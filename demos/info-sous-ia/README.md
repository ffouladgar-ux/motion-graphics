# Démo : L'info sous IA

Demo video (FR, 1920×1080, 30 fps, about 58 s, silent) of the "L'info sous IA" course, built from Workbook Mission 01 with the `motion-broll` engine.

Brand: ink `#0B0B0B`, paper `#F7F7F5`, blue `#0057FF`, yellow `#E9FF00`, pale blue `#E7EBFF`, DejaVu Sans Condensed (bold, uppercase), taken from the workbook PDF.

| # | Scene | Length |
|---|---|---|
| 01 | Opening: yellow tag → workbook cover, "IA & Journalisme · Le workbook" | 6.5 s |
| 02 | "Et si l'IA devinait à votre place ?" → "L'IA propose. Vous enquêtez." | 6 s |
| 03 | 01 Le prompt flou: the vague prompt typed, then "Notez deux pistes" | 8 s |
| 04 | 02 Les non-dits: six missing pieces of context checked off | 8 s |
| 05 | 03 Le contexte caché → 04 Reprenez la main | 9.5 s |
| 06 | 05 Prompt 1 vs prompt 2 | 6.5 s |
| 07 | Bravo, mission accomplie: Repérer, Guider, Garder | 8.5 s |
| 08 | "L'IA propose. Vous enquêtez." → logo, Comprendre • Vérifier • Créer | 7.5 s |

All on-screen text comes from the workbook.

`assets/hero.jpg` (the workbook cover art) and the rendered video are not committed. To rebuild, extract the cover image from the workbook PDF into `assets/hero.jpg` (`pdfimages -png -f 1 -l 1 Workbook_1-ISI.pdf`, scaled to 1920 wide).

```bash
python3 build.py                       # shared brand CSS/JS + engine → dist/
E=../../skills/motion-broll/engine
for c in dist/*.html; do node $E/render.js $c out/$(basename $c .html).mp4 30; done
# then join with 0.4 s crossfades (xfade) into out/info-sous-ia-demo.mp4
```
