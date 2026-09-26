const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const origin=process.argv[2]||'http://localhost:3000';
const canonical='https://www.modocrisissurvival.com';
(async()=>{
 const xml=await (await fetch(origin+'/sitemap.xml')).text();
 const urls=[...new JSDOM(xml,{contentType:'text/xml'}).window.document.querySelectorAll('loc')].map(e=>e.textContent);
 const results=[];const links=new Set();const errors=[];
 for(let start=0;start<urls.length;start+=5){await Promise.all(urls.slice(start,start+5).map(async url=>{
  const pathname=new URL(url).pathname;const r=await fetch(origin+pathname);const html=await r.text();const d=new JSDOM(html).window.document;
  const row={oldUrl:pathname,newUrl:pathname,status:r.status,action:'preserve',canonical:d.querySelector('link[rel="canonical"]')?.href,title:d.title,h1:d.querySelectorAll('h1').length};results.push(row);
  if(r.status!==200||row.canonical!==canonical+pathname||row.h1!==1)errors.push(row);
  for(const image of d.querySelectorAll('img[src],meta[property="og:image"]')){const src=image.getAttribute('src')||image.getAttribute('content');const parsed=new URL(src,canonical);if(parsed.origin===canonical&&!fs.existsSync('public'+parsed.pathname))errors.push({page:pathname,missingImage:parsed.pathname});}
  for(const a of d.querySelectorAll('a[href]')){const href=a.getAttribute('href');if(href.startsWith('/')&&!href.startsWith('//'))links.add(href.split('#')[0].split('?')[0]);}
  if(html.includes('dominio-pendiente.example'))errors.push({page:pathname,placeholder:true});
 }));}
 const extra=[...links].filter(link=>!urls.includes(canonical+link)&&!link.startsWith('/api/')&&!link.startsWith('/downloads/'));
 for(let start=0;start<extra.length;start+=5)await Promise.all(extra.slice(start,start+5).map(async link=>{const r=await fetch(origin+link,{method:'HEAD'});if(r.status>=400)errors.push({brokenLink:link,status:r.status});}));
 fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/url-migration.json',JSON.stringify({checkedAt:'2026-09-26',environment:'local production build',routes:results,extraLinks:extra,errors},null,2)+'\n');
 console.log(JSON.stringify({routes:urls.length,extraLinks:extra.length,errors},null,2));if(errors.length)process.exitCode=1;
})();
