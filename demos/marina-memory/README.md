# Démo : Marina Memory

Video demo (FR, 1920×1080, 30 fps, 53.6 s, silent) of [marina-memory](https://github.com/ffouladgar-ux/marina-memory), built with the `motion-broll` engine.

**Video:** `out/marina-memory-demo.mp4`

| # | Scene | Length |
|---|---|---|
| 01 | Title: "Une mémoire permanente pour Claude" | 5 s |
| 02 | `ingère chapitre3.pdf` → converted to Markdown locally → filed under `sources/` | 8.5 s |
| 03 | Automatic filing into compartments (studies, business, …, inbox) | 9.5 s |
| 04 | `memory_recall` search → `memory_open` reads only the relevant sections | 8 s |
| 05 | Two tiers: `index.md` (~900 tokens) always loaded, the rest read on demand | 8 s |
| 06 | Privacy: no network, no API key, plain Markdown files | 7 s |
| 07 | Install (`./install.sh`, `mm doctor` → ready) + end card | 10 s |

Illustrative content: the example notes ("Rendu du mémoire vendredi à 14h", "Envoyer le devis au client lundi", "Plan du mémoire validé en 3 parties") and `guide-memoire.md` are made up. The figures (~900 tokens, 90–95 % lighter) come from the marina-memory README.

## Rebuild

```bash
E=../../skills/motion-broll/engine
python3 $E/build.py dist clips/*.html
for c in dist/*.html; do node $E/render.js $c out/$(basename $c .html).mp4 30; done
# then join with 0.4 s crossfades (xfade) into out/marina-memory-demo.mp4
```
