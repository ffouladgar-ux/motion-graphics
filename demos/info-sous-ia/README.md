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

## Soundtrack

French voiceover made locally with [Piper](https://github.com/rhasspy/piper) (voice `fr_FR-siwis-medium`) plus sound effects synthesized in code (whooshes, key clicks, ticks, pops, chimes), ducked under the voice and normalized to -16 LUFS.

- `audio/lines.py`: the script, with each line's start time. Spellings are phonetic for the voice: "I A" (said "i-a"), "prommpte", "ouorkbouk". Never start a line with a capital "L'I": the voice reads it as "elle apostrophe".
- `audio/mix.py`: builds the effects track, places the voice, mixes, and muxes onto the video.

```bash
# voices: https://huggingface.co/rhasspy/piper-voices (fr/fr_FR/siwis/medium)
python3 -c "import wave; from piper import PiperVoice; from lines import LINES; v=PiperVoice.load('fr_FR-siwis-medium.onnx'); [v.synthesize_wav(s, wave.open(f'vo/vo_{i}.wav','wb')) for i,(t,s,m) in enumerate(LINES)]"
python3 audio/mix.py vo out/info-sous-ia-demo.mp4 out/info-sous-ia-demo-vo.mp4
```
