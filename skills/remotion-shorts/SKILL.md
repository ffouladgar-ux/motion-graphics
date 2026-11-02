---
name: remotion-shorts
description: Make a bold, colourful vertical motion-graphic video (YouTube Shorts, Reels, TikTok, 1080×1920) in Remotion from a script, transcript, SRT or video description, in a "card" style (one bright gradient per section, chunky headlines with a highlighted word, rounded cards that spring in, counters, checklists, typed questions, diagonal wipes). Use whenever someone wants an animated Short or Reel made from their words, wants "motion graphics like that video" for a vertical clip, wants to turn a Short's script or caption into an animation, or mentions Remotion for a short-form video, even if they don't say "skill" or "Remotion". For B-roll cut into an existing talking-head video, use motion-broll instead.
---

# Remotion Shorts

You turn a creator's script into a 20–60 second vertical motion-graphic video. Each scene **acts out** one idea from the script: a number counts up, options drop in as cards, a checklist ticks off as it's said, a question types itself. Every scene gets its own bright gradient, so a viewer always knows where they are.

Everything you need is in this folder (`$SKILL` below):

- `template/`: a working Remotion project. `src/content.ts` is the only file you normally edit. `src/scenes.tsx` holds the scene types, `src/kit.tsx` the building blocks, `public/` the Geist fonts (OFL).
- `reference/scenes.md`: what each scene type is for, its fields, and how long it needs. **Read it before planning.**
- `scripts/srt_timing.py`: turns an SRT plus scene-start phrases into `sec` values.
- `scripts/contact_sheet.sh`: tiles stills from a render so you can check it.

A finished example (the template's default content, rendered) is in this repo at `samples/one-sentence/`.

## 1. Get the words

Ask for the script if you don't have it. Good sources, best first:

1. **An SRT or word-timed transcript of the voiceover.** This lets you time scenes to the voice.
2. **The script or the Short's description/caption.** Use its wording exactly.
3. A video file: transcribe it (e.g. faster-whisper) if a tool is available.

**Use the creator's own words, not your paraphrase.** Headlines may be cut down to a phrase from the script, but don't add claims. **Never invent numbers.** If the script gives a figure without saying what it measures (e.g. "42. 18. 3.58."), ask. If you can't ask, use the most literal label the script supports and tell the user it's your guess.

If there's no voiceover timing, say that the video will be timed to a reading pace (about 2.5 words per second, plus 1 second per scene for the animation to land) and that they can re-time it later.

## 2. Plan, then wait for an OK

Split the script into 4–8 beats, one idea each. Pick a scene type for each from `reference/scenes.md` and show a table:

| # | Words (from the script) | Scene type | Colour | sec |
|---|---|---|---|---|

Ways to pick:
- The scene type should **do** what the words say. Several options → `cards`. "Same X, same Y" → `checklist`. Before → after numbers → `steps`. A question → `question`. Don't use `statement` when a more active type fits.
- Alternate colours so neighbouring scenes never share one. Save `green` for the payoff or result.
- Open with the strongest number or claim (`stat` or `statement`) and end with the creator's call to action (`cta`) if they have one.

Wait for the user's OK before building. A wrong plan costs a full render.

## 3. Build

```bash
cp -r "$SKILL/template" ./<video-name> && cd ./<video-name>
npm install
```

Write the plan into `src/content.ts` (replace the example `SCENES`). Use `*stars*` to highlight the one key word in a line; one highlight per line at most, or nothing stands out.

**Timing.** With an SRT, list the cues (`python3 $SKILL/scripts/srt_timing.py talk.srt`), then pass one phrase per scene start to get the `sec` values. Within a scene, `cards`, `checklist` and `steps` take a `gap` (frames between items, 30 per second). Set it so each item lands on the word that names it.

Type-check: `npx tsc`.

## 4. Check, then render

Render, then look at a contact sheet before showing anything:

```bash
npx remotion render Short out/short.mp4
bash $SKILL/scripts/contact_sheet.sh out/short.mp4 out/sheet.png
```

If Remotion can't download its browser (offline or sandboxed), point it at a local Chromium or headless shell: `REMOTION_BROWSER=/path/to/chrome npx remotion render ...`.

Look at the sheet and fix:
- **Overflow:** a headline or card running off the right edge. Shorten the words, or lower `size` on `statement`.
- **Items rushing in faster than they are said.** List scenes squeeze their spacing to fit a short scene. Give the scene more `sec`, or split it.
- **Two neighbouring scenes with the same colour.**
- **Anything in the bottom fifth of the frame.** The platform's caption and buttons cover it.

## 5. Hand over

Give the user the MP4 and say plainly:
- whether it is timed to their voice or to a reading pace;
- any label or number you had to guess;
- how to change it: edit `src/content.ts`, then `npm run studio` to preview or `npm run render` to export.

## Changing the look

Colours are `C` and `BG` in `src/kit.tsx`. To match a brand, change those and keep everything else. A new scene type goes in `src/scenes.tsx`, gets added to `SCENE_TYPES`, and gets a union entry in `content.ts`. Build it from the `kit.tsx` pieces (`Pop`, `Card`, `Tag`, `Headline`, `Counter`, `Typed`) so it moves like the rest.
