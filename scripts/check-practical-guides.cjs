const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
    const origin=process.argv[2]||'http://localhost:3001';
    await page.goto(`${origin}/preparacion-practica`);
    const routes=await page.locator('.practical-guide-grid a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
    if(routes.length!==12)throw Error('Missing practical guide');
    const checks=[];
    for(const width of [320,390,1440]){
      await page.setViewportSize({width,height:900});
      for(const route of ['/preparacion-practica',...routes,'/senales-en-grupo']){
        await page.goto(origin+route,{waitUntil:'networkidle'});
        await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
        const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(img=>!img.naturalWidth).length,h1:document.querySelectorAll('h1').length}));
        if(result.overflow||result.broken||result.h1!==1)throw Error(JSON.stringify({route,width,...result}));
        checks.push({route,width,...result});
        if(route==='/preparacion-practica'&&width!==320)await page.screenshot({path:`public/preparacion-${width}.png`,fullPage:true});
      }
    }
    await page.goto(origin+routes[0]);
    await page.getByRole('checkbox').first().check();
    if(!(await page.getByRole('status').innerText()).startsWith('1 de'))throw Error('Incorrect progress');
    const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar lista'}).click();
    const download=await pending;const content=fs.readFileSync(await download.path(),'utf8');
    if(!content.includes('[x]'))throw Error('Download missing progress');
    await page.getByRole('button',{name:'Desmarcar'}).click();
    if(await page.getByRole('checkbox').first().isChecked())throw Error('Reset failed');
    fs.writeFileSync('docs/practical-guides-check.json',JSON.stringify({checks,actions:'mark, progress, download content and reset passed'},null,2)+'\n');
    console.log(`${checks.length} layout checks and guide actions passed`);
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
