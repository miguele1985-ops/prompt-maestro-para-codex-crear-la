const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
const sourceFiles = files(path.join(root, '.codex-remote-attachments')).filter(file => /ARTICULOS_\d+_\d+.*\.html$/.test(file));
const blog = fs.readFileSync(path.join(root, 'src/content/blog.ts'), 'utf8');
const entries = [...blog.matchAll(/slug: "([^"]+)",\s+title: "([^"]+)"/g)].map(m => ({ slug: m[1], title: m[2] }));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const allowed = new Set(['P','H2','H3','H4','UL','OL','LI','STRONG','EM','B','A','DIV','TABLE','THEAD','TBODY','TR','TH','TD','BR','SECTION','DETAILS','SUMMARY']);
const output = {};
const index = {};
function cleanArticle(article, entry, file) {
    article.querySelectorAll('.meta, .codex, .eyebrow, h1, script, style, iframe, form').forEach(e => e.remove());
    for (const p of article.querySelectorAll('p')) {
      if (/^(SEO:|Categoría:|Texto opcional para incorporar|No se han generado identificadores)/.test(p.textContent.trim())) p.remove();
    }
    for (const element of [...article.querySelectorAll('*')]) {
      if (!allowed.has(element.tagName)) { element.replaceWith(...element.childNodes); continue; }
      const href = element.getAttribute('href');
      const className = element.getAttribute('class');
      for (const attr of [...element.attributes]) element.removeAttribute(attr.name);
      if (['table-wrap','sources','faq','box','warn'].includes(className)) element.className = className;
      if (element.tagName === 'A' && href) {
        let url;
        try { url = new URL(href, 'https://www.modocrisissurvival.com'); } catch { continue; }
        if (!['https:', 'http:'].includes(url.protocol)) continue;
        if (['www.modocrisissurvival.com','modocrisissurvival.com'].includes(url.hostname)) element.setAttribute('href',url.pathname + url.search + url.hash);
        else { element.setAttribute('href',url.href); element.setAttribute('rel','noopener noreferrer'); }
      }
    }
    const toc = [...article.querySelectorAll('h2')].map((heading, i) => {
      const id = `seccion-${i + 1}`;
      heading.id = id;
      return { id, title: heading.textContent.trim() };
    });
    const words = article.textContent.trim().split(/\s+/).length;
    output[entry.slug] = article.innerHTML.trim();
    index[entry.slug] = { toc, words, readingMinutes: Math.max(2, Math.ceil(words / 200)), summary: article.querySelector('p')?.textContent.trim() || '', sourceFile: path.basename(file), sources: [...article.querySelectorAll('a[href^="http"]')].map(a=>({title:a.textContent.trim(),url:a.href})).filter((s,i,list)=>list.findIndex(t=>t.url===s.url)===i) };
}
for (const file of sourceFiles) {
  const document = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
  for (const article of document.querySelectorAll('article')) {
    const title = article.querySelector('h1')?.textContent.trim();
    const entry = entries.find(e => normalize(e.title) === normalize(title || ''));
    if (!entry) throw new Error(`No matching article: ${title}`);
    cleanArticle(article, entry, file);
  }
}
if (Object.keys(output).length !== 30) throw new Error(`Expected 30 articles, got ${Object.keys(output).length}`);
const corpusFile = files(path.join(root,'.codex-remote-attachments')).find(file => file.includes('f37824c8-') && /1-Contenidos_.*\.html$/.test(file));
const corpus = new JSDOM(fs.readFileSync(corpusFile,'utf8')).window.document;
const corpusMap = {
  'pieza-2': 'apagon-general-espana-pasos',
  'pieza-3': 'mochila-emergencia-72-horas-peso-realista',
  'pieza-4': 'agua-sin-electricidad-metodos-limites',
  'pieza-5': 'plantas-comestibles-y-peligrosas-que-se-pueden-confundir',
  'pieza-6': 'lluvia-autoconsumo-generadores-normativa',
  'pieza-8': 'gps-movil-sin-internet-mapas-offline',
  'pieza-9': 'bateria-10000-mah-cargas-reales',
  'pieza-10': 'peso-reserva-familiar-emergencias',
  'pieza-11': 'filtros-agua-portatiles-comparativa-riesgo',
};
for (const [id,slug] of Object.entries(corpusMap)) {
  const container=corpus.createElement('article');
  let node=corpus.getElementById(id).nextElementSibling;
  while(node && node.tagName!=='HR' && node.tagName!=='H1') { container.append(node.cloneNode(true)); node=node.nextElementSibling; }
  // Preserve the overlapping batch article too, without publishing a duplicate URL.
  if(output[slug]) { const appendix=corpus.createElement('section'); appendix.innerHTML=output[slug]; container.append(appendix); }
  cleanArticle(container,{slug},corpusFile);
}
fs.writeFileSync(path.join(root,'src/content/editorial-articles.json'), JSON.stringify(output, null, 2) + '\n');
fs.writeFileSync(path.join(root,'src/content/editorial-index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`Imported ${Object.keys(output).length} complete articles with tables, FAQ, sources and navigation.`);
