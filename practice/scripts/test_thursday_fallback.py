"""docs/THURSDAY.md's no-JavaScript join fallback must point somewhere that exists.

Café Walk run 5: the fallback href was community.aigovops-foundation.com/events.html, a page the
community platform does not serve (its Thursday card lives on the front page, portal.html). With
JavaScript on, assets/thursday.js rewrites the href to joinUrl, so only a no-JS reader (or an empty
joinUrl) ever met the dead link.

Run:  python3 scripts/test_thursday_fallback.py
"""
import re
import sys
from pathlib import Path

MD = (Path(__file__).resolve().parent.parent / "docs" / "THURSDAY.md").read_text()
fails = 0


def check(c, label):
    global fails
    fails += 0 if c else 1
    print(f"  {'ok  ' if c else 'FAIL'} {label}")


m = re.search(r'data-thursday="join"\s+href="([^"]+)"', MD)
check(bool(m), "THURSDAY.md has a data-thursday=join link with a fallback href")
href = m.group(1) if m else ""
check("events.html" not in href, f"fallback is not the non-existent events.html ({href})")
check(href.startswith("https://community.aigovops-foundation.com/"), "fallback points at the community platform")
print(f"\nTHURSDAY FALLBACK: {'FAIL' if fails else 'ok'}")
sys.exit(1 if fails else 0)
