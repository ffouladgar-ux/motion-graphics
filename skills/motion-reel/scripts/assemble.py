"""Join the rendered scenes into the final reel and lay the music under it, cut on the beat.
usage: python3 assemble.py motion/reel.json motion/dist/timeline.json motion/out/reel.mp4

Scenes are read from motion/out/scenes/<scene file stem>.mp4 (render.js output). Hard cuts land on the
frame-snapped beats from timeline.json. Music starts at the beat the reel starts on and fades out over
reel.json "fade_out" seconds (default 1.0). Without music the reel is silent."""
import json, pathlib, subprocess, sys, tempfile
reel_p, tl_p, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3])
reel, tl = json.load(open(reel_p)), json.load(open(tl_p)); base = reel_p.parent
scenes_dir = out.parent / 'scenes'
probe = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)], capture_output=True, text=True).stdout.strip() or 0)

fps_f = (lambda v: float(v.split('/')[0]) / float(v.split('/')[1]) if '/' in v else float(v))(str(tl['fps']))
files = []
for s in tl['scenes']:
    f = scenes_dir / (pathlib.Path(s['file']).stem + '.mp4')
    if not f.exists(): sys.exit(f'missing render: {f}  (render it with engine/render.js first)')
    got = probe(f)
    if abs(got - s['T']) > 1.5 / fps_f: print(f'warning: {f.name} is {got:.3f}s, timeline says {s["T"]:.3f}s. Rebuild and re-render it.')
    files.append(f.resolve())

lst = tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False)
lst.write(''.join(f"file '{f}'\n" for f in files)); lst.close()
fps, dur = str(tl['fps']), tl['duration']
cmd = ['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst.name]
music = reel.get('music')
if music:
    fade = float(reel.get('fade_out', 1.0))
    cmd += ['-ss', f"{tl['music_start']:.4f}", '-i', str((base / music).resolve())]
    af = f"atrim=0:{dur:.4f},afade=t=out:st={max(0, dur - fade):.4f}:d={fade:.4f}"
    cmd += ['-filter_complex', f'[1:a]{af}[a]', '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '256k']
else:
    cmd += ['-map', '0:v']
cmd += ['-r', fps, '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', f'{dur:.4f}', str(out)]
subprocess.run(cmd, check=True)
print(f'wrote {out}  {probe(out):.3f}s  ({len(files)} scenes{", with music" if music else ", silent"})')
