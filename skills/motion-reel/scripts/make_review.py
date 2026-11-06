"""Write review.html next to the reel: the video with scene and beat markers, frame stepping, and loop-a-scene.
usage: python3 make_review.py motion/reel.json motion/dist/timeline.json motion/out/reel.mp4
Also writes SCENES.md (scene, beats, in/out, what it shows, what is illustrative)."""
import json, os, pathlib, sys
S = pathlib.Path(__file__).resolve().parent.parent / 'templates'
reel_p, tl_p, video = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3]).resolve()
reel, tl = json.load(open(reel_p)), json.load(open(tl_p)); out = video.parent
fps = str(tl['fps']); fps_f = float(fps.split('/')[0]) / float(fps.split('/')[1]) if '/' in fps else float(fps)
beats = sorted({round(s['in'] + b, 4) for s in tl['scenes'] for b in s['local_beats'][:-1]})
scenes = [{'id': s['id'], 'name': s.get('name', ''), 'in': s['in'], 'out': s['out'], 'beats': s['beats'], 'shows': s.get('shows', '')} for s in tl['scenes']]
title = reel.get('title', 'Reel')
html = (open(S / 'review.html').read().replace('/*TITLE*/', title).replace('/*SRC*/', os.path.relpath(video, out))
        .replace('/*FPS*/60', f'{fps_f:.6f}').replace('/*SCENES*/[]', json.dumps(scenes, ensure_ascii=False))
        .replace('/*BEATS*/[]', json.dumps(beats)).replace('/*DUR*/0', f"{tl['duration']:.4f}"))
open(out / 'review.html', 'w').write(html)
fmt = lambda t: f"{int(t // 60)}:{t % 60:05.2f}"
rows = ['| # | Scene | Beats | In | Out | What it shows |', '|---|---|---|---|---|---|']
rows += [f"| {s['id']} | {s['name']} | {s['beats']} | {fmt(s['in'])} | {fmt(s['out'])} | {s['shows']} |" for s in scenes]
notes = reel.get('notes', [])
music = f"Music: `{reel['music']}` from {tl['music_start']:.3f}s" if reel.get('music') else 'No music: silent render on a ' + (f"{reel.get('bpm', 120)} bpm grid" if not reel.get('beats') else 'detected beat grid')
open(out / 'SCENES.md', 'w').write(f"# {title}\n\n{tl['duration']:.2f}s at {fps} fps · {music}\n\n" + '\n'.join(rows)
                                   + ('\n\nNotes\n' + '\n'.join('- ' + n for n in notes) if notes else '') + '\n')
print('wrote', out / 'review.html', 'and', out / 'SCENES.md')
