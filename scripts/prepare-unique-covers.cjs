const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const generated = {"psicologia":"683048b2-229b-4e9f-bce2-6462983ffe73","ciberataque":"fa787731-beb6-40d7-8817-c8e9517f2b4a","pagos":"84b54c0e-d82b-47df-912c-b93f356ebc4a","confinamiento":"e82584b4-ebed-4fcd-8253-ce49510a5501","apagon-historico":"920e5aa6-6633-4192-a6d7-d382ebd9e611","hogares-preparados":"8a1de8b5-d951-4e9a-bf43-841404f1bdcb","mitos-cine":"29b8806a-1c8d-4abd-95ea-409cb25eff70","tormenta-solar":"6e137576-1d17-4db5-b71a-de6134733922","generador-compra":"e78fb60f-3491-4849-ad0c-e62a9166ff54","generador-normativa":"9e813302-3dee-4d51-b6ae-74b29446b968"};
const generatedRoot = path.join(process.env.USERPROFILE, '.codex/generated_images/01a035c4-c371-7aa1-ba2b-b2bfc2041af3');
const suppliedRoot = path.join(process.env.USERPROFILE, 'Documents/Codex/imagenes web/Modo_Crisis_Survival_30_imagenes_web/Modo_Crisis_Survival');
const sources = Object.entries(generated).map(([id, file]) => [id, path.join(generatedRoot, `exec-${file}.png`)]);
sources.push(...Object.entries({'ropa-calzado':'28-ropa-calzado-supervivencia.jpg','apagon-casa':'02-apagon-casa.jpg','refugio-entorno':'10-refugio-supervivencia.jpg','seguridad-hogar':'25-seguridad-hogar.jpg'}).map(([id,file])=>[id,path.join(suppliedRoot,file)]));
(async () => {
  for (const [id, source] of sources) {
    const dest = `public/images/blog/cover-${id}.jpg`;
    if (!fs.existsSync(dest)) await sharp(source).resize({width:1536,withoutEnlargement:true}).jpeg({quality:88}).toFile(dest);
  }
  const eclipse = 'public/images/blog/cover-eclipse-nasa.jpg';
  if (!fs.existsSync(eclipse)) {
    const response = await fetch('https://upload.wikimedia.org/wikipedia/commons/e/ea/2017_Total_Solar_Eclipse_%28NHQ201708210100%29_-_square_crop.jpg');
    if (!response.ok) throw new Error(`Eclipse image: ${response.status}`);
    await sharp(Buffer.from(await response.arrayBuffer())).resize({width:1536}).jpeg({quality:88}).toFile(eclipse);
  }
  const covers = require('../src/content/article-covers.json');
  for (const {image} of Object.values(covers)) {
    for (const width of [240,360,576,960,1200]) {
      const dest = `public${image.replace('.jpg',`-${width}.webp`)}`;
      if (!fs.existsSync(dest)) await sharp(`public${image}`).resize({width}).webp({quality:82}).toFile(dest);
    }
  }
  console.log(`Prepared ${sources.length + 1} imported covers and responsive variants for ${Object.keys(covers).length} replacements.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
