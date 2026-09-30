// NODE_PATH=motion/node_modules node render.js dist/clip.html out/clip.(mp4|mov) [fps, e.g. 30000/1001 | 25 | 60] [--subframes=N]
// N subframes per frame spread across a ~180° shutter, blended with ffmpeg tmix. --subframes=1 renders one
// screenshot per frame and skips the blend (crisp, no smear). Alpha clips -> ProRes 4444 .mov
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
(async()=>{
 const argv=process.argv.slice(2);
 const subArg=argv.find(a=>a.startsWith('--subframes='));
 const [html,out,fpsArg]=argv.filter(a=>!a.startsWith('--'));
 const K=Math.max(1,Math.min(16,subArg?+subArg.split('=')[1]:4));
 const FPS=!fpsArg?30000/1001:(fpsArg.includes('/')?fpsArg.split('/')[0]/fpsArg.split('/')[1]:+fpsArg);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(html)+'?render');await p.evaluate(()=>document.fonts.ready);
 const info=await p.evaluate(()=>({T:window.DURATION,W:document.getElementById('stage').offsetWidth,H:document.getElementById('stage').offsetHeight,alpha:document.documentElement.classList.contains('alpha')}));
 await p.setViewportSize({width:info.W,height:info.H});
 const N=Math.round(info.T*FPS), sub=1/(FPS*2*K);
 // exact framerates: keep the rational when one was given, so 24000/1001 stays exact
 const rat=n=>!fpsArg?`${30000*n}/1001`:(fpsArg.includes('/')?`${fpsArg.split('/')[0]*n}/${fpsArg.split('/')[1]}`:String(+fpsArg*n));
 const fr=[rat(1),rat(K)];
 const vf=`format=gbrap,${K>1?`tmix=frames=${K}:weights='${Array(K).fill(1).join(' ')}',select='eq(mod(n\\,${K})\\,${K-1})',`:''}setpts=N/(${fr[0]})/TB`;
 const enc=info.alpha?['-c:v','prores_ks','-profile:v','4','-pix_fmt','yuva444p10le','-vendor','apl0']:['-c:v','libx264','-crf','14','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart'];
 const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',fr[1],'-c:v','png','-i','-','-vf',vf,'-r',fr[0],...enc,out]);
 ff.stderr.on('data',d=>process.stderr.write(d));
 for(let f=0;f<N;f++){for(let k=0;k<K;k++){const t=Math.max(0,f/FPS+(k-(K-1)/2)*sub);await p.evaluate(t=>seek(t),t);
   const buf=await p.screenshot({type:'png',omitBackground:info.alpha});
   if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));}}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();
 console.log('rendered',out,N,'frames',K,'subframes',errs.length?'ERR '+errs[0]:'');
})();
