#!/bin/bash
# Assemble a tool-tutorial MP4 from rendered slides + ElevenLabs VO. Each slide is shown for the
# length of its narration (+0.6s tail); clips are concatenated. 1080p / 30fps / yuv420p — YouTube-ready.
set -euo pipefail
slug="${1:?usage: assemble.sh <slug>}"
d="tools/video/out/$slug"
rm -f "$d"/clip_*.mp4 "$d/clips.txt"

for png in "$d"/slide_*.png; do
  n=$(basename "$png" .png | sed 's/slide_//')
  mp3="$d/vo_$n.mp3"
  [ -f "$mp3" ] || { echo "missing $mp3"; exit 1; }
  ffmpeg -y -loop 1 -framerate 30 -i "$png" -i "$mp3" \
    -af "apad=pad_dur=0.6" -shortest \
    -c:v libx264 -preset medium -tune stillimage -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k "$d/clip_$n.mp4" >/dev/null 2>&1
  echo "file 'clip_$n.mp4'" >> "$d/clips.txt"
done

ffmpeg -y -f concat -safe 0 -i "$d/clips.txt" \
  -c:v libx264 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k \
  -movflags +faststart "$d/$slug.mp4" >/dev/null 2>&1

rm -f "$d"/clip_*.mp4 "$d/clips.txt"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$d/$slug.mp4")
printf "built %s  (%.1fs)\n" "$d/$slug.mp4" "$dur"
