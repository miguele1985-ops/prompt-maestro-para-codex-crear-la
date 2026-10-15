const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3029';

(async () => {
  fs.mkdirSync('tmp/home-legibility', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [];
  try {
    for (const width of [360, 414, 768, 1024, 1280, 1440, 1920, 2560, 3840]) {
      const page = await browser.newPage({ viewport: { width, height: 1080 } });
      assert.equal((await page.goto(base)).status(), 200);
      await page.getByRole('button', { name: 'Rechazar', exact: true }).click();
      await page.locator('.journal-cover img').evaluate(img => img.decode());
      assert.equal(await page.locator('h1').count(), 1);
      const metrics = await page.evaluate(() => {
        const font = selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
        const rect = selector => {
          const { x, y, width, height, bottom } = document.querySelector(selector).getBoundingClientRect();
          return { x, y, width, height, bottom };
        };
        return {
          width: innerWidth,
          overflow: document.querySelector('.site-page').scrollWidth > innerWidth + 1,
          h1: font('.journal-cover h1'),
          deck: font('.journal-cover .journal-deck'),
          body: font('.journal-cover-copy > p:not([class])'),
          button: font('.journal-primary'),
          utility: font('.journal-utilities a'),
          readingPath: font('.journal-paths a'),
          headerLink: font('.desktop-nav a'),
          header: rect('.site-header'),
          hero: rect('.journal-cover'),
          primary: rect('.journal-primary'),
          cookie: rect('.cookie-dock-closed'),
        };
      });
      assert.equal(metrics.overflow, false, `Overflow at ${width}`);
      assert(metrics.primary.y >= metrics.header.bottom - 1, 'Primary CTA behind sticky header');
      assert(metrics.primary.bottom < metrics.cookie.y, 'Primary CTA behind cookie preferences');
      if (width >= 768) {
        assert(metrics.h1 >= 64 && metrics.body >= 20 && metrics.button >= 17, `Small hero text at ${width}`);
        assert(metrics.hero.height >= 580, 'Flattened desktop hero');
      }
      if (width >= 1100) assert(metrics.utility >= 18 && metrics.readingPath >= 18, 'Small editorial links');
      const nav = page.locator('.desktop-nav');
      assert.equal(await nav.isVisible(), width >= 1440);
      if (width >= 1440) {
        assert(metrics.headerLink >= 16, 'Small header text');
        assert(await nav.evaluate(node => node.scrollWidth <= node.clientWidth + 1), `Clipped navigation at ${width}`);
      } else {
        await page.getByRole('button', { name: 'Abrir menú' }).click();
        await page.getByRole('navigation', { name: 'Navegación móvil' }).waitFor();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.mobile-nav').count(), 0);
      }
      await page.screenshot({ path: `tmp/home-legibility/hero-${width}.png` });
      await page.locator('.journal-paths').scrollIntoViewIfNeeded();
      await page.locator('.journal-paths img').evaluateAll(async images => {
        for (const img of images) await img.decode();
      });
      await page.screenshot({ path: `tmp/home-legibility/paths-${width}.png` });
      checks.push(metrics);
      await page.close();
    }
    // A user who enlarges their browser text must still be able to navigate.
    const page = await browser.newPage({ viewport: { width: 768, height: 1080 } });
    await page.goto(base);
    await page.addStyleTag({ content: 'html { font-size:200%; }' });
    assert(await page.evaluate(() => document.querySelector('.site-page').scrollWidth <= innerWidth + 1), 'Overflow with enlarged root text');
    await page.close();
  } finally {
    await browser.close();
  }
  fs.writeFileSync('docs/home-legibility-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, checks }, null, 2) + '\n');
  console.log(JSON.stringify({ checks: checks.length, desktopFontSizes: checks.filter(check => check.width >= 1440).map(({ width, h1, body, headerLink, utility }) => ({ width, h1, body, headerLink, utility })) }));
})().catch(error => { console.error(error); process.exitCode = 1; });
