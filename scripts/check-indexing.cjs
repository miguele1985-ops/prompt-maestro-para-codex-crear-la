const fs = require('node:fs');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
const {chromium} = require('playwright');
const posts = require('./audit-article-covers.cjs');
const {paginatedCatalogs,catalogPageHref,catalogPageSize} = require('../src/content/catalogs.ts');
const origin = process.argv[2] || 'http://127.0.0.1:3021';
const canonical = 'https://www.modocrisissurvival.com';

(async()=>{
 const xml=await (await fetch(origin+'/sitemap.xml')).text();
 const sitemapDocument=new JSDOM(xml,{contentType:'text/xml'}).window.document;
 const urls=Array.from(sitemapDocument.querySelectorAll('url > loc'),node=>node.textContent);
 assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap URLs');
 const rows=[];
 const graph=new Map();
 for(let i=0;i<urls.length;i+=5) await Promise.all(urls.slice(i,i+5).map(async url=>{
  const path=new URL(url).pathname;
  const response=await fetch(origin+path,{redirect:'manual'});
  const document=new JSDOM(await response.text()).window.document;
  assert.equal(response.status,200,path);
  assert.equal(document.querySelector('link[rel="canonical"]')?.href,canonical+path,path);
  assert.equal(document.querySelectorAll('h1').length,1,path);
  assert(!/noindex/i.test(response.headers.get('x-robots-tag')||''),path);
  assert(!/noindex/i.test(document.querySelector('meta[name="robots"]')?.content||''),path);
  const links=Array.from(document.querySelectorAll('a[href]'),node=>node.getAttribute('href')).filter(href=>href.startsWith('/')&&!href.startsWith('//')).map(href=>new URL(href,canonical).pathname);
  graph.set(path,links);
  rows.push({path,status:response.status,canonical:canonical+path});
 }));
 const seen=new Set();
 const queue=['/'];
 while(queue.length){const path=queue.shift();if(seen.has(path))continue;seen.add(path);for(const link of graph.get(path)||[])if(!seen.has(link))queue.push(link);}
 const unreachable=urls.map(url=>new URL(url).pathname).filter(path=>!seen.has(path));
 assert.deepEqual(unreachable,[],'Sitemap URLs without a crawlable link from the home page');
 const mapLinks=new Set(graph.get('/mapa-web'));
 for(const post of posts)assert(mapLinks.has(`/supervivencia/${post.slug}`),post.slug);
 for(const {catalog,page} of paginatedCatalogs()){
  const path=catalogPageHref(catalog,page);
  const links=graph.get(path);
  for(const item of catalog.items.slice((page-1)*catalogPageSize,page*catalogPageSize)) assert(links.includes(item.href),path+': '+item.href);
  assert(links.includes(catalogPageHref(catalog,page-1)),path+': previous page missing');
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage();
  await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
  for(const width of [360,414,768,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto(origin+'/supervivencia');
   const next=page.locator('.portal-pagination a').filter({hasText:'Siguiente'});
   assert.equal(await next.getAttribute('href'),'/catalogo/articulos/2');
   await next.click();
   await page.waitForURL('**/catalogo/articulos/2');
   assert((await page.locator('.portal-pagination').textContent()).includes('Página 2'));
   assert.equal(await page.locator('.portal-catalog .portal-card').count(),12);
   await page.getByRole('searchbox').fill('ciberataque');
   assert.equal(await page.locator('.portal-catalog .portal-card').count(),1);
   await page.getByRole('searchbox').fill('');
   assert((await page.locator('.portal-pagination').textContent()).includes('Página 2'));
   await page.locator('.portal-pagination a').filter({hasText:'Anterior'}).click();
   await page.waitForURL('**/supervivencia');
   await page.goto(origin+'/mapa-web');
   assert(await page.evaluate(()=>document.querySelector('.site-page').scrollWidth<=innerWidth));
   await page.screenshot({path:`docs/indexing-map-${width}.png`});
  }
 }finally{await browser.close();}
 const report={checkedAt:new Date().toISOString(),environment:origin,sitemapURLs:urls.length,articleURLs:posts.length,paginatedURLs:paginatedCatalogs().length,unreachable,viewports:[360,414,768,1440],routes:rows.sort((a,b)=>a.path.localeCompare(b.path))};
 fs.writeFileSync('docs/indexing-audit.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({sitemapURLs:urls.length,articles:posts.length,paginatedURLs:report.paginatedURLs,unreachable,viewports:report.viewports}));
})().catch(error=>{console.error(error);process.exitCode=1;});
