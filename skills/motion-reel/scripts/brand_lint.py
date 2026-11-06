"""Check scene fragments against the brand lock and the house rules before rendering.
usage: python3 brand_lint.py motion/brand.json motion/clips/*.html

Errors (exit 1): a colour that isn't in brand.json, a gradient, a glow, a font that isn't the brand's.
Warnings: every number shown on screen, so you can confirm each one came from the user."""
import json, re, sys, pathlib
brand = json.load(open(sys.argv[1]))
norm = lambda h: ('#' + ''.join(c * 2 for c in h[1:])).upper() if len(h) == 4 else h.upper()
allowed = {norm(h) for h in list(brand['colors'].values()) + brand.get('neutrals', [])}
fams = {brand['fonts'][r]['family'] for r in ('display', 'body')} | {'Geist Mono'}
errs = warns = 0
for f in sys.argv[2:]:
    src = open(f, encoding='utf-8').read(); name = pathlib.Path(f).name
    line = lambda i: src.count('\n', 0, i) + 1
    out = []
    for m in re.finditer(r'#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b', src):
        if norm(m.group()) not in allowed and not src[max(0, m.start() - 4):m.start()].endswith('id='):
            out.append(('E', line(m.start()), f'off-brand colour {m.group()} (use var(--canvas|--ink|--accent|--nN) or R.C.*)'))
    for m in re.finditer(r'rgba?\(\s*\d', src):
        out.append(('W', line(m.start()), 'literal rgb()/rgba(): fine for shadows and tints of brand colours, otherwise use a brand token'))
    for m in re.finditer(r'(linear|radial|conic)-gradient', src):
        out.append(('E', line(m.start()), f'{m.group()}: no gradients'))
    for m in re.finditer(r'text-shadow|drop-shadow\([^)]*(?:#|rgb)[^)]*\)|box-shadow:[^;"]*\b(?:[4-9]\d|\d{3})px\s+(?:\d+px\s+)?(?:#|rgb)', src):
        out.append(('E', line(m.start()), f'glow-like shadow `{m.group()[:40]}`: no glows'))
    for m in re.finditer(r"font-family:\s*([^;\"}]+)", src):
        v = m.group(1)
        if 'var(--' in v: continue
        fam = v.split(',')[0].strip().strip('\'"')
        if fam not in fams: out.append(('E', line(m.start()), f'font "{fam}" is not in the brand (use .display, var(--display) or var(--body))'))
    text = re.sub(r'<script>.*?</script>|<style>.*?</style>|<[^>]+>', ' ', src, flags=re.S)
    js = ''.join(re.findall(r'<script>(.*?)</script>', src, re.S))
    strs = ' '.join(a or b for a, b in re.findall(r"'([^'\n]*)'|\"([^\"\n]*)\"", js))  # JS string literals: on-screen copy lives here too
    strs = re.sub(r'#[0-9A-Fa-f]{3,6}|[\w-]+\(.*?\)|\b\d+(\.\d+)?px\b', ' ', strs)
    nums = sorted(set(re.findall(r'(?<![\w#.-])[$€£]?\d[\d,.]*(?:%|x|k|K|M|h|s|ms)?(?![\w-])', text + ' ' + strs)))
    nums = [n for n in nums if not re.fullmatch(r'0?\.?\d{1,2}', n) or '%' in n]
    if nums: out.append(('W', 0, 'numbers on screen: ' + ', '.join(nums) + ' (each must come from the user; otherwise use bars or skeleton lines)'))
    for k, ln, msg in out:
        print(f"{'ERROR' if k == 'E' else 'warn '} {name}{':' + str(ln) if ln else ''}  {msg}")
        errs += k == 'E'; warns += k == 'W'
print(f'{len(sys.argv) - 2} scenes · {errs} errors · {warns} warnings')
sys.exit(1 if errs else 0)
