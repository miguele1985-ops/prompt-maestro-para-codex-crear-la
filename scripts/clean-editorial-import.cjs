const fs = require('node:fs');
const file = 'src/content/editorial-articles.json';
const articles = JSON.parse(fs.readFileSync(file, 'utf8'));
const editorialNotes = [
  ' Codex no debe publicar una cifra inventada como “cada seis meses” presentándola como norma oficial.',
  ' Son recomendaciones de seguridad útiles, pero Codex no debe convertir ese folleto en una obligación estatal idéntica para toda España.',
];
let removed = 0;
let corrected = 0;
for (const slug of Object.keys(articles)) {
  for (const note of editorialNotes) {
    if (articles[slug].includes(note)) {
      articles[slug] = articles[slug].replace(note, '');
      removed++;
    }
  }
}
const heatSlug = 'verano-de-2026-el-mas-calido-de-la-serie-en-espana';
const oldCount = 'AEMET contabilizó 61 días totales bajo condiciones de ola de calor en Península y Baleares, repartidos en tres olas estivales: 20–27 de junio (8 días), 2–24 de julio (23) y 28 de julio–20 de agosto (24), con otros días contabilizados conforme a su metodología; Canarias tuvo una ola propia de cinco días. En septiembre hubo además otro episodio ya fuera del verano meteorológico.';
const verifiedCount = 'AEMET contabilizó 61 días bajo condiciones de ola de calor en Península y Baleares durante 2026: tres olas estivales sumaron 55 días —20–27 de junio (8), 2–24 de julio (23) y 28 de julio–20 de agosto (24)— y un cuarto episodio de septiembre añadió otros 6. Ese cuarto episodio queda fuera del verano meteorológico. Canarias tuvo una ola propia de cinco días, que no se suma a ese cómputo de Península y Baleares.';
if (articles[heatSlug]?.includes(oldCount)) {
  articles[heatSlug] = articles[heatSlug].replace(oldCount, verifiedCount);
  corrected++;
}
if (removed || corrected) fs.writeFileSync(file, JSON.stringify(articles, null, 2) + '\n');
console.log(JSON.stringify({ removedEditorialInstructions: removed, correctedSourceCounts: corrected }));
