const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const origin=process.argv[2]||'http://localhost:3018';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
  const page=await browser.newPage();await page.addInitScript(()=>localStorage.setItem('mcs-cookie-consent','rejected'));
  for(const width of [360,414,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto(origin+'/calendario-lunar');
    await page.waitForFunction(()=>document.querySelector('input[type="month"]').value.length===7);
    await page.locator('input[type="month"]').fill('2024-04');
    await page.waitForFunction(()=>document.querySelector('.lunar-detail time').getAttribute('datetime').startsWith('2024-04'));
    await page.locator('.lunar-days button').nth(7).click();
    const dark=await page.locator('canvas').evaluate(c=>{const p=c.getContext('2d').getImageData(0,0,240,240).data;return [...p].filter((v,i)=>i%4===0&&v>100).length;});
    await page.locator('.lunar-days button').nth(22).click();
    const light=await page.locator('canvas').evaluate(c=>{const p=c.getContext('2d').getImageData(0,0,240,240).data;return [...p].filter((v,i)=>i%4===0&&v>100).length;});
    assert(light>dark+30000,'Moon phase must visibly change');
    await page.locator('.lunar-detail').scrollIntoViewIfNeeded();
    assert(await page.evaluate(()=>document.querySelector('.site-page').scrollWidth<=innerWidth));
    await page.screenshot({path:`docs/lunar-expanded-${width}.png`});
    await page.goto(origin+'/codigo-morse');
    await page.locator('.morse-reference img').scrollIntoViewIfNeeded();
    await page.locator('.morse-reference img').evaluate(img=>img.decode());
    assert(await page.locator('.morse-reference img').evaluate(img=>img.clientWidth<=innerWidth));
    await page.goto(origin+'/herramientas-supervivencia');
    assert.equal(await page.locator('.calculator-catalog a').count(),13);
    const links=await page.locator('.calculator-catalog a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
    if(width===360)for(const link of links){
      assert.equal((await page.goto(origin+link)).status(),200);
      assert.equal(await page.locator('#calculadora').count(),1);
      assert(await page.evaluate(()=>document.querySelector('.site-page').scrollWidth<=innerWidth),link);
    }
  }
  const open=slug=>page.goto(origin+'/supervivencia/calculadora-'+slug+'#calculadora');
  await open('conversor-survival-unidades');await page.getByRole('button',{name:'Calcular',exact:true}).click();assert((await page.locator('.extra-tool [role="status"]').textContent()).replace(/[.\s]/g,'').includes('1000mL'));
  await open('destilacion-solar-agua');await page.getByRole('button',{name:'Calcular',exact:true}).click();assert((await page.locator('.extra-tool [role="status"]').textContent()).includes('1,025'));
  await open('potabilizacion-quimica-agua');await page.getByRole('button',{name:'Calcular',exact:true}).click();assert(await page.locator('.extra-tool [role="alert"]').count());await page.locator('.tool-check input').check();await page.getByRole('button',{name:'Calcular',exact:true}).click();assert(await page.locator('.extra-tool [role="status"]').count());
  await open('cruce-rios-seguridad');await page.getByRole('button',{name:'Calcular',exact:true}).click();assert((await page.locator('.extra-tool [role="status"]').textContent()).includes('0,5'));
  await open('silbato-emergencia-senales');for(const token of '...---...')await page.getByRole('button',{name:token==='.'?'· Corto':'− Largo',exact:true}).click();assert((await page.locator('.extra-tool [role="status"]').textContent()).includes('Coincide con SOS'));
  await open('senales-humo-supervivencia');await page.locator('.extra-tool select').first().selectOption('4');assert.equal(await page.locator('.smoke-practice svg').count(),4);
  await open('hipotermia-riesgo');await page.locator('.tool-check input').first().check();assert((await page.locator('.extra-tool [role="status"]').textContent()).includes('1 signos'));
  await page.getByRole('button',{name:'Restablecer',exact:true}).click();assert((await page.locator('.extra-tool [role="status"]').textContent()).includes('no descarta'));
  console.log('Lunar pixels, Morse image, 13 tools, seven interactions and four viewport widths verified.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
