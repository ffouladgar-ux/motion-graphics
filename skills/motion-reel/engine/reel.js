/* motion-reel helpers on top of motion.js. Pure functions of time, like the engine.
   build.py injects window.REEL = {beats:[scene-local beat times], T, fps, brand:{...}} before this file runs. */
(function(){
const M = window.M, RE = window.REEL || {beats:[0], T:4, brand:{colors:{}}};
const R = window.R = {};
const B = RE.beats;
R.T = RE.T; R.beats = B; R.brand = RE.brand;

// brand colours as hex, for JS (icons, M.ctrack). In CSS use var(--canvas) / var(--ink) / var(--accent) / var(--n0..)
R.C = Object.assign({}, RE.brand.colors);
(RE.brand.neutrals || []).forEach((h, i) => R.C['n' + i] = h);

// time of beat n from the start of this scene. Fractions interpolate (R.b(2.5) = the off-beat after beat 2).
// Beats past the last one known extrapolate at the last interval.
R.b = n => {
  if (B.length < 2) return n * 0.5;
  const i = Math.floor(n), f = n - i, last = B.length - 1;
  const at = k => k <= last ? B[k] : B[last] + (k - last) * (B[last] - B[last - 1]);
  return f === 0 ? at(i) : at(i) + f * (at(i + 1) - at(i));
};
R.bs = (...ns) => ns.map(R.b);

// beat accent: a short kick on each time in `times` (fast attack, ~0.15s decay). Use it for scale or position nudges.
R.kick = (t, times, decay = 0.15) => {
  let v = 0;
  for (const s of times) { const d = t - s; if (d >= 0 && d < decay * 6) v += (1 - Math.exp(-d / 0.018)) * Math.exp(-d / decay); }
  return Math.min(v, 1.5);
};

// kinetic type: put words into `el` once, reveal each at its time (rise + de-blur), optionally hide all at tout.
// times: one time per word (use R.b). Returns update(t). Words are spans with class "w"; style them in the clip CSS.
R.words = (el, text, times, o = {}) => {
  const ws = text.split(' ');
  // spacing is a margin, not a space character: flex rows (.row) drop whitespace between spans
  el.innerHTML = ws.map((w, i) => `<span class="w" style="display:inline-block;white-space:pre${i < ws.length - 1 ? ';margin-right:' + (o.gap ?? '0.26em') : ''}">${w}</span>`).join('');
  const spans = [...el.querySelectorAll('.w')], rise = o.rise ?? 0.32, lin = o.lin ?? 0.22;
  return t => spans.forEach((s, i) => {
    const v = M.vis(t, times[Math.min(i, times.length - 1)], o.tout ?? null, {din: 0, lin, lout: 0.12, blur: 10});
    s.style.opacity = v.o.toFixed(4);
    s.style.filter = v.blur > 0.05 ? `blur(${v.blur.toFixed(2)}px)` : 'none';
    s.style.transform = `translateY(${((1 - M.S(t - times[Math.min(i, times.length - 1)], 16, 0.82)) * rise).toFixed(4)}em)`;
  });
};

// step through a list of strings on the given times: R.swap(t, ['Email','Chat'], [R.b(0), R.b(1)])
R.swap = (t, list, times) => { let k = 0; for (let i = 0; i < times.length; i++) if (t >= times[i]) k = i; return list[k]; };

// count a REAL number from `from` to `to` (only figures the user gave you). Eased, rounded to `dp` places.
R.count = (t, t0, dur, from, to, dp = 0) => (from + (to - from) * M.eio((t - t0) / dur)).toFixed(dp);

// text width in the stage's fonts, for sizing a pill to its label. Cached only once the fonts have loaded.
const cv = document.createElement('canvas').getContext('2d'), wc = {};
R.textW = (s, font) => {
  const k = font + '|' + s; if (wc[k] != null) return wc[k];
  cv.font = font; const w = cv.measureText(s).width;
  if (document.fonts.status === 'loaded') wc[k] = w;
  return w;
};

// extra icons (24-grid stroke paths adapted from Lucide, ISC licence), same stroke normalisation as M.icon
Object.assign(M.IC, {
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  chat: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  hash: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  zap: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'],
  send: ['M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z', 'm21.854 2.147-10.94 10.939'],
  bars: ['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
});
})();
