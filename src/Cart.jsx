import {useEffect,useRef,useState} from 'react';
import {CONFIG,R,nz,waUrl} from './data.js';
import {Icon} from './ui.jsx';
export default function Cart({cart,setCart,open,setOpen,bump}){
  const[rg,setRg]=useState(''),[en,setEn]=useState(''),[nm,setNm]=useState(''),xr=useRef(),fb=useRef(),was=useRef(false);
  const ks=Object.keys(cart).filter(k=>cart[k]>0&&CONFIG.sabores[k]&&CONFIG.sabores[k].p),qt=ks.reduce((a,k)=>a+cart[k],0),sub=ks.reduce((a,k)=>a+cart[k]*CONFIG.sabores[k].p,0);
  const r=rg.trim(),t=r?CONFIG.taxas.find(x=>nz(x.r)===nz(r)):null,tx=t?t.v:0,tot=R(sub+tx)+(r&&!t?' + taxa':''),ok=qt>0&&!!r;
  const L=ks.map(k=>`${cart[k]}x ${CONFIG.sabores[k].n} (${R(CONFIG.sabores[k].p*cart[k])})`).join('\n');
  const href=waUrl(`Olá! Gostaria de fazer um pedido:\n${L}\n\nSubtotal: ${R(sub)}\nBairro: ${r}\nTaxa de entrega: ${t?R(tx):'a confirmar'}\nTotal: ${tot}\nEndereço: ${en.trim()||'informo na conversa'}${nm.trim()?'\nNome: '+nm.trim():''}`);
  const chg=(k,d)=>setCart(c=>{const n={...c,[k]:Math.max(0,Math.min(99,(c[k]||0)+d))};if(!n[k])delete n[k];return n});
  useEffect(()=>{if(open){was.current=true;xr.current&&xr.current.focus()}else if(was.current)fb.current&&fb.current.focus()},[open]);
  useEffect(()=>{const k=e=>{if(e.key==='Escape')setOpen(false)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[]);
  useEffect(()=>{document.body.classList.toggle('cart-open',open);return()=>document.body.classList.remove('cart-open')},[open]);
  return(<>
    <button ref={fb} className={`fab${bump?' bump':''}`} key={bump} id="fab" aria-label="Abrir carrinho de pedido" onClick={()=>setOpen(true)}>
      <svg className="i" viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0"/></svg>
      <span className="t">Meu pedido</span>
      <b className={qt?'has':''}>{qt}</b>
    </button>
    <div className={`shade${open?' open':''}`} onClick={()=>setOpen(false)} aria-hidden={!open}/>
    <aside className={`cart${open?' open':''}`} id="cart" role="dialog" aria-modal="true" aria-labelledby="cT">
      <div className="ch"><h3 id="cT">Seu pedido</h3><button ref={xr} aria-label="Fechar carrinho" onClick={()=>setOpen(false)}>✕</button></div>
      <ul id="cItems">{ks.length?ks.map((k,i)=>{const s=CONFIG.sabores[k];return(
        <li key={k} className="ci" style={{'--i':i}}>
          <div><b>{s.n}</b><small>{R(s.p)}</small></div>
          <div className="q">
            <button aria-label={`Diminuir ${s.n}`} onClick={()=>chg(k,-1)}>−</button>
            <span>{cart[k]}</span>
            <button aria-label={`Aumentar ${s.n}`} onClick={()=>chg(k,1)}>+</button>
          </div>
          <b>{R(s.p*cart[k])}</b>
        </li>
      )}):<li className="empty">Seu carrinho está vazio. Escolha seus pastéis no cardápio.</li>}</ul>
      <div className="cf">
        <label>Bairro (Campo Grande-MS)<input id="cReg" list="cRegL" autoComplete="off" placeholder="Digite seu bairro" value={rg} onChange={e=>setRg(e.target.value)}/><datalist id="cRegL">{CONFIG.taxas.map(x=><option key={x.r} value={x.r}/>)}</datalist></label>
        <label>Endereço de entrega<input id="cEnd" autoComplete="street-address" placeholder="Rua, número e complemento" value={en} onChange={e=>setEn(e.target.value)}/></label>
        <label>Seu nome (opcional)<input id="cNome" autoComplete="name" value={nm} onChange={e=>setNm(e.target.value)}/></label>
        <div className="pin"><div className="tot"><div><span>Subtotal</span><span id="cSub">{R(sub)}</span></div><div><span>Taxa de entrega</span><span id="cTax">{!r?'informe o bairro':t?R(tx):'a confirmar'}</span></div><div className="g"><span>Total</span><span id="cTot">{tot}</span></div></div>
          <a className="btn lg" id="cSend" href={href} target="_blank" rel="noopener" aria-disabled={!ok} onClick={e=>{if(!ok)e.preventDefault()}}><Icon k="wa"/>Enviar pedido pelo WhatsApp</a>
          <p className="cn">O pedido segue por mensagem. Pagamento e confirmação são combinados no WhatsApp.</p></div>
      </div>
    </aside></>);
}
