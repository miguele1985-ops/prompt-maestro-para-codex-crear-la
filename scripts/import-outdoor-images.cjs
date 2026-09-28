const sharp = require('sharp');
const fs = require('node:fs');
const assets = [
  ['C:/Users/Valeria/.codex/generated_images/01a035c4-c371-7aa1-ba2b-b2bfc2041af3/exec-dba79b00-b99f-4d79-b2c2-7d60a4df3f19.png','public/images/blog/caza-observacion-editorial'],
  ['C:/Users/Valeria/.codex/generated_images/01a035c4-c371-7aa1-ba2b-b2bfc2041af3/exec-c609c845-4f72-440a-9e4b-abaca8e6ad17.png','public/images/blog/pesca-ribera-editorial'],
  ['C:/Users/Valeria/Documents/Codex/SV/mobile/assets/hunting-tracks-ai/jabali-1.png','public/images/blog/lamina-huella-jabali-app'],
  ['C:/Users/Valeria/Documents/Codex/SV/mobile/assets/images/fishing-species/peces-espana-1.jpg','public/images/blog/lamina-peces-espana-app'],
];
(async()=>{
  for(const [input,output] of assets){
    await sharp(input).jpeg({quality:90}).toFile(output+'.jpg');
    for(const width of [240,360,576,960,1200])await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:85}).toFile(`${output}-${width}.webp`);
  }
  fs.writeFileSync('docs/outdoor-images-provenance.json',JSON.stringify(assets.map(([source,destination])=>({source,destination:destination+'.jpg'})),null,2));
})();
