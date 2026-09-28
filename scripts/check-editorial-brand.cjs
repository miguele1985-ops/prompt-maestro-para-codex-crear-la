const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent','rejected'));
    const origin = process.argv[2] || 'http://localhost:3001';
    const results = [];
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['/', '/supervivencia','/comparativas','/nudos','/plantas-y-fauna','/senales-en-grupo','/checklists']) {
        await page.goto(origin+route,{waitUntil:'networkidle'});
        await page.evaluate(async () => {for (const img of document.images) img.loading='eager'; await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
        const result = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(img=>!img.naturalWidth).length}));
        results.push({route,width,...result});
        if(result.overflow || result.broken) throw Error(JSON.stringify(results.at(-1)));
        if(width===390 && ['/','/supervivencia','/checklists'].includes(route)) await page.screenshot({path:`public/revision-${route==='/'?'inicio':route.slice(1)}-movil.png`,fullPage:true});
      }
    }
    const select = page.getByLabel('Lista de preparación');
    if(await select.locator('option').count()!==16) throw Error('Missing checklist');
    await page.getByRole('checkbox').first().check();
    await select.selectOption('bag72');
    await page.getByRole('checkbox').first().check();
    await page.getByRole('button',{name:'Desmarcar'}).click();
    await select.selectOption('family-plan');
    if(!await page.getByRole('checkbox').first().isChecked()) throw Error('Checklist state lost');
    const downloadPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'Descargar lista'}).click();
    const download=await downloadPromise;
    if(download.suggestedFilename()!=='checklist-family-plan.txt') throw Error('Wrong download');
    fs.writeFileSync('docs/editorial-brand-check.json',JSON.stringify({results,checklists:'selection, progress, scoped reset and download passed'},null,2)+'\n');
    console.log(`${results.length} viewport checks and checklist interactions passed`);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
