"""Build the soundtrack: French voiceover (Piper, local) + synthesized sound effects, then mux onto the video.
usage: python3 mix.py <voice_dir with vo_N.wav> <video.mp4> <out.mp4>"""
import sys, subprocess, numpy as np, pathlib
from lines import LINES
SR=48000; rng=np.random.default_rng(7)
VO, VID, OUT = sys.argv[1:4]
T=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',VID]))
N=int(T*SR)+SR
def load(fn):  # any wav -> mono float32 at SR, light voice EQ
    raw=subprocess.check_output(['ffmpeg','-loglevel','error','-i',fn,'-af','highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=80','-ac','1','-ar',str(SR),'-f','f32le','-'])
    return np.frombuffer(raw,np.float32)
def env(n,a,r):  # attack/exp-decay envelope
    t=np.arange(n)/SR; return np.minimum(1,t/max(a,1e-4))*np.exp(-t/r)
def lp(x,cut):  # one-pole lowpass, cut can be array
    cut=np.broadcast_to(cut,x.shape); a=np.exp(-2*np.pi*cut/SR); y=np.empty_like(x); s=0.0
    for i in range(len(x)): s=(1-a[i])*x[i]+a[i]*s; y[i]=s
    return y
def whoosh(d=0.5,g=1.0,hi=6000):
    n=int(d*SR); t=np.linspace(0,1,n); e=np.sin(np.pi*t**0.7)**2
    x=rng.standard_normal(n); cut=300+hi*np.sin(np.pi*t)**1.5
    y=lp(x,cut)-lp(lp(x,cut),200); return g*0.5*y*e/ (np.abs(y).max()+1e-9)
def pop(g=1.0,f0=520):
    n=int(0.12*SR); t=np.arange(n)/SR; f=f0*np.exp(-t*18)+f0*0.45
    return g*0.6*np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,0.002,0.03)
def tick(g=1.0,f=2400):
    n=int(0.05*SR); t=np.arange(n)/SR
    return g*0.35*(np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*f*2.01*t))*env(n,0.001,0.012)
def key(g=1.0):
    n=int(0.02*SR); x=rng.standard_normal(n); y=x-lp(x,1500)
    return g*0.22*y*env(n,0.0005,0.004)*rng.uniform(0.6,1.0)
def thud(g=1.0,f=85):
    n=int(0.35*SR); t=np.arange(n)/SR; b=np.sin(2*np.pi*(f*t+12*(1-np.exp(-t*30))/30))
    x=rng.standard_normal(n); return g*(0.8*b*env(n,0.003,0.09)+0.15*lp(x,900)*env(n,0.001,0.02))
def hit(g=1.0):
    n=int(0.5*SR); x=rng.standard_normal(n)
    return g*(thud(1,70)[:n] if False else 0)+g*(0.9*np.pad(thud(1,70),(0,max(0,n-int(0.35*SR))))[:n]+0.25*(x-lp(x,2500))*env(n,0.001,0.03))
def chime(g=1.0,base=880):
    n=int(1.6*SR); t=np.arange(n)/SR; y=np.zeros(n)
    for k,(m,dl) in enumerate([(1,0),(1.25,0.07),(1.5,0.14),(2,0.21)]):
        s=int(dl*SR); tt=t[:n-s]; y[s:]+=np.sin(2*np.pi*base*m*tt)*np.exp(-tt/0.45)*np.minimum(1,tt/0.004)*(0.9-0.12*k)
    return g*0.22*y
S=[0,6.1,11.7,19.3,26.9,36.0,42.1,50.2]
EV=[]
def at(s,t,snd): EV.append((S[s]+t,snd))
sw=lambda g=0.35: whoosh(0.35,g,3500)
# 1 opening
at(0,0.15,pop(0.9)); at(0,1.42,whoosh(0.7,1.0)); at(0,2.65,sw())
# 2 hook
for w in [0.25,0.55,0.85,1.15]: at(1,w,thud(0.55))
at(1,1.7,pop(0.7)); at(1,2.42,whoosh(0.5,0.8))
# 3 prompt flou
at(2,0.1,sw()); at(2,0.9,pop(0.8))
t=1.3
while t<3.0: at(2,t,key()); t+=rng.uniform(0.045,0.085)
at(2,5.22,whoosh(0.5,0.8)); at(2,5.8,tick(0.5,1800)); at(2,6.3,tick(0.5,1800))
# 4 non-dits
at(3,0.1,sw()); at(3,0.8,pop(0.8))
for i in range(6): at(3,1.9+0.42*i,tick(0.9,2200+90*i))
at(3,5.42,whoosh(0.5,0.8))
# 5 contexte
at(4,0.1,sw())
for i in range(7): at(4,0.9+0.35*i,tick(0.45,1500+60*i))
at(4,5.25,whoosh(0.55,0.9)); at(4,6.8,pop(0.8))
# 6 duel
at(5,0.1,sw()); at(5,0.8,pop(0.8,440)); at(5,1.1,pop(0.8,600)); at(5,1.72,hit(0.9)); at(5,2.6,sw(0.25))
# 7 bravo
at(6,0.1,sw()); at(6,0.3,thud(0.7)); at(6,0.35,chime(1.0,880)); at(6,2.5,pop(0.8))
for i in range(3): at(6,3.1+0.4*i,tick(0.8,2000+200*i))
at(6,5.0,pop(0.7))
# 8 end
at(7,0.3,thud(0.6)); at(7,1.0,hit(0.9)); at(7,3.12,whoosh(0.5,0.8)); at(7,3.4,thud(0.8,70)); at(7,4.2,sw()); at(7,4.6,chime(0.7,660))
fx=np.zeros(N,np.float32)
for t0,snd in EV:
    i=int(t0*SR); fx[i:i+len(snd)]+=snd[:N-i]
vo=np.zeros(N,np.float32); act=np.zeros(N,np.float32)
for i,(t0,_,_) in enumerate(LINES):
    v=load(f'{VO}/vo_{i}.wav'); a=int(t0*SR); vo[a:a+len(v)]+=v; act[a:a+len(v)]=1
vo/=np.abs(vo).max()+1e-9
# duck effects under the voice (smoothed)
k=int(0.15*SR); duck=np.convolve(act,np.ones(k)/k,'same'); fxg=0.95*(1-0.5*duck)
mix=0.9*vo+fxg*fx
mix=mix[:int(T*SR)]; mix/=max(1.0,np.abs(mix).max()/0.95)
tmp=pathlib.Path(OUT).with_suffix('.raw'); mix.astype(np.float32).tofile(tmp)
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',VID,'-f','f32le','-ar',str(SR),'-ac','1','-i',str(tmp),
  '-filter_complex','[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,pan=stereo|c0=c0|c1=c0[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',OUT],check=True)
tmp.unlink(); print('wrote',OUT,len(EV),'effects')
