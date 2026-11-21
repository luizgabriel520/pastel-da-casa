import {useEffect,useRef,useState} from 'react';
import {CONFIG,R,waUrl} from './data.js';
import {Rv,Sp,useParallax} from './hooks.js';
import {Icon,Curve,Swash} from './ui.jsx';
import Hero from './Hero.jsx';import Cart from './Cart.jsx';
import SPRITE from './sprite.html';
import logo from '../img/logo.jpg';import about from '../img/about.jpg';
const NAV=[['inicio','Início'],['pasteis','Nossos Pastéis'],['sobre','Sobre Nós'],['depoimentos','Depoimentos'],['contato','Contato']];
const WA=waUrl(CONFIG.mensagem),IG=CONFIG.instagram;
const Arrow=()=><Icon k="arrow" style={{width:'1em',height:'1em'}}/>;
function Header({active}){
  const[open,setOpen]=useState(false),[sc,setSc]=useState(false),hd=useRef();
  useEffect(()=>{let tk=0;const f=()=>{tk=0;const y=scrollY,mx=document.documentElement.scrollHeight-innerHeight;setSc(y>24);hd.current.style.setProperty('--p',mx>0?Math.min(1,y/mx):0)};
    const on=()=>{tk||(tk=requestAnimationFrame(f))};addEventListener('scroll',on,{passive:true});f();return()=>removeEventListener('scroll',on)},[]);
  useEffect(()=>{if(!open)return;const k=e=>e.key==='Escape'&&setOpen(false),c=e=>!e.target.closest('header')&&setOpen(false);
    addEventListener('keydown',k);document.addEventListener('click',c);document.body.style.overflow='hidden';
    return()=>{removeEventListener('keydown',k);document.removeEventListener('click',c);document.body.style.overflow=''}},[open]);
  return(<header ref={hd} className={sc?'sc':''}><div className="wrap bar">
    <a className="brand" href="#inicio" aria-label="Pastel da Casa, início"><img src={logo} width="60" height="60" alt="Logotipo Pastel da Casa"/></a>
    <nav id="menu" aria-label="Principal" className={open?'open':''}>{NAV.map(([id,t],i)=><a key={id} href={'#'+id} className={active===id?'on':''} style={{'--k':i}} onClick={()=>setOpen(false)}>{id==='inicio'&&<Icon k="home"/>}{t}</a>)}
      <a className="btn nav-wa" href={WA} target="_blank" rel="noopener" onClick={()=>setOpen(false)}><Icon k="wa"/>Peça pelo WhatsApp</a>
    </nav>
    <a className="btn hdr-wa" href={WA} target="_blank" rel="noopener"><Icon k="wa"/>Peça pelo WhatsApp</a>
    <button className="burger" aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="menu" onClick={()=>setOpen(!open)}><span/></button>
  </div></header>)}
const FEATS=[['hat',['Qualidade','em cada detalhe']],['heart',['Feito com','muito carinho']],['bolt',['Sabor inigualável']],['thumb',['Tradição que','conquista']]];
function Card({s,k,add}){
  return<Rv as="article" d={k*.07} className="card" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',(e.clientX-r.left)+'px');e.currentTarget.style.setProperty('--my',(e.clientY-r.top)+'px')}}>
    <img src={s.img} width="170" height="103" loading="lazy" alt={`Pastel de ${s.n} (imagem ilustrativa)`}/>
    <div><Icon k={s.i}/><span>{s.n}</span>{s.p&&<><b className="pr">{R(s.p)}</b><button type="button" className="add" onClick={e=>{e.stopPropagation();add(k)}}>Adicionar</button></>}</div></Rv>}
function About(){const pr=useParallax(10);
  return<section className="about" id="sobre"><Curve/><div className="wrap sec">
    <Rv className="pic"><img ref={pr} src={about} width="514" height="251" loading="lazy" alt="Pastel dourado aberto sobre tábua de madeira (imagem ilustrativa)"/></Rv>
    <div><Sp as="h2">Sobre o <em>Pastel da Casa</em></Sp>
      <Sp as="p" d={.1}>Somos apaixonados por pastel! Nossa missão é levar até você o verdadeiro sabor caseiro, com ingredientes de qualidade, muito recheio e aquele toque especial que faz toda a diferença.</Sp>
      <Rv as="a" d={.25} className="btn ghost" href={CONFIG.saibaMais||IG} target="_blank" rel="noopener">Saiba mais<Arrow/></Rv></div></div></section>}
