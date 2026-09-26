const {JSDOM}=require('jsdom');
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
  const origin=process.argv[2]||'http://localhost:3001';
  const sitemap=new JSDOM(await(await fetch(origin+'/sitemap.xml')).text(),{contentType:'text/xml'});
  const routes=[...sitemap.window.document.querySelectorAll('loc')].map(node=>new URL(node.textContent).pathname).filter(path=>/^\/(blog|preparacion-practica)\/.+/.test(path));
  for(const route of routes){
    const response=await fetch(origin+route);if(!response.ok)throw Error(`${route} ${response.status}`);
    const doc=new JSDOM(await response.text()).window.document;
    if(doc.querySelectorAll('.article-equipment').length!==1)throw Error(`Block count ${route}`);
    const links=[...doc.querySelectorAll('a')].filter(a=>/^https:\/\/www.amazon.es\//.test(a.href));
    if(links.length!==2)throw Error(`Amazon count ${links.length} ${route}`);
    for(const link of links)if(new URL(link.href).searchParams.get('tag')!=='cociesfaci-21'||!link.rel.includes('sponsored'))throw Error(`Attribution ${route}`);
    if(!doc.querySelector('.equipment-disclosure').textContent.includes('Publicidad'))throw Error(`Disclosure ${route}`);
  }
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
    for(const width of [320,390,1440]){
      await page.setViewportSize({width,height:950});
      await page.goto(origin+'/preparacion-practica/comparar-equipo-antes-comprar',{waitUntil:'networkidle'});
      await page.locator('.article-equipment').scrollIntoViewIfNeeded();
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`Overflow ${width}`);
      await page.screenshot({path:`public/amazon-discreto-${width}.png`});
    }
  }finally{await browser.close();}
  fs.writeFileSync('docs/article-equipment-check.json',JSON.stringify({articleCount:routes.length,linksPerArticle:2,tag:'cociesfaci-21',viewports:[320,390,1440],automaticAds:false},null,2)+'\n');
  console.log(`${routes.length} articles: one block, two tagged Amazon links each; mobile checks passed`);
})().catch(error=>{console.error(error);process.exitCode=1;});
