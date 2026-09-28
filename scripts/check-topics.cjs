const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', 'rejected'));
    for (const width of [360,414,768,1440]) {
      await page.setViewportSize({width,height:900});
      for (const path of ['/temas','/temas/comunicacion','/temas/plantas-espana','/temas/caza','/temas/pesca','/calendario-lunar','/supervivencia/pesca-preparar-salida-responsable']) {
        const response=await page.goto(process.argv[2]+path);
        assert.equal(response.status(),200,path);
        assert.equal(await page.locator('h1').count(),1);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${path}`);
        for (const img of await page.locator('img').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el=>el.decode());
        }
        if(path==='/temas') {
          assert.equal(await page.locator('.portal-categories > a').count(),22);
          await page.locator('.site-page').evaluate(el=>el.scrollTo(0,0));
          await page.screenshot({path:`docs/topics-${width}.png`});
        }
        if(path==='/calendario-lunar') {
          await page.locator('input[type="month"]').fill('2024-02');
          assert.equal(await page.locator('.lunar-days button').count(),29);
          await page.getByRole('button',{name:'Mes siguiente',exact:true}).click();
          assert.equal(await page.locator('.lunar-days button').count(),31);
          await page.locator('.lunar-days button').nth(14).click();
          assert((await page.locator('.lunar-tool [role="status"]').textContent()).includes('Día 15'));
          await page.locator('.site-page').evaluate(el=>el.scrollTo(0,0));
          await page.screenshot({path:`docs/lunar-${width}.png`});
        }
      }
    }
    console.log('28 responsive page checks, all images, 22 themes and lunar interactions passed.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
