const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3025';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const measures = [];
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('mcs-cookie-consent', JSON.stringify({ version: 1, analytics: false }));
      window.labVitals = { lcp: null, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.labVitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.labVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const paths = ['/', '/empieza-aqui', '/cuaderno-de-campo', '/mi-biblioteca', '/supervivencia/senderismo-principiantes-planificar-ruta', '/supervivencia/como-crear-plan-familiar-emergencia', '/supervivencia/hornillo-camping-monoxido-carbono'];
    for (const width of [360, 414, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200, path);
        await page.waitForTimeout(300);
        assert.equal(await page.locator('h1').count(), 1);
        assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth), path + ' overflow ' + width);
        const visibleImages = await page.locator('img').evaluateAll(images => images.filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).map(img => ({ src: img.currentSrc || img.src, loaded: img.complete && img.naturalWidth > 0 })));
        for (const image of visibleImages) assert(image.loaded, 'Missing image: ' + image.src);
        if (path === '/') { await page.waitForTimeout(1000); measures.push({ width, ...(await page.evaluate(() => window.labVitals)) }); await page.screenshot({ path: `docs/growth-home-${width}.png` }); }
        if (path === '/empieza-aqui' || path === paths[4]) await page.screenshot({ path: `docs/growth-${path === '/empieza-aqui' ? 'start' : 'guide'}-${width}.png` });
      }
    }
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(base + '/empieza-aqui');
    await page.getByRole('button', { name: 'Recordar mi progreso en este navegador' }).click();
    await page.getByRole('checkbox').first().check();
    await page.reload();
    await page.getByRole('button', { name: 'Recordar mi progreso en este navegador' }).click();
    assert(await page.getByRole('checkbox').first().isChecked());
    await page.goto(base + paths[4]);
    await page.getByRole('button', { name: 'Guardar', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Guardado en este navegador.' }).waitFor({ state: 'visible' });
    await page.getByRole('link', { name: 'Mi biblioteca', exact: true }).first().click();
    await page.getByRole('link', { name: 'Senderismo para principiantes: prepara una ruta que puedas terminar' }).waitFor({ state: 'visible' });
    await page.goto(base + '/cuaderno-de-campo');
    await page.emulateMedia({ media: 'print' });
    await page.setViewportSize({ width: 900, height: 1000 });
    await page.screenshot({ path: 'docs/growth-workbook-print.png', fullPage: true });
    assert.equal(await page.locator('.workbook-sheet').count(), 3);
    assert.equal(await page.locator('.workbook-sheet table').count(), 3);
    for (const width of [360, 414]) {
      const fresh = await browser.newPage({ viewport: { width, height: 740 } });
      try {
        await fresh.goto(base);
        const dock = fresh.getByRole('region', { name: 'Consentimiento de cookies' });
        await dock.waitFor({ state: 'visible' });
        await fresh.waitForTimeout(200);
        const banner = await dock.boundingBox();
        const content = await fresh.locator('.site-page').boundingBox();
        assert(banner && content && content.y + content.height <= banner.y + 1, 'Cookie banner overlaps content');
        assert(Math.abs(banner.width - width) <= 1, 'Cookie banner is not full width');
        await fresh.getByRole('link', { name: /Conocer la app/ }).first().scrollIntoViewIfNeeded();
        const appLink = await fresh.getByRole('link', { name: /Conocer la app/ }).first().boundingBox();
        assert(appLink && appLink.y + appLink.height <= banner.y + 1, 'App link obstructed by cookies');
        await fresh.screenshot({ path: `docs/growth-cookies-${width}.png` });
      } finally { await fresh.close(); }
    }
  } finally { await browser.close(); }
  const report = { checkedAt: new Date().toISOString(), origin: base, viewports: [360, 414, 768, 1440], pageViewportChecks: 28, freshCookieViewports: [360, 414], cookieOverlap: false, progressPersisted: true, bookmarkPersisted: true, workbookSheets: 3, labMeasures: measures, note: 'Local headless browser measurements, not field Core Web Vitals or traffic predictions.' };
  fs.writeFileSync('docs/growth-experience-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
