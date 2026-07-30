"""ElevenLabs voiceover for a video spec's slides. Runs on the Omni host (the ElevenLabs key
resolves there via the broker / 1Password item `elevenlabs`). Writes /tmp/vo/<slug>/vo_NN.mp3.
Reuses Omni's effectors.media_agent._eleven_tts. Pin a voice with VOICE_ID=<id>.

  VOICE_ID=cgSgspJ2msm6clMCkdW9 PYTHONPATH=/opt/omni python3 tts.py specs/claude.json
"""
import json
import os
import pathlib
import subprocess
import sys

os.environ["HOME"] = os.environ.get("OP_HOME", "/opt/omni/telemetry/.ophome")  # op needs a writable HOME
sys.path.insert(0, "/opt/omni")


def op_read(path):
    return subprocess.check_output(["op", "read", path], text=True, stdin=subprocess.DEVNULL).strip()


# Key: broker first (name mismatch — item is titled `elevenlabs`), else read the 1Password item.
try:
    from core import secrets
    key = secrets.BROKER.resolve("elevenlabs-api-key")
except Exception:  # noqa: BLE001
    key = ""
key = key or op_read("op://AiGovOps/elevenlabs/credential")

from effectors import media_agent  # noqa: E402


def labels(v):
    return " ".join(str(x).lower() for x in (v.get("labels") or {}).values()) + " " + v.get("name", "").lower()


if os.environ.get("VOICE_ID"):
    pick = {"voice_id": os.environ["VOICE_ID"], "name": "pinned"}
else:
    voices = media_agent._eleven_voices(key)
    fem = [v for v in voices if "female" in labels(v)]
    calm = ("calm", "soft", "gentle", "narration", "news", "warm", "pleasant")
    pick = next((v for v in fem if any(w in labels(v) for w in calm)), (fem or voices)[0])
print("VOICE:", pick["name"], pick["voice_id"])

spec = json.load(open(sys.argv[1]))
outdir = pathlib.Path("/tmp/vo") / spec["slug"]
outdir.mkdir(parents=True, exist_ok=True)
for i, s in enumerate(spec["slides"], 1):
    (outdir / f"vo_{i:02d}.mp3").write_bytes(media_agent._eleven_tts(key, pick["voice_id"], s["narration"]))
print("DONE", spec["slug"], "->", outdir)
