#!/usr/bin/env python3
"""
Rebuild FuelPay + Parent Guide WebP screenshots (max 1200px edge, ≤280KB).
Expects PNGs under the Cursor project assets folder. Course card uses
images/course-html-screenshot.webp — replace that file manually or add
images/course-html-source.jpg and extend this script if you need to regenerate it.
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("pip install pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
MAX_EDGE = 1200
MAX_BYTES = 280 * 1024
ASSETS = Path.home() / ".cursor/projects/Users-cynthia-cisneros-Documents-GitHub-developer-portfolio-cynthia-lizeth/assets"

JOBS: list[tuple[Path, Path]] = [
    (ASSETS / "Screenshot_2026-04-29_at_9.33.08_AM-ec369ffa-6f1a-47f6-9114-c9640c820d98.png", IMAGES / "fuelpay-screenshot.webp"),
    (ASSETS / "Screenshot_2026-04-29_at_9.35.02_AM-7f3a66f5-b059-4a5f-b3d1-062b9640bdd4.png", IMAGES / "parent-guide-screenshot.webp"),
]

SRC_COURSE = IMAGES / "course-html-source.jpg"
OUT_COURSE = IMAGES / "course-html-screenshot.webp"
if SRC_COURSE.exists():
    JOBS.append((SRC_COURSE, OUT_COURSE))


def save_webp(im: Image.Image, dest: Path) -> None:
    w, h = im.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    if scale < 1.0:
        nw = max(1, int(w * scale))
        nh = max(1, int(h * scale))
        im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    q = 88
    while q >= 45:
        im.save(dest, "WEBP", quality=q, method=6)
        if dest.stat().st_size <= MAX_BYTES:
            break
        q -= 4
    else:
        im.save(dest, "WEBP", quality=44, method=6)


def main() -> None:
    for src, dest in JOBS:
        if not src.exists():
            print("skip (missing):", src)
            continue
        im = Image.open(src).convert("RGB")
        save_webp(im, dest)
        print(dest.name, dest.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
