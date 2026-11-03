# Teaser : L'info sous IA, Bootcamp B1

Student teaser (FR, 1920×1080, 30 fps, 37 s) for the B1 bootcamp of the IA & Journalisme programme (9, 10, 11 February 2027, 14h–17h).

Brand, from the official "DA TYPO/couleurs" guide: blue `#0453E1`, yellow `#E9FF00`, black `#0B0B0B`, off-white `#F8F6F2`; Bebas Neue (titles), Inter (text), Anton (stickers and logo); editorial collage (halftone, torn paper, stickers); logo always "L'INFO SOUS IA", never the "ISI" abbreviation.

| # | Scene | Length |
|---|---|---|
| 01 | "Info ou intox ?" · L'IA répond à tout. Même quand elle se trompe. | 4.5 s |
| 02 | Et vous, vous vérifiez ? | 3.5 s |
| 03 | "Bienvenue dans l'info sous IA" visual · Bootcamp B1 • 3 jours | 4 s |
| 04 | Jour 01 Comprendre · Jour 02 Expérimenter · Jour 03 Vérifier et décider · À retenir | 9.5 s |
| 05 | Des missions : workbooks, quiz, certification AFP | 6 s |
| 06 | L'IA propose. Vous enquêtez. | 4 s |
| 07 | Logo · 9 • 10 • 11 février 2027 · À vous de jouer | 5.5 s |

Hard cuts on a 120 BPM grid. Soundtrack: synthesized hits/pops on every sticker + a light beat (`audio/mix.py`, `--no-beat` for effects only).

`assets/bienvenue.jpg` and `assets/journal.jpg` (project artwork from the team Drive) are not committed; this repo is public.

```bash
python3 build.py
E=../../skills/motion-broll/engine
for c in dist/*.html; do node $E/render.js $c out/$(basename $c .html).mp4 30; done
# concat with hard cuts → out/teaser-video.mp4, then:
python3 audio/mix.py out/teaser-video.mp4 out/info-sous-ia-teaser-b1.mp4
```
