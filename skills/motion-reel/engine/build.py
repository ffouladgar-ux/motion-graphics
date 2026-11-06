"""Assemble a reel's scene fragments + engine + brand + beat clock into self-contained HTML files.
usage: python3 build.py motion/reel.json motion/dist [only scene ids ...]

Reads reel.json (schema in reference/reel-api.md), works out every scene's beats from the music
(beats.json) or from bpm/offset, snaps scene cuts to whole frames so they never drift, and writes
motion/dist/NN-name.html plus motion/dist/timeline.json (scene in/out times for render and assemble)."""
import base64, json, re, sys, pathlib
E = pathlib.Path(__file__).resolve().parent
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CURSOR = '<svg id="cursor" viewBox="0 0 40 56"><path d="M3 3 L3 41 L12.5 32 L19 47 L25.5 44.2 L19.2 29.8 L32 29.8 Z" fill="var(--cursor,#0B0B0B)" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/></svg>'
FMT = {'.woff2': 'woff2', '.woff': 'woff', '.ttf': 'truetype', '.otf': 'opentype'}
MIME = {'.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf'}
DEFAULT_BRAND = {'name': 'Default', 'colors': {'canvas': '#E9E7E2', 'ink': '#0B0B0B', 'accent': '#FF5A1F'},
                 'neutrals': ['#FFFFFF', '#8A8782', '#F1EFEB'],
                 'fonts': {'display': {'family': 'Geist', 'weight': 600}, 'body': {'family': 'Geist', 'weight': 400}}}


def fps_of(v):
    v = str(v)
    if '/' in v: a, b = v.split('/'); return float(a) / float(b)
    return float(v)


def beat_grid(reel, base):
    """Absolute beat times in the music (seconds). From beats.json when there is one, else a bpm grid."""
    if reel.get('beats'):
        bj = json.load(open(base / reel['beats']))
        bt = list(bj['beats'])
    else:
        bpm, off = float(reel.get('bpm', 120)), float(reel.get('offset', 0))
        bt = [off + i * 60 / bpm for i in range(2000)]
    need = reel.get('start_beat', 0) + sum(s['beats'] for s in reel['scenes']) + 2
    while len(bt) < need:  # extend past the end of the detected beats at the last interval
        bt.append(bt[-1] + (bt[-1] - bt[-2]))
    return bt


def timeline(reel, base):
    fps = fps_of(reel.get('fps', 60)); bt = beat_grid(reel, base)
    k0 = reel.get('start_beat', 0); t0 = bt[k0]; k = k0; out = []
    for s in reel['scenes']:
        a, b = bt[k] - t0, bt[k + s['beats']] - t0
        fa, fb = round(a * fps), round(b * fps)  # cut on whole frames: cumulative, so no drift
        local = [bt[j] - bt[k] for j in range(k, k + s['beats'] + 1)]
        out.append({**s, 'in': fa / fps, 'out': fb / fps, 'frames': fb - fa, 'T': (fb - fa) / fps, 'local_beats': local, 'first_beat': k})
        k += s['beats']
    return {'fps': reel.get('fps', 60), 'music_start': t0, 'duration': out[-1]['out'] if out else 0, 'scenes': out}


def brand_css(brand, bdir):
    c = brand['colors']; css = []
    for role in ('display', 'body'):
        f = brand['fonts'][role]
        if f.get('file'):
            p = bdir / f['file']; ext = p.suffix.lower()
            css.append(f"@font-face{{font-family:'{f['family']}';src:url(data:{MIME[ext]};base64,{b64(p)}) format('{FMT[ext]}');font-weight:{f.get('weight_range', '100 900')}}}")
    fam = lambda r: f"'{brand['fonts'][r]['family']}','Geist',system-ui,sans-serif"
    vars_ = [f'--canvas:{c["canvas"]}', f'--ink:{c["ink"]}', f'--accent:{c["accent"]}', f'--cursor:{c["ink"]}',
             f'--display:{fam("display")}', f'--body:{fam("body")}',
             f'--dw:{brand["fonts"]["display"].get("weight", 600)}'] + [f'--n{i}:{h}' for i, h in enumerate(brand.get('neutrals', []))]
    css.append(':root{' + ';'.join(vars_) + '}')
    css.append('html,body{background:var(--canvas)}html:not(.alpha) body.preview{background:var(--canvas)}'
               '#stage{font-family:var(--body);color:var(--ink)}.display{font-family:var(--display);font-weight:var(--dw);letter-spacing:-.035em}')
    return ''.join(css)


def build(src, dst, scene, brand, bdir, fps):
    frag = open(src, encoding='utf-8').read()
    m = re.search(r'<title>(.*?)</title>', frag); title = m.group(1) if m else pathlib.Path(src).stem
    css = ''.join(re.findall(r'<style>(.*?)</style>', frag, re.S))
    slot = lambda n: (re.search(rf'<div data-slot="{n}">(.*?)</div><!--/{n}-->', frag, re.S) or [None, ''])[1]
    js = ''.join(re.findall(r'<script>(.*?)</script>', frag, re.S))
    base = open(E / 'base.css').read().replace('__GEIST__', b64(E / 'fonts/Geist-Variable.woff2')).replace('__GEISTMONO__', b64(E / 'fonts/GeistMono-Medium.woff2'))
    pub = {k: brand[k] for k in ('name', 'colors', 'neutrals') if k in brand}
    reel = json.dumps({'beats': [round(x, 5) for x in scene['local_beats']], 'T': scene['T'], 'fps': fps, 'brand': pub})
    html = (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><style>{base}{brand_css(brand, bdir)}{css}</style></head><body>\n'
            f'<div id="wrap"><div id="stage"><div id="world">{slot("world")}<div id="shape">{slot("shape")}</div>{slot("over")}</div>{slot("screen")}{CURSOR}</div></div>\n'
            f'<script>window.REEL={reel};</script><script>{open(E / "motion.js").read()}</script><script>{open(E / "reel.js").read()}</script><script>{js}</script></body></html>')
    open(dst, 'w', encoding='utf-8').write(html)


if __name__ == '__main__':
    reel_p = pathlib.Path(sys.argv[1]); base = reel_p.parent; reel = json.load(open(reel_p))
    out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True); only = set(sys.argv[3:])
    brand, bdir = DEFAULT_BRAND, E
    if reel.get('brand'):
        bp = base / reel['brand']; brand = json.load(open(bp)); bdir = bp.parent
    tl = timeline(reel, base)
    for s in tl['scenes']:
        name = pathlib.Path(s['file']).stem; s['html'] = str((out / f'{name}.html').resolve())
        if only and s['id'] not in only: continue
        build(base / s['file'], out / f'{name}.html', s, brand, bdir, tl['fps'])
        print(f"built {name}.html  {s['beats']} beats  {s['T']:.3f}s  ({s['in']:.3f} → {s['out']:.3f})")
    json.dump(tl, open(out / 'timeline.json', 'w'), indent=1)
    print(f"reel {tl['duration']:.3f}s at {tl['fps']} fps · music starts at {tl['music_start']:.3f}s · wrote {out / 'timeline.json'}")
