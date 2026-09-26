const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
  const origin=process.argv[2]||'http://localhost:3001';
  const redirects=JSON.parse(fs.readFileSync('.next/routes-manifest.json','utf8')).redirects.filter(item=>item.source.startsWith('/blog/'));
  if(redirects.length!==5)throw Error('Missing redirects');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
    for(const entry of redirects){
      const response=await fetch(origin+entry.source,{redirect:'manual'});
      if(response.status!==308||!response.headers.get('location')?.endsWith(entry.destination))throw Error(`Redirect ${entry.source}`);
      for(const width of [390,1440]){
        await page.setViewportSize({width,height:950});
        await page.goto(origin+entry.source,{waitUntil:'networkidle'});
        await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
        const checks=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].some(img=>!img.naturalWidth),toc:[...document.querySelectorAll('.editorial-toc a[href^="#"]')].every(a=>document.getElementById(a.getAttribute('href').slice(1))),commercial:document.querySelectorAll('.article-equipment').length}));
        if(checks.overflow||checks.broken||!checks.toc||checks.commercial!==1)throw Error(JSON.stringify({entry,width,checks}));
      }
    }
    await page.setViewportSize({width:390,height:950});await page.goto(origin+redirects[4].destination);await page.screenshot({path:'public/lote-2-movil.png'});
    console.log('5 redirects and 10 article viewport checks passed');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
