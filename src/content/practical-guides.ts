import { householdPracticalGuides } from "./household-practical-guides";
export type PracticalGuide = {
  slug: string; title: string; summary: string; category: string; image: string;
  source: string; introduction: string; sections: {title:string; text:string}[];
  tasks: string[]; mistake: string; next: string;
};
export const practicalGuides: PracticalGuide[] = [
  ...householdPracticalGuides,
  {
    slug:"inventario-que-se-usa",title:"Un inventario que sirva, no una lista de compras",category:"Organización",
    summary:"Localiza lo que tienes, registra su estado y repón solo lo que falta.",image:"personal-inventory",source:"src/app/tools/inventory.jsx",
    introduction:"Antes de comprar otra linterna, busca la que ya tienes. La app separa el inventario por categorías; en casa, esa misma idea permite distinguir una necesidad real de un objeto duplicado. Empieza por un solo armario y termina una revisión pequeña antes de extenderla a toda la vivienda.",
    sections:[
      {title:"Registra lo que otra persona necesitaría saber",text:"Para cada objeto, anota nombre, cantidad y unidad, lugar exacto, estado y fecha de revisión. 'Agua: 3' no aclara si son botellas o litros. 'Linterna en el cajón de la entrada, comprobada' es más útil que una lista de marcas. Evita guardar contraseñas o información médica en un inventario compartido."},
      {title:"Comprueba una función, no solo su presencia",text:"Enciende la linterna, comprueba que el cable encaja y revisa el cierre del recipiente. Consulta el manual para el mantenimiento: tener un equipo no demuestra que funcione ni que sepas usarlo. Separa lo pendiente de comprobar para no contarlo como disponible."},
      {title:"Cierra el ciclo después de usarlo",text:"Cuando prestes, consumas o cambies algo de sitio, actualiza la lista. Una revisión breve tras cada uso evita rehacerla desde cero. Prioriza reponer lo que realmente utilizáis antes de ampliar el equipo."},
    ],tasks:["Elegir una zona pequeña para revisar","Anotar cantidades con su unidad","Localizar y probar un equipo siguiendo su manual","Separar lo pendiente de revisar","Acordar quién actualiza la lista"],mistake:"No sumes unidades distintas ni interpretes el número de objetos como una puntuación de seguridad.",next:"revision-por-temporadas",
  },
  {
    slug:"documentos-accesibles",title:"Documentos importantes: encontrarlos sin exponerlos",category:"Organización",
    summary:"Organiza las copias necesarias y comprueba quién puede acceder a ellas.",image:"personal-documents",source:"src/app/tools/documents.jsx",
    introduction:"Una carpeta llena de archivos no siempre resuelve el problema: puede estar desordenada, necesitar conexión o contener una copia antigua. Las categorías de documentos de la app sirven como punto de partida para decidir qué necesita realmente tu hogar, sin recopilar datos por acumularlos.",
    sections:[
      {title:"Haz un índice antes de hacer copias",text:"Agrupa identificación, seguros, vivienda, vehículo y documentación que corresponda a tus circunstancias. Registra dónde está cada original y qué copia necesitas. No todas las personas necesitan todas las categorías ni todas las copias tienen valor para un trámite."},
      {title:"Separa acceso de exposición",text:"Decide qué persona de confianza debe localizar cada documento y qué no debe circular por un chat. Protege el dispositivo y las copias sensibles con controles de acceso adecuados. No añadas claves bancarias a una lista general ni subas documentos personales a esta web."},
      {title:"Prueba con un archivo de ejemplo",text:"Abre una copia no sensible sin conexión y comprueba que se lee. Revisa nombres, fechas y páginas. Una prueba con un documento ficticio permite aprender a exportar o localizar archivos sin difundir información privada."},
    ],tasks:["Preparar un índice sin datos sensibles","Localizar los originales necesarios","Comprobar una copia de ejemplo sin conexión","Revisar quién tiene acceso","Anotar cuándo revisar documentos renovados"],mistake:"Una captura, una copia y un original no son intercambiables para todos los trámites.",next:"copias-que-se-pueden-abrir",
  },
  {
    slug:"mapas-antes-de-salir",title:"Comprueba tu mapa sin conexión antes de salir",category:"Exterior",
    summary:"Revisa la zona, el detalle y los archivos descargados desde un lugar conocido.",image:"personal-offline-map",source:"src/app/tools/maps.jsx",
    introduction:"Ver un mapa mientras tienes conexión no demuestra que esté descargado. La app distingue recursos offline y mapas activos; traslada esa comprobación a cualquier aplicación que uses. Haz la prueba con tiempo, desde casa o desde un lugar conocido, nunca esperando a perder la cobertura.",
    sections:[
      {title:"Revisa la zona completa",text:"Abre el área prevista y sus alrededores. Comprueba el detalle a distintas escalas y que no aparecen huecos. La fecha, procedencia y nivel de detalle del mapa importan: una ruta dibujada no acredita que el paso esté abierto o sea adecuado para tu grupo."},
      {title:"Distingue el mapa de la posición",text:"El archivo del mapa y la ubicación del dispositivo son funciones diferentes. Durante una prueba controlada sin datos, revisa qué sigue disponible. No interpretes una posición ausente o antigua como una confirmación de dónde estás. Vuelve a activar tus comunicaciones al terminar."},
      {title:"Prepara una alternativa comprensible",text:"Anota referencias y puntos de encuentro acordados y lleva una alternativa que sepas interpretar. Comparte el plan con quien corresponda. Cambiar el teléfono, reinstalar la app o borrar archivos puede requerir repetir la comprobación."},
    ],tasks:["Abrir toda la zona prevista","Probar varios niveles de detalle","Comprobar recursos en una prueba sin datos","Volver a activar las comunicaciones","Preparar una alternativa y un punto de encuentro"],mistake:"Una línea de ruta no es una garantía de acceso, orientación o seguridad.",next:"ensayo-familiar-tranquilo",
  },
  {
    slug:"luz-y-bateria",title:"Luz y batería: preparar las tareas esenciales",category:"Hogar",
    summary:"Asigna iluminación a cada tarea y prueba cables, carga y accesibilidad.",image:"personal-battery",source:"src/app/tools/energy.jsx",
    introduction:"La sección de energía de la app invita a revisar consumos y baterías. Para una preparación doméstica útil, empieza por las tareas: comunicarte, consultar información y ver dónde caminas. Una reserva nominal grande no sustituye comprobar los dispositivos concretos que vas a conectar.",
    sections:[
      {title:"Comprueba el conjunto completo",text:"Reúne dispositivo, batería, cable y adaptador. Verifica que cargan juntos, que no hay daños visibles y que conoces las instrucciones del fabricante. No reutilices una batería dañada ni improvises reparaciones eléctricas."},
      {title:"Ilumina lo que necesitas",text:"Localiza una luz para moverte y otra para una tarea fija si la necesitas. Prueba los controles con antelación, sin apuntar a los ojos. Guarda los repuestos en un sitio que otra persona del hogar pueda encontrar."},
      {title:"Anota pruebas, no promesas",text:"Registra el equipo utilizado, su modo de funcionamiento y lo observado en una prueba normal. No conviertas los mAh de una etiqueta en horas garantizadas: los valores nominales no describen por sí solos el consumo ni las pérdidas del conjunto. La web no copia la estimación de autonomía de la app como si fuera una medición."},
    ],tasks:["Elegir las tareas que necesitan electricidad","Probar dispositivo, cable y batería juntos","Localizar iluminación y repuestos","Consultar instrucciones de carga y almacenamiento","Anotar qué queda pendiente de comprobar"],mistake:"No uses una cifra estimada para garantizar alimentación a un equipo médico; sigue su plan profesional y del fabricante.",next:"inventario-que-se-usa",
  },
  {
    slug:"ensayo-familiar-tranquilo",title:"Un ensayo familiar sin sustos ni carreras",category:"Familia",
    summary:"Practica localizar objetos y explicar el plan, sin simular un peligro real.",image:"personal-family-preparedness",source:"src/features/drill/FamilyDrillScreen.tsx",
    introduction:"La app permite organizar simulacros. Para empezar en la web, proponemos una conversación y una práctica tranquila: encontrar una linterna, explicar a quién avisar y comprobar que todos conocen el punto acordado. No hace falta crear oscuridad, humo ni sorpresa para descubrir lo que falta.",
    sections:[
      {title:"Avisa a todos antes de empezar",text:"Explica qué vais a practicar y permite parar en cualquier momento. Adapta la actividad a movilidad, edad, comprensión y comunicación. El objetivo es aprender, no competir por un tiempo ni provocar miedo."},
      {title:"Elige una tarea pequeña",text:"Una persona explica dónde está la linterna y otra la busca sin correr. Después revisad un contacto de confianza avisado de la práctica. No hagáis llamadas de prueba a emergencias, no cortéis suministros y no bloqueéis una salida para representar un escenario."},
      {title:"Termina con un cambio concreto",text:"Preguntad qué ha sido difícil: una estantería alta, un nombre de archivo confuso o un contacto antiguo. Corregid un detalle y acordad cuándo repetirlo. Una lista completada no certifica la capacidad de responder a una emergencia real."},
    ],tasks:["Acordar el ejercicio y cómo detenerlo","Elegir una tarea sin riesgo","Adaptarla a cada participante","Localizar un objeto y explicar un contacto","Corregir una dificultad observada"],mistake:"El tiempo más corto no es necesariamente el mejor resultado. No copies escenarios de emergencia como un guion universal.",next:"ocho-retos-de-preparacion",
  },
  {
    slug:"ocho-retos-de-preparacion",title:"Ocho pequeños retos para poner el plan en marcha",category:"Familia",
    summary:"Una secuencia de mejoras concretas, sin compras obligatorias ni puntuaciones de seguridad.",image:"personal-checklists",source:"src/features/weeklyChallenge/WeeklyChallengeScreen.tsx",
    introduction:"El reto semanal de la app propone avanzar poco a poco. Aquí tienes una secuencia que puedes adaptar al tiempo disponible. No tienes que completarla en ocho semanas exactas: empieza por lo que esté más descuidado en tu hogar y vuelve a los pasos que necesiten seguimiento.",
    sections:[
      {title:"Empieza por lo que ya tienes",text:"Los primeros retos son localizar, probar y ordenar. Revisa una linterna, prueba la radio y comprueba un cable. Si algo no funciona, anota la necesidad antes de comprar. Así podrás decidir si reparar, sustituir o simplemente cambiar de lugar un objeto."},
      {title:"Convierte el acuerdo en una acción",text:"Un plan familiar mejora cuando cada persona entiende su parte. Dedica una sesión a explicar el contacto acordado y otra a revisar la documentación. Utiliza un ejemplo ficticio cuando la práctica pueda exponer datos privados."},
      {title:"Vuelve a mirar lo que cambia",text:"Las necesidades familiares, los equipos y los lugares de almacenamiento cambian. Tras los ocho retos, elige una tarea que requiera revisión y programa tu propio recordatorio. Marcar una casilla documenta una revisión, no garantiza que todo esté resuelto."},
    ],tasks:["Localizar y probar una linterna","Comprobar una radio y sus controles","Revisar cables y baterías siguiendo sus manuales","Contar y revisar los envases de agua disponibles","Revisar fechas y envases del botiquín sin cambiar pautas médicas","Ordenar el índice de documentos","Explicar el contacto y punto de encuentro acordados","Hacer una práctica tranquila y anotar una mejora"],mistake:"No compartas datos sensibles para demostrar que has completado un reto.",next:"revision-por-temporadas",
  },
  {
    slug:"revision-por-temporadas",title:"Qué revisar cuando cambia la temporada",category:"Hogar",
    summary:"Adapta ropa, equipos y hábitos a tus condiciones, no a un calendario rígido.",image:"advanced-reviews",source:"src/app/tools/routines.jsx",
    introduction:"La app separa revisión mensual, verano, invierno y recursos digitales. Esa estructura es útil, pero las fechas no encajan igual en todos los lugares. Utiliza el cambio de condiciones como recordatorio para revisar el material, los contactos y las necesidades de tu hogar.",
    sections:[
      {title:"Una revisión breve y repetible",text:"Comprueba iluminación, carga, envases, fechas y ubicación de los objetos. Consulta las indicaciones de conservación de cada producto: no hay un plazo único de sustitución aplicable a cualquier agua, alimento o batería."},
      {title:"Anticipa los cambios de uso",text:"Revisa si la ropa y el calzado siguen siendo adecuados y de la talla correcta. Comprueba qué material del vehículo necesita mantenimiento según su manual. Para calefacción u otros equipos que requieren un profesional, programa la revisión correspondiente; una comprobación visual no la sustituye."},
      {title:"Incluye los archivos",text:"Abre tus mapas y documentos de ejemplo, comprueba contactos y retira copias que ya no deban circular. Cambiar de teléfono o reinstalar una aplicación es un buen motivo para verificar de nuevo los recursos offline."},
    ],tasks:["Revisar fechas y condiciones de almacenamiento","Probar iluminación y carga","Revisar ropa y calzado","Identificar mantenimiento que requiere un profesional","Abrir mapas y archivos de ejemplo","Actualizar contactos y próxima revisión"],mistake:"No confundas una lista doméstica con una inspección técnica de equipos.",next:"mapas-antes-de-salir",
  },
  {
    slug:"huerto-observar-antes-de-sembrar",title:"Huerto pequeño: observa antes de comprar semillas",category:"Exterior",
    summary:"Prepara un registro de espacio, luz, agua y tiempo disponible.",image:"encyclopedia-garden",source:"src/features/garden/gardenData.js",
    introduction:"La app contempla espacio, clima, experiencia, agua y objetivos del huerto. Antes de convertir esos datos en un calendario, dedica unos días a observar tu lugar. Un proyecto pequeño y mantenible enseña más que una promesa de autosuficiencia basada solo en metros cuadrados.",
    sections:[
      {title:"Describe tu espacio real",text:"Anota si trabajas en suelo, patio o recipientes. Observa la luz en varios momentos y qué cambia entre estaciones. No deduzcas la aptitud del espacio solo por el nombre de tu comunidad: el emplazamiento concreto puede ser muy distinto."},
      {title:"Decide quién lo atenderá",text:"Registra cómo se accederá al agua, quién podrá revisar las plantas y qué ocurrirá durante ausencias. Antes de instalar recipientes pesados en una terraza, verifica sus limitaciones con quien corresponda. No improvises productos fitosanitarios ni tratamientos a partir de consejos genéricos."},
      {title:"Empieza con una prueba acotada",text:"Elige un cultivo con orientación local y las instrucciones de semillas o plantones. Guarda la etiqueta y anota fecha, condiciones y resultado. La web reutiliza el método de planificación, no las cifras de rendimiento ni un calendario único para todo el país."},
    ],tasks:["Describir el espacio disponible","Observar luz y sombra en varios momentos","Acordar acceso al agua y mantenimiento","Consultar limitaciones del lugar","Elegir una prueba pequeña con orientación local","Preparar un registro de observaciones"],mistake:"Un huerto inicial no debe contarse como una reserva de alimentos garantizada.",next:"inventario-que-se-usa",
  },
  {
    slug:"copias-que-se-pueden-abrir",title:"Una copia de seguridad que puedas comprobar",category:"Organización",
    summary:"Revisa qué exportas, dónde lo guardas y cómo recuperarlo sin tocar tu única copia.",image:"personal-backup",source:"src/app/tools/backup.jsx",
    introduction:"Guardar una copia y comprobar que puede recuperarse son dos tareas distintas. El módulo de respaldo de la app sirve como punto de partida para una rutina que también puedes aplicar a otros archivos. Haz las pruebas con datos ficticios y conserva intacta la información original.",
    sections:[
      {title:"Define qué quieres conservar",text:"Prepara una lista de tipos de información: notas, contactos, planes o archivos descargados. Consulta qué incluye realmente la función de exportación; no presupongas que copia todos los recursos externos ni que un PDF puede restaurar el estado de una aplicación."},
      {title:"Revisa el lugar de destino",text:"Comprueba que puedes localizar la copia, que no está en una carpeta pública y que no depende exclusivamente del mismo dispositivo. Protege la información sensible. No pegues claves de cifrado o datos personales en un formulario de soporte."},
      {title:"Prueba sin arriesgar el original",text:"Utiliza un archivo de ejemplo o un entorno separado cuando la herramienta lo permita. Revisa las instrucciones antes de importar: algunas operaciones sustituyen datos. Si no sabes qué ocurrirá, no ensayes sobre tu única copia útil."},
    ],tasks:["Enumerar lo que debe conservarse","Comprobar qué incluye la exportación","Localizar el archivo resultante","Revisar acceso y almacenamiento","Abrir una copia de ejemplo","Leer las condiciones antes de cualquier restauración"],mistake:"No prometemos cifrado ni recuperación por el simple hecho de que exista un botón de exportar.",next:"documentos-accesibles",
  },
];
