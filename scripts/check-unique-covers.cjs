const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const covers = require('../src/content/article-covers.json');
const origin = process.argv[2] || 'http://localhost:3018';
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const page = await browser.newPage();
  await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
  for (const {image} of Object.values(covers)) {
   const response = await page.request.get(origin + image.replace('.jpg','-360.webp'));
   assert.equal(response.status(),200,image);
  }
  for (const width of [360,414,768,1440]) {
   await page.setViewportSize({width,height:900});
   await page.goto(origin+'/supervivencia/psicologia-emergencia-errores-mentales');
   const cover = page.locator('img[src="/images/blog/cover-psicologia.jpg"]');
   await cover.scrollIntoViewIfNeeded();
   await cover.evaluate(img=>img.decode());
   assert(await cover.evaluate(img=>img.naturalWidth>0));
   assert(await page.evaluate(()=>document.querySelector('.site-page').scrollWidth<=innerWidth));
   await page.screenshot({path:`docs/unique-covers-${width}.png`});
  }
  console.log('46 responsive covers loaded; article cover verified at 360, 414, 768 and 1440px.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
