const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const mobile = process.argv[2] || 'C:/Users/Valeria/Documents/Codex/SV/mobile';
(async () => {
  const assets = [];
  for (const id of ['alto','silencio','mirar','espera','ven','reunirse','agua','comida','contar','telefono','linterna','no','ok','lento']) {
    const source = `assets/reference-photos/hand-signals/${id}.png`;
    const input = fs.readFileSync(path.join(mobile,source));
    const destination = `public/images/from-app/senal-${id}`;
    await sharp(input).resize({width:1086,withoutEnlargement:true}).jpeg({quality:90}).toFile(`${destination}.jpg`);
    for(const width of [360,576,960]) await sharp(input).resize({width}).webp({quality:88}).toFile(`${destination}-${width}.webp`);
    assets.push({id,source,destination:`/images/from-app/senal-${id}.jpg`,sha256:crypto.createHash('sha256').update(input).digest('hex')});
  }
  fs.writeFileSync('docs/mobile-signals-provenance.json',JSON.stringify({mobileReadOnly:true,assets,contentSource:'src/app/tools/hand-signals.jsx',review:`${assets.length} láminas inspeccionadas. Adaptación para práctica acordada, no protocolo de rescate ni lengua de signos. Se conservan completas, sin recortar. Procedencia facilitada por el responsable de la app; no se declara dominio público.`},null,2)+'\n');
  console.log(`${assets.length} láminas copiadas y optimizadas; originales intactos.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
