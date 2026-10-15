const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const posts = require('./audit-article-covers.cjs');
const base = process.argv[2] || 'http://127.0.0.1:3027';
const screenshots = new Set(['senderismo-principiantes-planificar-ruta', 'higiene-sin-agua-vivienda', 'caza-observacion-fauna-preparacion', 'gestion-alimentos-sin-electricidad']);

(async () => {
  fs.mkdirSync('tmp/photo-layout', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [];
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', JSON.stringify({ version: 1, analytics: false })));
    const paths = ['/', '/supervivencia', '/temas', '/herramientas-supervivencia', '/empieza-aqui', '/cuaderno-de-campo', '/nudos', '/plantas-y-fauna', '/calendario-lunar', '/codigo-morse'];
    for (const width of [360, 414, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const post of posts.filter(post => !post.slug.startsWith('calculadora-'))) {
        const pathname = `/supervivencia/${post.slug}`;
        const response = await page.goto(base + pathname);
        assert.equal(response.status(), 200, pathname);
        assert.equal(await page.locator('h1').count(), 1, pathname);
        const cover = page.locator('.editorial-article-photo img');
        await cover.scrollIntoViewIfNeeded();
        await cover.evaluate(img => img.decode());
        const size = await cover.evaluate(img => {
          const r = img.getBoundingClientRect();
          return { left: r.left, right: r.right, width: r.width, height: r.height, naturalWidth: img.naturalWidth, src: img.currentSrc, fit: getComputedStyle(img).objectFit };
        });
        assert(size.src.includes('/editorial/realistic/'), pathname);
        assert(size.naturalWidth >= size.width * .95, `${pathname}: undersized cover at ${width}`);
        assert(size.left >= -1 && size.right <= width + 1, `${pathname}: cover overflow`);
        assert(size.height <= 681, `${pathname}: cover too tall`);
        assert.equal(size.fit, 'contain', `${pathname}: main photo cropped`);
        assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth + 1), `${pathname}: page overflow at ${width}`);
        if (width <= 768) assert.equal(await page.locator('.editorial-reading-layout').evaluate(node => getComputedStyle(node).display), 'block');
        for (const table of await page.locator('.article-table-scroll').all()) {
          assert(await table.evaluate(node => node.getBoundingClientRect().right <= innerWidth + 1), `${pathname}: table outside article`);
          const columns = await table.locator('thead th').count();
          if (columns <= 3) assert(await table.evaluate(node => node.scrollWidth <= node.clientWidth + 1), `${pathname}: small table scrolls at ${width}`);
        }
        if (screenshots.has(post.slug)) {
          await page.screenshot({ path: `tmp/photo-layout/${post.slug}-${width}.png` });
          if (width === 360 && await page.locator('.article-table-scroll').count()) {
            await page.locator('.article-table-scroll').first().scrollIntoViewIfNeeded();
            await page.screenshot({ path: `tmp/photo-layout/${post.slug}-table-360.png` });
          }
        }
        checks.push({ pathname, width, photoLoaded: true, overflow: false });
      }
      for (const pathname of paths) {
        const response = await page.goto(base + pathname);
        assert.equal(response.status(), 200, pathname);
        assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth + 1), `${pathname}: overflow at ${width}`);
        if (pathname === '/' || pathname === '/supervivencia') {
          const content = page.locator(pathname === '/' ? '.journal-feature-grid' : '.portal-grid').first();
          await content.scrollIntoViewIfNeeded();
          await page.waitForFunction(() => [...document.images].filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).every(img => img.complete && img.naturalWidth > 0));
          await page.locator('img').evaluateAll(async images => {
            for (const img of images.filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0)) await img.decode();
          });
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const visible = await page.locator(pathname === '/' ? '.journal-feature-grid img' : '.portal-grid img').evaluateAll(images => images.filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).map(img => ({ source: img.currentSrc, naturalWidth: img.naturalWidth, width: img.getBoundingClientRect().width })));
          for (const image of visible) assert(image.naturalWidth >= image.width * .95, `${pathname}: low-resolution card at ${width}: ${image.source}`);
          await page.screenshot({ path: `tmp/photo-layout/${pathname === '/' ? 'home' : 'catalog'}-${width}.png` });
        }
        checks.push({ pathname, width, overflow: false });
      }
    }
  } finally { await browser.close(); }
  const report = { checkedAt: new Date().toISOString(), base, viewports: [360, 414, 768, 1440], checks, note: 'Local browser layout checks, not proof of rankings or field Core Web Vitals.' };
  fs.writeFileSync('docs/photo-layout-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ checks: checks.length, articleViewports: 352, otherPageViewports: 40 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
