export type EquipmentOption = {name:string;query:string;check:string};
const options = {
  light:{name:"Linterna para tareas cotidianas",query:"linterna LED pilas uso domestico",check:"Compara controles, tipo de alimentación y autonomía declarada en cada modo."},
  power:{name:"Batería externa",query:"bateria externa USB C",check:"Comprueba compatibilidad, Wh indicados por el fabricante y cables necesarios."},
  radio:{name:"Radio portátil",query:"radio portatil AM FM pilas",check:"Revisa bandas, controles, alimentación y tamaño; no todas ofrecen lo mismo."},
  folder:{name:"Carpeta para documentos",query:"carpeta documentos cierre organizador",check:"Elige tamaño y cierre según tus documentos; un cierre no garantiza impermeabilidad."},
  notebook:{name:"Cuaderno de preparación",query:"cuaderno bolsillo tapa resistente",check:"Reutiliza uno que tengas; busca un formato legible y cómodo de llevar."},
  labels:{name:"Etiquetas para organizar reservas",query:"etiquetas adhesivas escribir organizacion",check:"Comprueba que se adhieren al recipiente y que permiten anotar contenido y fecha."},
  containers:{name:"Recipientes para agua potable",query:"recipiente agua potable uso alimentario",check:"Revisa uso alimentario, limpieza, cierre y peso cuando esté lleno. No purifica el agua."},
  measuring:{name:"Recipiente graduado",query:"jarra graduada uso alimentario",check:"Compara escala legible y material apto para el uso previsto."},
  bag:{name:"Mochila de organización",query:"mochila compartimentos ajustable",check:"Valora ajuste, peso vacío y accesibilidad antes que el número de accesorios."},
  pouches:{name:"Bolsas organizadoras",query:"bolsas organizadoras mochila",check:"Comprueba dimensiones y cierre; organiza el equipo que ya tienes."},
  guide:{name:"Guía de campo",query:"guia campo naturaleza España",check:"Busca autoría especializada, edición identificable y cobertura de tu zona; no decide si una especie es comestible."},
  magnifier:{name:"Lupa de observación",query:"lupa de mano observacion naturaleza",check:"Compara manejo y campo de visión. No la uses para mirar el sol."},
  rope:{name:"Cordón para practicar en una mesa",query:"cordon manualidades practicar nudos",check:"Solo práctica sin carga. No comprarlo como cuerda para escalada, rescate o sujeción de personas."},
  pots:{name:"Recipientes para cultivo",query:"macetas drenaje huerto",check:"Comprueba drenaje, dimensiones y compatibilidad con tu espacio; sin promesas de rendimiento."},
  firstaid:{name:"Organizador de botiquín vacío",query:"organizador botiquin vacio",check:"Busca separación y acceso controlado. El contenido y la medicación requieren revisión individual."},
  storage:{name:"Caja de almacenamiento",query:"caja almacenamiento tapa",check:"Mide el lugar disponible y revisa cierre y carga admitida; evita bloquear accesos."},
} satisfies Record<string,EquipmentOption>;

export function equipmentForArticle(slug:string):EquipmentOption[] {
  if(/tormenta-solar/.test(slug))return [options.radio,options.power];
  if(/confinamiento-emergencia/.test(slug))return [options.radio,options.light];
  if(/medicamentos-tratamientos/.test(slug))return [options.firstaid,options.folder];
  if(/emergencia-trabajo-volver/.test(slug))return [options.power,options.pouches];
  if(/evacuacion-10-minutos/.test(slug))return [options.bag,options.folder];
  if(/ciberataque/.test(slug))return [options.folder,options.notebook];
  if(/desinformacion/.test(slug))return [options.radio,options.notebook];
  if(/cadena-suministro/.test(slug))return [options.labels,options.storage];
  if(/espana-2030/.test(slug))return [options.containers,options.folder];
  // Preparatory accessories only, including on health and calculator articles.
  if(/primeros-auxilios|botiquin|hipotermia|salud|herida/.test(slug))return [options.firstaid,options.notebook];
  if(/plantas|setas|fauna|animales|naturaleza/.test(slug))return [options.guide,options.notebook];
  if(/nudo|cuerda/.test(slug))return [options.rope,options.pouches];
  if(/huerto|sembrar/.test(slug))return [options.pots,options.notebook];
  if(/document|copia|backup|licencia|privacidad/.test(slug))return [options.folder,options.notebook];
  if(/radio|comunica|cobertura|morse|frecuencia|senal|silbato/.test(slug))return [options.radio,options.notebook];
  if(/lluvia|agua|potabiliza|deposito/.test(slug))return [options.containers,options.measuring];
  if(/bateria|powerbank|energia|luz|apagon|generador/.test(slug))return [options.light,options.power];
  if(/mapa|ruta|velocidad|orienta/.test(slug))return [options.pouches,options.notebook];
  if(/mochila|kit-|peso-reserva/.test(slug))return [options.bag,options.pouches];
  if(/inventario|reserva|objetos|etiqueta/.test(slug))return [options.labels,options.storage];
  if(/app|aplicacion|offline|movil/.test(slug))return [options.power,options.pouches];
  return [options.notebook,options.pouches];
}
