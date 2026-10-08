const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const posts = require('./audit-article-covers.cjs');
const originals = require('../src/content/editorial-articles.json');
const { batchTwoRevisions } = require('../src/content/batch-two.ts');
const { everydayUpdates } = require('../src/content/everyday-survival.ts');
const { articleIndex } = require('../src/lib/editorial.ts');
const { articleQualityRevisions } = require('../src/content/article-quality-revisions.ts');
const { distinctGuideRevisions } = require('../src/content/distinct-guide-revisions.ts');

const rows = posts.map(post => {
  const original = !batchTwoRevisions[post.slug] && !everydayUpdates.has(post.slug) && !articleQualityRevisions[post.slug] && !distinctGuideRevisions[post.slug] && originals[post.slug];
  const text = original
    ? new JSDOM(original).window.document.body.textContent
    : post.sections.map(section => [section.heading, section.body, ...(section.bullets || [])].join(' ')).join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return { slug: post.slug, words, interactive: post.slug.startsWith('calculadora-'), sources: (post.sources ?? articleIndex[post.slug]?.sources ?? []).length };
}).sort((a, b) => a.words - b.words);

// This is an editorial triage signal, never a Google acceptance threshold.
const briefGuides = rows.filter(row => !row.interactive && row.words < 250);
const report = {
  checkedAt: new Date().toISOString(),
  note: 'Content-data audit; excludes common navigation, commerce and interactive UI. Length alone does not determine quality or AdSense acceptance.',
  totalArticles: rows.length,
  briefGuides,
  withoutExplicitSources: rows.filter(row => row.sources === 0).map(row => row.slug),
  articles: rows,
};
fs.writeFileSync('docs/editorial-quality-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({totalArticles:rows.length,briefGuides:briefGuides.length,withoutExplicitSources:report.withoutExplicitSources.length}));
