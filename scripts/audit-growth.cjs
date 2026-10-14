const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const posts = require('./audit-article-covers.cjs');
const originals = require('../src/content/editorial-articles.json');
const { batchTwoRevisions } = require('../src/content/batch-two.ts');
const { everydayUpdates } = require('../src/content/everyday-survival.ts');
const { articleQualityRevisions } = require('../src/content/article-quality-revisions.ts');
const { distinctGuideRevisions } = require('../src/content/distinct-guide-revisions.ts');
const rows = posts.map(post => {
  const revised = batchTwoRevisions[post.slug] || everydayUpdates.has(post.slug) || articleQualityRevisions[post.slug] || distinctGuideRevisions[post.slug];
  const dom = new JSDOM(!revised && originals[post.slug] || '');
  const text = dom.window.document.body.textContent || post.sections.map(s => [s.heading, s.body, ...(s.bullets || [])].join(' ')).join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  const interactive = post.slug.startsWith('calculadora-');
  const classification = interactive || words >= 1200 ? 'MANTENER' : words < 500 ? 'REESCRIBIR POR COMPLETO' : 'MEJORAR';
  const row = { slug: post.slug, title: post.title, topic: post.category, classification, words, interactive,
    image: post.image, alt: post.imageAlt, imageExists: fs.existsSync('public' + post.image),
    metaDescription: post.excerpt, metaLength: post.excerpt.length, keywords: post.keywords,
    sources: post.sources || [], internalLinks: (post.relatedLinks || []).map(link => link.href),
    headings: dom.window.document.querySelectorAll('h2').length || post.sections.length,
    reason: interactive ? 'Evaluar función, accesibilidad y límites; no añadir relleno para alcanzar palabras.' : words >= 1200 ? 'Conservar profundidad y contrastar vigencia.' : words < 500 ? 'Falta desarrollo para resolver la tarea de forma completa.' : 'Añadir casos, práctica y respuestas específicas, conservando el núcleo útil.' };
  dom.window.close();
  return row;
});
const report = { checkedAt: new Date().toISOString(), note: 'Editorial baseline, not a ranking prediction. No Search Console query or traffic data available.', articles: rows };
fs.writeFileSync('docs/auditoria-crecimiento-inicial.json', JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync('docs/inventario-editorial.md', '# Inventario editorial inicial\n\nCada URL conserva su contenido hasta que se publique una revisión. Las herramientas no se evalúan solo por longitud.\n\n| Artículo | Tema | Palabras | Decisión | Meta |\n|---|---|---:|---|---:|\n' + rows.map(r => `| [${r.title.replaceAll('|', '/')}](https://www.modocrisissurvival.com/supervivencia/${r.slug}) | ${r.topic} | ${r.words} | ${r.classification} | ${r.metaLength} |`).join('\n') + '\n');
console.log(JSON.stringify({ articles: rows.length, classifications: Object.fromEntries(['MANTENER', 'MEJORAR', 'REESCRIBIR POR COMPLETO'].map(value => [value, rows.filter(row => row.classification === value).length])), longDescriptions: rows.filter(row => row.metaLength > 155).length, missingImages: rows.filter(row => !row.imageExists).length }));
