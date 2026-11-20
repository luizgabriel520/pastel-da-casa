// Uso: npm install && npm run build  → gera dist/index.html (React pré-renderizado, tudo embutido)
const esbuild=require('esbuild'),fs=require('fs');
const common={bundle:true,minify:true,jsx:'automatic',loader:{'.jpg':'dataurl','.webp':'dataurl','.html':'text'},define:{'process.env.NODE_ENV':'"production"'},legalComments:'none',logLevel:'warning'};
(async()=>{
  await esbuild.build({...common,entryPoints:['src/client.jsx'],format:'iife',target:'es2019',outfile:'dist/client.js'});
  await esbuild.build({...common,entryPoints:['src/server.jsx'],format:'cjs',platform:'node',outfile:'dist/server.cjs'});
  const ssr=require('./dist/server.cjs').html();
  const head=fs.readFileSync('src/head.html','utf8'),css=fs.readFileSync('src/site.css','utf8'),js=fs.readFileSync('dist/client.js','utf8').replace(/<\/script/g,'<\\/script');
  fs.writeFileSync('dist/index.html',`<!DOCTYPE html>\n<html lang="pt-BR">\n<head>${head}<style>${css}</style>\n</head>\n<body>\n<div id="root">${ssr}</div>\n<noscript><p style="padding:24px;color:#f4efe6">Pastel da Casa: pedidos pelo WhatsApp +55 67 8121-3991.</p></noscript>\n<script>${js}</script>\n</body>\n</html>`);
  console.log('ok',(fs.statSync('dist/index.html').size/1024|0)+' KB');
})();
