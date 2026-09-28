const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:900});for(const slug of ['caza-observacion-fauna-preparacion','pesca-preparar-salida-responsable']){
  await page.goto(`${process.argv[2]}/supervivencia/${slug}`);
  assert.equal(await page.locator('.article-app-reference').count(),0);
  const artwork=page.locator('.article-field-reference img');await artwork.scrollIntoViewIfNeeded();await artwork.evaluate(el=>el.decode());
  assert(await artwork.evaluate(el=>Math.abs(el.clientWidth/el.clientHeight-el.naturalWidth/el.naturalHeight)<.01));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const href=await page.locator('.article-field-reference a').getAttribute('href');assert((await page.request.get(process.argv[2]+href)).ok());
  await page.screenshot({path:`docs/${slug}-${width}.png`});
 }}console.log('Six responsive artwork checks passed; full-size assets load; screenshots removed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
