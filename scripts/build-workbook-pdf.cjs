const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3025';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const response = await page.goto(base + '/cuaderno-de-campo');
    if (response.status() !== 200) throw new Error('Workbook page unavailable');
    await page.evaluate(() => document.fonts.ready);
    if (await page.locator('.workbook-sheet').count() !== 3) throw new Error('Expected three sheets');
    fs.mkdirSync('output/pdf', { recursive: true });
    fs.mkdirSync('public/downloads', { recursive: true });
    await page.pdf({ path: 'output/pdf/cuaderno-modo-crisis-survival.pdf', format: 'A4', printBackground: false, margin: { top: '12mm', right: '12mm', bottom: '16mm', left: '12mm' }, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font:9px Arial;width:100%;text-align:center;color:#333">www.modocrisissurvival.com · Cuaderno de preparación · <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
    fs.copyFileSync('output/pdf/cuaderno-modo-crisis-survival.pdf', 'public/downloads/cuaderno-modo-crisis-survival.pdf');
    console.log('Created workbook PDF and the identical public download. Render and inspect all pages before delivery.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
