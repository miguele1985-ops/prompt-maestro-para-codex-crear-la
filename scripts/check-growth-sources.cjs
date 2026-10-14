const fs = require('node:fs');
require('./audit-article-covers.cjs');
const { growthArticles } = require('../src/content/growth-articles.ts');
const { growthRevisions } = require('../src/content/growth-revisions.ts');
(async () => {
  const sources = [...new Map([...growthArticles.flatMap(post => post.sources), ...Object.values(growthRevisions).flatMap(revision => revision.sources || [])].map(source => [source.url, source])).values()];
  const results = [];
  for (const source of sources) {
    try {
      const response = await fetch(source.url, { signal: AbortSignal.timeout(15000), method: 'GET' });
      results.push({ ...source, status: response.status, resolvedUrl: response.url });
      await response.body?.cancel();
    } catch (error) { results.push({ ...source, error: error.message }); }
  }
  const report = { checkedAt: new Date().toISOString(), sources: results, note: 'HTTP availability is not verification of every assertion. Some official providers reject automated requests.' };
  fs.writeFileSync('docs/growth-sources-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
