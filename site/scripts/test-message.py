#!/usr/bin/env python3
"""Cloud-Mary — 🗣️ Message lint (redesign plan step 1.1 / 1.2)

One public vocabulary — promise · path · proof — and it must not drift back. Checks VISIBLE text only
(tags, scripts, styles and comments stripped), so a CSS class named `porch` is fine and a sentence
saying "the porch" is not.

  1. The home page carries the promise line ("Ship safe AI — never unsafe AI").
  2. The home page's first hero action is the ten-minute Gate Check (the one CTA, src-tagged).
  3. No public page's visible text contains a retired phrase (tests/message-lint.txt) — except pages
     listed in tests/message-allow.txt, which shrink as the fold lands. An allowlisted page that no
     longer needs it is ALSO a failure, so the list can only shrink.

Exit 1 on any failure. Run:  python3 scripts/test-message.py
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMISE = re.compile(r"ship safe ai\s*[—\-–,.:]?\s*never unsafe ai", re.I)
GATE = re.compile(r"community\.aigovops-foundation\.com/gate-check\.html\?src=", re.I)
PUBLIC = sorted(f for f in glob.glob(os.path.join(ROOT, "*.html"))
                if os.path.basename(f) not in {"admin.html", "status.html", "404.html"})

_p = _f = 0


def check(desc, ok, detail=""):
    global _p, _f
    print(("  ✅  " if ok else "  ❌  ") + desc + ("" if ok else f" — {detail}"))
    _p += ok; _f += (not ok)


def visible(html):
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    html = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).lower()


def read_list(name):
    p = os.path.join(ROOT, "tests", name)
    if not os.path.exists(p):
        return []
    return [l.strip() for l in open(p, encoding="utf-8") if l.strip() and not l.startswith("#")]


def main():
    retired = [r.lower() for r in read_list("message-lint.txt")]
    allow = {}
    for line in read_list("message-allow.txt"):
        page, _, why = line.partition(":")
        allow[page.strip()] = why.strip()
    print("\n🗣️  Message lint — promise · path · proof\n")
    # The promise and the Gate Check CTA lived in the site footer, retired 2026-10-19 (English-only,
    # nothing below the page), so they are no longer linted on every page. The HOME page is: it carries
    # the promise, and the ten-minute Gate Check is its first action (restored 22 Oct estate review —
    # this check went missing with the footer on 20 Oct and the home page lost the Gate Check unnoticed).
    print("  [Home page: the promise, and the Gate Check first]")
    home = open(os.path.join(ROOT, "index.html"), encoding="utf-8", errors="ignore").read()
    check("index.html carries the promise", bool(PROMISE.search(visible(home))),
          "no 'Ship safe AI — never unsafe AI' in visible text")
    check("index.html links the Gate Check (src-tagged)", bool(GATE.search(home)), "no gate-check.html?src= link")
    grid = re.search(r'<ul class="task-grid".*?</ul>', home, re.S)
    first = re.search(r'href="([^"]+)"', grid.group(0)) if grid else None
    check("index.html: the first hero action is the Gate Check", bool(first and GATE.search(first.group(1))),
          f"first hero link is {first.group(1) if first else 'missing'}")
    print("\n  [Retired vocabulary stays out of visible copy]")
    stale_allow = set(allow)
    for f in PUBLIC:
        name = os.path.basename(f)
        text = visible(open(f, encoding="utf-8", errors="ignore").read())
        hits = [r for r in retired if r in text]
        if name in allow:
            stale_allow.discard(name) if hits else None
            check(f"{name}: allowlisted ({allow[name]}) — {len(hits)} retired phrase(s) tolerated for now", True)
            continue
        check(f"{name}: no retired phrases", not hits, f"found {hits}")
    for name in sorted(stale_allow):
        check(f"{name}: allowlist entry no longer needed — remove it from tests/message-allow.txt", False, "clean page still allowlisted")
    print(f"\n  Message lint: {_p} passed, {_f} failed\n")
    return 1 if _f else 0


if __name__ == "__main__":
    sys.exit(main())
