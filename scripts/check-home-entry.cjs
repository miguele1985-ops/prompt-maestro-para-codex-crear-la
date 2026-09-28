const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const [width, height] of [[360,640],[414,896],[768,1024],[1440,900]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(process.argv[2]);
      await page.locator('.cookie-banner').waitFor();
      await page.waitForTimeout(150);
      const inspect = async () => page.evaluate(() => {
        const rect = s => document.querySelector(s).getBoundingClientRect();
        const cookie = document.querySelector('.cookie-banner') || document.querySelector('.cookie-dock-closed');
        return { cta: rect('.journal-primary').bottom, app: rect('.journal-hero-app a').bottom, top: cookie.getBoundingClientRect().top, search: rect('.site-header > .portal-header-search').width, overflow: document.documentElement.scrollWidth > innerWidth, adjacent: document.querySelector('.journal-cover').nextElementSibling.matches('.journal-topics'), shell: rect('.site-page').bottom };
      });
      let state = await inspect();
      assert(!state.overflow && state.adjacent && state.search >= 44, JSON.stringify(state));
      assert(state.cta <= state.top && state.shell <= state.top + 1, JSON.stringify({width,...state}));
      await page.screenshot({ path: `docs/home-entry-${width}.png` });
      await page.getByRole('button', { name: 'Rechazar', exact: true }).click();
      await page.waitForTimeout(100);
      state = await inspect();
      assert(state.app <= state.top, JSON.stringify({width,...state}));
      const links = await page.locator('.journal-topics a').evaluateAll(nodes => nodes.map(a=>a.getAttribute('href')));
      assert.deepEqual(links, ['/guias-supervivencia','/checklists','/comparativas','/herramientas-supervivencia']);
      await page.locator('.journal-hero-app a').scrollIntoViewIfNeeded();
      state = await inspect();
      assert(state.app <= state.top, JSON.stringify(state));
      await page.locator('.site-header > .portal-header-search').click();
      await page.waitForURL('**/buscar');
      await page.close();
    }
    console.log('Home entry: CTA, cookie dock, navigation, search and widths verified.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
