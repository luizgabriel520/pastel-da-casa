import {useEffect,useRef,useState,Children,cloneElement,isValidElement,createElement as h} from 'react';
export function useInView(th=.12){const ref=useRef(null),[on,set]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){set(true);io.disconnect()}},{threshold:th});io.observe(el);return()=>io.disconnect()},[th]);return[ref,on]}
export function useParallax(amp){const ref=useRef(null);
  useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;let tk=0;
    const f=()=>{tk=0;const el=ref.current;if(!el)return;const r=el.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.setProperty('--py',((((r.top+r.height/2)/innerHeight-.5)*2)*-amp).toFixed(1)+'px')};
    const on=()=>{tk||(tk=requestAnimationFrame(f))};addEventListener('scroll',on,{passive:true});f();return()=>removeEventListener('scroll',on)},[amp]);return ref}
/* entrada suave: aplica .rv/.in e atraso escalonado */
export function Rv({as:T='div',d=0,className='',style,children,...p}){const[ref,on]=useInView();
  return h(T,{ref,className:`rv${on?' in':''} ${className}`.trim(),style:{'--d':d+'s',...style},...p},children)}
/* texto revelado palavra por palavra */
const words=(node,c)=>Children.map(node,n=>{
  if(typeof n==='string')return n.split(/(\s+)/).map((t,i)=>!t?null:/^\s+$/.test(t)?t:h('span',{key:i,className:'w',style:{'--i':c.i++}},t));
  if(isValidElement(n)&&n.type!=='br')return cloneElement(n,{},words(n.props.children,c));return n});
export function Sp({as:T='p',d=0,className='',children,...p}){const[ref,on]=useInView();
  return h(T,{ref,className:`sp${on?' in':''} ${className}`.trim(),style:{'--d':d+'s'},...p},words(children,{i:0}))}
