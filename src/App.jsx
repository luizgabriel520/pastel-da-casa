import {useEffect,useRef,useState} from 'react';
import {CONFIG,R,waUrl} from './data.js';
import {Rv,Sp,Mv,useParallax} from './hooks.js';
import {Icon,Curve,Swash} from './ui.jsx';
import Hero from './Hero.jsx';import Cart from './Cart.jsx';
import SPRITE from './sprite.html';
import logo from '../img/logo.jpg';import about from '../img/about.jpg';
const NAV=[['inicio','Início'],['pasteis','Cardápio'],['sobre','Sobre Nós'],['depoimentos','Depoimentos'],['contato','Contato']];
const WA=waUrl(CONFIG.mensagem),IG=CONFIG.instagram;
const Arrow=()=><Icon k="arrow" style={{width:'1em',height:'1em'}}/>;
function Header({active}){
  const[open,setOpen]=useState(false),[sc,setSc]=useState(false),hd=useRef();
  useEffect(()=>{let tk=0;const f=()=>{tk=0;const y=scrollY,mx=document.documentElement.scrollHeight-innerHeight;setSc(y>24);hd.current&&hd.current.style.setProperty('--p',mx>0?Math.min(1,y/mx):0)};
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
const CartI=()=><svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.4-1L20.5 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>;
const CheckI=()=><svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>;
const Sparks=({flip})=><svg className={`sparks${flip?' flip':''}`} viewBox="0 0 64 56" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true"><path d="M56 28H28M52 16 30 5M52 40l-22 11"/></svg>;
function Card({s,k,add}){
  const[ok,setOk]=useState(false),tm=useRef();
  useEffect(()=>()=>clearTimeout(tm.current),[]);
  const onAdd=()=>{add(k);setOk(true);clearTimeout(tm.current);tm.current=setTimeout(()=>setOk(false),1400)};
  const[ip,dp]=s.p.toFixed(2).split('.');
  return(
    <Mv as="li" v="up" d={Math.min(k,5)*.09} className="pitem">
      <article className={`pcard${ok?' added':''}`}
        onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',(e.clientX-r.left)+'px');e.currentTarget.style.setProperty('--my',(e.clientY-r.top)+'px')}}>
        <div className="pimg"><img src={s.img} width="632" height="292" loading="lazy" alt={`Pastel de ${s.n} (imagem ilustrativa)`}/></div>
        <div className="pbody">
          <h3 className="pname">{s.n}</h3>
          <p className="pprice" aria-label={R(s.p)}><span className="cur" aria-hidden="true">R$</span><span className="int" aria-hidden="true">{ip}</span><span className="dec" aria-hidden="true">,{dp}</span></p>
          <button type="button" className="padd" onClick={onAdd} aria-label={`Adicionar ${s.n} ao pedido`}>
            {ok?<CheckI/>:<CartI/>}<span aria-live="polite">{ok?'Adicionado':'Adicionar'}</span>
            {ok&&<span className="plus" aria-hidden="true">+1</span>}
          </button>
        </div>
      </article>
    </Mv>)}
function More({s}){
  return(<Mv as="li" v="up" d={.35} className="pitem pmore"><div className="pmorebox">
    <img src={s.img} width="344" height="206" loading="lazy" alt="" aria-hidden="true"/>
    <div><h3><Icon k={s.i}/>{s.n}</h3><a className="btn ghost" href={waUrl('Olá! Gostaria de saber todos os sabores disponíveis.')} target="_blank" rel="noopener">Ver todos os sabores<Arrow/></a></div>
  </div></Mv>)}
function About(){const pr=useParallax(12);
  return<section className="about" id="sobre"><Curve/><div className="wrap sec">
    <Mv v="left" className="pic"><img ref={pr} src={about} width="514" height="251" loading="lazy" alt="Pastel dourado aberto sobre tábua de madeira (imagem ilustrativa)"/></Mv>
    <div><Sp as="h2">Sobre o <em>Pastel da Casa</em></Sp>
      <Sp as="p" d={.12}>Somos apaixonados por pastel! Nossa missão é levar até você o verdadeiro sabor caseiro, com ingredientes de qualidade, muito recheio e aquele toque especial que faz toda a diferença.</Sp>
      <Mv as="a" v="up" d={.28} className="btn ghost" href={CONFIG.saibaMais||IG} target="_blank" rel="noopener">Saiba mais<Arrow/></Mv></div></div></section>}
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
        <div className="hero-copy">
          <svg className="hat hero-enter" style={{'--d':'.05s'}} viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M30 38a14 14 0 0 1 2-27 20 20 0 0 1 38-2 15 15 0 0 1 18 14 14 14 0 0 1-8 15v12H30zM30 48h50M8 24l10 4M104 20l-8 6M60 2V0"/></svg>
          <h1 className="word hero-enter" style={{'--d':'.12s'}} aria-label="Pastel da Casa"><span className="p" aria-hidden="true">Pastel</span><span className="da" aria-hidden="true">da</span><span className="ca" aria-hidden="true">Casa</span></h1>
          <p className="tag hero-enter" style={{'--d':'.28s'}}>Sabor caseiro, <em>feito com carinho!</em></p>
          <Swash d={.32}/>
          <p className="lead hero-enter" style={{'--d':'.4s'}}>Tradicionais e especiais, nossos pastéis são irresistíveis e feitos na hora!</p>
          <a className="btn lg hero-enter" style={{'--d':'.52s'}} href={WA} target="_blank" rel="noopener"><Icon k="wa"/>Peça pelo WhatsApp<Arrow/></a>
        </div>
        <Hero/>
      </div></section>
      <section className="menu" id="pasteis">
        <svg className="mwave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path className="mfill" d="M0 44C230 8 450 6 660 34S1090 80 1440 40V92H0Z"/><path className="mline" d="M0 44C230 8 450 6 660 34S1090 80 1440 40"/></svg>
        <div className="wrap">
          <div className="mhead">
            <div className="mtt"><Sparks/><Sp as="h2" className="mtitle">Nosso Cardápio</Sp><Sparks flip/></div>
            <Sp as="p" d={.18} className="msub">Escolha o seu pastel favorito:</Sp>
          </div>
          <ul className="mgrid" id="cards">{CONFIG.sabores.map((s,k)=>s.p?<Card key={s.n} s={s} k={k} add={add}/>:null)}
            {CONFIG.sabores.map((s,k)=>s.p?null:<More key={s.n} s={s}/>)}</ul>
          <p className="note">Imagens ilustrativas. Valores por unidade.</p>
        </div>
      </section>
      <section className="strip" aria-label="Diferenciais"><div className="wrap"><ul>{FEATS.map(([ic,tx],i)=><Mv as="li" v="up" key={ic} d={i*.1}><Icon k={ic}/><span>{tx.map((l,j)=><span key={j}>{j>0&&<br/>}{l}</span>)}</span></Mv>)}</ul></div></section>
      <About/>
      <section className="sec dep" id="depoimentos"><div className="wrap">
        <Mv v="up" className="eyebrow">Depoimentos</Mv>
        {dep.length?<Sp as="h2" d={.08}>Quem provou, <em>aprovou!</em></Sp>:<Sp as="h2" d={.08}>Conte como foi <em>sua experiência!</em></Sp>}
        <div className="quotes">{dep.map((d,i)=><Mv as="blockquote" v="up" key={i} d={i*.1}>“{d.texto}”<br/><small>{d.autor}</small></Mv>)}</div>
        <Sp as="p" d={.1}>Já pediu o seu? Conte pra gente como foi no Instagram.</Sp>
        <Mv as="a" v="up" d={.18} className="btn ghost" href={IG} target="_blank" rel="noopener"><Icon k="ig"/>Falar no Instagram</Mv></div></section>
      <section className="wrap" id="pedido" style={{paddingBottom:10}}><Mv v="up" className="order">
        <div className="l"><Icon k="wa" cls="big"/><div><h3>Faça já seu pedido!</h3><small>É rápido, fácil e delicioso!</small></div></div>
        <div className="m"><Icon k="clock"/><div>Atendimento:<br/><strong>{CONFIG.atendimento}</strong></div></div>
        <a className="btn" href={WA} target="_blank" rel="noopener"><Icon k="wa"/>Chamar no WhatsApp</a></Mv></section>
    </main>
    <footer id="contato"><div className="wrap"><div className="foot">
      <img src={logo} width="104" height="104" loading="lazy" alt="Pastel da Casa"/>
      <div className="s">Pastel da Casa<br/>Sabor que faz bem!</div>
      <div className="soc"><span>Siga nossas redes sociais:</span><div>{[['instagram','ig','Instagram'],['facebook','fb','Facebook']].filter(x=>CONFIG[x[0]]).map(x=><a key={x[1]} href={CONFIG[x[0]]} target="_blank" rel="noopener" aria-label={x[2]}><Icon k={x[1]}/></a>)}</div></div>
      <div className="e">Peça, aproveite e compartilhe essa delícia!</div></div>
      <p className="fine">Pastéis fritos tradicionais e especiais. Mini pastéis por encomenda.</p></div></footer>
    <Cart cart={cart} setCart={setCart} open={open} setOpen={setOpen} bump={bump}/>
  </>)}
