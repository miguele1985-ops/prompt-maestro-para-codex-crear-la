const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('mcs-cookie-consent', 'rejected'));
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${process.argv[2]}/codigo-morse`);
      await page.locator('#morse-input').fill('SOS');
      assert.equal(await page.locator('.morse-output').textContent(), '... --- ...');
      await page.getByRole('button', { name: 'Morse a texto', exact: true }).click();
      await page.locator('#morse-input').fill('.... --- .-.. .-');
      assert.equal(await page.locator('.morse-output').textContent(), 'HOLA');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `docs/morse-${width}.png`, fullPage: true });
      await page.goto(`${process.argv[2]}/supervivencia/como-guardar-agua-emergencias`);
      await page.locator('img[src*="aportada-"]').first().scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('img[src*="aportada-"]')].every(img => img.complete && img.naturalWidth > 0));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    console.log('Morse conversions, responsive layout and supplied article images verified at 320, 390 and 1440px.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
