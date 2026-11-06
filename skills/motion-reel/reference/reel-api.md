# Reel files and helpers

A reel is `brand.json` (the locked look) + `reel.json` (the scenes and the beat) + one HTML fragment per scene. Fragments are written exactly like motion-broll clips (`engine-api.md`), with two differences: colours and fonts come from the brand, and times come from the beat clock (`R.b`).

## brand.json

```json
{
  "name": "Tidepool",
  "colors": {"canvas": "#F2F0EA", "ink": "#0E1A24", "accent": "#2F6BFF"},
  "neutrals": ["#FFFFFF", "#7F8A94", "#E4E2DB"],
  "fonts": {
    "display": {"family": "Inter", "file": "inputs/Inter-SemiBold.woff2", "weight": 600},
    "body":    {"family": "Inter", "file": "inputs/Inter-Regular.woff2", "weight": 400}
  },
  "logo": "inputs/logo.svg",
  "voice": "Short, plain, confident. Full stops, no exclamation marks."
}
```

- **3 colours.** `canvas` fills the frame, `ink` is text and dark components, `accent` is used sparingly. `neutrals` are the supporting greys and white: keep it to three (component white, muted text, hairlines and skeleton lines). They become `--n0`, `--n1`, `--n2`.
- **2 fonts.** `file` is optional and relative to `brand.json`. Without one, the family must be Geist (bundled) or the render falls back to Geist. A variable font can set `"weight_range": "100 900"`.
- `voice` is for you: write all on-screen copy in it.

In CSS use `var(--canvas)`, `var(--ink)`, `var(--accent)`, `var(--n0)`…, `var(--display)`, `var(--body)`, and the `.display` class (display font, weight and tight tracking). In JS use `R.C.canvas`, `R.C.ink`, `R.C.accent`, `R.C.n0`… (hex strings, for `M.icon`, `M.ctrack` and `SH` backgrounds).

`brand_lint.py` fails on any other hex colour, any gradient, glow-like shadows and fonts outside the brand, and lists every number on screen so you can check it against the brief.

## reel.json

```json
{
  "title": "Tidepool launch reel",
  "fps": 60,
  "size": [1920, 1080],
  "brand": "brand.json",
  "music": "inputs/track.mp3",
  "beats": "work/beats.json",
  "bpm": 120, "offset": 0,
  "start_beat": 8,
  "fade_out": 1.0,
  "scenes": [
    {"id": "01", "name": "Hook", "file": "clips/01-hook.html", "beats": 8, "shows": "What the scene shows, for SCENES.md"}
  ],
  "notes": ["Scene 03's bars are illustrative."]
}
```

- `beats` is the output of `music_beats.py`. When it is null, a steady grid from `bpm` and `offset` is used.
- `start_beat` is the beat in the track where the reel starts (0 = the first beat detected). The music is trimmed to start exactly there.
- Each scene lasts a whole number of `beats`. `build.py` turns that into seconds, snaps each cut to a whole frame (cumulatively, so there is no drift), and writes `dist/timeline.json`.
- `music: null` makes a silent reel on the beat grid.
- Paths are relative to `reel.json`.

## Fragment skeleton

```html
<title>02 Product</title>
<style>.big{transform:translate(-50%,-50%);font-size:84px}</style>
<div data-slot="world"><!-- optional: beside the shape, in world space (camera applies) --></div><!--/world-->
<div data-slot="shape">
  <div class="L" id="Lpill"> … </div>
  <div class="L" id="Lcard"><div class="row big display" id="head"></div></div>
</div><!--/shape-->
<div data-slot="screen"><!-- optional: screen space, no camera (e.g. a corner logo) --></div><!--/screen-->
<script>
const $=id=>document.getElementById(id);
const [b0,b2,b4]=R.bs(0,2,4);                        // beat times of this scene, in seconds
const head=R.words($('head'),'Every channel. One inbox.',R.bs(2,2.5,3,3.5));
M.scene({
  W:1920,H:1080,bg:R.C.canvas,T:R.T,intro:b0,        // T:R.T = the scene's length from reel.json
  SH:{pill:{w:420,h:124,r:62,bg:R.C.ink,cam:1.9}, card:{w:1200,h:300,r:44,bg:R.C.n0,cam:1.25}},
  start:'pill', SEQ:[[b2,'card']],
  layers:[{el:'Lpill',tin:b0,tout:b2},{el:'Lcard',tin:b2,tout:null,update:t=>head(t)}],
  geom:(t,g)=>{g.sc*=1+0.05*R.kick(t,[b4]); return g;},
});
</script>
```

## Reel helpers (`window.R`)

| Call | What it does |
|---|---|
| `R.T` | This scene's length in seconds (whole frames). Use `T:R.T`. |
| `R.b(n)` | Time of beat `n` from the start of the scene. Fractions interpolate: `R.b(2.5)` is the off-beat. |
| `R.bs(...ns)` | Several at once: `const [b0,b4]=R.bs(0,4)`. |
| `R.beats` | The scene's beat times (seconds), including the end beat. |
| `R.C` | Brand colours as hex: `canvas`, `ink`, `accent`, `n0`, `n1`… |
| `R.kick(t, times, decay=0.15)` | A short kick (0→1→0) on each time. Multiply a scale or offset by a small amount for beat accents. |
| `R.words(el, text, times, {tout, rise, lin, gap})` | Kinetic type: splits `text` into words in `el`, reveals each at its time (rise + de-blur). Returns `update(t)`; call it from a layer's `update`. Style the words with `.w`. |
| `R.swap(t, list, times)` | The string from `list` whose time has most recently passed. |
| `R.count(t, t0, dur, from, to, dp)` | Counts up to a **real** number from the brief. Never to an invented one. |
| `R.textW(s, font)` | Canvas text width, cached once fonts have loaded. In layout, prefer DOM `offsetWidth`. |

Icons added to `M.IC` by `reel.js`: mail, chat, hash, phone, inbox, zap, send, bars, user (adapted from Lucide, ISC). The engine's own: arrow, check, x, plus, folder, terminal, file, pencil, coin, clock, chip, sparkle, castle, search.

## Timing

- Cuts between scenes are hard cuts on the beat (from `reel.json`). Inside a scene, put **state changes on beats** and **content (words, rows, clicks) on beats or half-beats**.
- A morph takes about 0.35s to settle at `M.MORPH`. At 120 bpm that is under one beat; at 160+ bpm, change state at most every 2 beats.
- Cursor moves should arrive about half a beat before the click and click on the beat.
- At 60fps, a beat at 120 bpm is 30 frames. `stills.js` at `R.b(n)+0.15` shows a state that has nearly settled.
