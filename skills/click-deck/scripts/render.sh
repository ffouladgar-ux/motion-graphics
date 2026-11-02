#!/usr/bin/env bash
# Render every slide of a deck (fully built, as after its last click) into one grid image.
#   render.sh deck.pptx [out_dir=deck-render]
# Needs LibreOffice (soffice) and pdftoppm. Prints the grid's path.
set -euo pipefail
deck=$(realpath "$1")
out=$(realpath -m "${2:-$(basename "${deck%.*}")-render}")
mkdir -p "$out"
cp "$deck" "$out/deck.pptx"
cd "$out"
rm -f deck.pdf slide-*.jpg
timeout 240 soffice --headless --convert-to pdf deck.pptx >/dev/null 2>&1
pdftoppm -jpeg -r 50 deck.pdf slide 2>/dev/null
python3 - <<'EOF'
import glob, math
from PIL import Image
files = sorted(glob.glob("slide-*.jpg"))
ims = [Image.open(f) for f in files]
w, h = ims[0].size
cols = 3
grid = Image.new("RGB", (w * cols, h * math.ceil(len(ims) / cols)), "black")
for i, im in enumerate(ims):
    grid.paste(im, ((i % cols) * w, (i // cols) * h))
grid.save("grid.jpg")
EOF
echo "$out/grid.jpg"
