"""Swap each tool page's third-party YouTube 'walkthrough' for the self-hosted AiGovOps Foundation
video. Stages out/<slug>/<slug>.mp4, removes the YouTube button (keeps the vendor's Official
install guide), and embeds the Foundation <video> in place of the vendor caption. Re-runnable.

2026-08-09: the videos no longer live in the repo. docs/videos was 329MB of MP4 in git — it made
the repo 871MB, and it timed out the CI link check (linkinator FETCHES every link) into reporting
false broken links for a day. They now serve from DigitalOcean Spaces, and the pages point there.

So this script no longer copies into docs/. It stages the file and prints the upload command; the
page is only correct once the object is actually in Spaces:

    rclone copy tools/video/stage/<slug>.mp4 sp:allbuckets-non-nyc-1/ncw-camp/videos/tools \\
      --s3-acl public-read

(rclone remote `sp` = s3/DigitalOcean, endpoint sfo3.digitaloceanspaces.com; the key and secret
are `spaces-key` / `spaces-secret` in the Omni broker — never hard-code them here.)
"""
import pathlib
import re
import shutil

TOOLS = pathlib.Path("docs/tools")
# Where the page points. Kept as one constant so a bucket or prefix move is a one-line change.
VIDEO_BASE = "https://allbuckets-non-nyc-1.sfo3.digitaloceanspaces.com/ncw-camp/videos"
# Staging only — NOT under docs/, so a re-run can never put a 7MB MP4 back into git.
VID = pathlib.Path("tools/video/stage")
VID.mkdir(parents=True, exist_ok=True)
OUT = pathlib.Path("tools/video/out")
SKIP = {"lab-tools"}
_staged = []

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
    _staged.append(slug)
    html = f.read_text()
    embed = (
        r'\1'
        f'<div class="mt-4"><video controls preload="metadata" playsinline '
        f'class="w-full block aspect-video rounded-xl border border-charcoal/10 bg-charcoal">'
        f'<source src="{VIDEO_BASE}/tools/{slug}.mp4" type="video/mp4">'
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
if _staged:
    print()
    print(f"{len(_staged)} file(s) staged in {VID}/ — the pages point at Spaces, so they are")
    print("NOT live until you upload. Nothing was written into docs/ (that is deliberate: it is")
    print("what kept 329MB of MP4 out of git). Upload with:")
    print(f"  rclone copy {VID} sp:allbuckets-non-nyc-1/ncw-camp/videos/tools --s3-acl public-read")
if skipped:
    print("skipped:", skipped)
