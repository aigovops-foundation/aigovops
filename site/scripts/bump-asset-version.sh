#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: scripts/bump-asset-version.sh <new-version>" >&2
  exit 2
fi

VERSION="$1"
if [[ ! "$VERSION" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  echo "Invalid asset version: $VERSION" >&2
  exit 2
fi

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python3 - "$REPO" "$VERSION" <<'PY'
import os
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

root = Path(sys.argv[1])
version = sys.argv[2]
excluded_dirs = {
    entry.strip()
    for entry in (root / "scripts" / "asset-version-excludes.txt").read_text(encoding="utf-8").splitlines()
    if entry.strip()
}

def files_with_suffix(directory, suffix):
    for current, dirs, files in os.walk(directory):
        dirs[:] = sorted(name for name in dirs if name not in excluded_dirs)
        for name in sorted(files):
            if name.lower().endswith(suffix):
                yield Path(current) / name

tag_re = re.compile(r"<(?:link|script)\b[^>]*>", re.I | re.S)
rel_re = re.compile(r"""(?:\s)rel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)
href_re = re.compile(r"""(\s+href\s*=\s*)(["'])(.*?)\2""", re.I | re.S)
src_re = re.compile(r"""(\s+src\s*=\s*)(["'])(.*?)\2""", re.I | re.S)
import_re = re.compile(
    r"""(?P<prefix>@import\s+(?:url\(\s*)?)(?P<quote>["']?)(?P<url>[^"'()\s]+)(?P=quote)(?P<suffix>\s*\)?)""",
    re.I,
)
local_hosts = {"www.aigovops-foundation.com", "aigovops-foundation.com"}
changed_references = 0
changed_files = 0

def versioned_url(value, extension):
    parsed = urlsplit(value)
    if parsed.netloc:
        if parsed.hostname not in local_hosts or (parsed.scheme and parsed.scheme not in {"http", "https"}):
            return value
    elif parsed.scheme:
        return value
    if not parsed.path.lower().endswith(extension):
        return value

    query = [(key, item) for key, item in parse_qsl(parsed.query, keep_blank_values=True) if key != "v"]
    query.append(("v", version))
    return urlunsplit(parsed._replace(query=urlencode(query, doseq=True)))

def update_file(page, is_css):
    global changed_files, changed_references
    source = page.read_text(encoding="utf-8")
    page_changes = [0]

    def update_tag(match):
        tag = match.group(0)
        tag_name = re.match(r"<([a-z]+)", tag, re.I).group(1).lower()
        if tag_name == "link":
            rel_match = rel_re.search(tag)
            rel_value = next((value for value in rel_match.groups() if value is not None), "") if rel_match else ""
            if "stylesheet" not in rel_value.lower().split():
                return tag
            attr_match = href_re.search(tag)
            extension = ".css"
        else:
            attr_match = src_re.search(tag)
            extension = ".js"
        if not attr_match:
            return tag
        old_url = attr_match.group(3)
        new_url = versioned_url(old_url, extension)
        if new_url == old_url:
            return tag
        return tag[:attr_match.start(3)] + new_url + tag[attr_match.end(3):]

    def update_and_count(match):
        updated = update_tag(match)
        if updated != match.group(0):
            page_changes[0] += 1
        return updated

    def update_import(match):
        old_url = match.group("url")
        new_url = versioned_url(old_url, ".css")
        if new_url == old_url:
            return match.group(0)
        page_changes[0] += 1
        return (
            match.group("prefix")
            + match.group("quote")
            + new_url
            + match.group("quote")
            + match.group("suffix")
        )

    updated = import_re.sub(update_import, source) if is_css else tag_re.sub(update_and_count, source)
    if updated != source:
        page.write_text(updated, encoding="utf-8")
        changed_files += 1
        changed_references += page_changes[0]

for page in files_with_suffix(root, ".html"):
    update_file(page, is_css=False)
for page in files_with_suffix(root / "css", ".css"):
    update_file(page, is_css=True)

if changed_references == 0:
    raise SystemExit("No local stylesheet, script, or CSS import URLs were updated.")
print(f"Updated {changed_references} asset references in {changed_files} HTML/CSS files to ?v={version}.")
PY
