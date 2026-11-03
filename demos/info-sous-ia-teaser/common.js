const $=id=>document.getElementById(id);
const BL='#0453E1',YE='#E9FF00',INK='#0B0B0B',PA='#F8F6F2';
['400 20px Bebas','400 20px Anton','400 20px Inter','700 20px Inter','800 20px Inter','600 20px Inter'].forEach(f=>document.fonts.load(f));
document.getElementById('world').insertAdjacentHTML('afterbegin','<div id="fontwarm"><span class="B">Aa</span><span class="AN">Aa</span><span class="I4">Aa</span><span class="I7">Aa</span><span class="stk">Aa</span></div>');
// slap: lands from big + slightly rotated, springs to rest. rot = resting rotation (deg)
const slap=(el,t,tin,rot=0,tout=null,from=1.35)=>{
  if(t<tin){el.style.visibility='hidden';return;}
  const k=M.S(t-tin,22,0.62), b=tout==null?0:M.eo((t-tout)/0.18);
  if(b>=1){el.style.visibility='hidden';return;} el.style.visibility='';
  const s=from+(1-from)*k; el.style.opacity=(M.clamp((t-tin)/0.06)*(1-b)).toFixed(3);
  el.style.transform=`rotate(${(rot+(1-k)*-6).toFixed(2)}deg) scale(${(s*(1-0.06*b)).toFixed(4)})`;};
// rise: slide up + fade in
const rise=(el,t,tin,tout=null,d=0.35,dy=50,rot=0)=>{const a=M.eo((t-tin)/d), b=tout==null?0:M.eo((t-tout)/0.2);
  if(a<=0||b>=1){el.style.visibility='hidden';return;} el.style.visibility='';
  el.style.opacity=(Math.min(1,a*1.5)*(1-b)).toFixed(3); el.style.transform=`translateY(${((1-a)*dy-b*20).toFixed(2)}px) rotate(${rot}deg)`;};
// wipe left to right
const wipe=(el,t,tin,tout=null,d=0.3,rot=0)=>{const a=M.eio((t-tin)/d), b=tout==null?0:M.eo((t-tout)/0.2);
  if(a<=0||b>=1){el.style.visibility='hidden';return;} el.style.visibility=''; el.style.opacity=(1-b).toFixed(3);
  el.style.clipPath=`inset(-20px ${((1-a)*100).toFixed(2)}% -20px -20px)`; el.style.transform=`rotate(${rot}deg)`;};
// torn paper edge as clip-path polygon (deterministic jitter)
const torn=(el,w,h,amp=7,step=22,seed=1)=>{let s=seed;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const p=[];
  for(let x=0;x<=w;x+=step)p.push([x,r()*amp]); for(let y=0;y<=h;y+=step)p.push([w-r()*amp,y]);
  for(let x=w;x>=0;x-=step)p.push([x,h-r()*amp]); for(let y=h;y>=0;y-=step)p.push([r()*amp,y]);
  el.style.clipPath='polygon('+p.map(([x,y])=>`${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')+')';};
// invisible engine shape (scenes are collages in the world layer)
const NOSHAPE={W:1920,H:1080,intro:null,SH:{n:{w:2,h:2,r:0,bg:'#000000',cam:1}},start:'n',SEQ:[],geom:(t,g)=>{g.op=0;return g;}};
// brand logo lockup: L'INFO / SOUS + IA on tilted yellow block + yellow underline
const LOGO=(id,x,y,scale=1,dark=false)=>{const c=dark?INK:'#FFFFFF';document.getElementById('world').insertAdjacentHTML('beforeend',`
 <div class="a" id="${id}" style="left:${x}px;top:${y}px;width:560px;height:330px;transform-origin:50% 50%">
  <div style="position:absolute;left:0;top:0;width:560px;height:330px;transform:scale(${scale}) rotate(-7deg);transform-origin:0 0">
   <div class="AN" style="position:absolute;left:0;top:0;font-size:150px;line-height:150px;color:${c}">L'info</div>
   <div class="AN" style="position:absolute;left:0;top:140px;font-size:150px;line-height:150px;color:${c}">Sous</div>
   <div style="position:absolute;left:40px;top:296px;width:230px;height:22px;background:${YE}"></div>
   <div style="position:absolute;left:318px;top:150px;width:200px;height:160px;background:${YE};transform:rotate(4deg)"></div>
   <div class="AN" style="position:absolute;left:334px;top:140px;font-size:156px;line-height:156px;color:${BL}">IA</div>
  </div></div>`);};
