const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const base = process.argv[2] || 'http://127.0.0.1:3023';
const canonical = 'https://www.modocrisissurvival.com';

(async () => {
  const xml = await (await fetch(base + '/sitemap.xml')).text();
  const sitemap = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const paths = [...sitemap.querySelectorAll('url > loc')].map(node => new URL(node.textContent).pathname);
  const links = new Map();
  const broken = [];
  for (const path of paths) {
    const document = new JSDOM(await (await fetch(base + path)).text()).window.document;
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');
      const url = new URL(href, canonical + path);
      if (url.origin !== canonical || !['https:', 'http:'].includes(url.protocol)) continue;
      const key = url.pathname + url.search;
      if (!links.has(key)) links.set(key, path);
    }
  }
  for (const [path, source] of links) {
    const response = await fetch(base + path);
    if (!response.ok) broken.push({ source, path, status: response.status });
  }
  const report = { checkedAt: new Date().toISOString(), origin: base, pages: paths.length, internalLinks: links.size, broken };
  fs.writeFileSync('docs/public-links-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  assert.deepEqual(broken, [], 'Broken internal links');
})().catch(error => { console.error(error); process.exitCode = 1; });
