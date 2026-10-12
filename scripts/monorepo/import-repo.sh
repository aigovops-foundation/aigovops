#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <git-url> <branch> <dest-path> [--drop-path P]... [--replace-text FILE]\n' "$0" >&2
}

if [[ $# -lt 3 ]]; then
  usage
  exit 2
fi

git_url=$1
branch=$2
dest_path=$3
shift 3
invocation_dir=$PWD
drop_paths=()
replace_text=

while [[ $# -gt 0 ]]; do
  case "$1" in
    --drop-path)
      if [[ $# -lt 2 || -z "$2" ]]; then
        printf 'missing path after --drop-path\n' >&2
        exit 2
      fi
      drop_paths+=("$2")
      shift 2
      ;;
    --replace-text)
      if [[ $# -lt 2 || -z "$2" || -n "$replace_text" ]]; then
        printf 'provide exactly one file after --replace-text\n' >&2
        exit 2
      fi
      replace_text=$2
      shift 2
      ;;
    *)
      printf 'unexpected argument: %s\n' "$1" >&2
      usage
      exit 2
      ;;
  esac
done

case "$dest_path" in
  ""|/*|..|../*|*/../*|*/..|*\\*|*/)
    printf 'destination must be a normalized relative path: %s\n' "$dest_path" >&2
    exit 2
    ;;
esac

for path in "${drop_paths[@]}"; do
  case "$path" in
    ""|/*|..|../*|*/../*|*/..|*\\*)
      printf 'drop path must be relative to the source repository: %s\n' "$path" >&2
      exit 2
      ;;
  esac
done

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  printf 'run this script from inside the destination git repository\n' >&2
  exit 2
}
cd "$repo_root"

if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  printf 'refusing to import into a dirty working tree\n' >&2
  exit 1
fi

if [[ -e "$dest_path" ]]; then
  printf 'refusing to import: destination already exists: %s\n' "$dest_path" >&2
  exit 1
fi
if [[ -L "$dest_path" ]]; then
  printf 'refusing to import: destination already exists: %s\n' "$dest_path" >&2
  exit 1
fi

if ! command -v git-filter-repo >/dev/null 2>&1; then
  printf 'git-filter-repo is required; install it with: brew install git-filter-repo\n' >&2
  exit 1
fi
if [[ -z "$(git symbolic-ref --short -q HEAD || true)" ]]; then
  printf 'refusing to import into a detached HEAD\n' >&2
  exit 1
fi

if [[ -n "$replace_text" ]]; then
  if [[ "$replace_text" != /* ]]; then replace_text="$invocation_dir/$replace_text"; fi
  if [[ ! -f "$replace_text" ]]; then
    printf 'replace-text file not found: %s\n' "$replace_text" >&2
    exit 1
  fi
fi

tmpdir=$(mktemp -d "${TMPDIR:-/tmp}/aigovops-import.XXXXXX")
trap 'rm -rf -- "$tmpdir"' EXIT
source_clone="$tmpdir/source"
git clone --no-local --single-branch --branch "$branch" "$git_url" "$source_clone"

if [[ ${#drop_paths[@]} -gt 0 ]]; then
  drop_args=()
  for path in "${drop_paths[@]}"; do drop_args+=(--path "$path"); done
  drop_args+=(--invert-paths)
  git -C "$source_clone" filter-repo "${drop_args[@]}"
  filter_args=(--force --to-subdirectory-filter "$dest_path")
else
  filter_args=(--to-subdirectory-filter "$dest_path")
fi
if [[ -n "$replace_text" ]]; then filter_args+=(--replace-text "$replace_text"); fi
git -C "$source_clone" filter-repo "${filter_args[@]}"

git fetch --no-tags "$source_clone" "$branch"
git merge --allow-unrelated-histories --no-edit FETCH_HEAD
