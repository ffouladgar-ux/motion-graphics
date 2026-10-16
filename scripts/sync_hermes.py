#!/usr/bin/env python3
"""Copy the shared parts of a Claude skill into its Hermes edition.

  python3 scripts/sync_hermes.py           # copy skills/click-deck → hermes-skills/click-deck
  python3 scripts/sync_hermes.py --check   # exit 1 if the Hermes copy is out of date

Only the engine, scripts and slide catalog are shared. Each edition keeps its own
SKILL.md, because Claude and Hermes need different descriptions and tool names.
Hermes skips symlinked files, so these are real copies.
"""
import filecmp
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAIRS = [
    # (from the Claude skill, to the Hermes skill)
    ("skills/click-deck/engine", "hermes-skills/click-deck/engine"),
    ("skills/click-deck/scripts", "hermes-skills/click-deck/scripts"),
    ("skills/click-deck/reference/slides.md", "hermes-skills/click-deck/references/slides.md"),
    ("skills/click-deck/examples/win-win/deck.js", "hermes-skills/click-deck/templates/deck.js"),
]
SKIP = {"node_modules", ".deck-assets", "package-lock.json"}


def files(src: Path):
    if src.is_file():
        yield src, Path()
        return
    for f in sorted(src.rglob("*")):
        if f.is_file() and not SKIP & set(f.relative_to(src).parts):
            yield f, f.relative_to(src)


def main(check: bool) -> int:
    stale = []
    for a, b in PAIRS:
        src, dst = ROOT / a, ROOT / b
        for f, rel in files(src):
            target = dst / rel if rel != Path() else dst
            if target.exists() and filecmp.cmp(f, target, shallow=False):
                continue
            stale.append(target.relative_to(ROOT))
            if not check:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(f, target)
    for path in stale:
        print(("out of date: " if check else "copied: ") + str(path))
    if not stale:
        print("Hermes edition is up to date.")
    return 1 if check and stale else 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv))
