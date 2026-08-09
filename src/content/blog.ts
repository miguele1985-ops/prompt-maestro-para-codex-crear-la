export interface BlogSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  imageAlt: string;
  date: string;
  readingTime: string;
  keywords: string[];
  sections: BlogSection[];
  warning?: string;
  relatedLinks?: Array<{ label: string; href: string }>;
}

export interface BlogAppUseGuide {
  title: string;
  intro: string;
  steps: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "que-debe-incluir-aplicacion-supervivencia-offline",
    title: "Qué debe incluir una aplicación de supervivencia offline",
    excerpt: "Una app de emergencias no debería depender solo de Internet: debe guardar guías, mapas, contactos, herramientas y recursos críticos en el dispositivo.",
    category: "Supervivencia offline",
    image: "/screenshots/app/home.jpg",
    imageAlt: "Pantalla principal de Modo Crisis Survival con modo offline activo",
    date: "Configurar fecha de publicación",
    readingTime: "6 min",
    keywords: ["aplicación de supervivencia offline", "app sin Internet", "emergencias"],
    sections: [
      { heading: "Información disponible cuando no hay cobertura", body: "La diferencia principal está en que el contenido importante debe poder consultarse sin depender de buscadores, vídeos o servicios en la nube. Modo Crisis Survival está pensada para llevar en el teléfono guías, escenarios de crisis y herramientas que siguen siendo útiles cuando la conexión falla.", bullets: ["Guías organizadas por categorías", "Buscador interno", "Favoritos para accesos rápidos", "Contenido consultable sin Internet", "Avisos claros sobre funciones que sí necesitan conexión"] },
      { heading: "Herramientas prácticas, no solo texto", body: "Una aplicación de preparación debe combinar información con herramientas: inventario, checklists, ubicaciones guardadas, brújula, calculadoras, contactos y planes familiares. Así el usuario no solo lee qué hacer, también puede prepararlo antes." },
      { heading: "Transparencia y límites", body: "La app debe explicar qué puede hacer y qué no. No sustituye al 112, a profesionales sanitarios ni a fuentes oficiales. Su valor está en organizar información y recursos para responder mejor, no en prometer seguridad absoluta." },
    ],
    relatedLinks: [{ label: "Ver guías", href: "/guias-supervivencia" }, { label: "Descargar la app", href: "/descargar" }],
  },
  {
    slug: "como-prepararse-para-un-apagon",
    title: "Cómo prepararse para un apagón prolongado",
    excerpt: "Un apagón afecta a luz, comunicación, conservación de alimentos, agua caliente, pagos y acceso a información. La preparación previa marca la diferencia.",
    category: "Apagones",
    image: "/screenshots/app/crisis-mode.jpg",
    imageAlt: "Modo Crisis con escenarios de emergencia",
    date: "Configurar fecha de publicación",
    readingTime: "7 min",
    keywords: ["prepararse para un apagón", "app para apagones", "supervivencia urbana"],
    sections: [
      { heading: "Prioridades iniciales", body: "Lo primero es mantener la calma, confirmar si el corte afecta solo a tu vivienda o a toda la zona y reducir el consumo de batería. La app permite consultar protocolos, checklists e inventario sin conexión.", bullets: ["Linterna y baterías cargadas", "Radio o canales alternativos", "Agua preparada", "Alimentos que no necesiten nevera", "Contactos y punto de encuentro"] },
      { heading: "Organiza casa y familia", body: "Un apagón se gestiona mejor si cada persona sabe qué hacer. Define dónde están las linternas, qué alimentos usar primero, cómo comunicarse y cuándo activar el plan familiar." },
      { heading: "Qué usar dentro de la app", body: "Modo Crisis, control de batería, inventario, checklists, notas, documentos y guía de frecuencias ayudan a trabajar por prioridades sin perder tiempo buscando información dispersa." },
    ],
    relatedLinks: [{ label: "Modo Crisis", href: "/modo-crisis" }, { label: "Herramientas", href: "/herramientas-supervivencia" }],
  },
  {
    slug: "como-crear-plan-familiar-emergencia",
    title: "Cómo crear un plan familiar de emergencia",
    excerpt: "Un plan familiar convierte instrucciones sueltas en acciones claras: quién avisa, dónde reunirse, qué llevar y qué hacer si alguien no tiene cobertura.",
    category: "Preparación familiar",
    image: "/screenshots/app/personal-family-preparedness.jpg",
    imageAlt: "Panel de preparación familiar de la app",
    date: "Configurar fecha de publicación",
    readingTime: "6 min",
    keywords: ["plan familiar de emergencia", "preparación familiar", "rutas de evacuación"],
    sections: [
      { heading: "Define miembros y responsabilidades", body: "El plan debe indicar quién se encarga de menores, personas mayores, medicación, documentación, mascotas, llaves, mochila y comunicación. Cuanto menos haya que improvisar, mejor." },
      { heading: "Puntos de encuentro y rutas", body: "Guarda un punto cercano y otro fuera del barrio. Añade rutas alternativas si una calle queda cortada, hay inundación o no funciona el transporte." },
      { heading: "Practica y revisa", body: "Un plan que nadie ha probado suele fallar. Usa retos, simulacros y revisiones para comprobar tiempos, carencias y mejoras pendientes." },
    ],
    relatedLinks: [{ label: "Preparación familiar", href: "/preparacion-familiar" }],
  },
  {
    slug: "que-guardar-mochila-72-horas",
    title: "Qué guardar en una mochila de 72 horas",
    excerpt: "La mochila de 72 horas debe cubrir lo básico sin convertirse en una carga imposible: agua, abrigo, luz, botiquín, documentación y comida sencilla.",
    category: "Checklists",
    image: "/screenshots/app/personal-checklists.jpg",
    imageAlt: "Checklist de mochila 72 horas en la app",
    date: "Configurar fecha de publicación",
    readingTime: "6 min",
    keywords: ["mochila 72 horas", "kit emergencia", "checklist evacuación"],
    sections: [
      { heading: "Prioriza lo esencial", body: "Empieza por agua, comida lista para consumir, linterna, batería externa, botiquín, ropa de abrigo, documentación y dinero en efectivo. Adapta la mochila a clima, salud, niños, mascotas y transporte." },
      { heading: "Peso y accesibilidad", body: "Una mochila útil es la que puedes mover. Coloca arriba lo que más se usa y evita objetos pesados que no tengan una función clara." },
      { heading: "Usa la checklist", body: "La app permite marcar elementos, ver pendientes y revisar el porcentaje completado. La lista no es una garantía, es una guía para no olvidar lo importante." },
    ],
    relatedLinks: [{ label: "Guías", href: "/guias-supervivencia" }],
  },
  {
    slug: "como-utilizar-mapas-offline",
    title: "Cómo utilizar mapas offline en una emergencia",
    excerpt: "Los mapas offline permiten orientarse cuando no hay datos móviles, pero deben prepararse antes y revisarse con calma.",
    category: "Mapas offline",
    image: "/screenshots/app/personal-offline-map.jpg",
    imageAlt: "Mapa offline dentro de la app",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["mapas offline", "mapas sin cobertura", "orientación GPS"],
    sections: [
      { heading: "Instala mapas antes", body: "No esperes a una emergencia para descargar o importar mapas. Comprueba que abren, que cubren tu zona y que el móvil tiene espacio suficiente." },
      { heading: "Marca puntos importantes", body: "Guarda casa, vehículo, punto de encuentro, centro médico, agua, refugios o lugares útiles. Las coordenadas pueden ser más fiables que una dirección si no hay conexión." },
      { heading: "Combina mapa y brújula", body: "El mapa ayuda a ver rutas y referencias. La brújula y el GPS ayudan a orientarte, siempre teniendo en cuenta permisos, sensores y precisión del dispositivo." },
    ],
    relatedLinks: [{ label: "Mapas offline", href: "/mapas-offline" }, { label: "Centro de descargas", href: "/centro-descargas" }],
  },
  {
    slug: "que-es-archivo-mbtiles",
    title: "Qué es un archivo MBTiles y para qué sirve",
    excerpt: "MBTiles es un formato usado para guardar mapas por teselas en un solo archivo, útil para llevar cartografía offline en el móvil.",
    category: "MBTiles",
    image: "/screenshots/app/personal-offline-map.jpg",
    imageAlt: "Mapa offline compatible con archivos MBTiles",
    date: "Configurar fecha de publicación",
    readingTime: "4 min",
    keywords: ["MBTiles", "mapas MBTiles", "mapas offline España"],
    sections: [
      { heading: "Mapa guardado en un archivo", body: "Un MBTiles puede contener muchas teselas de mapa empaquetadas. Esto facilita copiar, importar y activar mapas sin depender de una conexión constante." },
      { heading: "Licencias y tamaño", body: "Los mapas pueden ocupar mucho espacio y estar sujetos a licencias. No se deben alojar ni distribuir mapas con derechos si no se tiene autorización." },
      { heading: "Uso dentro de la app", body: "La idea es seleccionar el archivo desde el teléfono, activarlo y cambiar entre mapas según la zona o el tipo de terreno." },
    ],
    relatedLinks: [{ label: "Centro de descargas", href: "/centro-descargas" }],
  },
  {
    slug: "como-ahorrar-bateria-emergencia",
    title: "Cómo ahorrar batería durante una emergencia",
    excerpt: "La batería es un recurso crítico. Reducir brillo, limitar conexiones y usar el teléfono por turnos puede ampliar la autonomía.",
    category: "Batería",
    image: "/screenshots/app/personal-battery.jpg",
    imageAlt: "Control de batería de Modo Crisis Survival",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["ahorrar batería emergencia", "modo ultra emergencia", "batería móvil"],
    sections: [
      { heading: "Reduce consumo desde el primer momento", body: "Baja brillo, cierra apps no necesarias, desactiva conexiones que no uses y evita vídeo o navegación innecesaria. La app muestra modos orientativos para elegir una estrategia." },
      { heading: "Reserva batería para lo importante", body: "Prioriza llamadas, ubicación, mapas, contactos y protocolos. Si hay varias personas, organiza turnos de uso para no agotar todos los teléfonos a la vez." },
      { heading: "Estimaciones, no promesas", body: "La duración depende de batería real, cobertura, pantalla, temperatura y uso. Las estimaciones ayudan a planificar, pero no garantizan autonomía." },
    ],
    relatedLinks: [{ label: "Herramientas", href: "/herramientas-supervivencia" }],
  },
  {
    slug: "que-hacer-cuando-no-hay-cobertura",
    title: "Qué hacer cuando no hay cobertura",
    excerpt: "Sin cobertura conviene reducir intentos inútiles, buscar puntos altos con seguridad, usar mensajes breves y apoyarse en información offline.",
    category: "Sin cobertura",
    image: "/screenshots/app/home.jpg",
    imageAlt: "Pantalla principal con modo offline activo",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["sin cobertura", "sin Internet", "comunicación offline"],
    sections: [
      { heading: "No dependas de una sola vía", body: "Prueba llamada, SMS, mensajería si vuelve la red, Bluetooth o Wi-Fi Direct si están disponibles, y señales visuales o sonoras cuando proceda. Ningún método garantiza entrega." },
      { heading: "Consulta lo que ya tienes", body: "Guías, mapas, contactos guardados, notas y documentos deben estar preparados antes. Si no hay red, lo local es lo que queda." },
      { heading: "Busca seguridad antes que señal", body: "Subir, moverse o salir puede ser peligroso. Evalúa entorno, clima, tráfico, luz y estado de las personas antes de buscar cobertura." },
    ],
    relatedLinks: [{ label: "Con uso de Internet", href: "/con-uso-de-internet" }],
  },
  {
    slug: "como-guardar-agua-emergencias",
    title: "Cómo guardar agua para emergencias",
    excerpt: "El agua almacenada debe ser suficiente, estar protegida, revisarse y usarse con criterio. La app ayuda a calcular autonomía de forma orientativa.",
    category: "Agua",
    image: "/screenshots/app/guides-water-category.jpg",
    imageAlt: "Categoría Agua dentro de las guías offline",
    date: "Configurar fecha de publicación",
    readingTime: "6 min",
    keywords: ["guardar agua emergencias", "agua supervivencia", "autonomía de agua"],
    sections: [
      { heading: "Cantidad y rotación", body: "Calcula por personas, días y necesidades especiales. Revisa recipientes, fechas y lugar de almacenamiento para evitar sorpresas." },
      { heading: "Separar usos", body: "No toda el agua tiene el mismo uso. Distingue agua para beber, cocinar, higiene básica y limpieza. En una crisis, esa separación ayuda a decidir mejor." },
      { heading: "Potabilización con prudencia", body: "Hervir suele ser el método preferente cuando es posible. Los métodos químicos requieren productos adecuados y seguir fuentes sanitarias oficiales." },
    ],
    warning: "No utilices cálculos de la web o la app como sustituto de instrucciones sanitarias oficiales sobre agua potable.",
    relatedLinks: [{ label: "Guías de supervivencia", href: "/guias-supervivencia" }],
  },
  {
    slug: "como-preparar-coche-averia",
    title: "Cómo preparar el coche para una avería aislada",
    excerpt: "El vehículo puede ser refugio temporal, punto de carga y transporte, pero necesita kit, señalización, agua, abrigo y documentación.",
    category: "Vehículo",
    image: "/screenshots/app/advanced-vehicle.jpg",
    imageAlt: "Supervivencia con vehículo en la app",
    date: "Configurar fecha de publicación",
    readingTime: "6 min",
    keywords: ["kit coche emergencia", "avería aislada", "supervivencia vehículo"],
    sections: [
      { heading: "Kit mínimo", body: "Incluye agua, manta, linterna, batería externa, cargadores, botiquín, ropa adecuada, documentación y elementos de señalización legalmente aplicables." },
      { heading: "Escenarios distintos", body: "No es lo mismo una avería en verano que quedar atrapado por nieve, riada o túnel. La app separa escenarios para priorizar seguridad, visibilidad y llamada a emergencias." },
      { heading: "Evita maniobras peligrosas", body: "La prioridad es señalizar, proteger a las personas y pedir ayuda. No improvises reparaciones si hay riesgo de tráfico, incendio, electrocución o exposición." },
    ],
    relatedLinks: [{ label: "Recursos avanzados", href: "/recursos-avanzados" }],
  },
  {
    slug: "que-hacer-durante-dana",
    title: "Qué hacer durante una DANA o inundación",
    excerpt: "Una DANA puede cambiar la situación en minutos. Evitar cauces, bajos, garajes y desplazamientos innecesarios es clave.",
    category: "Desastres naturales",
    image: "/screenshots/app/encyclopedia-natural-disasters.jpg",
    imageAlt: "Guía de desastres naturales en la app",
    date: "Configurar fecha de publicación",
    readingTime: "7 min",
    keywords: ["DANA", "inundación", "desastres naturales España"],
    sections: [
      { heading: "Antes", body: "Consulta avisos oficiales, revisa rutas, prepara documentación, carga el móvil y evita dejar el vehículo en zonas inundables si hay margen seguro." },
      { heading: "Durante", body: "No cruces zonas inundadas a pie ni en coche. Evita garajes, sótanos, cauces y barrancos. Si hay peligro real, llama al 112 y sigue instrucciones oficiales." },
      { heading: "Después", body: "No vuelvas hasta que sea seguro. El agua puede ocultar daños, cables, alcantarillas abiertas o contaminación. Revisa información oficial antes de moverte." },
    ],
    warning: "Una app no sustituye los avisos oficiales, ES-Alert, Protección Civil ni servicios de emergencia.",
    relatedLinks: [{ label: "IA y enciclopedia", href: "/ia-enciclopedia" }],
  },
  {
    slug: "diferencias-alertas-oficiales-avisos-meteorologicos",
    title: "Diferencias entre alertas oficiales y avisos meteorológicos",
    excerpt: "Los avisos meteorológicos informan de fenómenos previstos; las alertas oficiales pueden incluir instrucciones de protección civil y emergencia.",
    category: "Alertas",
    image: "/screenshots/app/internet-alerts.jpg",
    imageAlt: "Pantalla de alertas de catástrofes",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["alertas oficiales", "avisos meteorológicos", "ES-Alert"],
    sections: [
      { heading: "No todo aviso exige la misma acción", body: "Un aviso puede ayudarte a prepararte; una alerta oficial puede requerir actuar de inmediato. Lee fuente, zona, fecha, actualización y recomendaciones." },
      { heading: "La app depende de fuentes externas", body: "Cuando hay conexión, la app puede mostrar información de alertas y meteorología, pero puede sufrir retrasos o quedar desactualizada." },
      { heading: "Contrasta siempre", body: "Ante riesgo real, consulta fuentes oficiales y sigue instrucciones de autoridades. La app organiza información, no reemplaza canales oficiales." },
    ],
    relatedLinks: [{ label: "Con uso de Internet", href: "/con-uso-de-internet" }],
  },
  {
    slug: "como-preparar-ninos-sin-asustarlos",
    title: "Cómo preparar a los niños sin asustarlos",
    excerpt: "La preparación infantil debe ser clara, tranquila y práctica: llamar al 112, recordar datos básicos, buscar un adulto y seguir el plan familiar.",
    category: "Familia",
    image: "/screenshots/app/advanced-kids-guide.jpg",
    imageAlt: "Guía para niños dentro de la app",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["preparar niños emergencias", "modo niño", "aprendizaje familiar"],
    sections: [
      { heading: "Lenguaje tranquilo", body: "Evita mensajes alarmistas. Explica qué hacer con frases sencillas y practica pequeños pasos: nombre, teléfono, punto seguro y adulto de confianza." },
      { heading: "Aprender jugando", body: "El aprendizaje interactivo y el juego 72 horas ayudan a practicar decisiones básicas sin convertir la preparación en miedo." },
      { heading: "Plan familiar visible", body: "Los menores necesitan saber a quién acudir, dónde esperar y qué no tocar: cables, fuego, agua de riada o sustancias desconocidas." },
    ],
    relatedLinks: [{ label: "Aprendizaje", href: "/aprendizaje-supervivencia" }],
  },
  {
    slug: "documentacion-conviene-tener-disponible",
    title: "Qué documentación conviene tener disponible",
    excerpt: "Seguros, información médica, documentos familiares y manuales pueden ser importantes si no tienes conexión o tienes que evacuar.",
    category: "Documentación",
    image: "/screenshots/app/personal-documents.jpg",
    imageAlt: "Documentos y biblioteca PDF offline en la app",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["documentación emergencia", "PDF offline", "datos sensibles"],
    sections: [
      { heading: "Documentos útiles", body: "La app permite preparar documentos y PDF para consultarlos sin conexión. Conviene elegir bien qué guardar porque algunos datos son sensibles.", bullets: ["Seguros", "Documentación familiar", "Información médica", "Manuales importantes", "Instrucciones del hogar", "Contactos y direcciones"] },
      { heading: "Privacidad y protección", body: "Si guardas documentos personales, protege el teléfono con bloqueo seguro. No compartas archivos sensibles sin revisar qué contienen." },
      { heading: "Copias y actualización", body: "Los documentos caducan o cambian. Revisa fechas, versiones y contactos. Un documento antiguo puede ser menos útil que no tenerlo." },
    ],
    relatedLinks: [{ label: "Herramientas personales", href: "/herramientas-supervivencia" }],
  },
  {
    slug: "como-revisar-kit-emergencia",
    title: "Cómo revisar un kit de emergencia",
    excerpt: "Preparar una vez no basta. Agua, pilas, comida, botiquín y documentos necesitan revisión periódica.",
    category: "Revisiones",
    image: "/screenshots/app/advanced-reviews.jpg",
    imageAlt: "Sistema de revisiones y mantenimiento de la app",
    date: "Configurar fecha de publicación",
    readingTime: "5 min",
    keywords: ["revisar kit emergencia", "mantenimiento preparación", "checklist"],
    sections: [
      { heading: "Qué revisar", body: "Un kit puede parecer completo y estar desactualizado. La app ayuda a convertir la revisión en una rutina con estado, notas y próximos recordatorios.", bullets: ["Agua", "Alimentos", "Medicamentos", "Botiquín", "Pilas", "Powerbanks", "Documentación", "Vehículo", "Mochilas"] },
      { heading: "Cada cuánto", body: "No hay una frecuencia única para todos. Lo importante es revisar antes de temporadas de riesgo y después de usar cualquier material." },
      { heading: "Mejora continua", body: "Cada revisión debe terminar con una lista clara de pendientes: qué falta, qué caduca y qué hay que sustituir. Así la preparación deja de ser una idea y pasa a ser una rutina real." },
    ],
    relatedLinks: [{ label: "Recursos avanzados", href: "/recursos-avanzados" }],
  },
];

