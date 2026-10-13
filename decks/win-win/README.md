# Why the worse product keeps winning — animated deck

A 16:9 PowerPoint talk (11 slides, 43 clicks) built from the WIN-WIN Shorts, in the same card style as
`skills/remotion-shorts`. Every build is a native PowerPoint animation that plays **on click**, so you
advance it with a clicker, Space or the arrow keys while you present. Speaker notes list what each click reveals.

```
npm install
node build.js        # → win-win.pptx
```

- `build.js` — the slides. Each element gets a name and an `anim(name, click, fx, delay)` line:
  `click` 0 plays when the slide appears, 1, 2, 3… on each click; `fx` is `pop`, `rise`, `fade`,
  `wipe`, `type` (letter by letter), `exit`, or `pulse` (a quick grow-and-back on something already shown).
- `animate.js` — writes those steps into the .pptx as PowerPoint timing XML (pptxgenjs can't).

Fonts are Arial and Consolas, which ship with Office. Slide 6 stacks four numbers in one place and
swaps them on click, so in Normal view and in a PDF export they overlap; in the slide show only one shows.
