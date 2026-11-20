import re,subprocess,sys
E='/opt/npm-tools/node_modules/.bin/esbuild'
C=['--bundle','--minify','--jsx=automatic','--preserve-symlinks','--loader:.jpg=dataurl','--loader:.webp=dataurl','--loader:.html=text','--define:process.env.NODE_ENV="production"','--legal-comments=none','--log-level=warning']
def run(a):
    r=subprocess.run([E]+a,capture_output=True,text=True,cwd='/home/claude/app');print(r.stderr[-1500:]);assert r.returncode==0
run(['src/client.jsx','--format=iife','--target=es2019','--outfile=dist/client.js']+C)
run(['src/server.jsx','--format=cjs','--platform=node','--outfile=dist/server.cjs']+C)
ssr=subprocess.run(['node','-e',"console.log(require('./dist/server.cjs').html())"],capture_output=True,text=True,cwd='/home/claude/app');assert ssr.returncode==0,ssr.stderr[-800:]
old=open('/mnt/user-data/outputs/artifacts/b3ca8cc3-38c5-46fe-87e6-7e07172fff48/index.html',encoding='utf-8').read() if not __import__('os').path.exists('orig_head.txt') else None
if old:
    head=re.search(r'<head>(.*?)</head>',old,re.S).group(1)
    head=re.sub(r'<script.*?</script>','',head,flags=re.S);head=re.sub(r'<noscript>.*?</noscript>','',head,flags=re.S);head=re.sub(r'<style>.*?</style>','',head,flags=re.S)
    open('orig_head.txt','w',encoding='utf-8').write(head)
head=open('orig_head.txt',encoding='utf-8').read()
css=open('src/site.css',encoding='utf-8').read();js=open('dist/client.js',encoding='utf-8').read().replace('</script','<\\/script')
page=f'<!DOCTYPE html>\n<html lang="pt-BR">\n<head>{head}<style>{css}</style>\n</head>\n<body>\n<div id="root">{ssr.stdout.strip()}</div>\n<noscript><p style="padding:24px;color:#f4efe6">Pastel da Casa: pedidos pelo WhatsApp +55 67 8121-3991.</p></noscript>\n<script>{js}</script>\n</body>\n</html>'
open('dist/index.html','w',encoding='utf-8').write(page);print('html',len(page)//1024,'KB','js',len(js)//1024,'KB')