export default function App(){
  const[active,setActive]=useState('inicio'),[cart,setCart]=useState({}),[open,setOpen]=useState(false),[bump,setBump]=useState(0),loaded=useRef(false);
  useEffect(()=>{try{const o=JSON.parse(localStorage.getItem('pdc')||'{}'),n={};for(const k in o)if(CONFIG.sabores[k]&&CONFIG.sabores[k].p&&o[k]>0)n[k]=Math.min(99,o[k]|0);setCart(n)}catch(e){}loaded.current=true},[]);
  useEffect(()=>{if(loaded.current)try{localStorage.setItem('pdc',JSON.stringify(cart))}catch(e){}},[cart]);
  useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&setActive(e.target.id)),{rootMargin:'-45% 0px -50% 0px'});NAV.forEach(([id])=>{const el=document.getElementById(id);el&&io.observe(el)});return()=>io.disconnect()},[]);
  const add=k=>{setCart(c=>({...c,[k]:Math.min(99,(c[k]||0)+1)}));setBump(b=>b+1)};
  const dep=CONFIG.depoimentos;
  return(<>
    <span dangerouslySetInnerHTML={{__html:SPRITE}}/>
    <Header active={active}/>
    <main>
      <section className="hero" id="inicio"><div className="wrap">
        <div>
          <svg className="hat" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M30 38a14 14 0 0 1 2-27 20 20 0 0 1 38-2 15 15 0 0 1 18 14 14 14 0 0 1-8 15v12H30zM30 48h50M8 24l10 4M104 20l-8 6M60 2V0"/></svg>
          <Rv as="h1" d={.1} className="word" aria-label="Pastel da Casa"><span className="p" aria-hidden="true">Pastel</span><span className="da" aria-hidden="true">da</span><span className="ca" aria-hidden="true">Casa</span></Rv>
          <Sp as="p" d={.25} className="tag">Sabor caseiro, <em>feito com carinho!</em></Sp>
          <Swash d={.3}/>
          <Sp as="p" d={.35} className="lead">Tradicionais e especiais, nossos pastéis são irresistíveis e feitos na hora!</Sp>
          <Rv as="a" d={.45} className="btn lg" href={WA} target="_blank" rel="noopener"><Icon k="wa"/>Peça pelo WhatsApp<Arrow/></Rv>
        </div>
        <Hero/>
      </div><Curve/></section>
      <section className="strip" aria-label="Diferenciais"><div className="wrap"><ul>{FEATS.map(([ic,tx],i)=><Rv as="li" key={ic} d={i*.08}><Icon k={ic}/><span>{tx.map((l,j)=><span key={j}>{j>0&&<br/>}{l}</span>)}</span></Rv>)}</ul></div></section>
      <section className="sec" id="pasteis"><div className="wrap">
        <Rv className="eyebrow">Nossos Pastéis</Rv>
        <Sp as="h2" d={.1}>Uma variedade de sabores<br/>para <em>todos os gostos!</em></Sp>
        <div className="cards" id="cards">{CONFIG.sabores.map((s,k)=><Card key={s.n} s={s} k={k} add={add}/>)}</div>
        <p className="note">Imagens ilustrativas. Valores por unidade.</p></div></section>
      <About/>
      <section className="sec dep" id="depoimentos"><div className="wrap">
        <Rv className="eyebrow">Depoimentos</Rv>
        {dep.length?<Sp as="h2" d={.1}>Quem provou, <em>aprovou?</em></Sp>:<Sp as="h2" d={.1}>Conte como foi <em>sua experiência!</em></Sp>}
        <div className="quotes">{dep.map((d,i)=><blockquote key={i}>“{d.texto}”<br/><small>{d.autor}</small></blockquote>)}</div>
        <Sp as="p">Já pediu o seu? Conte pra gente como foi no Instagram.</Sp>
        <Rv as="a" className="btn ghost" href={IG} target="_blank" rel="noopener"><Icon k="ig"/>Falar no Instagram</Rv></div></section>
      <section className="wrap" id="pedido" style={{paddingBottom:10}}><Rv className="order">
        <div className="l"><Icon k="wa" cls="big"/><div><h3>Faça já seu pedido!</h3><small>É rápido, fácil e delicioso!</small></div></div>
        <div className="m"><Icon k="clock"/><div>Atendimento:<br/><strong>{CONFIG.atendimento}</strong></div></div>
        <a className="btn" href={WA} target="_blank" rel="noopener"><Icon k="wa"/>Chamar no WhatsApp</a></Rv></section>
    </main>
    <footer id="contato"><div className="wrap"><div className="foot">
      <img src={logo} width="104" height="104" loading="lazy" alt="Pastel da Casa"/>
      <div className="s">Pastel da Casa<br/>Sabor que faz bem!</div>
      <div className="soc"><span>Siga nossas redes sociais:</span><div>{[['instagram','ig','Instagram'],['facebook','fb','Facebook']].filter(x=>CONFIG[x[0]]).map(x=><a key={x[1]} href={CONFIG[x[0]]} target="_blank" rel="noopener" aria-label={x[2]}><Icon k={x[1]}/></a>)}</div></div>
      <div className="e">Peça, aproveite e compartilhe essa delícia!</div></div>
      <p className="fine">Pastéis fritos tradicionais e especiais. Mini pastéis por encomenda.</p></div></footer>
    <Cart cart={cart} setCart={setCart} open={open} setOpen={setOpen} bump={bump}/>
  </>)}
