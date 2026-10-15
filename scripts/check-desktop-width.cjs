const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3028';

(async () => {
  fs.mkdirSync('tmp/desktop-layout', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [];
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', JSON.stringify({ version: 1, analytics: false })));
    for (const width of [360, 414, 768, 1024, 1280, 1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width, height: 1080 });
      for (const pathname of ['/', '/supervivencia', '/temas']) {
        const response = await page.goto(base + pathname);
        assert.equal(response.status(), 200, pathname);
        assert.equal(await page.locator('h1').count(), 1, pathname);
        assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth + 1), `${pathname}: overflow at ${width}`);
        const section = page.locator('.journal-section').first();
        const contentWidth = await section.evaluate(node => node.getBoundingClientRect().width);
        if (width >= 1100) assert(contentWidth / width >= .88, `${pathname}: unused desktop width at ${width}`);
        const navigation = page.locator('.desktop-nav');
        if (await navigation.isVisible()) assert(await navigation.evaluate(node => node.scrollWidth <= node.clientWidth + 1), `Clipped desktop navigation at ${width}`);
        if (pathname === '/') {
          const feature = page.locator('.journal-feature-grid');
          await feature.scrollIntoViewIfNeeded();
          await feature.locator('img').evaluateAll(async images => { for (const img of images) await img.decode(); });
          const cards = await feature.locator('.journal-story').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y })));
          if (width >= 1100) {
            assert.equal(cards.length, 3);
            assert(Math.max(...cards.map(card => card.y)) - Math.min(...cards.map(card => card.y)) < 2, 'Featured cards are not in a single row');
            assert(Math.max(...cards.map(card => card.width)) - Math.min(...cards.map(card => card.width)) < 2, 'Unequal featured cards');
          }
          const images = await feature.locator('img').evaluateAll(nodes => nodes.map(img => ({ width: img.getBoundingClientRect().width, naturalWidth: img.naturalWidth, src: img.currentSrc })));
          for (const img of images) assert(img.naturalWidth >= img.width * .95, 'Low-resolution featured image: ' + img.src);
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          await page.screenshot({ path: `tmp/desktop-layout/home-feature-${width}.png` });
          const paths = page.locator('.journal-paths');
          await paths.scrollIntoViewIfNeeded();
          await paths.locator('img').evaluateAll(async images => { for (const img of images) await img.decode(); });
          await page.screenshot({ path: `tmp/desktop-layout/home-paths-${width}.png` });
        }
        checks.push({ pathname, viewport: width, contentWidth: Math.round(contentWidth), occupancy: Math.round(contentWidth / width * 100), overflow: false });
      }
    }
  } finally { await browser.close(); }
  fs.writeFileSync('docs/desktop-layout-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, checks, note: 'CSS viewport tests. A wide viewport is not a measurement of the user browser zoom setting.' }, null, 2) + '\n');
  console.log(JSON.stringify({ checks: checks.length, desktop: checks.filter(check => check.viewport >= 1280) }));
})().catch(error => { console.error(error); process.exitCode = 1; });
