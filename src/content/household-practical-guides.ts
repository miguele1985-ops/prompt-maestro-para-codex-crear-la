import type { PracticalGuide } from "./practical-guides";
export const householdPracticalGuides: PracticalGuide[] = [
  {
    slug:"objetos-casa-sin-improvisaciones",title:"Objetos de casa: aprovecharlos sin improvisaciones peligrosas",category:"Hogar",
    summary:"Cuadernos, cajas y bolsas pueden ayudarte a organizarte sin convertirlos en equipos de seguridad.",image:"learning-home-objects",source:"src/data/interactiveLearningData.js: HOUSEHOLD_OBJECTS",
    introduction:"La app reúne usos de objetos cotidianos. Para esta guía seleccionamos una idea sencilla: aprovechar materiales que ya tienes para ordenar, identificar y preparar. No trasladamos usos médicos, reparaciones eléctricas, trabajo con cristales o montajes de refugio como si fueran soluciones caseras fiables.",
    sections:[
      {title:"Empieza por ordenar, no por transformar",text:"Una caja limpia puede reunir cables y una bolsa organizadora separar repuestos. Revisa que el tamaño y el cierre encajan con lo que guardas y que puedes acceder al contenido. No presupongas resistencia al agua, al fuego o a una carga por el aspecto del recipiente."},
      {title:"Da una función clara a las etiquetas",text:"Anota contenido, cantidad y fecha de revisión sin cubrir instrucciones o caducidades del fabricante. Usa nombres que otra persona entienda. Prueba el adhesivo en una zona discreta y conserva las etiquetas originales de alimentos, medicamentos y productos de limpieza."},
      {title:"Pon límites a la reutilización",text:"Un material útil para clasificar no se convierte por ello en material sanitario o de rescate. No emplees cinta doméstica para reparar un equipo crítico ni botellas de productos químicos para guardar agua. Antes de reutilizar, comprueba el uso previsto del recipiente y su estado."},
    ],tasks:["Elegir una caja o bolsa que ya tengas","Asignarle una única categoría","Revisar estado, limpieza y cierre","Identificar el contenido sin tapar etiquetas originales","Separar cualquier equipo que necesite reparación profesional"],mistake:"No se incluyen improvisaciones con fuego, electricidad, heridas, cargas humanas o envases de sustancias peligrosas.",next:"inventario-que-se-usa",
  },
  {
    slug:"comparar-equipo-antes-comprar",title:"Compara el equipo por su uso, no por sus promesas",category:"Equipo",
    summary:"Una ficha de decisión para distinguir necesidades, compatibilidad y mantenimiento antes de comprar.",image:"encyclopedia-comparisons",source:"src/features/comparisons/comparisonData.js",
    introduction:"La biblioteca de comparativas de la app ordena materiales por contexto, ventajas y límites. Esa estructura puede servirte sin copiar puntuaciones ni elegir un ganador universal. Define primero qué tarea quieres resolver y qué equipo tienes ya; después contrasta las opciones con documentación del modelo concreto.",
    sections:[
      {title:"Escribe la necesidad en una frase",text:"'Quiero una luz que pueda manejar con una mano' permite comparar mejor que 'quiero la mejor linterna'. Anota dónde la usarás, quién la manejará y qué alimentación tienes disponible. Descarta funciones que no resuelvan esa necesidad aunque destaquen en el anuncio."},
      {title:"Compara siempre las mismas condiciones",text:"Separa peso, dimensiones, consumibles, compatibilidad y mantenimiento. Si faltan datos, escribe 'sin comprobar'. Una foto de un conector no confirma compatibilidad, y una autonomía anunciada en un modo no describe todos los modos del equipo."},
      {title:"Cuenta también lo que viene después",text:"Comprueba si necesitas cables, repuestos o accesorios adicionales y si podrás mantener el material según su manual. Revisa las condiciones del vendedor antes de decidir. Reparar de forma adecuada o reutilizar un equipo válido puede ser preferible a añadir otro objeto."},
    ],tasks:["Escribir la tarea que necesitas resolver","Anotar quién usará el equipo y dónde","Revisar primero el material disponible","Comparar datos del modelo exacto","Marcar lo que falta por comprobar","Revisar consumibles y mantenimiento"],mistake:"Las búsquedas de Amazon no son pruebas de producto ni una clasificación de modelos. No mostramos precios o valoraciones sin verificarlos.",next:"luz-y-bateria",
  },
  {
    slug:"contactos-familiares-claros",title:"Contactos familiares que se entiendan a la primera",category:"Familia",
    summary:"Ordena a quién avisar, por qué medio y qué alternativa usar si no responde.",image:"personal-contacts",source:"src/app/tools/contacts.jsx",
    introduction:"La app permite agrupar contactos y marcar favoritos. Lo útil no es tener una agenda enorme, sino poder encontrar a la persona adecuada y explicar para qué se la llama. Prepara un acuerdo sencillo con las personas implicadas, sin publicar sus teléfonos ni recopilar información que no haga falta.",
    sections:[
      {title:"Acordad el papel de cada contacto",text:"Distinguid contacto habitual, persona fuera de la zona y alternativa si alguien no responde. Confirma que esas personas conocen el acuerdo y qué pueden hacer. Una etiqueta como 'emergencia' sin contexto puede resultar confusa para quien no preparó la lista."},
      {title:"Comprueba nombres y medios de contacto",text:"Revisa el número directamente con su titular y guarda un nombre reconocible. Anota si habéis acordado llamada o mensaje y evita enviar información sensible a grupos amplios. Para directorios de servicios, consulta la fuente oficial en lugar de copiar números antiguos sin verificar."},
      {title:"Practica sin usar servicios de emergencia",text:"Haz una prueba con una persona avisada y un mensaje ficticio. Comprueba que el texto se entiende y que puedes localizar la alternativa. Conserva una copia privada accesible según las necesidades del hogar; esta página no solicita ni guarda números personales."},
    ],tasks:["Elegir un contacto habitual y una alternativa","Confirmar el acuerdo con esas personas","Revisar nombres y números con sus titulares","Acordar llamada o mensaje","Probar con un mensaje ficticio y avisado","Guardar una copia privada accesible"],mistake:"No hagas llamadas de prueba al 112 ni publiques teléfonos privados en una lista compartida abiertamente.",next:"ensayo-familiar-tranquilo",
  },
];
