#!/usr/bin/env python3
"""Turn an SRT into scene timings for content.ts.

  srt_timing.py talk.srt                      # list every cue with its start second
  srt_timing.py talk.srt "157 dollars" "New creative" "never the problem" ...

With phrases, each phrase marks where a scene starts (first cue containing it,
case-insensitive, searched in order). Prints `sec` for each scene; the last scene
runs to the end of the final cue plus a short hold.
"""
import re
import sys

HOLD = 0.6  # seconds the last scene stays after the voice ends


def parse(path):
    text = open(path, encoding="utf-8-sig").read()
    cues = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = block.strip().splitlines()
        m = next((re.search(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", l) for l in lines if "-->" in l), None)
        if not m:
            continue
        g = [int(x) for x in m.groups()]
        start = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        end = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        body = " ".join(l for l in lines if "-->" not in l and not l.strip().isdigit())
        cues.append((start, end, body.strip()))
    return cues


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cues = parse(sys.argv[1])
    phrases = sys.argv[2:]
    if not phrases:
        for s, e, t in cues:
            print(f"{s:7.2f}  {t}")
        return
    starts, i = [], 0
    for p in phrases:
        while i < len(cues) and p.lower() not in cues[i][2].lower():
            i += 1
        if i == len(cues):
            sys.exit(f"phrase not found (in order): {p!r}")
        starts.append(cues[i][0])
    starts[0] = 0.0  # first scene starts with the video
    ends = starts[1:] + [cues[-1][1] + HOLD]
    for p, s, e in zip(phrases, starts, ends):
        print(f"sec: {e - s:.2f},  // starts {s:.2f}s  “{p}”")


if __name__ == "__main__":
    main()
