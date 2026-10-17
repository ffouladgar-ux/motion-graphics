---
name: click-deck
description: Build a 16:9 PowerPoint (.pptx) presentation in a bold, colourful card style where every point builds on the presenter's click (native PowerPoint animations: pop with a springy overshoot, wipe, type-on, pulse), with speaker notes listing what each click reveals. Use whenever someone wants an animated deck, a presentation they will present "point by point" or "click by click", slides with builds or entrance animations, or a talk version of a video, Short or script in this card style, even if they don't say "skill". For vertical video Shorts use remotion-shorts instead.
---

# Click deck

You build a live-presentation deck: 16:9, one bright gradient per section, chunky Arial headlines with a highlighted word, rounded cards that **pop** in. **Every point is on the presenter's click.** Only a slide's tag and title play by themselves, as the slide arrives (that arrival is already a click). Everything else waits for a click, one point at a time, in reading order. Never let later slides get thinner animation than early ones; a presenter notices.

Everything is in this folder (`$SKILL` below):

- `engine/kit.js`: the `Deck` class and its slide types. Each slide type places its own elements, measures its text (Arial metrics), numbers its own clicks and writes the speaker notes.
- `engine/animate.js`: writes PowerPoint click sequences into the .pptx (pptxgenjs can't).
- `reference/slides.md`: every slide type (text, picture galleries, nested circles, colour-coded prompts), what it is for, its fields and its clicks. **Read it before planning.**
- `scripts/check.py`: fails if any element on any slide isn't animated, or if an animation targets nothing.
- `scripts/render.sh`: renders every slide (fully built) into one grid image.
- `examples/win-win/`: an 11-slide, 43-click talk built with every slide type but `points` and `statement`. Use it as the quality bar.

## 1. Get the content

Ask for the talk: an outline, a script, notes, or a video or Short to turn into a talk. **Use the person's own wording.** Cut it down, but don't add claims, and **never invent numbers**. If a figure has no label, ask what it measures. If you can't ask, use the most literal label and put "inferred" in that slide's notes.

## 2. Plan, then wait for an OK

One idea per slide, 1.5–2 minutes per slide when spoken. Pick a slide type for each from `reference/slides.md` and show a table:

| # | Point (their words) | Slide type | Colour | Clicks |
|---|---|---|---|---|

- The slide type should **do** what the words say: options → `cards`, unknowns → `mystery`, "same X, same Y" → `checklist`, before → after numbers → `steps`, wrong move vs. right move → `contrast`, surface vs. real answer → `pair`, a list of steps → `points`. Use `statement` only when nothing more active fits.
- Alternate colours so neighbouring slides differ. Save `green` for results.
- Aim for 2–5 clicks per slide. A slide with 1 click is a sign to merge it; one with more than 5 should be split.

Wait for the OK before building.

## 3. Build

```bash
mkdir <deck-name> && cd <deck-name>
cp -r "$SKILL/engine" ./engine && (cd engine && npm install)
```

Write `deck.js` next to `engine/`, in the same shape as `$SKILL/examples/win-win/deck.js`. Put `*stars*` around the one or two words to highlight. Give each slide `notes:` with what you'll say before the first click; the click-by-click lines are added for you. Then:

```bash
node deck.js
python3 "$SKILL/scripts/check.py" <deck>.pptx
```

`node deck.js` prints `WARN` lines for text it measures as too long for its box. Fix every one: shorten the words (best), or move the content to a slide type with more room. `check.py` must pass.

## 4. Look at it

```bash
bash "$SKILL/scripts/render.sh" <deck>.pptx
```

Open the grid image and check each slide **fresh**, as the audience would see it after the last click:
- text cut off, overlapping or crowding a card's edge;
- a word stranded alone on a line;
- two neighbouring slides with the same colour;
- any slide that looks emptier or plainer than the others.

`steps` slides show all their numbers stacked in one spot. That is expected: they swap on click, and only one shows in the slide show. It also means a PDF export or the Normal view shows the stack, so say so when you hand the deck over.

## 5. Hand over

Give the .pptx and say plainly:
- how many slides and clicks it has, and that the speaker notes list each click;
- that it hasn't been played in real PowerPoint here, so rehearse it once (F5) before presenting;
- any number or label you inferred;
- that the fonts are Arial and Consolas, which ship with Office, so it looks the same on any machine.

## Changing it

- **Colours:** `COL` and `BG` in `engine/kit.js`. Light backgrounds go in `LIGHT` so their headlines turn dark.
- **Titles on a click too:** in `kit.js` → `title()`, change `click: 0` to the current click, and call `t.click()` first.
- **A new slide type:** add it to `TYPES` in `kit.js`. Use `t.click(say)` before each point, `t.anim(name, fx)` for every element you add (fx: `pop`, `wipe`, `type`, `exit`, `pulse`), and `t.fit(...)` on any text that could run long. Then run `check.py`; it catches anything you forgot to animate.
