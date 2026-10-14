const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const origin = process.argv[2] || 'https://www.modocrisissurvival.com';
const examples = [
  '/aplicacion-supervivencia-offline', '/aplicacion-supervivencia-offline/herramientas',
  '/aviso-legal', '/calendario-lunar', '/catalogo/articulos/2', '/catalogo/articulos/3',
  '/catalogo/guias/2', '/catalogo/guias/3', '/catalogo/guias/4', '/catalogo/guias/5',
];
async function request(path) {
  const start = Date.now();
  const response = await fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text(), milliseconds: Date.now() - start };
}

(async () => {
  const robots = await request('/robots.txt');
  const sitemap = await request('/sitemap.xml');
  if (sitemap.response.status !== 200) throw new Error('Sitemap HTTP ' + sitemap.response.status);
  const xml = new JSDOM(sitemap.html, { contentType: 'text/xml' });
  const urls = [...xml.window.document.querySelectorAll('url > loc')].map(node => node.textContent);
  xml.window.close();
  const paths = [...new Set(['/', ...urls.map(url => new URL(url).pathname), ...examples])];
  const rows = [];
  const graph = new Map();
  for (const path of paths) {
    try {
      const { response, html, milliseconds } = await request(path);
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const links = [...doc.querySelectorAll('a[href]')].map(node => {
        try { const url = new URL(node.getAttribute('href'), origin + path); return url.origin === origin ? url.pathname : null; }
        catch { return null; }
      }).filter(Boolean);
      graph.set(path, links);
      rows.push({ path, status: response.status, milliseconds, location: response.headers.get('location'),
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
        robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
        robotsHeader: response.headers.get('x-robots-tag'),
        title: doc.querySelector('title')?.textContent || null, h1: doc.querySelectorAll('h1').length,
        bytes: Buffer.byteLength(html), contentType: response.headers.get('content-type'),
        challenge: /cf-mitigated|Just a moment/i.test(response.headers.get('cf-mitigated') || doc.title),
      });
      dom.window.close();
    } catch (error) { rows.push({ path, error: error.message }); }
    if (rows.length % 40 === 0) console.log('Checked ' + rows.length + '/' + paths.length);
  }
  const depth = new Map([['/', 0]]);
  const queue = ['/'];
  while (queue.length) {
    const path = queue.shift();
    for (const link of graph.get(path) || []) {
      if (!depth.has(link)) { depth.set(link, depth.get(path) + 1); queue.push(link); }
    }
  }
  for (const row of rows) row.linkDepth = depth.get(row.path) ?? null;
  const sitemapPaths = new Set(urls.map(url => new URL(url).pathname));
  const issues = rows.filter(row => sitemapPaths.has(row.path) && (
    row.error || row.status !== 200 || row.canonical !== origin + (row.path === '/' ? '/' : row.path) ||
    /noindex/i.test((row.robots || '') + (row.robotsHeader || '')) || row.h1 !== 1 || row.challenge || row.linkDepth === null
  ));
  const report = { checkedAt: new Date().toISOString(), origin, note: 'Public HTTP audit, not Google URL Inspection or a verified Googlebot request.',
    sitemapURLs: urls.length, duplicateSitemapURLs: urls.length - new Set(urls).size,
    robots: { status: robots.response.status, text: robots.html }, examples: rows.filter(row => examples.includes(row.path)),
    issues, routes: rows,
  };
  fs.writeFileSync('docs/published-indexing-audit.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ sitemapURLs: report.sitemapURLs, issues, examples: report.examples }));
})().catch(error => { console.error(error); process.exitCode = 1; });
