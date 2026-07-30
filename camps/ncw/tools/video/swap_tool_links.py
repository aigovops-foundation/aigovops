"""Swap each tool page's third-party YouTube 'walkthrough' for the self-hosted AiGovOps Foundation
video. Copies out/<slug>/<slug>.mp4 -> docs/videos/tools/<slug>.mp4, removes the YouTube button
(keeps the vendor's Official install guide), and embeds the Foundation <video> in place of the
vendor caption. Re-runnable."""
import pathlib
import re
import shutil

TOOLS = pathlib.Path("docs/tools")
VID = pathlib.Path("docs/videos/tools")
VID.mkdir(parents=True, exist_ok=True)
OUT = pathlib.Path("tools/video/out")
SKIP = {"lab-tools"}

# Match the YouTube button through the vendor caption (anchored, so nothing else is touched).
BLOCK = re.compile(
    r'<a href="https://www\.youtube\.com/watch\?v=[^"]*"[^>]*>Watch the walkthrough.*?</a>'
    r'(\s*</div>\s*)'
    r'<p class="mt-3 text-\[13px\] text-charcoal/55">.*?</p>',
    re.S)

done, skipped = [], []
for f in sorted(TOOLS.glob("*.html")):
    slug = f.stem
    if slug in SKIP:
        continue
    mp4 = OUT / slug / f"{slug}.mp4"
    if not mp4.exists():
        skipped.append(f"{slug} (no mp4)")
        continue
    shutil.copy(mp4, VID / f"{slug}.mp4")
    html = f.read_text()
    embed = (
        r'\1'
        f'<div class="mt-4"><video controls preload="metadata" playsinline '
        f'class="w-full block aspect-video rounded-xl border border-charcoal/10 bg-charcoal">'
        f'<source src="../videos/tools/{slug}.mp4" type="video/mp4">'
        f'Your browser does not support embedded video.</video>'
        f'<p class="mt-2 text-[13px] text-charcoal/55">The AiGovOps Foundation 90-second guide '
        f'&mdash; the tool, what&rsquo;s cool, and the rules.</p></div>')
    html2, n = BLOCK.subn(embed, html, count=1)
    if n == 0:
        skipped.append(f"{slug} (block not matched)")
        continue
    f.write_text(html2)
    done.append(slug)

print(f"swapped {len(done)} tool pages:", done)
if skipped:
    print("skipped:", skipped)
