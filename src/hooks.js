import {useEffect,useRef,useState,Children,cloneElement,isValidElement,createElement as h} from 'react';

/* IntersectionObserver agressivo + fallbacks para mobile */
export function useInView(th=0.05){
  const ref=useRef(null),[on,set]=useState(false);
  useEffect(()=>{
    const el=ref.current;if(!el||on)return;
    let done=false;
    const reveal=()=>{if(done)return;done=true;set(true)};

    // Já visível no carregamento?
    const r=el.getBoundingClientRect();
    if(r.top<innerHeight*0.98&&r.bottom>innerHeight*-0.05){reveal();return}

    // IntersectionObserver com rootMargin generoso
    let io;
    if(typeof IntersectionObserver!=='undefined'){
      io=new IntersectionObserver(es=>{
        if(es[0].isIntersecting){reveal();io.disconnect()}
      },{threshold:th,rootMargin:'40px 0px 80px 0px'});
      io.observe(el);
    }

    // Fallback por scroll (Safari antigo / edge cases)
    const onScroll=()=>{
      const rr=el.getBoundingClientRect();
      if(rr.top<innerHeight*0.92&&rr.bottom>0){reveal();removeEventListener('scroll',onScroll)}
    };
    addEventListener('scroll',onScroll,{passive:true});

    // Último recurso: revela após 1.8s
    const t=setTimeout(reveal,1800);

    return()=>{clearTimeout(t);io&&io.disconnect();removeEventListener('scroll',onScroll)}
  },[th,on]);
  return[ref,on]
}

export function useParallax(amp){
  const ref=useRef(null);
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    // No mobile também aplica, só com amplitude menor
    const touch=matchMedia('(pointer:coarse)').matches;
    const a=touch?amp*0.55:amp;
    let tk=0;
    const f=()=>{
      tk=0;const el=ref.current;if(!el)return;
      const r=el.parentNode.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      el.style.setProperty('--py',((((r.top+r.height/2)/innerHeight-.5)*2)*-a).toFixed(1)+'px')
    };
    const on=()=>{tk||(tk=requestAnimationFrame(f))};
    addEventListener('scroll',on,{passive:true});
    f();
    return()=>removeEventListener('scroll',on)
  },[amp]);
  return ref
}

export function Rv({as:T='div',d=0,className='',style,children,...p}){
  const[ref,on]=useInView();
  return h(T,{ref,className:`rv${on?' in':''} ${className}`.trim(),style:{'--d':d+'s',...style},...p},children)
}

const words=(node,c)=>Children.map(node,n=>{
  if(typeof n==='string')return n.split(/(\s+)/).map((t,i)=>!t?null:/^\s+$/.test(t)?t:h('span',{key:i,className:'w',style:{'--i':c.i++}},t));
  if(isValidElement(n)&&n.type!=='br')return cloneElement(n,{},words(n.props.children,c));
  return n
});

export function Sp({as:T='p',d=0,className='',children,...p}){
  const[ref,on]=useInView();
  return h(T,{ref,className:`sp${on?' in':''} ${className}`.trim(),style:{'--d':d+'s'},...p},words(children,{i:0}))
}
