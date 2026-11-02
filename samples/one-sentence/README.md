# one-sentence — Remotion sample

A 32-second vertical (1080×1920, 30 fps) motion-graphic version of the Short
*"157 dollars to 3.58, from one sentence"*. The copy is taken word for word from the Short's description.

The style: one saturated gradient per section, bold Geist headlines with a highlighted key word,
monospace pill tags, rounded cards that spring in, counters, checklists that tick as they're said,
a typed question, and diagonal wipes between sections.

## Run

```
npm install
npm run studio      # preview and scrub in the browser
npm run render      # → out/one-sentence.mp4
```

If Remotion can't download its browser, point it at a local Chromium:
`REMOTION_BROWSER=/path/to/chrome npm run render`.

## Change it

- `src/OneSentence.tsx` — the six scenes. Re-time to your voiceover by editing `dur` in `SCENES`
  and the `delay` values inside each scene (frames, 30 per second).
- `src/kit.tsx` — reusable pieces: `Background`, `Pop`, `Tag`, `Headline`/`Hi`, `Card`, `Counter`,
  `Check`, `Typed`, `DiagonalWipe`. Colours live in `C` and `BG`.

Geist fonts: SIL Open Font License (see `public/OFL-Geist.txt`).
