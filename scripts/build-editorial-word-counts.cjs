const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const originals = require('../src/content/editorial-articles.json');
const counts = Object.fromEntries(Object.entries(originals).map(([slug, html]) => {
  const dom = new JSDOM(html);
  dom.window.document.querySelectorAll('p,h2,h3,li,td,th').forEach(node => node.append(' '));
  const count = dom.window.document.body.textContent.split(/\s+/).filter(Boolean).length;
  dom.window.close();
  return [slug, count];
}));
fs.writeFileSync('src/content/editorial-original-word-counts.json', JSON.stringify(counts, null, 2) + '\n');
console.log(`Counted ${Object.keys(counts).length} original bodies without importing a DOM parser into the web bundle.`);
