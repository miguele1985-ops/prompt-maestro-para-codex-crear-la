const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3024';
(async () => {
  for (const path of ['/aplicacion-supervivencia-offline', '/sobre-nosotros']) {
    const response = await fetch(base + path);
    const dom = new JSDOM(await response.text());
    assert.equal(response.status, 200, path);
    assert.equal(dom.window.document.querySelectorAll('h1').length, 1, path);
    assert(!/noindex/i.test(dom.window.document.querySelector('meta[name="robots"]')?.content || ''), path);
    dom.window.close();
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', JSON.stringify({ version: 1, analytics: false })));
    let showUpdate = true;
    await page.route('**/app-version.json', route => route.fulfill({ json: { latestVersionLabel: 'V 9.8', showWebUpdateNotice: showUpdate, apkSize: '123 MB', publishedAt: '14/10/2026' } }));
    await page.route('**/api/public-stats', route => route.fulfill({ json: { visits: 0, downloads: 0, donationClicks: 0, donatedEuros: '0 €' } }));
    for (const width of [360, 414, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(base + '/aplicacion-supervivencia-offline');
      assert.equal(response.status(), 200);
      await page.getByRole('button', { name: 'Descargar aplicacion para Android · V 9.8' }).waitFor();
      assert.equal(await page.getByRole('link', { name: 'Ver nueva actualización de Modo Crisis Survival' }).count(), 1);
      assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth), 'App overflow ' + width);
      await page.screenshot({ path: `docs/indexing-app-repair-${width}.png` });
    }
    showUpdate = false;
    await page.reload();
    await page.getByRole('button', { name: 'Descargar aplicacion para Android · V 9.8' }).waitFor();
    assert.equal(await page.getByRole('link', { name: 'Ver nueva actualización de Modo Crisis Survival' }).count(), 0);
  } finally { await browser.close(); }
  const report = { checkedAt: new Date().toISOString(), environment: base, appStatus: 200, aboutStatus: 200, viewports: [360, 414, 768, 1440], liveVersion: true, manualNoticeRespected: true, note: 'The release API was mocked in the browser. These results do not confirm the Cloudflare deployment.' };
  fs.writeFileSync('docs/indexing-repairs-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
