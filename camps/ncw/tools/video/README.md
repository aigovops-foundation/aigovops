# Tool-tutorial video pipeline

Branded 90-second "how to use this tool the NCW way" videos for every tool page — **script → ElevenLabs
voiceover → branded AiGovOps slides → ffmpeg MP4**, 1080p / 30fps, YouTube-ready. This is the in-repo,
**regenerable** source for those videos (the earlier hero/mini-camp videos in `docs/videos/` were
rendered externally in Gamma and committed as binaries; this pipeline replaces that gap).

Each video is five slides — **Title · The Tool · What's cool · The Rules · Outro** — where "The Rules"
is the camp's three habits (a human on the trigger · keep the receipts · mind the data cost of "free")
plus the tool page's own governance framing.

## Layout

- `gen_specs.py` — reads `docs/tools/<slug>.html` → `specs/<slug>.json` (title/tool/cool/rules/outro
  slides + narration). `specs/claude.json` is hand-tuned and kept as the style reference.
- `specs/*.json` — one per tool (the editable script + narration).
- `render.mjs` — Playwright renders each slide → `out/<slug>/slide_NN.png` (garden-warm brand, Fraunces,
  the AiGovOps mark). Accepts many specs in one browser: `node render.mjs specs/*.json`.
- `tts.py` — ElevenLabs voiceover per slide (runs on the **Omni host**, where the key resolves). Pin a
  voice with `VOICE_ID`. Default batch voice: `cgSgspJ2msm6clMCkdW9` (Jessica — warm female).
- `assemble.sh` — ffmpeg: each slide shown for its narration length (+0.6s), clips concatenated → the MP4.
- `out/` — build output (PNGs, MP3s, MP4s). **Gitignored** — regenerate, don't commit the binaries.

## Regenerate everything

```bash
python3 tools/video/gen_specs.py                        # specs from the tool pages
# voiceover (on the Omni host; scp specs there, run per spec, pull /tmp/vo back):
#   VOICE_ID=cgSgspJ2msm6clMCkdW9 PYTHONPATH=/opt/omni python3 tts.py specs/<slug>.json
node tools/video/render.mjs tools/video/specs/*.json     # slides
for s in tools/video/specs/*.json; do bash tools/video/assemble.sh "$(basename "$s" .json)"; done
```

Edit a `specs/*.json` to tweak wording, then re-render + re-assemble that one tool. Publish the MP4s to
the Foundation YouTube channel; the tool pages then link the Foundation video in place of the vendor's.
