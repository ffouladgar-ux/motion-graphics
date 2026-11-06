---
name: motion-reel
description: Make a short standalone motion-graphics reel (product launch, data story, kinetic type, explainer or showreel; 10–60s, usually 1920×1080 at 60fps) from a written brief, with the brand locked to 3 colours and 2 fonts, every scene cut on the music's beat, and a closing call to action. Use when someone asks for a promo video, launch video, product reel, sizzle, animated ad, kinetic-type video or "a motion video" without existing footage. For B-roll over a talking-head video, use motion-broll instead.
---

# Motion reel

You make a short motion-graphics video from a brief. Claude has no video model: you write every scene as code (a small HTML file whose every frame is a pure function of time), and a headless browser renders it frame by frame with motion blur. That makes every word, colour and beat an edit, not a regeneration.

The house style comes from the shared engine: **one shape per scene that never cuts**. It morphs size, corners and colour from state to state while its content swaps with a short blur, a cursor drives real clicks and drags, and springs (never bouncy easing) move everything. A reel is 3–7 of these scenes, **hard-cut on the beat**, ending on a call to action.

Everything you need is in this skill folder (`$SKILL` below):

- `engine/`: `motion.js` (the motion engine), `reel.js` (beat clock, brand colours, kinetic type, beat kicks, extra icons), `build.py` (scenes + brand + beats → self-contained HTML and `timeline.json`), `render.js` (frame-by-frame render with motion blur), `stills.js` (contact sheets), `base.css`, fonts (Geist, OFL).
- `scripts/`: `setup.sh`, `music_beats.py` (tempo, beats, downbeats), `brand_lint.py` (brand lock and house rules), `assemble.py` (scenes + music → final reel), `make_review.py` (frame-by-frame review page).
- `reference/brief.md`: the brief template. **Fill it in with the user before anything else.**
- `reference/library.md`: scene and reel recipes for the five kinds of reel. Start from the closest one, never from a blank prompt.
- `reference/reel-api.md`: `reel.json`, `brand.json` and the `R.*` helpers. `reference/engine-api.md`: the engine (`M.*`). **Read both before writing your first scene.**
- `examples/launch-reel/`: a finished 20-second launch reel (fictional product) with its brief, brand, reel.json and five scenes. Use it as the quality bar.

Work in a `motion/` folder in the user's project.

## 1. Set up (first run only)

```bash
bash $SKILL/scripts/setup.sh ./motion
```

Checks for Node, Python 3 (with numpy) and ffmpeg, and installs Playwright and Chromium into `motion/node_modules`. Run every engine script with `NODE_PATH=./motion/node_modules`.

## 2. Brief: one round of questions, then lock it

Use AskUserQuestion once and skip anything already answered. You need:

- **Kind of reel**: product launch, data story, kinetic type, explainer or showreel (see `reference/library.md`).
- **The one message** the viewer should leave with, and the **call to action**: the words on the button and where it goes.
- **Brand**: exactly 3 colours (canvas, ink, accent) as hex codes, and 2 fonts (display, body) as names. Font files (`.woff2`, `.ttf`, `.otf`) go in `motion/inputs/`. Ask for a logo and product screenshots there too, and read them. With no brand, offer the default (warm canvas, near-black ink, one orange accent, Geist).
- **Music**: a track in `motion/inputs/` (they must have the rights to it), or a bpm to cut to and they add music later. Default 120 bpm.
- **Length and format**: default 20s, 1920×1080, 60fps.
- **Facts**: the real names, numbers, quotes and features the reel may show. **Nothing else gets a number.**

Write `motion/brief.md` from `reference/brief.md` and `motion/brand.json` (schema in `reference/reel-api.md`). The brief locks the brand: from here on, every colour and font must come from `brand.json`, and `brand_lint.py` enforces it.

## 3. Find the beat

With a track:

```bash
python3 $SKILL/scripts/music_beats.py motion/inputs/track.mp3 motion/work/beats.json
```

It prints the bpm, the beat count and the first downbeat. Pick `start_beat` on a downbeat where the music is strong (usually the first downbeat, or the drop). If confidence is low or the bpm looks doubled or halved, ask the user for the bpm and rerun with `--bpm`. Without a track, set `bpm` in `reel.json` and leave `beats` null.

## 4. Plan in beats, and get approval before any code

Choose the closest recipe in `reference/library.md` and adapt it in three ways:
1. **Brand**: swap in `brand.json` colours, fonts and voice.
2. **Real objects**: replace generic UI with the user's own product, data and words from the brief.
3. **The track**: re-time scene lengths to the music's phrasing.

Show a table with one row per scene:

| # | Beats | Seconds | What the shape does, on which beats | Copy on screen | Why |

