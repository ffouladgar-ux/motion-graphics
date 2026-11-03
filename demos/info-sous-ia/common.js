const $=id=>document.getElementById(id);
const BL='#0057FF',YE='#E9FF00',INK='#0B0B0B',PA='#F7F7F5',PB='#E7EBFF',GR='#6B6B6B';
document.fonts.load('700 20px ISI'); document.fonts.load('400 20px ISI');
document.getElementById('world').insertAdjacentHTML('afterbegin','<div id="fontwarm"><b>Aa</b><span class="R">Aa</span></div>');
// rise: slide up + fade in at tin, fade up and out at tout
const rise=(el,t,tin,tout=null,d=0.45,dy=40)=>{const a=M.eo((t-tin)/d), b=tout==null?0:M.eo((t-tout)/0.25);
  if(a<=0||b>=1){el.style.visibility='hidden';return;} el.style.visibility='';
  el.style.opacity=(Math.min(1,a*1.4)*(1-b)).toFixed(3); el.style.transform=`translateY(${((1-a)*dy-b*16).toFixed(2)}px)`;};
// wipe: reveal left to right
const wipe=(el,t,tin,tout=null,d=0.4)=>{const a=M.eio((t-tin)/d), b=tout==null?0:M.eo((t-tout)/0.25);
  if(a<=0||b>=1){el.style.visibility='hidden';return;} el.style.visibility=''; el.style.opacity=(1-b).toFixed(3);
  el.style.clipPath=`inset(0 ${((1-a)*100).toFixed(2)}% 0 0)`;};
const typed=(el,s,t,a,b)=>M.setText(el,s.slice(0,Math.round(M.clamp((t-a)/(b-a))*s.length)));
// workbook page header: tag, title, subtitle, blue rule, yellow dots, big blue number
const HDR=(p,tag,title,sub,num)=>{document.getElementById('world').insertAdjacentHTML('beforeend',`
  <div class="tag" id="${p}tag" style="left:-800px;top:-440px">${tag}</div>
  <div class="a U" id="${p}tt" style="left:-800px;top:-366px;font-size:76px;line-height:84px">${title}</div>
  <div class="a R" id="${p}sb" style="left:-800px;top:-272px;font-size:28px;color:${GR};white-space:nowrap">${sub}</div>
  <div class="a" id="${p}rl" style="left:-800px;top:-220px;height:4px;background:${BL}"></div>
  <div id="${p}dt">${[0,1,2,3].map(i=>`<div class="dot" style="left:${560+i*28}px;top:-224px"></div>`).join('')}</div>
  <div class="a" id="${p}nm" style="left:520px;top:-470px;width:280px;text-align:right;font-size:190px;line-height:220px;color:${BL}">${num}</div>`);};
const HDRA=(p,t,tin,tout=null)=>{wipe($(p+'tag'),t,tin,tout); rise($(p+'tt'),t,tin+0.12,tout); rise($(p+'sb'),t,tin+0.3,tout,0.4,20);
  rise($(p+'nm'),t,tin+0.2,tout,0.55,70); const r=$(p+'rl'); r.style.width=(1320*M.eio((t-tin-0.25)/0.6))+'px'; r.style.opacity=tout==null?1:1-M.eo((t-tout)/0.25);
  [...$(p+'dt').children].forEach((d,i)=>{const k=M.clamp((t-tin-0.7-0.08*i)/0.15)*(tout==null?1:1-M.eo((t-tout)/0.25)); d.style.opacity=k; d.style.transform=`scale(${k})`;});};
