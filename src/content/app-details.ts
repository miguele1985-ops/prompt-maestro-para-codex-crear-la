export const appStats = [
  {
    value: "16",
    label: "escenarios de crisis",
    detail: "Incluye apagón, sin cobertura, falta de agua, evacuación, heridos, clima extremo y crisis personalizadas.",
  },
  {
    value: "16",
    label: "checklists iniciales",
    detail: "Mochila 72 h, botiquín, casa preparada, vehículo, mascotas, niños, apagón y revisión mensual.",
  },
  {
    value: "90",
    label: "fichas de plantas de España",
    detail: "Contenido offline de campo para consulta responsable, con avisos de seguridad visibles.",
  },
  {
    value: "300+",
    label: "artículos de supervivencia",
    detail: "Guía completa con más de 300 artículos organizados por categorías, buscador, favoritos y consulta principalmente offline.",
  },
];

export const moduleGroups = [
  {
    title: "Emergencia inmediata",
    kicker: "Actuar en segundos",
    image: "/screenshots/app/sos.jpg",
    items: ["Modo Crisis", "SOS y llamada al 112", "Caja Negra autorizada", "Centro de Emergencias", "Señales visuales"],
    text: "Agrupa las acciones que el usuario necesita encontrar bajo presión: pedir ayuda, ver ubicación, activar señales y consultar prioridades por escenario.",
  },
  {
    title: "Herramientas",
    kicker: "Preparación y control",
    image: "/screenshots/app/personal-tools.jpg",
    items: ["Inventario", "Checklists", "Contactos", "Ubicaciones", "Documentos", "Respaldo"],
    text: "Agrupa las herramientas personales que ayudan a preparar y organizar recursos: inventario, checklists, contactos, ubicaciones, documentos, respaldo, notas, batería y plan familiar.",
  },
  {
    title: "Biblioteca offline",
    kicker: "Información local",
    image: "/screenshots/app/guides-survival-list.jpg",
    items: ["Guías completas", "Crisis urbana", "Primeros auxilios", "Agua", "Comida", "Fuego", "Refugio"],
    text: "La pantalla principal separa guías, herramientas y favoritos para que la información no quede enterrada en menús.",
  },
  {
    title: "Recursos avanzados",
    kicker: "Herramientas de campo",
    image: "/screenshots/app/advanced-resources.jpg",
    items: ["Calculadoras", "Lluvia", "Velocidad", "Sensación térmica", "Horas de luz", "Frecuencias"],
    text: "Incluye funciones de apoyo para orientación, señales, ahorro de batería, radio, vehículo, captación de lluvia, velocidad necesaria, sensación térmica, horas de luz y cálculo orientativo en emergencias.",
  },
  {
    title: "Aprendizaje interactivo",
    kicker: "Formación y juego",
    image: "/screenshots/app/learning-interactive-menu.jpg",
    items: ["Academia Survival", "Mitos peligrosos", "Objetos de casa", "Aprende en familia", "Juego 72 horas"],
    text: "Es una categoría propia para aprender por capítulos, practicar preguntas, desmontar mitos, aprovechar objetos cotidianos y enseñar preparación a niños y familias.",
  },
  {
    title: "IA y enciclopedia",
    kicker: "Consulta local opcional",
    image: "/screenshots/app/ai-encyclopedia.jpg",
    items: ["Asistente offline IA", "Recursos Offline", "Panel Prep.", "Nudos útiles", "Plantas y animales", "Comparativas", "Desastres"],
    text: "Agrupa consulta local opcional, recursos instalados, panel de preparación y biblioteca visual. La IA se presenta como apoyo, no como autoridad: depende del teléfono, del modelo instalado y puede equivocarse.",
  },
  {
    title: "Internet cuando aporta valor",
    kicker: "Separado con claridad",
    image: "/screenshots/app/alerts.jpg",
    items: ["Tiempo", "Alertas", "Fuentes externas", "Última información guardada"],
    text: "Las funciones online aparecen diferenciadas para no confundir: alertas y meteorología dependen de fuentes externas y pueden retrasarse.",
  },
];

export const realFlows = [
  {
    title: "Antes de la emergencia",
    text: "Configura contactos, rutas, ubicaciones, plan familiar, documentación, inventario, checklists, mapas y recursos offline.",
    steps: ["Crear plan", "Revisar equipo", "Guardar mapas", "Marcar favoritos"],
  },
  {
    title: "Durante una crisis",
    text: "Entra en Modo Crisis, selecciona el escenario, revisa primeras acciones, abre SOS si hace falta y consulta brújula o ubicación.",
    steps: ["Elegir crisis", "Priorizar", "Llamar al 112", "Usar herramientas"],
  },
  {
    title: "Sin cobertura",
    text: "La app sigue mostrando guías, checklists, notas, inventario, mapas preparados, brújula, Morse y recursos locales ya instalados.",
    steps: ["Buscar offline", "Ver favoritos", "Consultar mapas", "Ahorrar batería"],
  },
  {
    title: "Después",
    text: "Revisa notas, registros autorizados, inventario consumido, documentación, rutas y tareas pendientes para mejorar el plan.",
    steps: ["Actualizar datos", "Reponer material", "Anotar fallos", "Preparar revisión"],
  },
];

export const resourceDetails = [
  {
    title: "Carpeta externa SupervivenciaOffline",
    text: "La app contempla carpetas para modelos, mapas, rutas y packs externos. Esto evita cargar el APK con recursos demasiado pesados.",
    tags: ["models", "maps", "routes", "packs"],
  },
  {
    title: "Mapa normal de España en MBTiles",
    text: "El proyecto de la app referencia un mapa MBTiles de España como recurso offline renderizable. Por su tamaño, la web debe tratar los mapas como recursos sujetos a licencia y espacio disponible.",
    tags: ["MBTiles", "España", "offline"],
  },
  {
    title: "IA local mediante modelo GGUF",
    text: "La app contempla importar un modelo GGUF compatible como recurso externo, siempre que el telefono tenga memoria, espacio y potencia suficiente.",
    tags: ["GGUF", "local", "offline"],
  },
  {
    title: "Límites realistas de recursos",
    text: "El código de la app define límites orientativos para APK, mapas y modelos. La web debe explicar que los recursos grandes se descargan o importan aparte.",
    tags: ["APK", "espacio", "rendimiento"],
  },
];

export const permissionGroups = [
  {
    title: "Ubicación",
    text: "Para coordenadas, mapas, brújula, ubicación actual, puntos guardados, alertas por zona y funciones de Caja Negra si el usuario las autoriza.",
  },
  {
    title: "Cámara y micrófono",
    text: "Para vídeo, audio, señales o Caja Negra cuando el usuario active y autorice esas funciones. La web no debe sugerir grabaciones sin permiso.",
  },
  {
    title: "Llamadas y vibración",
    text: "Para facilitar llamada al 112, patrones SOS y avisos locales. La app no sustituye al servicio de emergencias.",
  },
  {
    title: "Bluetooth, Wi-Fi y notificaciones",
    text: "Para comunicación local, avisos y funciones del sistema compatibles con cada dispositivo. El alcance y entrega no están garantizados.",
  },
  {
    title: "Archivos y documentos",
    text: "Para importar mapas, modelos, documentos o copias manuales. El usuario debe proteger el dispositivo si almacena datos sensibles.",
  },
];
