"""Teaser soundtrack: synthesized hits/pops on every slap + a light 120 BPM beat. Mux onto the video.
usage: python3 mix.py <video.mp4> <out.mp4> [--no-beat]"""
import sys, subprocess, pathlib, numpy as np
from sfx import SR, rng, whoosh, pop, tick, thud, hit, chime, lp, env
VID, OUT = sys.argv[1:3]; BEAT='--no-beat' not in sys.argv
T=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',VID])); N=int(T*SR)
S=[0,4.5,8,12,21.5,27.5,31.5]   # scene starts (hard cuts)
EV=[]; at=lambda s,t,x: EV.append((S[s]+t,x)); sw=lambda g=0.4: whoosh(0.3,g,4500)
# 1 hook
at(0,0.2,pop(0.9,700)); [at(0,t,thud(0.7)) for t in (0.6,1.1,2.0)]; at(0,2.45,sw(0.5)); at(0,2.55,hit(1.0))
# 2 question
at(1,0.0,hit(0.6)); at(1,0.1,whoosh(0.35,0.6,7000)); at(1,0.45,thud(0.7)); at(1,1.1,hit(1.0))
# 3 bienvenue
at(2,0.0,hit(1.1)); at(2,0.02,whoosh(0.6,0.8)); at(2,1.6,pop(0.9,560))
# 4 three days
at(3,0.15,thud(0.6)); at(3,0.5,pop(0.8,620)); [at(3,t,hit(0.85)) for t in (1.0,2.5,4.0)]; at(3,6.0,pop(0.9,700)); at(3,6.3,sw(0.35))
# 5 missions
at(4,0.15,tick(0.6)); at(4,0.4,thud(0.7)); at(4,1.0,pop(0.9,600)); [at(4,t,pop(0.8,f)) for t,f in ((1.8,500),(2.3,620),(2.8,760))]; at(4,3.6,sw(0.35))
# 6 rule
at(5,0.2,hit(0.9)); at(5,1.2,hit(1.1)); at(5,1.22,whoosh(0.3,0.5,6000))
# 7 end
at(6,0.15,hit(1.1)); at(6,0.2,chime(0.9,880)); at(6,0.9,sw(0.35)); at(6,1.6,tick(0.7,2000)); at(6,1.85,tick(0.7,2400)); at(6,2.7,pop(1.0,700)); at(6,2.75,chime(0.6,1320))
fx=np.zeros(N+SR,np.float32)
for t0,x in EV: i=int(t0*SR); fx[i:i+len(x)]+=x[:len(fx)-i]
mix=fx
if BEAT:
    bt=np.zeros_like(fx); kick=thud(1.0,52); n=int(0.03*SR); h=rng.standard_normal(n); hat=(h-lp(h,7000))*env(n,0.0005,0.008)*0.35
    for k in range(int(T*2)):
        t=k*0.5
        if t>=T-1.0: break
        i=int(t*SR); bt[i:i+len(kick)]+=kick[:len(bt)-i]*(0.55 if k%2 else 0.8)
        j=int((t+0.25)*SR); bt[j:j+len(hat)]+=hat[:len(bt)-j]
    fade=np.clip((T-np.arange(len(bt))/SR-1.0)/1.5,0,1); mix=fx+0.32*bt*fade
mix=mix[:N]; mix/=max(1.0,np.abs(mix).max()/0.95)
tmp=pathlib.Path(OUT).with_suffix('.raw'); mix.astype(np.float32).tofile(tmp)
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',VID,'-f','f32le','-ar',str(SR),'-ac','1','-i',str(tmp),'-filter_complex','[1:a]loudnorm=I=-16:TP=-2.5:LRA=11,aresample=48000,pan=stereo|c0=c0|c1=c0[a]',
  '-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',OUT],check=True)
tmp.unlink(); print('wrote',OUT,len(EV),'effects','beat' if BEAT else 'no beat')
