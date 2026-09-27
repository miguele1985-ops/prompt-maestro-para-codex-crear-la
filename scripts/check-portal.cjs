const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const origin=process.argv[2]||'http://localhost:3002';
 const checks=[];
 try {
  const page=await browser.newPage();
  await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/','/guias-supervivencia','/guias-supervivencia/agua','/blog','/comparativas','/herramientas-supervivencia','/buscar','/preparacion-practica','/aplicacion-supervivencia-offline/herramientas']){
    const response=await page.goto(origin+route,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(img=>!img.naturalWidth).map(img=>img.src)}));
    checks.push({width,route,status:response.status(),...result});
    if(result.overflow||result.broken.length||response.status()!==200)throw Error(JSON.stringify(checks.at(-1)));
    if(width===390&&['/guias-supervivencia','/herramientas-supervivencia'].includes(route))await page.screenshot({path:`docs/portal-${route.slice(1)}-movil.png`});
   }
  }
  await page.setViewportSize({width:390,height:850});
  await page.goto(origin+'/buscar',{waitUntil:'networkidle'});
  await page.getByRole('searchbox').fill('captacion');
  await page.locator('.portal-card').filter({hasText:'Calculadora de captación de lluvia'}).waitFor();
  if(!await page.locator('.portal-card').filter({hasText:'Calculadora de captación de lluvia'}).count())throw Error('Search normalization');
  await page.getByLabel('Tipo',{exact:true}).selectOption('Comparativa');
  if(await page.locator('.portal-card').count()!==0)throw Error('Combined filters');
  await page.getByRole('searchbox').fill('');
  await page.getByLabel('Tipo',{exact:true}).selectOption('');
  await page.getByRole('button',{name:'Siguiente',exact:true}).click();
  if(!await page.getByText(/Página 2 de/).count())throw Error('Pagination');
  await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
  await page.getByRole('navigation',{name:'Navegación móvil',exact:true}).getByRole('link',{name:'Herramientas',exact:true}).click();
  if(!page.url().endsWith('/herramientas-supervivencia'))throw Error('Mobile menu');
  const calculators=await page.locator('.portal-card a[href*="#calculadora"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  if(calculators.length!==6)throw Error('Wrong calculator count');
  for(const href of calculators){await page.goto(origin+href);await page.getByRole('button',{name:'Calcular',exact:true}).click();if(!await page.locator('.calculator-result p').count())throw Error('No result '+href);}
  const missing=await page.goto(origin+'/pagina-inexistente-revision');if(missing.status()!==404)throw Error('404 status');
  fs.writeFileSync('docs/portal-check.json',JSON.stringify({checks,interactions:'search, accents, filters, pagination, mobile navigation, six calculator results, 404 passed'},null,2));
  console.log(`${checks.length} viewport checks and all interactions passed`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
