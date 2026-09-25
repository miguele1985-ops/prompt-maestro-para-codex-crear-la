const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const { chromium } = require('playwright');

(async () => {
  const origin = 'http://localhost:3000';
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.evaluate(() => { localStorage.setItem('mcs-cookie-consent','rejected'); });
    await page.reload();
    await page.evaluate(async () => {
      for (const image of document.images) { image.loading = 'eager'; }
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.src) }));
    console.log(name, result);
    if (result.overflow || result.broken.length) throw new Error('Visual validation failed');
    await page.screenshot({ path: `public/editorial-${name}.png`, fullPage: true });
  }
  await browser.close();
  const document = new JSDOM(await (await fetch(origin)).text()).window.document;
  document.querySelectorAll('script, link[rel="preload"], link[rel="modulepreload"], .cookie-banner, .cookie-reopen, .menu-button').forEach(element => element.remove());
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    let css = await (await fetch(new URL(link.href, origin))).text();
    const urls = [...css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)];
    for (const match of urls) {
      const response = await fetch(new URL(match[1], origin));
      if (response.ok) css = css.replace(match[0], `url(data:${response.headers.get('content-type')};base64,${Buffer.from(await response.arrayBuffer()).toString('base64')})`);
    }
    const style = document.createElement('style'); style.textContent = css; link.replaceWith(style);
  }
  document.querySelectorAll('source').forEach(source => source.remove());
  for (const image of document.images) {
    const response = await fetch(new URL(image.getAttribute('src'), origin));
    if (!response.ok) throw new Error(`Missing image ${image.src}`);
    image.src = `data:${response.headers.get('content-type')};base64,${Buffer.from(await response.arrayBuffer()).toString('base64')}`;
    image.removeAttribute('srcset'); image.loading = 'eager';
  }
  for (const link of document.querySelectorAll('a[href^="/"]')) link.href = 'https://www.modocrisissurvival.com' + link.getAttribute('href');
  const robots = document.createElement('meta'); robots.name='robots'; robots.content='noindex,follow'; document.head.append(robots);
  const style = document.createElement('style'); style.textContent='@media(max-width:1000px){.site-header{flex-wrap:wrap}.desktop-nav{display:flex!important;flex-wrap:wrap;width:100%}.desktop-nav a{font:12px Arial!important;padding:8px!important}}'; document.head.append(style);
  fs.writeFileSync('public/inicio-remoto.html', '<!doctype html>\n' + document.documentElement.outerHTML);
  console.log('Standalone preview exported with embedded images and styles.');
})();
