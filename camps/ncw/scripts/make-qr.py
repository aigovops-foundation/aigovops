#!/usr/bin/env python3
"""Regenerate the pledge QR. Run when the pledge URL moves — then SCAN THE RESULT.

    python3 -m pip install segno zxing-cpp pillow
    python3 scripts/make-qr.py

Two choices here are deliberate:

  ERROR CORRECTION 'H' (30%), not the smaller 'L'. This code gets printed, taped to a table,
  photographed at an angle in a bright hall, and quite possibly reprinted from someone's phone
  screenshot of a slide. 'L' produces a tidier square that fails exactly when it matters.

  IT DECODES WHAT IT JUST WROTE before declaring success. A QR that encodes a typo is
  indistinguishable from a correct one by eye, and the failure surfaces in a room full of
  people holding phones. If the decoder is not installed the script says so rather than
  implying it checked.
"""
import sys
from pathlib import Path

import segno

URL = "https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/pledge.html"
OUT = Path(__file__).resolve().parent.parent / "docs" / "assets" / "img"
ORCHARD, CREAM = "#2E7D4F", "#FAF7F0"


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    qr = segno.make(URL, error="h")
    svg, png = OUT / "pledge-qr.svg", OUT / "pledge-qr.png"
    qr.save(str(svg), scale=10, border=4, dark=ORCHARD, light=CREAM)
    qr.save(str(png), scale=12, border=4, dark=ORCHARD, light=CREAM)
    print(f"  wrote {svg.name} + {png.name}  (version {qr.version}, error correction H)")
    print(f"  target: {URL}")

    try:
        import zxingcpp
        from PIL import Image
    except ImportError:
        print("  ! NOT VERIFIED — no decoder installed (pip install zxing-cpp pillow).")
        print("    Scan it with a phone before printing anything.")
        return 0

    found = zxingcpp.read_barcodes(Image.open(png))
    if not found:
        print("  ✗ the image decodes to NOTHING — do not print this")
        return 1
    text = found[0].text
    if text != URL:
        print(f"  ✗ decodes to the WRONG url: {text}")
        return 1
    print(f"  ✓ decoded and matches: {text}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
