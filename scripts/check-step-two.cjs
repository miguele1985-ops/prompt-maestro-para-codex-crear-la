const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
require('./audit-article-covers.cjs');
const { stepTwoRevisions } = require('../src/content/step-two-revisions.ts');
const base = process.argv[2] || 'http://127.0.0.1:3026';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [];
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', JSON.stringify({ version: 1, analytics: false })));
    for (const width of [360, 414, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const slug of Object.keys(stepTwoRevisions)) {
        const path = `/supervivencia/${slug}`;
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200, path);
        assert.equal(await page.locator('h1').count(), 1, path);
        const headings = page.locator('.article-faq summary h3');
        assert.equal(await headings.count(), 3, path);
        await page.locator('.article-faq summary').first().click();
        assert(await page.locator('.article-faq details').first().getAttribute('open') !== null, path);
        assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth), `${path}: overflow at ${width}`);
        const anchors = await page.locator('.editorial-toc a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('#')));
        for (const href of anchors) assert(await page.evaluate(id => Boolean(document.getElementById(id)), href.slice(1)), `${path}: ${href}`);
        const capture = slug === 'como-hacer-mas-segura-el-agua-sin-filtro-ni-pastillas' || slug === 'es-alert-por-que-a-veces-no-llega-a-tu-movil';
        if (capture && width === 360) await page.screenshot({ path: `docs/step-two-${slug}-faq-360.png` });
        await page.evaluate(() => document.querySelector('.site-page').scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForFunction(() => document.querySelector('.site-page').scrollTop === 0);
        await page.waitForFunction(() => [...document.images].filter(node => node.getBoundingClientRect().top < innerHeight && node.getBoundingClientRect().bottom > 0).every(node => node.complete && node.naturalWidth > 0));
        const images = await page.locator('img').evaluateAll(nodes => nodes.filter(node => node.getBoundingClientRect().top < innerHeight).map(node => ({ src: node.currentSrc || node.src, loaded: node.complete && node.naturalWidth > 0 })));
        for (const image of images) assert(image.loaded, `${path}: ${image.src}`);
        if (capture) {
          await page.screenshot({ path: `docs/step-two-${slug}-${width}.png` });
          if (width === 360) {
            const table = page.locator('table').first();
            await table.scrollIntoViewIfNeeded();
            await page.screenshot({ path: `docs/step-two-${slug}-table-360.png` });
          }
        }
        checks.push({ slug, width, status: 200, headings: 1, faq: 3, overflow: false });
      }
    }
    const report = { checkedAt: new Date().toISOString(), base, checks, note: 'Local responsive rendering and interactions, not search ranking or real-user performance.' };
    fs.writeFileSync('docs/step-two-responsive-check.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ pages: Object.keys(stepTwoRevisions).length, combinations: checks.length }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
