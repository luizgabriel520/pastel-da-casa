// Uso: npm run dev → abre http://localhost:5173 e recompila ao salvar arquivos de src/
const esbuild=require('esbuild'),fs=require('fs');
const copy=()=>{fs.mkdirSync('.dev',{recursive:true});fs.copyFileSync('src/site.css','.dev/site.css');
  fs.writeFileSync('.dev/index.html',`<!DOCTYPE html>\n<html lang="pt-BR">\n<head>${fs.readFileSync('src/head.html','utf8')}<link rel="stylesheet" href="site.css">\n</head>\n<body>\n<div id="root"></div>\n<script src="client.js"></script>\n<script>new EventSource('/esbuild').addEventListener('change',()=>location.reload())</script>\n</body>\n</html>`)};
(async()=>{
  copy();fs.watchFile('src/site.css',{interval:300},copy);
  const ctx=await esbuild.context({entryPoints:['src/client.jsx'],bundle:true,jsx:'automatic',loader:{'.jpg':'dataurl','.webp':'dataurl','.html':'text'},define:{'process.env.NODE_ENV':'"development"'},outfile:'.dev/client.js',logLevel:'info'});
  await ctx.watch();const s=await ctx.serve({servedir:'.dev',port:5173});
  console.log('Site em http://localhost:'+s.port);
})();
