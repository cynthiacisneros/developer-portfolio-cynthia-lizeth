#!/usr/bin/env python3
"""Resize project JPGs to max 1200px edge; write WebP and replace JPEGs under max_bytes."""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: python3 -m pip install --user pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
MAX_EDGE = 1200
MAX_BYTES = 300 * 1024
FILES = [
    "project-fuelpay-real.jpg",
    "project-parent-guide-real.jpg",
    "project-html-pages-real.jpg",
]


def save_under_max(im: Image.Image, path: Path, fmt: str, ext: str) -> int:
    if fmt == "WEBP":
        q = 88
        while q >= 50:
            im.save(path, "WEBP", quality=q, method=6)
            size = path.stat().st_size
            if size <= MAX_BYTES:
                return q
            q -= 4
        im.save(path, "WEBP", quality=45, method=6)
        return 45
    # JPEG
    q = 88
    while q >= 45:
        im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
        size = path.stat().st_size
        if size <= MAX_BYTES:
            return q
        q -= 5
    im.save(path, "JPEG", quality=40, optimize=True, progressive=True)
    return 40


def main() -> None:
    for name in FILES:
        src = IMAGES / name
        if not src.exists():
            print(f"skip missing: {src}")
            continue
        im = Image.open(src).convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX_EDGE / max(w, h))
        if scale < 1.0:
            nw = max(1, int(w * scale))
            nh = max(1, int(h * scale))
            im = im.resize((nw, nh), Image.Resampling.LANCZOS)

        webp_path = IMAGES / (Path(name).stem + ".webp")
        q_w = save_under_max(im, webp_path, "WEBP", ".webp")
        jpg_path = IMAGES / name
        q_j = save_under_max(im, jpg_path, "JPEG", ".jpg")
        print(
            f"{name}: {im.size[0]}x{im.size[1]} "
            f"webp={webp_path.stat().st_size // 1024}KB(q{q_w}) "
            f"jpg={jpg_path.stat().st_size // 1024}KB(q{q_j})"
        )


if __name__ == "__main__":
    main()
