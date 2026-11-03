# Voice brief for Hermes: L'info sous IA demo

Make 8 French voiceover files for the 58 s demo video. Use the `fadi-voice` skill (Phonon via Ollama, or a cloned voice if you have one that speaks natural French).

## Output

- Files: `vo_0.wav` to `vo_7.wav`, mono, any sample rate, no silence at the start or end.
- Each file must be **no longer than its max length** below, or it will overlap the next scene.
- Put them in one Google Drive folder named `info-sous-ia-vo` (or commit them to the branch `ccr-81759c3d-olw24t` under `demos/info-sous-ia/audio/vo/`).

## Lines

| File | Starts at | Max length | Text |
|---|---|---|---|
| vo_0.wav | 0:00.5 | 5.4 s | L'info sous IA. Le workbook pour apprendre le journalisme avec l'IA. |
| vo_1.wav | 0:06.4 | 5.3 s | Et si l'IA devinait à votre place ? L'IA propose. Vous enquêtez. |
| vo_2.wav | 0:12.6 | 6.9 s | Mission un. Le prompt flou. On demande un sujet sur les adolescents, sans aucun contexte. |
| vo_3.wav | 0:19.9 | 7.0 s | Les non-dits. Public, média, territoire, angle, délais : l'IA a tout supposé à votre place. |
| vo_4.wav | 0:27.5 | 8.6 s | Le contexte caché : la vraie situation. Puis vous reprenez la main, avec un prompt précis, sans lui faire écrire le sujet. |
| vo_5.wav | 0:36.5 | 5.6 s | Prompt un contre prompt deux. Vous comparez, puis vous décidez. |
| vo_6.wav | 0:42.5 | 7.6 s | Mission accomplie ! Repérer l'implicite. Guider l'IA. Garder son regard critique. |
| vo_7.wav | 0:50.6 | 6.8 s | L'IA propose. Vous enquêtez. L'info sous IA : comprendre, vérifier, créer. |

## Pronunciation

- "IA" = "i-a" (two syllables), never "ya".
- "prompt" = "prompte", French style.
- "workbook" as in English.
- Tone: confident, warm, a bit punchy. Like a short course trailer.

## Mixing (done in the cloud session)

```bash
python3 demos/info-sous-ia/audio/mix.py <folder with vo_N.wav> demos/info-sous-ia/out/info-sous-ia-demo.mp4 out.mp4
```
