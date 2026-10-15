const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = process.argv[2] || 'public/images/blog';
  const output = process.argv[3] || 'tmp/photo-review';
  const files = fs.readdirSync(root).filter(file => /\.(jpg|png|webp)$/i.test(file) && !/-\d+\.webp$/.test(file));
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(`${output}/index.json`, JSON.stringify(files, null, 2));
  for (let start = 0; start < files.length; start += 30) {
    const composite = [];
    for (let i = start; i < Math.min(start + 30, files.length); i++) {
      const image = await sharp(path.join(root, files[i])).resize(240, 150, { fit: 'contain', background: '#ffffff' }).toBuffer();
      const label = Buffer.from(`<svg width="240" height="28"><rect width="240" height="28" fill="white"/><text x="8" y="20" font-size="17">${i}: ${files[i].slice(0, 20)}</text></svg>`);
      const top = Math.floor((i - start) / 5) * 180;
      const left = ((i - start) % 5) * 240;
      composite.push({ input: image, left, top }, { input: label, left, top: top + 150 });
    }
    await sharp({ create: { width: 1200, height: 1080, channels: 3, background: '#ffffff' } }).composite(composite).png().toFile(`${output}/sheet-${start}.png`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
