const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3017';
const slugs = ['objetos-de-casa-que-pueden-ayudarte-en-una-emergencia', 'psicologia-emergencia-errores-mentales', 'que-hacer-si-te-pierdes-24-horas', 'sin-mochila-sin-equipo', '5-mitos-de-supervivencia-que-pueden-ponerte-en-peligro'];
(async () => {
  const xml = await (await fetch(origin + '/sitemap.xml')).text();
  const routes = [...xml.matchAll(/<loc>[^<]+(\/supervivencia\/[^<]+)<\/loc>/g)].map(m => m[1]);
  assert.equal(routes.length, 98);
  for (const route of routes) {
    const response = await fetch(origin + route.replace('/supervivencia/', '/blog/') + '?ref=test', { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, route);
    assert.equal(new URL(response.headers.get('location'), origin).search, '?ref=test');
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', 'rejected'));
    for (const width of [360, 414, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const slug of slugs) {
        const route = '/supervivencia/' + slug;
        assert.equal((await page.goto(origin + route)).status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://www.modocrisissurvival.com' + route);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.site-page').scrollWidth <= innerWidth));
        const cover = page.locator('main img').first();
        await cover.evaluate(img => img.decode());
        assert(await cover.evaluate(img => img.naturalWidth > 0));
        assert(await page.locator('a[href*="descargas.modocrisissurvival.com/apk/"]').count() > 0);
        await page.screenshot({ path: `docs/article-${slug}-${width}.png` });
      }
    }
    console.log('98 permanent redirects (including query strings), 15 mobile/tablet checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
