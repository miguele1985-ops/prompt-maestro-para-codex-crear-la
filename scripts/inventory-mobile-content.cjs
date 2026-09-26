const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const sharp = require('sharp');
const base = process.argv[2] || 'C:/Users/Valeria/Documents/Codex/SV/mobile';
const files = [];
function walk(relative) {
  for(const entry of fs.readdirSync(path.join(base,relative),{withFileTypes:true})) {
    if(entry.isSymbolicLink()) continue;
    const name = `${relative}/${entry.name}`;
    if(entry.isDirectory()) walk(name);
    else files.push(name);
  }
}
walk('src'); walk('assets');
(async()=>{
  const inventory=[];
  for(const file of files) {
    const buffer=fs.readFileSync(path.join(base,file));
    const entry={file,bytes:buffer.length,sha256:crypto.createHash('sha256').update(buffer).digest('hex')};
    if(/\.(?:png|jpg|jpeg|webp|avif)$/i.test(file)) {
      try {const meta=await sharp(buffer).metadata();entry.image={width:meta.width,height:meta.height,format:meta.format};}catch{entry.imageError=true;}
    }
    if(/^src\/(data|app\/tools|features)\//.test(file)&&/\.(?:jsx?|tsx?|json)$/.test(file)&&!/admin|licensing|storage|service|test/i.test(file)) {
      const ast=ts.createSourceFile(file,buffer.toString('utf8'),ts.ScriptTarget.Latest,true);
      const declarations=[];
      function visit(node) {if(ts.isVariableDeclaration(node)&&node.initializer&&(ts.isArrayLiteralExpression(node.initializer)||ts.isObjectLiteralExpression(node.initializer))) declarations.push({name:node.name.getText(ast),entries:ts.isArrayLiteralExpression(node.initializer)?node.initializer.elements.length:node.initializer.properties.length});ts.forEachChild(node,visit);}
      visit(ast);entry.collections=declarations;
    }
    inventory.push(entry);
  }
  const report={scope:'Inventario de todos los archivos en src y assets; no se ejecuta la app ni se leen datos personales, .env o dependencias. Metadatos, no validación editorial completa.',mobileReadOnly:true,files:inventory.length,images:inventory.filter(f=>f.image).length,inventory};
  fs.writeFileSync('docs/mobile-complete-inventory.json',JSON.stringify(report,null,2)+'\n');
  const ids=['ven','izquierda','derecha','reunirse','agua','comida','contar','telefono','linterna','no','ok','lento'];
  const thumbs=[];
  for(let i=0;i<ids.length;i++) thumbs.push({input:await sharp(path.join(base,`assets/reference-photos/hand-signals/${ids[i]}.png`)).resize({width:272,height:362,fit:'contain',background:'#ffffff'}).toBuffer(),left:(i%4)*272,top:Math.floor(i/4)*362});
  await sharp({create:{width:1088,height:1086,channels:3,background:'#ffffff'}}).composite(thumbs).jpeg({quality:90}).toFile('docs/mobile-signal-review.jpg');
  console.log(JSON.stringify({files:report.files,images:report.images,contactSheetOrder:ids}));
})().catch(error=>{console.error(error);process.exitCode=1;});
