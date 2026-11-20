import c1 from '../img/c1.jpg';import c3 from '../img/c3.jpg';import c4 from '../img/c4.jpg';import c5 from '../img/c5.jpg';
/* ===== CONFIGURAÇÃO: edite aqui os dados do cliente ===== */
export const CONFIG={
  whatsapp:'556781213991',            // só dígitos com DDI (confirmar se o número precisa do 9 extra)
  mensagem:'Olá! Gostaria de fazer um pedido de pastéis.',
  instagram:'https://www.instagram.com/pasteldacasa8/',
  facebook:'',
  atendimento:'Horário a combinar',
  saibaMais:'',
  taxas:[],                           // [{r:'Bairro',v:5}] vazio = taxa a confirmar no WhatsApp
  depoimentos:[],                     // [{texto:'…',autor:'…'}] somente com autorização
  sabores:[{n:'Carne',p:2,i:'carne',img:c1},{n:'Carne com queijo',p:3,i:'carne',img:c1},{n:'Queijo',p:3,i:'queijo',img:c3},{n:'Pizza',p:3,i:'pizza',img:c4},{n:'e muito mais!',i:'star',img:c5}]
};
export const R=v=>'R$ '+v.toFixed(2).replace('.',',');
export const nz=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export const waUrl=txt=>'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(txt);
