const fs = require('node:fs');
const sharp = require('sharp');
const posts = require('./audit-article-covers.cjs');
const { portalTopic } = require('../src/content/portal.ts');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const lines = (value, limit) => {
  const rows = [''];
  for (const word of value.split(/\s+/)) {
    if ((rows.at(-1) + ' ' + word).trim().length > limit && rows.at(-1)) rows.push(word);
    else rows[rows.length - 1] = (rows.at(-1) + ' ' + word).trim();
  }
  return rows;
};
const visuals = {
  nudos: '<path d="M775 300c70-80 220 100 280 10M790 390c40-80 220 40 255-30M860 310c-60 130 140 130 120-5" fill="none" stroke="#e7b372" stroke-width="18" stroke-linecap="round"/>',
  comunicacion: '<rect x="790" y="290" width="240" height="150" rx="10" fill="#739383"/><path d="m830 290 90-80" stroke="#dce7d8" stroke-width="7"/><circle cx="850" cy="360" r="30" fill="#dce7d8"/><path d="M920 325h75m-75 25h75m-75 25h75" stroke="#1d3428" stroke-width="8"/>',
  vehiculo: '<path d="m795 350 45-65h120l45 65v60H795Z" fill="#96b5a2"/><path d="M850 300h100l24 45H825Z" fill="#1d3428"/><circle cx="830" cy="410" r="25" fill="#dce7d8"/><circle cx="970" cy="410" r="25" fill="#dce7d8"/>',
  refugio: '<path d="m775 320 130-110 140 110" stroke="#e7b372" stroke-width="12" fill="none"/><path d="M805 315v140h210V315" fill="#95b5a1"/><rect x="875" y="360" width="65" height="95" fill="#1d3428"/>',
  agua: '<path d="M910 210Q835 330 835 365A75 75 0 0 0 985 365Q985 330 910 210Z" fill="#5caabf"/><path d="M870 365q-8 30 20 45" stroke="#fff" stroke-width="8" fill="none"/>',
  orientacion: '<circle cx="910" cy="340" r="115" fill="#314d3b" stroke="#abbcb0" stroke-width="3"/><path d="m910 230 35 145-35-22-35 22Z" fill="#ee8e4f"/><path d="m910 450-35-97 35 22 35-22Z" fill="#e9efdd"/><text x="910" y="205" text-anchor="middle" fill="#fff" font-size="24">N</text>',
  energia: '<rect x="790" y="280" width="210" height="115" rx="12" fill="none" stroke="#dce7d8" stroke-width="8"/><rect x="1005" y="315" width="18" height="45" fill="#dce7d8"/><rect x="810" y="300" width="75" height="75" fill="#dcb14a"/><path d="m925 300-30 50h25l-15 35 45-50h-28Z" fill="#ec9255"/>',
  primeros: '<rect x="810" y="250" width="200" height="180" rx="10" fill="#dce7d8"/><path d="M865 250v-35h90v35" stroke="#dce7d8" stroke-width="10" fill="none"/><path d="M910 295v90m-45-45h90" stroke="#56738b" stroke-width="28"/>',
  familia: '<circle cx="865" cy="285" r="26" fill="#eab56e"/><circle cx="950" cy="305" r="23" fill="#bdd3bb"/><path d="M825 400v-55q40-45 80 0v55m10 0v-45q35-35 70 0v45" fill="none" stroke="#dce7d8" stroke-width="18"/>',
  naturaleza: '<path d="m740 425 110-195 75 140 55-110 115 165Z" fill="#95b5a1"/><path d="m850 230-28 50 28-12 23 13Z" fill="#edf1e6"/><path d="m915 420 24-60 45 35" stroke="#ed974f" stroke-width="8" fill="none"/>',
  equipo: '<rect x="835" y="250" width="150" height="200" rx="35" fill="#5f8575" stroke="#c9dccd" stroke-width="6"/><path d="M880 250v-30h60v30" stroke="#c9dccd" stroke-width="8" fill="none"/><rect x="860" y="355" width="100" height="65" rx="8" fill="#e7b372"/><path d="M850 300h120" stroke="#c9dccd" stroke-width="6"/>',
};
(async () => {
  fs.mkdirSync('public/images/editorial', { recursive: true });
  const credits = {};
  for (const post of posts) {
    const topic = portalTopic(post.slug);
    const visual = visuals[topic === 'primeros-auxilios' ? 'primeros' : topic] || visuals.equipo;
    const title = lines(post.title, 25).slice(0, 6);
    const headings = post.sections.slice(0, 3).map(section => section.heading).filter(Boolean);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><title>${escape(post.title)}</title><desc>Diagrama editorial original, no representación de un incidente ni identificación de especies.</desc><rect width="1200" height="750" fill="#1d3428"/><path d="M700 0v750" stroke="#77948a" stroke-width="2"/><text x="60" y="67" fill="#eca56a" font-family="Arial" font-size="18">MODO CRISIS SURVIVAL · CUADERNO DE CAMPO</text>${title.map((text, i) => `<text x="60" y="${155 + i * 62}" fill="#f2f5e9" font-family="Arial" font-weight="700" font-size="46">${escape(text)}</text>`).join('')}${visual}<path d="M765 510h290" stroke="#e6a060" stroke-width="3"/><text x="910" y="550" text-anchor="middle" fill="#f2f5e9" font-family="Arial" font-size="20">PREPARAR · COMPROBAR · REVISAR</text><text x="60" y="675" fill="#c7d4c9" font-family="Arial" font-size="18">${escape(headings[0] || post.keywords[0] || topic)}</text><text x="60" y="710" fill="#c7d4c9" font-family="Arial" font-size="16">Diagrama propio · CC BY 4.0 · ${escape(post.slug.slice(0, 65))}</text></svg>`;
    const base = `public/images/editorial/${post.slug}`;
    fs.writeFileSync(base + '.svg', svg);
    await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(base + '.webp');
    for (const width of [240, 360, 576, 960, 1200]) await sharp(Buffer.from(svg)).resize(width).webp({ quality: 82 }).toFile(base + `-${width}.webp`);
    credits[post.slug] = { image: `/images/editorial/${post.slug}.webp`, imageAlt: `Diagrama editorial de ${post.title}. No representa una situación real.`, imageCredit: { author: 'Modo Crisis Survival', license: 'CC BY 4.0', source: `/images/editorial/${post.slug}.svg`, licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' } };
  }
  fs.writeFileSync('src/content/growth-image-credits.json', JSON.stringify(credits, null, 2) + '\n');
  console.log(JSON.stringify({ originalDiagrams: posts.length, responsiveWidths: [240, 360, 576, 960, 1200] }));
})().catch(error => { console.error(error); process.exitCode = 1; });
