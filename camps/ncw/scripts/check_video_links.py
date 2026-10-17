#!/usr/bin/env python3
"""Every Spaces-hosted video referenced by the site must actually be there.

Why this exists: the videos used to live in docs/videos, so a typo'd path failed the internal
link check. They moved to DigitalOcean Spaces on 2026-08-09 (329MB of MP4 in git made the repo
871MB and timed the link checker out into false failures). Now they are EXTERNAL URLs, and
linkinator is configured to skip external links — so nothing was left watching them. A rename or
a delete on the Spaces side would silently blank a video on the day of an event.

Ranged GET of the first byte, not a HEAD: some S3-compatible endpoints answer HEAD differently
from GET, and a 206 proves both that the object is there and that range requests work — which is
what a <video> element needs in order to seek.

Exit 0 when every referenced object answers 200/206, 1 otherwise.
"""
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "docs"
BASE = "https://allbuckets-non-nyc-1.sfo3.digitaloceanspaces.com/ncw-camp/videos"
TIMEOUT = 20


def referenced():
    urls = set()
    pat = re.compile(re.escape(BASE) + r'/[^"\'\s>]+')
    for page in ROOT.rglob("*.html"):
        urls.update(pat.findall(page.read_text(encoding="utf-8", errors="replace")))
    return sorted(urls)


def probe(url, attempt=0):
    req = urllib.request.Request(url, headers={"Range": "bytes=0-0"}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return (url, r.status, "")
    except urllib.error.HTTPError as e:
        return (url, e.code, e.reason)
    except Exception as e:  # noqa: BLE001 — one retry, then report; a flake must not red the build
        if attempt == 0:
            return probe(url, 1)
        return (url, 0, f"{type(e).__name__}: {e}")


def main():
    urls = referenced()
    if not urls:
        print("no Spaces video references found — nothing to check")
        return 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(probe, urls))
    bad = [r for r in results if r[1] not in (200, 206)]
    for url, code, why in bad:
        print(f"  MISSING [{code}] {url} {why}".rstrip())
    if bad:
        print(f"\nFAIL: {len(bad)} of {len(urls)} Spaces video object(s) unreachable.")
        return 1
    print(f"PASS: {len(urls)} Spaces-hosted video objects all resolve (200/206, range supported).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
