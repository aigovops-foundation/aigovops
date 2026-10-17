#!/usr/bin/env python3
"""index.html: a door must land cleanly on "your first hour", with a way back.

Two ways a visitor reaches "your first hour": a hash link from the site's café doors
(https://practice.aigovops-foundation.com/#promise) or an in-page click on this page's
own doors grid. Both must add body.focused (hiding the doors grid so the question isn't
asked twice), and the "<- not this one? the other doors" link rendered inside #hour must
stay visible in that state — it is the only way back once focused. A CSS class collision
between that link and the unrelated "back room" resources section (both named .back)
hid the escape hatch precisely when focused was set correctly; a class-name collision
like that between the door-landing markup and the top-of-file "hide when focused" rule
would slip back in silently, so this checks it directly instead of just re-testing the
one string that broke.

Run: python3 scripts/test_door_landing.py
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
HTML = (REPO / "index.html").read_text(encoding="utf-8")

PASS = FAIL = 0


def check(label, cond):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  ok   {label}")
    else:
        FAIL += 1
        print(f"  FAIL {label}")


# 1 — the class names the top-of-file rule hides when body.focused is set
m = re.search(r"body\.focused[^{]*\{display:\s*none\}", HTML)
check("the body.focused hider rule exists", bool(m))
hider_rule = m.group(0) if m else ""
hidden_classes = set(re.findall(r"\.([\w-]+)(?=[,\s{])", hider_rule))

# 2 — the render() function, where "your first hour" and the way back are built
render_start = HTML.index("function render(d){")
render_end = HTML.index("\n  doors.addEventListener", render_start)
render_src = HTML[render_start:render_end]

# every class= used on markup render() injects into #hour
rendered_classes = set()
for html_literal in re.findall(r"`([^`]*)`", render_src):
    rendered_classes.update(re.findall(r'class="([\w-]+)"', html_literal))

check("render() defines at least one class (sanity)", bool(rendered_classes))
collisions = rendered_classes & hidden_classes
check(
    "no class rendered inside #hour collides with a body.focused hider class "
    f"(hider hides: {sorted(hidden_classes)})",
    not collisions,
)
if collisions:
    print(f"       collision: {sorted(collisions)}")

check(
    "the 'not this one? the other doors' link is present in render()",
    "not this one? the other doors" in render_src,
)

# 3 — both ways of reaching "your first hour" set body.focused
click_handler = re.search(r"doors\.addEventListener\('click',[^;]*(?:;[^;]*)*?\}\);", HTML)
check("the in-page door click handler exists", bool(click_handler))
check(
    "an in-page door click sets body.focused (not just a hash landing)",
    bool(click_handler) and "classList.add('focused')" in click_handler.group(0),
)

hash_landing = re.search(r"const h=location\.hash[^;]*;.*", HTML)
check("the hash-landing branch exists", bool(hash_landing))
check(
    "a hash landing (a door clicked from the site's café) sets body.focused",
    bool(hash_landing) and "classList.add('focused')" in hash_landing.group(0),
)

print()
print(f"DOOR LANDING: {PASS} passed, {FAIL} failed")
sys.exit(1 if FAIL else 0)
