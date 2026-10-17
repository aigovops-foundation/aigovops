#!/usr/bin/env bash
# Bob's single paste script for Open-Source-Unified-Sept-2026.
#   bash ~/Downloads/_aigov/Open-Source-Unified-Sept-2026/scripts/humans.sh
# Step 1 (toil, no prompt): git init + first commit in the local project folder.
# Step 2 (one y/N):         create the org repo `practice` (public — the source of truth) and push.
# Step 3 (toil):            tag the release candidate.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORG="aigovops-foundation"
NAME="practice"
cd "$ROOT"

echo "== Step 1: local git"
if [ ! -d .git ]; then
  git init -q -b main
  git add -A
  git commit -q -m "Open-Source-Unified-Sept-2026: PRD v2 (practitioner ladder) + v1 source + level kits

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017Z8hGphxvCj2ceNmLkXh7t"
  echo "   initialised and committed at $ROOT"
else
  git add -A
  git diff --cached --quiet || git commit -q -m "Open-Source-Unified-Sept-2026: update"
  echo "   already a repo; committed any changes"
fi

echo
echo "== Step 2: GitHub repo $ORG/$NAME (public — the source of truth)"
if git remote get-url origin >/dev/null 2>&1; then
  echo "   origin already set: $(git remote get-url origin)"
  git push -q -u origin main && echo "   pushed"
else

command -v gh >/dev/null || { echo "   gh not found — install GitHub CLI, then re-run"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "   gh not signed in — run: gh auth login"; exit 1; }
read -r -p "   Create $ORG/$NAME as a PUBLIC repo and push main? [y/N] " yn
case "$yn" in
  [Yy]*)
    gh repo create "$ORG/$NAME" --public --source . --remote origin --push \
      --description "AiGovOps Practice — one hour of value at every level (100–400): worksheets, checklists, the manifesto. Fall 2026 Release. Conforms to OVERT."
    echo "   done: https://github.com/$ORG/$NAME"
    ;;
  *) echo "   skipped. Re-run any time; step 1 is idempotent."; exit 0 ;;
esac
fi

echo
echo "== Step 3: release tag"
V="v$(cat "$ROOT/VERSION")"
if git rev-parse "$V" >/dev/null 2>&1; then echo "   $V already tagged"; else git tag -a "$V" -m "Fall 2026 Release candidate $V" && git push -q origin "$V" && echo "   tagged and pushed $V"; fi
