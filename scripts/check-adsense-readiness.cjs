const fs = require('node:fs');
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:3023';

(async () => {
  const ads = await fetch(base + '/ads.txt');
  assert.equal(ads.status, 200);
  assert.match(ads.headers.get('content-type'), /text\/plain/);
  assert.equal((await ads.text()).trim(), 'google.com, pub-7330652876943268, DIRECT, f08c47fec0942fa0');
  for (const path of ['/vista-previa-web.html', '/inicio-editorial-revisado.html', '/inicio-remoto.html']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const paths = [
    '/politica-editorial',
    '/supervivencia/como-crear-plan-familiar-emergencia',
    '/supervivencia/como-revisar-kit-emergencia',
    '/supervivencia/documentacion-conviene-tener-disponible',
    '/supervivencia/como-preparar-ninos-sin-asustarlos',
    '/supervivencia/linterna-frontal-vs-de-mano-para-un-apagon',
    '/', '/contacto', '/cookies', '/privacidad', '/donaciones',
    '/supervivencia/que-es-archivo-mbtiles',
    '/supervivencia/gestion-alimentos-sin-electricidad',
    '/supervivencia/kit-emergencia-personas-mayores',
    '/supervivencia/radio-frecuencias-emergencia-sin-cobertura',
  ];
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', JSON.stringify({version:1,analytics:false})));
    for (const width of [360, 414, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path + ' overflow ' + width);
        if (path === '/politica-editorial') await page.screenshot({ path: 'docs/adsense-policy-' + width + '.png' });
        if (paths.slice(1, 5).includes(path)) assert.equal(await page.locator('#equipo-articulo').count(), 0, 'Generic commercial block on an organizational guide');
      }
      await page.goto(base + paths[1]);
      assert((await page.locator('.editorial-byline').textContent()).includes('Actualizado'));
      assert.equal(await page.locator('.editorial-prose section[id^="seccion-"]').count(), 6);
      await page.screenshot({ path: 'docs/adsense-guide-' + width + '.png' });
    }
  } finally {
    await browser.close();
  }
  const report = { checkedAt: new Date().toISOString(), origin: base, adsTxt: { status: 200, publisher: 'pub-7330652876943268' }, viewports: [360, 414, 768, 1440], paths, previewsNoindex: true, organizationalGuidesWithoutShoppingBlocks: true };
  fs.writeFileSync('docs/adsense-readiness-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
