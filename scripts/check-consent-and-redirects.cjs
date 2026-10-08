const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
require('./audit-article-covers.cjs');
const { articleAliases } = require('../src/content/article-consolidation.ts');
const base = process.argv[2] || 'http://127.0.0.1:3023';

(async () => {
  for (const [alias, destination] of Object.entries(articleAliases)) {
    for (const prefix of ['blog', 'supervivencia']) {
      const response = await fetch(`${base}/${prefix}/${alias}`, { redirect: 'manual' });
      assert.equal(response.status, 308, alias);
      assert.equal(new URL(response.headers.get('location'), base).pathname, `/supervivencia/${destination}`);
    }
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page = await context.newPage();
    const statistics = [];
    page.on('request', request => { if (request.url().includes('/api/stats/track')) statistics.push(request.url()); });
    await page.goto(base);
    await page.getByRole('button', { name: 'Rechazar', exact: true }).waitFor();
    await page.screenshot({ path: 'docs/adsense-home-first-visit-360.png' });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'First-visit mobile overflow');
    await page.setViewportSize({ width: 414, height: 800 });
    await page.screenshot({ path: 'docs/adsense-home-first-visit-414.png' });
    await page.setViewportSize({ width: 360, height: 800 });
    await page.getByRole('button', { name: 'Rechazar', exact: true }).click();
    await page.waitForTimeout(2000);
    assert.equal(statistics.length, 0, 'Statistics sent before consent or after rejection');
    assert.equal(await page.evaluate(() => sessionStorage.length), 0);
    await page.screenshot({ path: 'docs/adsense-home-consent-360.png' });
    await page.getByRole('button', { name: 'Preferencias de cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Aceptar', exact: true }).click();
    await page.waitForTimeout(500);
    assert.equal(statistics.length, 1, 'Explicit acceptance did not enable the counter');
    await page.getByRole('button', { name: 'Preferencias de cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Rechazar', exact: true }).click();
    await page.goto(base + '/supervivencia');
    await page.waitForTimeout(2000);
    assert.equal(statistics.length, 1, 'Statistics sent after revocation');
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto(base + '/donaciones');
    await page.waitForTimeout(500);
    assert(!requests.some(url => url.includes('donate-sdk.js')), 'PayPal preloaded before activation');
    assert(await page.getByRole('button', { name: 'Activar botón de PayPal' }).isVisible());
    assert(!requests.some(url => /googlesyndication|doubleclick/.test(url)), 'Unconfigured advertising activated');
    await context.close();
  } finally {
    await browser.close();
  }
  const report = { checkedAt: new Date().toISOString(), origin: base, permanentRedirects: Object.keys(articleAliases).length * 2, rejectionRespected: true, revocationRespected: true, paypalNotPreloaded: true, advertisingNotLoaded: true };
  fs.writeFileSync('docs/consent-redirects-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
