const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const source = path.join(process.argv[2] || 'C:/Users/Valeria/Documents/Codex/SV/mobile', 'src/data/checklistsData.js');
const text = fs.readFileSync(source, 'utf8');
const ast = ts.createSourceFile(source, text, ts.ScriptTarget.Latest, true);
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => {
    if (!ts.isPropertyAssignment(p)) throw Error('Unexpected property');
    return [p.name.text, literal(p.initializer)];
  }));
  throw Error('Nonliteral source');
}
let lists;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'INITIAL_CHECKLISTS') lists = literal(node.initializer);
  ts.forEachChild(node, visit);
}
visit(ast);
const changes = {
  '72-1':'Agua potable calculada según personas, duración y capacidad de transporte',
  '72-9':'Herramienta adecuada que sepas usar y puedas transportar legalmente',
  '72-14':'Medicación personal preparada según la pauta profesional',
  'fa-4':'Material de limpieza adecuado, con envases intactos',
  'fa-5':'Productos de cura indicados por un profesional para tu botiquín',
  'fa-10':null,'fa-11':null,'fa-12':null,'fa-15':null,
  'hp-1':'Reserva de agua calculada para las necesidades del hogar',
  'hp-10':'Iluminación a pilas disponible sin depender de llamas',
  'hp-14':'Alimentos que puedan consumirse sin encender equipos de combustión',
  'bl-2':'Plan de contacto familiar y necesidades de apoyo revisados',
  'bl-3':'Linternas localizadas, probadas y con repuestos',
  'bl-4':'Instrucciones de los aparatos consultadas para cortes y reconexión',
  'bl-5':'Plan para conservar alimentos sin abrir innecesariamente nevera y congelador',
  'bl-8':'Radio probada y emisora informativa anotada',
  'bl-9':'Toda la familia sabe que generadores y barbacoas no se usan dentro de casa',
  'bl-10':'Baterías externas cargadas antes de un corte',
  'ev-2':'Medicación y documentación preparadas según necesidades individuales',
  'ev-9':'Responsable de acompañar a cada menor o dependiente acordado',
  'ev-12':'Instrucciones oficiales sobre suministros conocidas; no manipular instalaciones con riesgo',
  'ck-1':'Señalización reglamentaria revisada: V16 conectada certificada cuando corresponda en España',
  'ck-6':'Agua adaptada a ocupantes, trayecto y condiciones',
  'ck-8':'Asistencia en carretera y manual del vehículo localizados',
  'ck-10':'Contacto de asistencia para inmovilización o remolque',
  'fp-6':'Teléfonos importantes anotados y conocidos según edad y capacidad',
  'fp-7':'Información personal imprescindible guardada de forma privada y accesible',
  '24-1':'Agua adaptada al recorrido, necesidades y peso transportable',
  '24-5':'Botiquín revisado y material cuyo uso conoces',
  'cw-1':'Equipo invernal compatible revisado según manual y restricciones',
  'cw-3':'Previsión y estado oficial de las carreteras consultados',
  'hw-1':'Lugar fresco y alternativa fuera del hogar identificados',
  'hw-2':'Protección solar de ventanas revisada',
  'hw-3':'Ventilación prevista cuando las condiciones exteriores sean adecuadas',
  'hw-4':'Agua accesible y necesidades consultadas si hay restricciones médicas',
  'hw-5':'Contacto y apoyo acordados para personas vulnerables',
  'hw-6':'Horarios previstos para evitar esfuerzo en las horas más calurosas',
  'hw-8':'Plan para no dejar personas ni animales en un coche cerrado',
  'cf-1':'Abrigo y lugar protegido previstos para cada persona',
  'cf-2':'Estado del aislamiento doméstico revisado',
  'cf-3':'Calefacción revisada según manual, sin tapar rejillas de ventilación',
  'cf-4':'Nadie usará generadores, braseros improvisados ni barbacoas en interiores',
  'cf-7':'Apoyo a menores y personas vulnerables acordado',
  'fl-1':'Regla conocida: no tocar cuadros ni aparatos eléctricos en agua; seguir indicaciones oficiales',
  'fl-2':'Zonas y rutas oficiales consultadas antes de un aviso',
  'fl-3':'Dirección y ubicación conocidas para pedir ayuda en una emergencia',
  'fl-4':'Reserva de agua potable y canales de avisos del abastecimiento localizados',
  'fl-6':'Todos conocen que no deben atravesar zonas inundadas a pie ni en coche',
  'fl-7':'Plan familiar y canal oficial de información preparados',
  'hf-1':'Salidas y punto de encuentro planificados según el edificio',
  'hf-2':'Todos saben pedir ayuda al 112 y dar la dirección',
  'hf-3':'Instrucciones de bomberos locales consultadas previamente',
  'hf-4':'Todos conocen que no deben volver a un edificio afectado',
  'hf-5':'Ayuda para personas que la necesiten acordada',
  'hf-6':'Detectores y medidas de prevención revisados según sus instrucciones',
  'pet-2':'Agua prevista según especie, tamaño, duración y consejo veterinario',
  'kk-1':'Alimentos adecuados a edad, alergias y necesidades, evitando riesgos de atragantamiento',
  'kk-8':'Medio de aviso apropiado a la edad y supervisión disponible',
  'mr-6':'Envases y fechas del agua revisados según fabricante y autoridad sanitaria',
  'mr-9':'Mantenimiento de equipos de protección revisado con personal competente',
};
const names = {blackout:'Preparación ante un apagón',evacuation:'Plan de evacuación','heat-wave':'Preparación para el calor','extreme-cold':'Preparación para el frío',flood:'Preparación ante inundaciones','house-fire':'Prevención y plan ante incendios','first-aid-kit':'Revisión del botiquín'};
if (lists?.length !== 16) throw Error('Review source changes before import');
const result = lists.map(list => ({id:list.id,title:names[list.id] || list.title,category:list.category,items:list.items.filter(item => changes[item.id] !== null).map(item => ({id:item.id,text:changes[item.id] || item.text}))}));
fs.writeFileSync('src/content/mobile-checklists.json', JSON.stringify(result,null,2)+'\n');
fs.writeFileSync('docs/mobile-checklists-review.json', JSON.stringify({source,sha256:crypto.createHash('sha256').update(text).digest('hex'),lists:result.length,tasks:result.reduce((n,l)=>n+l.items.length,0),changes,scope:'Preparación previa, no protocolos para emergencias activas. App original sin modificar.',sources:['https://www.dgt.es/muevete-con-seguridad/tecnologia-e-innovacion-en-carretera/Dispositivos-de-presenalizacion-V16/','https://ficheros.proteccioncivil.es/unidadesFormativas/Plan_Familiar_Emergencias_Creacion_propia_UnidadPsicologiaDGPCYE.pdf','https://www.cdc.gov/natural-disasters/response/what-to-do-protect-yourself-from-electrical-hazards.html']},null,2)+'\n');
console.log(`${result.length} listas importadas`);
