"""Inject the shared brand CSS/JS into each clip, then build with the motion-broll engine.
usage: python3 build.py [clips/NN-name.html ...]   (default: all clips)"""
import pathlib, subprocess, sys, tempfile
H = pathlib.Path(__file__).resolve().parent
ENGINE = H.parent.parent / 'skills/motion-broll/engine/build.py'
css, js = (H/'common.css').read_text(), (H/'common.js').read_text()
srcs = [pathlib.Path(s) for s in sys.argv[1:]] or sorted((H/'clips').glob('*.html'))
with tempfile.TemporaryDirectory() as tmp:
    outs = []
    for s in srcs:
        f = s.read_text(encoding='utf-8')
        i = f.index('<script>')
        f = f[:i] + f'<style>{css}</style><script>{js}</script>' + f[i:]
        d = pathlib.Path(tmp)/s.name; d.write_text(f, encoding='utf-8'); outs.append(str(d))
    subprocess.run(['python3', str(ENGINE), str(H/'dist'), *outs], check=True)
