const {chromium}=require('playwright');
const fs=require('node:fs');
const slugs=['como-prepararse-para-un-apagon','ciberataque-masivo-servicios-esenciales','crisis-cadena-suministro-supermercados-vacios','espana-2030-calor-sequia-inundaciones','desinformacion-emergencias-deepfakes-alertas-falsas'];
slugs.push('como-guardar-agua-emergencias','7-dias-sin-internet','tarjetas-cajeros-pagos-no-funcionan','que-hacer-durante-dana','primeras-24-horas-gran-emergencia');
slugs.push('tormenta-solar-extrema-como-prepararse','confinamiento-emergencia-casa-que-hacer','medicamentos-tratamientos-emergencias','emergencia-trabajo-volver-casa','evacuacion-10-minutos-que-coger');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const origin=process.argv[2]||'http://localhost:3004';const results=[];
 try{
  const page=await browser.newPage();await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   for(const slug of slugs){
    const response=await page.goto(`${origin}/supervivencia/${slug}`,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    const row=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).length,sources:document.querySelectorAll('.editorial-review-note a[href^="https://"]').length,download:document.querySelector('.app-download-primary')?.getAttribute('href'),amazon:document.querySelectorAll('a[rel*="sponsored"]').length}));
    if(response.status()!==200||row.h1!==1||row.overflow||row.broken||!row.sources||row.amazon!==2||!row.description||row.canonical!==`https://www.modocrisissurvival.com/blog/${slug}`||row.download!=='https://descargas.modocrisissurvival.com/apk/supervivencia-offline-usuarios.apk')throw Error(JSON.stringify({slug,width,...row}));
    results.push({slug,width,...row});
    if(width===390&&slug===slugs[1])await page.screenshot({path:'docs/resilience-article-mobile.png'});
   }
  }
  fs.writeFileSync('docs/resilience-check.json',JSON.stringify({results},null,2));console.log(`${results.length} viewport checks, SEO, sources, images and download links passed`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
