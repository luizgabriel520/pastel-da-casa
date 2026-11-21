import {useEffect,useRef,useState} from 'react';
import {mkGL} from './mkgl.js';
import {useInView} from './hooks.js';
import bgS from '../img/bg.jpg';import fgS from '../img/fg.webp';
const G=[[50,34,0],[69,46,1.4],[34,58,2.6],[82,66,.8],[58,80,3.4],[24,50,2]];
export default function Hero(){
  const[ref,on]=useInView(),st=useRef(),cv=useRef(),[ready,setReady]=useState(false);
  useEffect(()=>{
    const root=ref.current;if(!root)return;
    const bg=root.querySelector('.bgl');
    let dead=false,raf=0,t0=0,io,ro,clean=[];
    const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;

    const start=()=>{
      if(dead)return;
      setReady(true);
      if(RM)return;
      t0=performance.now();

      const touch=matchMedia('(pointer:coarse)').matches;
      const lowP=touch||innerWidth<760||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
      const c=cv.current;
      if(!c)return;

      // Tenta WebGL; se falhar, canvas some mas o resto continua
      const g=mkGL(c);
      let res=lowP?0.4:0.55;

      const size=()=>{
        const w=Math.max(2,(c.offsetWidth||c.clientWidth||300)*res|0);
        const h=Math.max(2,(c.offsetHeight||c.clientHeight||260)*res|0);
        if(c.width!==w||c.height!==h){c.width=w;c.height=h;g&&g.rs(w,h)}
      };

      if(!g){c.style.display='none'}

      let px=0,py=0,gx=0,gy=0,cx=0,cy=0,sx=-9,sy=-9,vis=true,ema=.016,cool=0,f=0,last=t0;

      const fr=now=>{
        raf=requestAnimationFrame(fr);
        const dt=Math.min(.05,(now-last)/1000||.016);
        last=now;
        if(!vis||document.hidden)return;

        ema+=(dt-ema)*.05;
        cool-=dt;
        if(g&&ema>.04&&cool<=0&&res>.24){res*=.8;cool=3;size()}

        const t=(now-t0)/1000;
        const k=Math.min(1,t/2.8);
        const kk=k*k*(3-2*k);

        // Movimento idle mais forte no touch (sem mouse)
        const amp=touch?0.7:0.32;
        const tx=(px||gx)+Math.sin(t*.38)*amp;
        const ty=(py||gy)+Math.cos(t*.29)*(amp*.72);
        cx+=(tx-cx)*Math.min(1,dt*3.2);
        cy+=(ty-cy)*Math.min(1,dt*3.2);

        if(Math.abs(cx-sx)+Math.abs(cy-sy)>.0008){
          sx=cx;sy=cy;
          if(st.current){
            st.current.style.setProperty('--nx',cx.toFixed(3));
            st.current.style.setProperty('--ny',cy.toFixed(3));
          }
        }

        // Desenha fumaça (a cada frame ou a cada 2 em lowP)
        if(g&&!(lowP&&(f++&1)))g.draw(t,kk);
      };

      // Observa visibilidade do canvas
      if(typeof IntersectionObserver!=='undefined'){
        io=new IntersectionObserver(e=>{vis=e[0].isIntersecting},{threshold:0.02});
        io.observe(c);
      }

      if(typeof ResizeObserver!=='undefined'){
        ro=new ResizeObserver(size);
        ro.observe(c);
      }else{
        addEventListener('resize',size,{passive:true});
        clean.push(()=>removeEventListener('resize',size));
      }

      // Garante tamanho após layout
      size();
      requestAnimationFrame(size);
      setTimeout(size,200);
      setTimeout(size,600);

      raf=requestAnimationFrame(fr);

      // Mouse parallax (desktop)
      const mv=e=>{
        if(e.pointerType&&e.pointerType!=='mouse')return;
        px=(e.clientX/innerWidth-.5)*2;
        py=(e.clientY/innerHeight-.5)*2;
      };
      const lv=()=>{px=py=0};
      addEventListener('pointermove',mv,{passive:true});
      document.addEventListener('mouseleave',lv);
      clean.push(()=>{removeEventListener('pointermove',mv);document.removeEventListener('mouseleave',lv)});

      // Giroscópio no celular
      if(touch&&typeof DeviceOrientationEvent!=='undefined'){
        let b0=null;
        const go=e=>{
          if(e.gamma==null||e.beta==null)return;
          if(b0==null)b0=e.beta;
          gx=Math.max(-1,Math.min(1,e.gamma/20));
          gy=Math.max(-1,Math.min(1,(e.beta-b0)/20));
        };
        const D=DeviceOrientationEvent;
        if(typeof D.requestPermission==='function'){
          const ask=()=>D.requestPermission().then(s=>{if(s==='granted')addEventListener('deviceorientation',go)}).catch(()=>{});
          root.addEventListener('click',ask,{once:true});
          clean.push(()=>root.removeEventListener('click',ask));
        }else{
          addEventListener('deviceorientation',go);
          clean.push(()=>removeEventListener('deviceorientation',go));
        }
      }
    };

    const boot=()=>setTimeout(start,100);
    if(bg&&bg.decode)bg.decode().then(boot).catch(boot);
    else boot();

    return()=>{
      dead=true;
      cancelAnimationFrame(raf);
      io&&io.disconnect();
      ro&&ro.disconnect();
      clean.forEach(fn=>fn());
    };
  },[]);

  return(
    <div ref={ref} className={`shot rv${on?' in':''} ${ready?'ready':'pre'}`} style={{'--d':'.15s'}}>
      <div ref={st} className="stage">
        <img className="ly bgl" src={bgS} width="1088" height="940" alt="Pastéis fritos crocantes, um deles aberto mostrando o recheio de carne (imagem ilustrativa)" fetchPriority="high"/>
        <canvas ref={cv} className="ly steam" aria-hidden="true"/>
        <img className="ly fgl" src={fgS} width="1088" height="940" alt="" aria-hidden="true"/>
        <div className="ly fgl glw" aria-hidden="true">{G.map((g,i)=><i key={i} className="gl" style={{'--x':g[0],'--y':g[1],'--d':g[2]+'s'}}/>)}</div>
      </div>
      <div className="dim"/>
    </div>
  );
}
