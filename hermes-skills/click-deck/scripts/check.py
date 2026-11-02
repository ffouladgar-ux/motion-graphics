#!/usr/bin/env python3
"""Check a click-deck .pptx: every shape animated, clicks per slide, no bad targets.

  check.py deck.pptx

Exits 1 if any slide has an un-animated shape or an animation that targets the
slide's root container (id 1), which plays nothing.
"""
import re
import sys
import zipfile


def main(path):
    z = zipfile.ZipFile(path)
    slides = sorted(
        (n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)),
        key=lambda n: int(re.search(r"\d+", n.rsplit("/", 1)[1]).group()),
    )
    bad = False
    total = 0
    for name in slides:
        no = re.search(r"slide(\d+)", name).group(1)
        x = z.read(name).decode()
        shapes = {i: n for i, n in re.findall(r'<p:cNvPr id="(\d+)" name="([^"]*)"', x) if i != "1"}
        t = x[x.find("<p:timing"):] if "<p:timing" in x else ""
        targets = set(re.findall(r'<p:spTgt spid="(\d+)"', t))
        clicks = len(re.findall(r'nodeType="clickEffect"', t))
        total += clicks
        missing = [n or f"id {i}" for i, n in shapes.items() if i not in targets]
        problems = []
        if missing:
            problems.append(f"not animated: {', '.join(missing)}")
        if "1" in targets:
            problems.append("an animation targets the slide root (id 1)")
        bad |= bool(problems)
        print(f"slide {no:>2}: {clicks} clicks{'  ' + '; '.join(problems) if problems else ''}")
    print(f"total: {len(slides)} slides, {total} clicks")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
