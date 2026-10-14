const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const originals = require('../src/content/editorial-articles.json');
const index = {};
for (const [slug, html] of Object.entries(originals)) {
  const dom = new JSDOM(html);
  const heading = [...dom.window.document.querySelectorAll('h2')].find(node => /^(FAQ|Preguntas frecuentes)$/i.test(node.textContent.trim()));
  const questions = [];
  let question;
  for (let node = heading?.nextElementSibling; node && node.tagName !== 'H2' && node.tagName !== 'SECTION'; node = node.nextElementSibling) {
    if (node.tagName === 'H3') question = node.textContent.trim();
    else if (node.tagName === 'P' && question) { questions.push({ question, answer: node.textContent.trim() }); question = undefined; }
  }
  if (questions.length) index[slug] = questions;
  dom.window.close();
}
fs.writeFileSync('src/content/legacy-faq-index.json', JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ articlesWithVisibleFAQ: Object.keys(index).length }));
