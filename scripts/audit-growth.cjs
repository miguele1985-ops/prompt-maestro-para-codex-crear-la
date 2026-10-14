const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const posts = require('./audit-article-covers.cjs');
const current = process.argv.includes('--current');
const { growthRevisions } = require('../src/content/growth-revisions.ts');
const { articleDescription } = require('../src/lib/editorial.ts');
const originals = require('../src/content/editorial-articles.json');
const { articleWordCount, usesOriginalBody } = require('../src/lib/article-body.ts');
const rows = posts.map(post => {
  const revised = !usesOriginalBody(post.slug);
  const dom = new JSDOM(!revised && originals[post.slug] || '');
  const text = dom.window.document.body.textContent || [...post.sections.map(s => [s.heading, s.body, ...(s.bullets || []), ...(s.steps || []), ...(s.table?.rows.flat() || [])].join(' ')), ...(post.faq || []).map(item => `${item.question} ${item.answer}`)].join(' ');
  const words = current ? articleWordCount(post) : text.split(/\s+/).filter(Boolean).length;
  const interactive = post.slug.startsWith('calculadora-');
  const classification = interactive || words >= 1200 ? 'MANTENER' : words < 500 ? 'REESCRIBIR POR COMPLETO' : 'MEJORAR';
  const row = { slug: post.slug, title: post.title, topic: post.category, classification, words, interactive,
    status: growthRevisions[post.slug] ? 'AMPLIADO' : post.publishedAt === '2026-10-14' ? 'NUEVO' : classification === 'MANTENER' ? 'CONSERVADO' : 'PENDIENTE DE REVISION',
    image: post.image, alt: post.imageAlt, imageExists: fs.existsSync('public' + post.image),
    metaDescription: current ? articleDescription(post) : post.excerpt, metaLength: current ? articleDescription(post).length : post.excerpt.length, keywords: post.keywords,
    sources: post.sources || [], sourceLinksInBody: [...dom.window.document.querySelectorAll('a[href^="https://"]')].map(node => ({ title: node.textContent, url: node.href })),
    internalLinks: [...new Set([...(post.relatedLinks || []).map(link => link.href), ...post.sections.flatMap(section => section.links || []).map(link => link.href).filter(href => href.startsWith('/')), ...[...dom.window.document.querySelectorAll('a[href^="/"]')].map(node => node.getAttribute('href'))])],
    bodyImages: [...dom.window.document.querySelectorAll('img')].map(node => ({ image: node.getAttribute('src'), alt: node.getAttribute('alt') })),
    headings: dom.window.document.querySelectorAll('h2').length + (dom.window.document.querySelector('h2') ? growthRevisions[post.slug]?.sections.length || 0 : post.sections.length),
    reason: interactive ? 'Evaluar función, accesibilidad y límites; no añadir relleno para alcanzar palabras.' : words >= 1200 ? 'Conservar profundidad y contrastar vigencia.' : words < 500 ? 'Falta desarrollo para resolver la tarea de forma completa.' : 'Añadir casos, práctica y respuestas específicas, conservando el núcleo útil.' };
  dom.window.close();
  return row;
});
const report = { checkedAt: new Date().toISOString(), note: 'Length is a triage signal, not a quality certification or ranking prediction. Source verification, originality and practical usefulness also need review. No Search Console query or traffic data available.', articles: rows };
fs.writeFileSync(`docs/auditoria-crecimiento-${current ? 'actual' : 'inicial'}.json`, JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(current ? 'docs/inventario-editorial-actual.md' : 'docs/inventario-editorial.md', '# Inventario editorial\n\nCada URL conserva su contenido hasta que se publique una revisión. Las herramientas no se evalúan solo por longitud.\n\n| Artículo | Tema | Palabras | Decisión | Estado | Meta |\n|---|---|---:|---|---|---:|\n' + rows.map(r => `| [${r.title.replaceAll('|', '/')}](https://www.modocrisissurvival.com/supervivencia/${r.slug}) | ${r.topic} | ${r.words} | ${r.classification} | ${r.status} | ${r.metaLength} |`).join('\n') + '\n');
console.log(JSON.stringify({ articles: rows.length, classifications: Object.fromEntries(['MANTENER', 'MEJORAR', 'REESCRIBIR POR COMPLETO'].map(value => [value, rows.filter(row => row.classification === value).length])), longDescriptions: rows.filter(row => row.metaLength > 155).length, missingImages: rows.filter(row => !row.imageExists).length }));
