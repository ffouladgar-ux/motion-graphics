"""Synthesized sound generators (no samples)."""
import numpy as np
SR=48000; rng=np.random.default_rng(7)
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