Rules:
- **Every cut lands on a beat, and scene lengths are whole bars** (multiples of 4 beats in 4/4) where you can. Big changes (a new scene, a morph to a new state) go on downbeats; small ones (a word, a row, a click) go on beats or half-beats.
- **Hook in the first 2 beats.** Something must move on frame 1.
- **One idea per scene**, with 3–5 states at most. Copy is short: 2–6 words a state, in the brand's voice.
- **End on the CTA** for at least 4 beats, with the logo and the button. Hold it.
- **Never invent numbers, quotes, logos, prices or results.** Use relative bars, skeleton lines or labels from the brief, and say which ones are illustrative.

Write `motion/reel.json` with the scenes and their beat counts. Wait for the user to approve or edit the plan.

## 5. Build

Write one fragment per scene in `motion/clips/NN-name.html`, following `reference/reel-api.md`, `reference/engine-api.md` and the example. Time everything with `R.b(n)` (beat n of this scene), never with raw seconds, so a new track or bpm re-times the whole reel. Then:

```bash
python3 $SKILL/scripts/brand_lint.py motion/brand.json motion/clips/*.html
python3 $SKILL/engine/build.py motion/reel.json motion/dist
```

Fix every lint error. For every number the linter lists, check it is in the brief's facts.

## 6. Check stills on the beats

```bash
NODE_PATH=./motion/node_modules node $SKILL/engine/stills.js motion/dist/NN-name.html motion/work/NN.png 0.3 0.8 1.3 …
```

Pick times just after each beat a state lands on (about +0.15s), plus a couple of mid-morph moments. Look at every sheet yourself. Fix anything cramped, clipped, unreadable, off-brand or off-beat, or where the cursor leaves the frame, and check again. Look for what makes it feel unfinished: dead time, two things moving at once that fight, a label that pops without a blur, a state that doesn't fill the frame.

## 7. Render and assemble

```bash
mkdir -p motion/out/scenes
NODE_PATH=./motion/node_modules node $SKILL/engine/render.js motion/dist/NN-name.html motion/out/scenes/NN-name.mp4 60
python3 $SKILL/scripts/assemble.py motion/reel.json motion/dist/timeline.json motion/out/reel.mp4
python3 $SKILL/scripts/make_review.py motion/reel.json motion/dist/timeline.json motion/out/reel.mp4
```

- Render at the fps in `reel.json`. Each scene renders 4 subframes per frame, so it is slower than real time; render scenes in parallel (one per core).
- `build.py` snaps every cut to a whole frame, so scenes join with no drift and the cuts stay on the beat.
- After an edit, rebuild and re-render only that scene, then re-assemble.

## 8. Review and deliver

Open `motion/out/review.html` for a frame-by-frame check: step with `,` and `.`, jump scenes with `[` and `]`, loop a scene, quarter speed, and see the distance from the nearest beat. Watch it once with sound to confirm the cuts hit.

The user gets, in `motion/out/`:
- `reel.mp4`: the finished reel with music (H.264, AAC)
- `scenes/`: each scene as its own MP4, for their editor
- `review.html` and `SCENES.md`: the scene list with beats and timings, and what is illustrative

For variants (other copy, another language, 9:16), copy `reel.json`, change the copy or `size`, rebuild and re-render. For 1080×1920, set `W:1080,H:1920` in each scene and re-lay out; don't just crop.

## Style defaults

The brand overrides these.

- **Colour**: the canvas fills the frame; components are white (`--n0`) or ink; the accent is used once or twice a scene, for the thing that matters.
- **Type**: the display font for headlines (`.display`, 80–150px on screen), the body font for UI, Geist Mono for code. Sentence case, short, full stops for rhythm.
- **Motion**: springs with a tiny overshoot at most. Leading and trailing edges ride different springs so indicators stretch. Beat kicks (`R.kick`) are small: 3–10% scale. The camera zooms so each state fills the frame.
- **Banned**: purple-to-blue gradients, glows, particles, lens flares, bouncy easing, a card sliding in from the left for no reason, stock "tech" backgrounds, mixed icon strokes, made-up data, dead time.

## Gotchas

- Everything is a pure function of `t`. No CSS transitions, `setTimeout` or state carried between frames; `seek(t)` must draw any frame on its own.
- A flex row (`.row`) drops spaces between spans. `R.words` uses margins for that reason; do the same in your own markup.
- Measure text with the DOM (`offsetWidth`, `offsetLeft`; they ignore transforms) inside `geom`/`update`, not at script start: the fonts may not have loaded yet.
- Never put `will-change` on anything the camera scales; text renders blurry.
- Content swapping inside a morphing shape needs its own enter and exit timing (`M.vis` din/lin/lout), or the old and new text overlap.
- A scene that changes on its very first frame (t=0) hides the cut. Put the first change on `R.b(0)` with `intro:R.b(0)`, or start in a settled state.
- Music under 60s rarely changes tempo, but live recordings drift. `music_beats.py` follows small drift; for big tempo changes, use the beats as detected (`"beats": "work/beats.json"`), not a bpm grid.
