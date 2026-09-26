const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const mobile = path.resolve(process.argv[2] || 'C:/Users/Valeria/Documents/Codex/SV/mobile');
const selected = [
  ['ortiga-mayor', 'plantas_comestibles/ortiga_mayor_custom_1.jpg'],
  ['diente-de-leon', 'plantas_comestibles/diente_leon_custom_1.jpg'],
  ['llanten-mayor', 'plantas_comestibles/llanten_mayor_custom_1.jpg'],
];
const digest = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
(async () => {
  const target = path.join(root, 'public/images/from-app');
  fs.mkdirSync(target, { recursive: true });
  const assets = [];
  for (const [id, relative] of selected) {
    const source = path.join(mobile, 'assets/species', relative);
    const original = fs.readFileSync(source);
    await sharp(original).rotate().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(path.join(target, `${id}.jpg`));
    for (const width of [360, 576, 960]) {
      await sharp(original).rotate().resize({ width }).webp({ quality: 84 }).toFile(path.join(target, `${id}-${width}.webp`));
    }
    assets.push({ id, source: `assets/species/${relative}`, sha256: digest(original), destination: `/images/from-app/${id}.jpg`, credit: 'Material incluido en la app Modo Crisis Survival y facilitado por su responsable para esta web. No se declara dominio público ni licencia Creative Commons.' });
  }
  // Parse only literal metadata; do not execute app modules or load their dependencies.
  const source = fs.readFileSync(path.join(mobile, 'src/data/knotsData.js'), 'utf8');
  const ast = ts.createSourceFile('knotsData.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const knots = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'knot' && ts.isObjectLiteralExpression(node.arguments[0])) {
      const data = {};
      for (const p of node.arguments[0].properties) {
        if (ts.isPropertyAssignment(p) && ['id', 'name', 'category'].includes(p.name.getText(ast)) && ts.isStringLiteral(p.initializer)) data[p.name.getText(ast)] = p.initializer.text;
      }
      knots.push(data);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/mobile-field-provenance.json'), JSON.stringify({ importedAt: '2026-09-26', mobileReadOnly: true, assets, knotsSource: { path: 'src/data/knotsData.js', sha256: digest(source), entries: knots }, excluded: ['Láminas de knots-ai con discordancias de nombre, pasos o usos técnicos', 'Fichas con tratamientos o dosificaciones medicinales', 'Recomendaciones de consumo de especies basadas en una imagen'] }, null, 2) + '\n');
  console.log(`Imported ${assets.length} selected images; inventoried ${knots.length} knots. Mobile files unchanged.`);
})();
