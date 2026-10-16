---
name: click-deck
description: Build 16:9 PowerPoint talks that build point by point.
version: 0.1.0
author: Fadi Fouladgar (ffouladgar-ux), Hermes Agent
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [PowerPoint, pptx, presentation, slides, animation, deck]
    category: creative
    related_skills: []
---

# Click Deck Skill

Builds a 16:9 `.pptx` in a bold card style (one bright gradient per slide, chunky Arial headlines with a highlighted word, rounded cards) where **every point appears on the presenter's click** as a native PowerPoint animation: cards pop in with a springy overshoot, rows tick off, a question types itself, the key reveal pulses. Speaker notes list what each click shows. It does not edit existing decks or make video.

## When to Use

- The user wants a presentation they will present "point by point" or "click by click".
- The user wants an animated deck, builds or entrance animations on slides.
- The user wants a talk version of a script, outline, video or Short in this card style.
- Don't use for: editing an existing .pptx, static handout decks, video output.

## Prerequisites

- Node.js 18+ and npm (the engine installs `pptxgenjs`, `jszip`, `sharp` locally).
- Python 3 with Pillow (for `check.py` and the render grid).
- LibreOffice (`soffice` on PATH) and Poppler (`pdftoppm`) for the render check. On macOS: `brew install --cask libreoffice` and `brew install poppler`.

## How to Run

All paths below are inside this skill: `${HERMES_SKILL_DIR}`. Work in a new folder named after the deck, in the user's current project.

```
terminal(command="mkdir -p <deck> && cp -r ${HERMES_SKILL_DIR}/engine <deck>/engine && cp ${HERMES_SKILL_DIR}/templates/deck.js <deck>/deck.js", timeout=30)
terminal(command="cd <deck>/engine && npm install --no-audit --no-fund", timeout=300)
terminal(command="cd <deck> && node deck.js", timeout=120)
terminal(command="python3 ${HERMES_SKILL_DIR}/scripts/check.py <deck>/<name>.pptx", timeout=60)
terminal(command="bash ${HERMES_SKILL_DIR}/scripts/render.sh <deck>/<name>.pptx <deck>/render", timeout=300)
```

## Quick Reference

- Slide types and their fields: `read_file` `${HERMES_SKILL_DIR}/references/slides.md` before planning.
- Worked example (11 slides, 43 clicks): `${HERMES_SKILL_DIR}/templates/deck.js`.
- Slide types: `cover`, `stat`, `cards`, `question`, `checklist`, `steps`, `mystery`, `pair`, `contrast`, `points`, `statement`, `close`.
- `*stars*` around words highlight them. `bg`: `coral`, `blue`, `purple`, `amber`, `green`, `teal`.
- Each slide's tag and title play as the slide arrives; every other element waits for a click.
- `node deck.js` prints `WARN` lines for text measured as too long for its box.
- `check.py` exits 1 if any element is not animated or an animation targets the slide root.

## Procedure

1. **Get the content in the user's own words.** Ask for the outline, script or source. Never invent numbers; if a figure has no label, ask what it measures, or label it literally and write "inferred" in that slide's `notes`. Done when every slide's text and numbers come from the user's material.
2. **Plan one idea per slide** (1.5–2 minutes each) and show a table: `# | point | slide type | colour | clicks`. Pick the type that acts out the words: options → `cards`, unknowns → `mystery`, "same X, same Y" → `checklist`, before → after numbers → `steps`, wrong vs. right move → `contrast`, surface vs. real answer → `pair`, a list → `points`; `statement` only when nothing more active fits. Neighbouring slides get different colours; `green` is for results. Aim for 2–5 clicks per slide. Done when the user approves the table.
3. **Write `deck.js`.** Replace the slides in the copied template with the approved plan, keeping its `require("./engine/kit")` line, `new Deck({ title, out })` and the final `deck.build()`. Give each slide `notes:` with what to say before its first click. Done when `node deck.js` runs with no errors.
4. **Clear every `WARN`.** Shorten the words first; move content to a roomier slide type second. Done when `node deck.js` prints no `WARN` lines.
5. **Check animation coverage** with `check.py`. Done when it exits 0 and each slide shows 2–5 clicks.
6. **Look at the render.** `render.sh` prints the path of `grid.jpg` (every slide fully built). Inspect it with `vision_analyze(image_url="<that path>", question="For each slide: is any text cut off, overlapping, or crowding a card edge? Is any word alone on its own line? Do neighbouring slides share a colour? Does any slide look emptier than the rest?")`. Fix what it finds and rebuild. Done when the answer is clean for every slide (ignore the stacked numbers on `steps` slides, see Pitfalls).
7. **Hand over** the `.pptx` path with: slide and click counts, that the speaker notes list each click, any inferred label, and a request to rehearse it once in PowerPoint (F5) before presenting.

## Pitfalls

- **`steps` slides look stacked when not playing.** The numbers sit in one spot and swap on click; Normal view, thumbnails and PDF exports show them overlapping. That is expected; tell the user.
- **Not tested in real PowerPoint here.** The XML passes validation and LibreOffice imports every click, but PowerPoint itself is the real test, so always ask for one rehearsal.
- **Later slides must not get fewer builds than early ones.** Keep 2–5 clicks per slide; split slides with more, merge slides with 1.
- **Fonts are Arial and Consolas**, which ship with Office. Don't swap in other fonts: the kit's text measuring assumes Arial widths.
- **`question` underline needs a one-line title**, and the underlined word must appear in it exactly.
- **Keep `engine/` next to `deck.js`.** The template requires `./engine/kit`; moving either breaks the build.
- **Titles on a click too:** in `engine/kit.js` → `title()`, call `t.click()` first and push the title at that click instead of 0. Only change it if the user asks.

## Verification

- `node deck.js` prints `<name>.pptx: N slides, M clicks` and no `WARN` lines.
- `check.py` exits 0; every slide lists 2–5 clicks and no "not animated" entries.
- `vision_analyze` on `grid.jpg` reports no cut-off, overlapping or stranded text.
- The `.pptx` opens in PowerPoint and each click (Space, arrow, clicker) reveals exactly the next point listed in that slide's notes.
