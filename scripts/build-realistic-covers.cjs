const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const crypto = require('node:crypto');
const os = require('node:os');
const blogPosts = require('./audit-article-covers.cjs');
const selected = require('../docs/realistic-cover-plan.json');
const generated = require('../docs/generated-realistic-photos.json').map(item => ({
  ...item,
  path: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'generated_images/01a035c4-c371-7aa1-ba2b-b2bfc2041af3', item.path),
}));
const alts = require('../docs/generated-photo-alts.json');
const output = 'public/images/editorial/realistic';
const widths = [240, 360, 576, 960, 1200];

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const credits = {};
  const hashes = new Set();
  const records = [];
  const all = [
    ...selected.map(([slug, file, alt]) => ({ slug, source: `public/images/blog/${file}`, alt, supplied: file.startsWith('aportada-'), nasa: file === 'cover-eclipse-nasa.jpg' })),
    ...generated.map(item => ({ slug: item.slug, source: item.path, alt: alts[item.slug], prompt: item.prompt })),
  ];
  for (const item of all) {
    if (!blogPosts.some(post => post.slug === item.slug)) throw new Error(`Unknown article: ${item.slug}`);
    if (credits[item.slug]) throw new Error(`Repeated selection: ${item.slug}`);
    if (!item.alt) throw new Error(`Missing descriptive alt: ${item.slug}`);
    const target = `${output}/${item.slug}.webp`;
    const source = fs.existsSync(item.source) ? item.source : target;
    const buffer = await sharp(source).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    if (hashes.has(hash)) throw new Error(`Repeated photograph: ${item.slug}`);
    hashes.add(hash);
    fs.writeFileSync(target, buffer);
    for (const width of widths) await sharp(buffer).resize({ width }).webp({ quality: 78, effort: 5 }).toFile(`${output}/${item.slug}-${width}.webp`);
    const image = `/images/editorial/realistic/${item.slug}.webp`;
    const label = item.nasa ? 'Fotografía de archivo, dominio público' : item.prompt ? 'Imagen ilustrativa generada con IA' : 'Imagen ilustrativa del archivo del proyecto';
    credits[item.slug] = {
      image,
      imageAlt: `${item.alt}. ${label}.`,
      imageCredit: {
        author: item.nasa ? 'NASA / Aubrey Gemignani, eclipse de 2017' : 'Modo Crisis Survival',
        license: label,
        source: image,
        licenseUrl: '/politica-editorial#imagenes',
      },
    };
    records.push({ slug: item.slug, image, origin: item.nasa ? 'NASA archive, 2017' : item.prompt ? 'AI illustrative photography' : 'Existing project archive, not documentary photography', previousSource: item.prompt ? undefined : item.source.replace('public', ''), prompt: item.prompt, sha256: hash, bytes: buffer.length });
  }
  const missing = blogPosts.filter(post => !post.slug.startsWith('calculadora-') && !credits[post.slug]);
  if (missing.length) throw new Error(`Missing photographs: ${missing.map(post => post.slug).join(', ')}`);
  fs.writeFileSync('src/content/realistic-cover-credits.json', JSON.stringify(credits, null, 2) + '\n');
  fs.writeFileSync('docs/realistic-photo-provenance.json', JSON.stringify(records, null, 2) + '\n');
  console.log(JSON.stringify({ photographs: records.length, uniqueHashes: hashes.size, responsiveWidths: widths, totalBaseBytes: records.reduce((sum, item) => sum + item.bytes, 0) }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
