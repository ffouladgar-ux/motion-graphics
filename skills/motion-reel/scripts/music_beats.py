"""Find the tempo, beats and downbeats of a music track, so scene cuts and accents land on the beat.
usage: python3 music_beats.py inputs/track.mp3 motion/work/beats.json [--bpm 120] [--min 70 --max 180]

Writes {"bpm", "offset", "beats":[s...], "downbeats":[s...], "duration", "confidence"}.
--bpm skips tempo detection when the user knows it (from the track's metadata or their DAW).
Method: spectral-flux onset envelope -> tempo from its autocorrelation -> beat phase that collects the most
onset energy -> each beat nudged to the strongest onset within ±40 ms. Downbeat = the phase (of 4) with the
most low-frequency energy. Good on music with a steady pulse; check it by ear in review.html."""
import argparse, json, subprocess, sys
import numpy as np

SR, HOP, N = 22050, 256, 1024

ap = argparse.ArgumentParser()
ap.add_argument('audio'); ap.add_argument('out')
ap.add_argument('--bpm', type=float); ap.add_argument('--min', type=float, default=70); ap.add_argument('--max', type=float, default=180)
ap.add_argument('--meter', type=int, default=4)
a = ap.parse_args()

raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', a.audio, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).astype(np.float64)
if len(x) < SR * 2: sys.exit('track is shorter than 2 seconds')
dur = len(x) / SR

# onset envelope: positive spectral flux on a log-magnitude spectrogram
nf = 1 + (len(x) - N) // HOP
idx = np.arange(N)[None, :] + HOP * np.arange(nf)[:, None]
spec = np.abs(np.fft.rfft(x[idx] * np.hanning(N), axis=1))
logS = np.log1p(100 * spec)
flux = np.maximum(0, np.diff(logS, axis=0))
env = np.concatenate([[0], flux.sum(1)])
low = np.concatenate([[0], flux[:, :int(200 * N / SR)].sum(1)])  # < 200 Hz: kick drum, for downbeats
env -= np.convolve(env, np.ones(16) / 16, 'same'); env = np.maximum(env, 0)  # remove slow trend
env /= env.max() or 1
fr = SR / HOP  # envelope frames per second
T0 = N / 2 / SR  # envelope frame j is centred at j/fr + T0 seconds

# tempo: autocorrelation of the envelope, weighted toward ~120 bpm, with a 2x/0.5x harmonic check
if a.bpm:
    bpm = a.bpm; conf = 1.0
else:
    ac = np.correlate(env, env, 'full')[len(env) - 1:]
    lags = np.arange(int(fr * 60 / a.max), int(fr * 60 / a.min) + 1)
    bpms = 60 * fr / lags
    score = ac[lags] * np.exp(-0.5 * (np.log2(bpms / 120) / 0.9) ** 2)
    L = lags[np.argmax(score)]
    # parabolic refinement for sub-frame lag
    y0, y1, y2 = ac[L - 1], ac[L], ac[L + 1]; d = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 or 1)
    bpm = 60 * fr / (L + d)
    conf = float(score.max() / (ac[0] or 1))
period = 60 / bpm

# phase: try offsets across one period, keep the one whose grid collects the most onset energy
def at(t): i = int(round((t - T0) * fr)); return env[i] if 0 <= i < len(env) else 0
def grid_score(off, per): return sum(at(t) for t in np.arange(off, dur, per))
offs = np.linspace(0, period, 200, endpoint=False)
off = offs[np.argmax([grid_score(o, period) for o in offs])]

# beats: grid, each nudged to the strongest onset within ±40 ms (keeps the grid steady, follows small drift)
def nudge(off, per):
    out, w = [], int(0.04 * fr)
    for t in np.arange(off, dur, per):
        i = int(round((t - T0) * fr)); lo, hi = max(0, i - w), min(len(env), i + w + 1)
        if hi <= lo: continue
        j = lo + int(np.argmax(env[lo:hi]))
        out.append((float(j / fr + T0), True) if env[j] > 0.15 else (float(t), False))
    return out
nb = nudge(off, period)
# refine tempo and phase with a straight-line fit through the beats that found an onset, then nudge again
k = np.array([i for i, (_, hit) in enumerate(nb) if hit]); tb = np.array([t for t, hit in nb if hit])
if len(k) >= 8 and not a.bpm:
    period, off = np.polyfit(k, tb, 1); bpm = 60 / period
    off = off % period
elif len(k) >= 2:
    off = float(np.median(tb - k * period)) % period
beats = sorted(set(round(t, 4) for t, _ in nudge(off, period)))

# downbeats: the phase (of `meter`) with the most low-frequency onset energy
lowsum = [sum(low[min(len(low) - 1, max(0, int(round((b - T0) * fr))))] for b in beats[p::a.meter]) for p in range(a.meter)]
p0 = int(np.argmax(lowsum))
down = beats[p0::a.meter]

json.dump({'bpm': round(bpm, 3), 'offset': round(beats[0] if beats else off, 4), 'meter': a.meter, 'beats': beats,
           'downbeats': down, 'first_downbeat_index': p0, 'duration': round(dur, 3), 'confidence': round(conf, 3)},
          open(a.out, 'w'), indent=1)
print(f'{bpm:.2f} bpm · {len(beats)} beats · first downbeat at {down[0] if down else 0:.3f}s (beat {p0}) · track {dur:.1f}s · wrote {a.out}')
if conf < 0.15 and not a.bpm: print('Low confidence: the pulse is weak. Ask the user for the bpm, then rerun with --bpm.')
