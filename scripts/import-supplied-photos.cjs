const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = process.argv[2];
if (!source) throw new Error('Provide the image pack directory');
const data = fs.readFileSync('src/content/supplied-photos.ts', 'utf8');
const names = [...data.matchAll(/file: "([^"]+)"/g)].map(m => m[1]);
(async () => {
  for (const name of names) {
    const input = path.join(source, `${name}.jpg`);
    const output = `public/images/blog/aportada-${name}`;
    fs.copyFileSync(input, `${output}.jpg`);
    for (const width of [240, 360, 576, 960, 1200]) {
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${output}-${width}.webp`);
    }
  }
  console.log(`Imported ${names.length} images with responsive variants`);
})();
