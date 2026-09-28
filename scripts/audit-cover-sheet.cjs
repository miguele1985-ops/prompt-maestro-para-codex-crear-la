const sharp=require('sharp'),fs=require('fs');
(async()=>{
 const folder=process.argv[2]||'public/images/blog';
 const files=process.argv.includes('--assigned') ? Object.values(require('../src/content/article-covers.json')).map(c=>c.image.split('/').pop()) : fs.readdirSync(folder).filter(f=>f.endsWith('.jpg')&&!f.startsWith('calculadora-')&&!f.startsWith('aportada-'));
 const cells=[];
 for(let i=0;i<files.length;i++){
  const b=await sharp(folder+'/'+files[i]).resize(180,112,{fit:'contain',background:'#fff'}).toBuffer();
  cells.push({input:b,left:(i%6)*180,top:Math.floor(i/6)*140});
  const label=Buffer.from(`<svg width="180" height="28"><rect width="180" height="28" fill="white"/><text x="3" y="15" font-size="9">${i} ${files[i].slice(0,26)}</text></svg>`);
  cells.push({input:label,left:(i%6)*180,top:Math.floor(i/6)*140+112});
 }
 await sharp({create:{width:1080,height:Math.ceil(files.length/6)*140,channels:3,background:'#fff'}}).composite(cells).png().toFile('docs/cover-audit-sheet.png');
 console.log(files.map((f,i)=>i+': '+f).join('\n'));
})();