export const blogArticles = blogPosts.map((post) => post.title);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export const blogAppUseGuides: Record<string, BlogAppUseGuide> = {
  "que-debe-incluir-aplicacion-supervivencia-offline": {
    title: "Cómo llevar esta preparación a la app",
    intro: "La idea no es leer el artículo y olvidarlo, sino convertirlo en elementos útiles dentro de Modo Crisis Survival.",
    steps: [
      "Abre la pantalla principal y marca con estrella las funciones que vas a usar primero.",
      "Revisa Guías de supervivencia y guarda como favoritas las categorías que más encajan con tu zona.",
      "Añade contactos, ubicaciones, documentos, notas y elementos de inventario antes de necesitarlos.",
      "Prueba mapas, brújula, Modo Crisis y SOS con calma para saber dónde está cada cosa.",
    ],
  },
  "como-prepararse-para-un-apagon": {
    title: "Cómo preparar un apagón dentro de la app",
    intro: "Un apagón se trabaja mejor si lo conviertes en checklist, inventario y protocolo visible.",
    steps: [
      "Abre Checklists y revisa la lista de apagón, casa preparada y mochila de 72 horas.",
      "En Inventario añade linternas, pilas, powerbanks, radio, agua, comida que no dependa de nevera y medicación.",
      "En Control de batería elige el modo de ahorro que tenga sentido según la duración estimada.",
      "En Notas guarda instrucciones familiares: dónde están las luces, qué comida usar primero y cuándo pedir ayuda.",
    ],
  },
  "como-crear-plan-familiar-emergencia": {
    title: "Cómo añadir el plan familiar",
    intro: "El plan familiar debe quedar registrado para que no dependa de la memoria en un momento de nervios.",
    steps: [
      "En Herramientas abre Planes de Emergencia o Plan Familiar.",
      "Añade miembros, roles, puntos de encuentro, rutas y contactos alternativos.",
      "Guarda necesidades especiales como medicación, alergias, movilidad reducida o menores a cargo.",
      "Revisa el porcentaje de preparación y programa simulacros o recordatorios de revisión.",
    ],
  },
  "que-guardar-mochila-72-horas": {
    title: "Cómo montar la mochila con la app",
    intro: "La app ayuda a que la mochila no sea una lista mental, sino una revisión marcada y actualizable.",
    steps: [
      "Abre Checklists y selecciona Mochila 72 Horas.",
      "Marca lo que ya tienes y deja visibles los elementos pendientes.",
      "Añade en Inventario cantidades reales de agua, comida, botiquín, pilas y batería externa.",
      "Crea una revisión mensual para comprobar caducidades, carga de baterías y estado del material.",
    ],
  },
  "como-utilizar-mapas-offline": {
    title: "Cómo añadir mapas offline",
    intro: "Los mapas deben prepararse antes de perder cobertura, porque suelen ocupar mucho y necesitan una prueba previa.",
    steps: [
      "Descarga o copia un archivo MBTiles compatible desde una fuente autorizada.",
      "Entra en Mapa Offline y pulsa Mapas para consultar los mapas instalados.",
      "Selecciona Importar otro mapa, elige el archivo MBTiles y actívalo.",
      "Guarda puntos importantes como casa, vehículo, punto de encuentro, centro médico y fuente de agua.",
    ],
  },
  "que-es-archivo-mbtiles": {
    title: "Cómo usar un MBTiles en Modo Crisis Survival",
    intro: "Un MBTiles funciona como un mapa empaquetado que puedes importar y llevar en el teléfono.",
    steps: [
      "Comprueba la licencia del mapa y que cubre la zona que necesitas.",
      "Copia el archivo al teléfono con un nombre claro.",
      "Desde Mapa Offline abre el gestor de mapas e importa el archivo.",
      "Prueba zoom, desplazamiento y ubicación antes de depender del mapa en una salida o emergencia.",
    ],
  },
  "como-ahorrar-bateria-emergencia": {
    title: "Cómo usar el control de batería",
    intro: "La batería se gestiona desde el primer minuto, no cuando el teléfono ya está casi agotado.",
    steps: [
      "Abre Control de batería y revisa la autonomía orientativa.",
      "Elige Normal, Ahorro moderado, Ahorro alto o Ultra emergencia según la situación.",
      "Reduce brillo, conexiones y uso de pantalla cuando no sean necesarios.",
      "Reserva batería para mapas, llamadas, contactos, ubicación y protocolos importantes.",
    ],
  },
  "que-hacer-cuando-no-hay-cobertura": {
    title: "Cómo preparar la app para quedarse sin cobertura",
    intro: "Cuando no hay red, solo funciona lo que ya está guardado en el teléfono.",
    steps: [
      "Marca como favoritos Modo Crisis, SOS, Brújula, Mapas Offline, Contactos y Notas.",
      "Guarda rutas, puntos de encuentro y contactos antes de salir.",
      "Prepara mensajes cortos o instrucciones en Notas por si necesitas comunicarlos rápido.",
      "Consulta Comunicaciones, Morse, señales con las manos y silbato como recursos de apoyo.",
    ],
  },
  "como-guardar-agua-emergencias": {
    title: "Cómo registrar agua y autonomía",
    intro: "El agua debe aparecer en inventario y en calculadoras para entender cuánto margen tienes.",
    steps: [
      "En Inventario añade agua embotellada, garrafas o depósitos con litros reales.",
      "Usa la calculadora de Gestión de Agua para estimar días aproximados según personas.",
      "Añade una revisión para comprobar fechas, envases y estado del almacenamiento.",
      "Consulta Guías de Agua para almacenamiento, hervido y potabilización con prudencia.",
    ],
  },
  "como-preparar-coche-averia": {
    title: "Cómo preparar el vehículo en la app",
    intro: "El coche puede ser recurso importante si el kit está pensado, revisado y localizado.",
    steps: [
      "Abre Supervivencia Vehículo y revisa el kit del coche.",
      "Añade al Inventario agua, manta, linterna, chaleco, señalización, botiquín, cargadores y documentación.",
      "Guarda la ubicación del vehículo si lo dejas en una zona poco conocida.",
      "Consulta el escenario concreto antes de actuar: avería aislada, nieve, accidente, riada, incendio o túnel.",
    ],
  },
  "que-hacer-durante-dana": {
    title: "Cómo usar la app ante DANA o inundación",
    intro: "La app ayuda a consultar protocolos y mapas, pero las órdenes oficiales siempre tienen prioridad.",
    steps: [
      "Consulta Desastres Naturales y la ficha de DANA o inundación.",
      "Revisa rutas alternativas y evita cauces, barrancos, garajes y pasos inundados.",
      "Guarda en Ubicaciones puntos altos, centros seguros y puntos de encuentro familiares.",
      "Si hay conexión, revisa Alertas y Meteorología, contrastando siempre con fuentes oficiales.",
    ],
  },
  "diferencias-alertas-oficiales-avisos-meteorologicos": {
    title: "Cómo consultar avisos dentro de la app",
    intro: "Las alertas online sirven para prepararse mejor, pero pueden sufrir retrasos y dependen de fuentes externas.",
    steps: [
      "Abre Con uso de Internet y entra en Alertas o El Tiempo.",
      "Selecciona zona y tipo de alerta cuando la pantalla lo permita.",
      "Lee fuente, fecha, ubicación y severidad antes de tomar decisiones.",
      "Contrasta con Protección Civil, AEMET, ES-Alert u organismos oficiales cuando haya riesgo real.",
    ],
  },
  "como-preparar-ninos-sin-asustarlos": {
    title: "Cómo enseñar a menores con la app",
    intro: "La preparación infantil debe ser sencilla, repetida y sin tono alarmista.",
    steps: [
      "Usa Aprende en familia para repartir responsabilidades sencillas.",
      "Practica el número 112, nombre, teléfono familiar y adulto de confianza.",
      "Utiliza el juego 72 Horas para aprender decisiones básicas sin generar miedo.",
      "Guarda el plan familiar visible y repásalo con frases claras.",
    ],
  },
  "documentacion-conviene-tener-disponible": {
    title: "Cómo guardar documentos en la app",
    intro: "La documentación debe estar disponible offline, pero también protegida por ser información sensible.",
    steps: [
      "Abre Documentos y Biblioteca para importar PDF o fotos importantes.",
      "Crea categorías claras: salud, seguros, identidad, vivienda, vehículo o manuales.",
      "Evita guardar datos innecesarios y protege el teléfono con bloqueo seguro.",
      "Añade una revisión para actualizar documentos caducados o teléfonos antiguos.",
    ],
  },
  "como-revisar-kit-emergencia": {
    title: "Cómo convertir la revisión en rutina",
    intro: "La preparación mejora cuando la app recuerda qué falta, qué caduca y qué conviene revisar.",
    steps: [
      "Abre Revisiones y elige revisión mensual, mochila, invierno, verano o vehículo.",
      "Comprueba agua, alimentos, pilas, botiquín, powerbanks, documentación y material usado.",
      "Actualiza Inventario con cantidades reales después de cada revisión.",
      "Anota pendientes para conseguir, sustituir o probar antes de la siguiente fecha.",
    ],
  },
};
