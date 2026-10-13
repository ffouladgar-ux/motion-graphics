#!/usr/bin/env bash
# Tile stills from a rendered video so you can check every scene at a glance.
#   contact_sheet.sh out/short.mp4 sheet.png [every_seconds=1.5]
set -euo pipefail
in=$1 out=$2 every=${3:-1.5}
ffmpeg -v error -y -i "$in" \
  -vf "fps=1/${every},scale=270:-1,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=8x3" \
  -frames:v 1 "$out"
echo "$out"
