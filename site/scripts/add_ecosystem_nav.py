#!/usr/bin/env python3
"""Add the Ecosystem link to every page's main-nav and an NCW AI Camp link to footers.

Idempotent: a page already carrying the link is skipped. Surgical: inserts the Ecosystem
anchor right before the Alpha anchor inside <nav class="main-nav">, and the NCW link before
</nav> inside <nav class="footer-nav">. Run dry-run first, then --apply.

  python3 scripts/add_ecosystem_nav.py            # dry-run: list what would change
  python3 scripts/add_ecosystem_nav.py --apply    # write the changes
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = "--apply" in sys.argv
ECO = '<a href="ecosystem.html">Ecosystem</a>'
NCW = '<a href="https://www.aigovops-foundation.com/camps/ncw/" target="_blank" rel="noopener">NCW AI Camp</a>'

changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    src = open(path, encoding="utf-8").read()
    out = src
    notes = []

    m = re.search(r'<nav class="main-nav">.*?</nav>', out, re.S)
    if m and "ecosystem.html" not in m.group(0):
        block = m.group(0)
        nb = re.sub(r'(\n(\s*))(<a href="alpha\.html")',
                    r'\1' + ECO + r'\1\3', block, count=1)
        if nb == block:  # no alpha anchor — append before </nav>
            nb = block.replace("</nav>", "  " + ECO + "\n    </nav>", 1)
        out = out.replace(block, nb)
        notes.append("main-nav +Ecosystem")

    f = re.search(r'<nav class="footer-nav">.*?</nav>', out, re.S)
    if f and "aigovops-ncw-ai-camp" not in f.group(0):
        fb = f.group(0)
        nf = fb.replace("</nav>", "  " + NCW + "\n    </nav>", 1)
        out = out.replace(fb, nf)
        notes.append("footer +NCW")

    if out != src:
        changed += 1
        print(f"  {name}: {', '.join(notes)}")
        if APPLY:
            open(path, "w", encoding="utf-8").write(out)

print(f"\n{'APPLIED' if APPLY else 'DRY-RUN'} — {changed} file(s) would change" + ("" if APPLY else "; re-run with --apply"))
