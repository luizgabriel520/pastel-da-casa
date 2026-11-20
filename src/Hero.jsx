import {useEffect,useRef,useState} from 'react';
import {mkGL} from './mkgl.js';
import {useInView} from './hooks.js';
import bgS from '../img/bg.jpg';import fgS from '../img/fg.webp';
const G=[[50,34,0],[69,46,1.4],[34,58,2.6],[82,66,.8],[58,80,3.4],[24,50,2]];
export default function Hero(){
  const[ref,on]=useInView(),st=useRef(),cv=useRef(),[ready,setReady]=useState(false);
  useEffect(()=>{
    const bg=ref.current.querySelector('.bgl');let dead=false,raf=0,t0=0,io,ro,clean=[];
    const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const start=()=>{
      if(dead)return;setReady(true);if(RM)return;t0=performance.now();
      const touch=matchMedia('(pointer:coarse)').matches,lowP=touch||innerWidth<760||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
      const c=cv.current,g=mkGL(c);let res=lowP?.42:.55;
      const size=()=>{c.width=Math.max(2,c.offsetWidth*res|0);c.height=Math.max(2,c.offsetHeight*res|0);g&&g.rs(c.width,c.height)};
      if(!g)c.style.display='none';
      let px=0,py=0,gx=0,gy=0,cx=0,cy=0,sx=-9,sy=-9,vis=true,ema=.016,cool=0,f=0,last=t0;
      const fr=now=>{raf=requestAnimationFrame(fr);const dt=Math.min(.05,(now-last)/1000||.016);last=now;if(!vis||document.hidden)return;
        ema+=(dt-ema)*.05;cool-=dt;if(g&&ema>.034&&cool<=0&&res>.28){res*=.8;cool=2.5;size()}
        const t=(now-t0)/1000,k=Math.min(1,t/3.4),kk=k*k*(3-2*k);
        const tx=(px||gx)+Math.sin(t*.35)*(lowP?.5:.3),ty=(py||gy)+Math.cos(t*.27)*(lowP?.35:.22);
        cx+=(tx-cx)*Math.min(1,dt*4);cy+=(ty-cy)*Math.min(1,dt*4);
        if(Math.abs(cx-sx)+Math.abs(cy-sy)>.001){sx=cx;sy=cy;st.current.style.setProperty('--nx',cx.toFixed(3));st.current.style.setProperty('--ny',cy.toFixed(3))}
        if(g&&!(lowP&&(f++&1)))g.draw(t,kk)};
      io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(c);ro=new ResizeObserver(size);ro.observe(c);size();raf=requestAnimationFrame(fr);
      const mv=e=>{if(e.pointerType!=='mouse')return;px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2};
      const lv=()=>{px=py=0};addEventListener('pointermove',mv,{passive:true});document.addEventListener('mouseleave',lv);
      clean.push(()=>{removeEventListener('pointermove',mv);document.removeEventListener('mouseleave',lv)});
      if(touch&&'DeviceOrientationEvent' in window){let b0=null;const go=e=>{if(e.gamma==null||e.beta==null)return;if(b0==null)b0=e.beta;gx=Math.max(-1,Math.min(1,e.gamma/22));gy=Math.max(-1,Math.min(1,(e.beta-b0)/22))};
        const D=DeviceOrientationEvent,el=ref.current;
        if(typeof D.requestPermission==='function'){const ask=()=>D.requestPermission().then(s=>s==='granted'&&addEventListener('deviceorientation',go)).catch(()=>{});el.addEventListener('click',ask,{once:true});clean.push(()=>el.removeEventListener('click',ask))}
        else addEventListener('deviceorientation',go);clean.push(()=>removeEventListener('deviceorientation',go))}
    };
    (bg.decode?bg.decode():Promise.resolve()).catch(()=>{}).then(()=>setTimeout(start,150));
    return()=>{dead=true;cancelAnimationFrame(raf);io&&io.disconnect();ro&&ro.disconnect();clean.forEach(f=>f())};
  },[]);
  return(
    <div ref={ref} className={`shot rv${on?' in':''} ${ready?'ready':'pre'}`} style={{'--d':'.2s'}}>
      <div ref={st} className="stage">
        <img className="ly bgl" src={bgS} width="1088" height="940" alt="Pastéis fritos crocantes, um deles aberto mostrando o recheio de carne (imagem ilustrativa)" fetchPriority="high"/>
        <canvas ref={cv} className="ly steam" aria-hidden="true"/>
        <img className="ly fgl" src={fgS} width="1088" height="940" alt="" aria-hidden="true"/>
        <div className="ly fgl glw" aria-hidden="true">{G.map((g,i)=><i key={i} className="gl" style={{'--x':g[0],'--y':g[1],'--d':g[2]+'s'}}/>)}</div>
      </div>
      <div className="dim"/>
    </div>);
}
