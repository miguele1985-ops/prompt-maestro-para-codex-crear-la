import Link from "next/link";
import { Bug, CheckCircle2, Database, HardDriveDownload, HeartHandshake, Map, ShieldCheck } from "lucide-react";
import { SafetyWarning } from "@/components/Badges";
import { DeferredScreenshotGallery } from "@/components/DeferredScreenshotGallery";
import { DownloadCard } from "@/components/DownloadCard";
import { DownloadDonationGate } from "@/components/DownloadDonationGate";
import { FeatureGrid } from "@/components/FeatureCard";
import { PublicHomeCounters } from "@/components/PublicHomeCounters";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SectionHeader } from "@/components/SectionHeader";
import { TrackedDonationLink } from "@/components/TrackedDonationLink";
import { appStats, moduleGroups, permissionGroups, realFlows, resourceDetails } from "@/content/app-details";
import { features } from "@/content/features";
import { siteConfig } from "@/content/site-config";

const trustItems = [
  "Modo offline activo",
  "Sin suscripción obligatoria: Configurar antes de publicar",
  "Datos locales según configuración",
  "Mapas compatibles con MBTiles",
  "Favoritos y buscador central",
  "SOS y alertas visibles",
];

const screenshotAssets = [
  {
    src: "/screenshots/app/learning-interactive-menu.jpg",
    alt: "Categoría Aprendizaje Interactivo con 72 Horas, Academia Survival, Mitos Peligrosos, Objetos de Casa y Aprender en Familia",
    caption: "Aprendizaje interactivo: acceso a 72 Horas, Academia Survival, mitos peligrosos, objetos de casa y aprendizaje familiar.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/home.jpg",
    alt: "Pantalla principal con modo offline activo, buscador, avisos, Modo Crisis, SOS y brújula",
    caption: "Inicio de la app: buscador, alertas, accesos rápidos, favoritos y brújula offline.",
    category: "Inicio",
  },
  {
    src: "/screenshots/app/guides-survival-list.jpg",
    alt: "Listado de guías de supervivencia con más de 300 artículos offline disponibles",
    caption: "Guías de supervivencia: más de 300 artículos offline organizados por categorías y favoritos.",
    category: "Guías",
  },
  {
    src: "/screenshots/app/guides-water-category.jpg",
    alt: "Categoría Agua con artículos offline sobre almacenamiento y potabilización",
    caption: "Categoría Agua: necesidades por persona, almacenamiento, hervido y pastillas potabilizadoras.",
    category: "Agua",
  },
  {
    src: "/screenshots/app/guides-shelter-category.jpg",
    alt: "Categoría Refugio con artículos offline sobre protección, calor y evacuación",
    caption: "Categoría Refugio: protección en casa, conservar calor, evacuación y refugio temporal.",
    category: "Refugio",
  },
  {
    src: "/screenshots/app/guides-urban-category.jpg",
    alt: "Categoría Supervivencia Urbana con artículos sobre apagón, agua y evacuación",
    caption: "Supervivencia urbana: apagones, 72 horas en casa, evacuación y agua segura en ciudad.",
    category: "Urbana",
  },
  {
    src: "/screenshots/app/guides-orientation-compass.jpg",
    alt: "Brújula y orientación offline con posición GPS y guías de orientación",
    caption: "Orientación offline: brújula, posición GPS, guías para orientarse con el sol y método del reloj.",
    category: "Orientación",
  },
  {
    src: "/screenshots/app/guides-first-aid-category.jpg",
    alt: "Categoría Primeros Auxilios con artículos offline de botiquín, hemorragias, quemaduras y fracturas",
    caption: "Primeros Auxilios: botiquín básico, hemorragias, quemaduras, fracturas y golpes de calor.",
    category: "Primeros Auxilios",
  },
  {
    src: "/screenshots/app/guides-food-category.jpg",
    alt: "Categoría Comida con artículos offline de despensa, consumo y cocina sin electricidad",
    caption: "Comida: despensa de emergencia, orden de consumo, cocina sin electricidad y nevera en apagón.",
    category: "Comida",
  },
  {
    src: "/screenshots/app/guides-fire-category.jpg",
    alt: "Categoría Fuego con artículos offline sobre fuego seguro, apagado y monóxido de carbono",
    caption: "Fuego: encendido seguro, apagado correcto, monóxido de carbono y métodos alternativos.",
    category: "Fuego",
  },
  {
    src: "/screenshots/app/guides-urban-crisis-guide.jpg",
    alt: "Guía urbana offline con perfiles, preparación revisada y contenido de crisis en ciudad",
    caption: "Crisis Urbana: guía offline para preparación, discreción, refugio y recuperación en ciudad.",
    category: "Crisis Urbana",
  },
  {
    src: "/screenshots/app/personal-tools.jpg",
    alt: "Herramientas personales con batería, preparación familiar, centro de emergencias e inventario",
    caption: "Herramientas personales: batería, preparación familiar, Caja Negra, inventario, checklists y respaldo.",
    category: "Herramientas",
  },
  {
    src: "/screenshots/app/personal-battery.jpg",
    alt: "Control de batería con autonomía restante, porcentaje y modos de ahorro",
    caption: "Control de batería: autonomía estimada y modos Normal, Ahorro moderado, Ahorro alto y Ultra emergencia.",
    category: "Batería",
  },
  {
    src: "/screenshots/app/personal-family-preparedness.jpg",
    alt: "Preparación Familiar con porcentaje de progreso, estado general, rutas, puntos y recordatorios",
    caption: "Preparación Familiar: progreso, plan familiar, inventario, contactos, rutas, puntos, suministros y recordatorios.",
    category: "Preparación",
  },
  {
    src: "/screenshots/app/personal-family-plan.jpg",
    alt: "Plan Familiar con datos de salud importantes, grupo sanguíneo, alergias y medicación",
    caption: "Plan Familiar: datos de salud importantes, grupo sanguíneo, alergias, medicación y miembros registrados.",
    category: "Plan familiar",
  },
  {
    src: "/screenshots/app/personal-black-box.jpg",
    alt: "Caja Negra con autorización al pulsar SOS, modo, duración y registro local",
    caption: "Caja Negra: autorización previa, modos de registro, duración, registro único y modo automático local.",
    category: "Caja Negra",
  },
  {
    src: "/screenshots/app/personal-contacts.jpg",
    alt: "Contactos con emergencias, Guardia Civil, Policía Nacional, Bomberos y Salvamento Marítimo",
    caption: "Contactos: teléfonos favoritos y números de asistencia visibles para llamada rápida.",
    category: "Contactos",
  },
  {
    src: "/screenshots/app/personal-emergency-center.jpg",
    alt: "Centro de Emergencias con ubicación, linterna SOS Morse, Caja Negra, brújula, frecuencias y mapas offline",
    caption: "Centro de Emergencias: ubicación, linterna SOS Morse, Caja Negra, brújula, frecuencias, mapas e inventario crítico.",
    category: "Centro",
  },
  {
    src: "/screenshots/app/personal-inventory.jpg",
    alt: "Inventario con artículos, litros de agua, autonomía, búsqueda y categorías",
    caption: "Inventario: registra agua, energía, productos críticos, categorías, búsqueda y cantidades útiles.",
    category: "Inventario",
  },
  {
    src: "/screenshots/app/personal-checklists.jpg",
    alt: "Checklists con mochila 72 horas, botiquín completo, casa preparada, apagón y evacuación urgente",
    caption: "Checklists: mochila 72 horas, botiquín, casa preparada, apagón, evacuación urgente y kit de coche.",
    category: "Checklists",
  },
  {
    src: "/screenshots/app/personal-emergency-plans.jpg",
    alt: "Planes de Emergencia con planes familiares, puntos, rutas y contactos",
    caption: "Planes de Emergencia: organiza personas, rutas, contactos y suministros sin conexión.",
    category: "Planes",
  },
  {
    src: "/screenshots/app/personal-locations.jpg",
    alt: "Ubicaciones guardadas para coche, campamento, inicio de ruta o punto seguro",
    caption: "Ubicaciones guardadas: guarda rápidamente coche, campamento, inicio de ruta o punto seguro.",
    category: "Ubicaciones",
  },
  {
    src: "/screenshots/app/personal-offline-map.jpg",
    alt: "Mapa Offline con mapa de España, controles de navegación, puntos, rutas y selector de mapas",
    caption: "Mapa Offline: mapa local, controles de orientación, puntos, rutas y selector de mapas.",
    category: "Mapa Offline",
  },
  {
    src: "/screenshots/app/personal-notes.jpg",
    alt: "Notas Offline con buscador, favoritos y creación de notas locales",
    caption: "Notas Offline: guarda instrucciones, listas, direcciones, protocolos y recordatorios importantes.",
    category: "Notas",
  },
  {
    src: "/screenshots/app/personal-documents.jpg",
    alt: "Documentos y Biblioteca con PDF offline, categorías y documentos guardados en el dispositivo",
    caption: "Documentos y Biblioteca: importa PDF, organiza categorías y guarda documentación para acceso offline.",
    category: "Documentos",
  },
  {
    src: "/screenshots/app/personal-backup.jpg",
    alt: "Respaldo de la app con contraseña de cifrado, exportación, restauración y PDF protegido",
    caption: "Respaldo: copia protegida, restauración desde carpeta, contraseña y PDF personal protegido.",
    category: "Respaldo",
  },
  {
    src: "/screenshots/app/personal-calm.jpg",
    alt: "Calmarme Ahora con sonidos calmantes offline y técnicas de respiración",
    caption: "Calmarme Ahora: sonidos offline, respiración guiada y técnicas 1 minuto, 3 minutos, 5-4-3-2-1 y STOP.",
    category: "Calma",
  },
  {
    src: "/screenshots/app/advanced-resources.jpg",
    alt: "Recursos avanzados con calculadoras, vehículo, comunicación, Morse, frecuencias y modo niños",
    caption: "Recursos avanzados y funciones que utilizan Internet claramente separadas.",
    category: "Recursos",
  },
  {
    src: "/screenshots/app/calculator-list.jpg",
    alt: "Calculadoras de supervivencia con gestión de agua, energía, potabilización, destilación solar, cruce de ríos y conversor",
    caption: "Calculadoras de supervivencia: herramientas prácticas offline con resultados orientativos.",
    category: "Calculadoras",
  },
  {
    src: "/screenshots/app/calculator-water.jpg",
    alt: "Gestión de Agua con autonomía estimada, consumo mínimo diario y nivel de riesgo",
    caption: "Gestión de Agua: calcula consumo diario, autonomía estimada y riesgo orientativo.",
    category: "Agua",
  },
  {
    src: "/screenshots/app/calculator-rain-capture.jpg",
    alt: "Captación de lluvia con modo de cálculo, precipitación, superficie de captación y unidades",
    caption: "Captación de lluvia: estima litros recogidos, recipientes, depósito, autonomía y modo inverso por superficie o lluvia necesaria.",
    category: "Lluvia",
  },
  {
    src: "/screenshots/app/calculator-energy.jpg",
    alt: "Energía y Electricidad con calculadora de powerbank, horas estimadas y cargas de móvil",
    caption: "Energía: estima horas de carga, cargas de móvil y consumo de dispositivos comunes.",
    category: "Energía",
  },
  {
    src: "/screenshots/app/calculator-solar-distillation.jpg",
    alt: "Destilación solar con selección de recipiente, material, superficie, horas de sol y temperatura",
    caption: "Destilación solar: estima rendimiento de un destilador improvisado según condiciones.",
    category: "Destilación",
  },
  {
    src: "/screenshots/app/calculator-hypothermia.jpg",
    alt: "Evaluación de hipotermia con checklist de signos tempranos y moderados",
    caption: "Hipotermia: checklist offline de signos observables y riesgo orientativo.",
    category: "Hipotermia",
  },
  {
    src: "/screenshots/app/calculator-chemical-water.jpg",
    alt: "Potabilización química con producto disponible, volumen de agua, dosis orientativa y protocolo",
    caption: "Potabilización química: dosis orientativa, tiempo de espera y protocolo con avisos sanitarios.",
    category: "Potabilización",
  },
  {
    src: "/screenshots/app/calculator-river-crossing.jpg",
    alt: "Cruce de ríos con anchura, velocidad, profundidad, peso con equipo y resultado de riesgo",
    caption: "Cruce de ríos: evalúa corriente, profundidad y empuje antes de decidir no cruzar o buscar alternativa.",
    category: "Ríos",
  },
  {
    src: "/screenshots/app/calculator-required-speed.jpg",
    alt: "Velocidad necesaria con modos de cálculo, distancia, tiempo manual y límite por luz",
    caption: "Velocidad necesaria: calcula velocidad, ritmo, tiempo, llegada a tiempo y margen según desnivel, terreno, carga y paradas.",
    category: "Velocidad",
  },
  {
    src: "/screenshots/app/calculator-thermal-feel.jpg",
    alt: "Sensación térmica con modo frío, temperatura del aire, velocidad del viento y unidades",
    caption: "Sensación térmica: calcula frío por viento o calor por humedad, nivel de riesgo y consejos rápidos de protección.",
    category: "Sensación térmica",
  },
  {
    src: "/screenshots/app/calculator-daylight-hours.jpg",
    alt: "Horas de luz con modo rápido, hora actual, puesta de sol y margen de seguridad",
    caption: "Horas de luz: calcula luz restante, hora límite recomendada, alerta de margen y si puedes llegar antes del anochecer.",
    category: "Luz",
  },
  {
    src: "/screenshots/app/calculator-converter.jpg",
    alt: "Conversor de supervivencia con categorías de unidades y conversión de litros",
    caption: "Conversor survival: agua, temperatura, peso, distancia, presión, velocidad, energía, superficie y tiempo.",
    category: "Conversor",
  },
  {
    src: "/screenshots/app/calculator-whistle.jpg",
    alt: "Silbatos de emergencia con señales, ejemplos de sonido y patrón escuchado",
    caption: "Silbatos de emergencia: pulsos cortos, largos, SOS, señal alpina y respuesta.",
    category: "Silbato",
  },
  {
    src: "/screenshots/app/calculator-smoke-signals.jpg",
    alt: "Señales de humo con simulación visual de columnas, viento y significado de socorro",
    caption: "Señales de humo: práctica visual de patrones, viento, ráfagas y significado.",
    category: "Humo",
  },
  {
    src: "/screenshots/app/advanced-lunar-calendar.jpg",
    alt: "Calendario lunar con julio de 2026, fase gibosa creciente, iluminación y luz estimada",
    caption: "Calendario lunar: fase, iluminación, edad lunar, luz estimada y próximas fechas.",
    category: "Luna",
  },
  {
    src: "/screenshots/app/advanced-hand-signals.jpg",
    alt: "Señales con las manos con buscador, categorías y señales ALTO, AGACHARSE y SILENCIO",
    caption: "Señales con las manos: comunicación silenciosa para grupos, ruido o emergencias.",
    category: "Señales",
  },
  {
    src: "/screenshots/app/advanced-health.jpg",
    alt: "Salud y Medicación con perfil de salud, grupo sanguíneo, alergias y enfermedades",
    caption: "Salud y Medicación: datos importantes, alergias, grupo sanguíneo, enfermedades y contacto médico.",
    category: "Salud",
  },
  {
    src: "/screenshots/app/advanced-reviews.jpg",
    alt: "Revisiones y Mantenimiento con revisiones mensuales, verano, invierno, app y mochila 72 horas",
    caption: "Revisiones: sistema de mantenimiento para mochilas, temporadas, app y preparación mensual.",
    category: "Revisiones",
  },
  {
    src: "/screenshots/app/advanced-kids-guide.jpg",
    alt: "Guía para Niños con supervivencia para niños, número 112 y explicación de cuándo llamar",
    caption: "Modo Niños: guía tranquila para aprender cuándo llamar al 112 y cómo actuar sin asustar.",
    category: "Niños",
  },
  {
    src: "/screenshots/app/advanced-vehicle.jpg",
    alt: "Supervivencia Vehículo con kit de coche y escenarios de avería, nieve, accidente, riada, incendio y túnel",
    caption: "Vehículo: kit de supervivencia del coche y escenarios de emergencia en carretera.",
    category: "Vehículo",
  },
  {
    src: "/screenshots/app/advanced-communications.jpg",
    alt: "Comunicaciones con Bluetooth Classic, Bluetooth BLE y Wi-Fi Direct",
    caption: "Comunicaciones: explicación de comunicación local sin cobertura mediante Bluetooth y Wi-Fi Direct.",
    category: "Comunicación",
  },
  {
    src: "/screenshots/app/advanced-morse.jpg",
    alt: "Código Morse Offline con SOS, tabla alfabética y traductor local",
    caption: "Código Morse Offline: SOS, tabla de letras y números, traductor local y señales.",
    category: "Morse",
  },
  {
    src: "/screenshots/app/advanced-sos-flashlight.jpg",
    alt: "Linterna SOS Morse con mensaje SOS, vibración sincronizada, pantalla activa y modos de linterna",
    caption: "Linterna SOS Morse: reproduce SOS u otros mensajes cortos con luz, vibración y pantalla activa.",
    category: "Linterna",
  },
  {
    src: "/screenshots/app/advanced-frequencies.jpg",
    alt: "Guía de Frecuencias con PMR 446, CTCSS, canales y aviso de llamar al 112",
    caption: "Guía de Frecuencias: PMR446, CB27, emergencias, radioafición, marítima y aeronáutica.",
    category: "Frecuencias",
  },
  {
    src: "/screenshots/app/settings.jpg",
    alt: "Pantalla de Ajustes con datos guardados, protección por PIN, copia de seguridad, tamaño de letra y modo mayores",
    caption: "Ajustes: revisa datos guardados, activa protección por PIN, exporta copias y adapta el tamaño de letra.",
    category: "Ajustes",
  },
  {
    src: "/screenshots/app/learning-academy.jpg",
    alt: "Academia de supervivencia con rango, progreso de academia, capítulos y preguntas offline",
    caption: "Academia de supervivencia: capítulos, preguntas, progreso, rango y aprendizaje sin conexión.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/learning-dangerous-myths.jpg",
    alt: "Mitos peligrosos con progreso, buscador, categorías y mitos revisados",
    caption: "Mitos peligrosos: desmonta consejos falsos y practica decisiones seguras.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/learning-home-objects.jpg",
    alt: "Objetos de Casa con progreso, buscador, categorías y usos prácticos",
    caption: "Objetos de Casa: usos alternativos, combinaciones, riesgos y retos cotidianos.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/learning-family.jpg",
    alt: "Aprendizaje Familiar con itinerario, lecciones aplicadas y preparación familiar",
    caption: "Aprendizaje Familiar: reparte responsabilidades, define puntos de encuentro y convierte teoría en tareas.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/learning-72-hours-game.jpg",
    alt: "Mini juego 72 horas con reto jugable offline, preparación, decisiones y botón Jugar",
    caption: "Juego 72 horas: mini juego offline para que los niños aprendan preparación jugando.",
    category: "Aprendizaje",
  },
  {
    src: "/screenshots/app/ai-encyclopedia.jpg",
    alt: "Asistente Offline IA, recursos, panel de preparación, plantas, huerto y desastres",
    caption: "IA y enciclopedia: asistente offline, recursos, nudos útiles, plantas, huerto, comparativas y desastres.",
    category: "IA",
  },
  {
    src: "/screenshots/app/encyclopedia-offline-resources.jpg",
    alt: "Recursos Offline con recursos instalados, modelo IA, motor IA, mapa base y buscador",
    caption: "Recursos Offline: controla modelos, mapas, rutas y archivos grandes preparados antes de perder cobertura.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-prep-panel.jpg",
    alt: "Panel de Preparación con nivel, alertas activas, agua, comida, checklists y estado general",
    caption: "Panel de Preparación: muestra un nivel orientativo y señala qué partes conviene completar primero.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-comparisons.jpg",
    alt: "Biblioteca comparativa con búsqueda, filtros y comparativa de potabilización de agua",
    caption: "Biblioteca comparativa: compara métodos, equipo y límites para decidir con más contexto.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-plants-animals.jpg",
    alt: "Plantas y Animales con aviso de seguridad, plantas peligrosas, comestibles, animales y hongos peligrosos",
    caption: "Plantas y Animales: fichas educativas con avisos claros para evitar identificaciones peligrosas.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-natural-disasters.jpg",
    alt: "Desastres Naturales con guía offline, DANA, terremoto, incendio forestal, tormenta eléctrica y ola de calor",
    caption: "Desastres Naturales: guías offline organizadas por escenario, prioridad y actuación.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-offline-assistant.jpg",
    alt: "Asistente Offline activo con modelo externo, motor registrado, contexto offline y pregunta rápida",
    caption: "Asistente Offline: busca en guías, inventario, checklists y notas, y usa modelo local si está disponible.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-knots.jpg",
    alt: "Nudos útiles con buscador, filtros, lista de nudos y recomendador",
    caption: "Nudos útiles: fichas prácticas con búsqueda, filtros, dificultad, usos y favoritos.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-spain-plants.jpg",
    alt: "Plantas de España con fichas offline, comestibles, peligrosas, medicinales y buscador",
    caption: "Plantas de España: fichas offline por tipo con aviso de seguridad y búsqueda por nombre, zona o uso.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-garden.jpg",
    alt: "Huerto de supervivencia con planificador familiar, personas, objetivo, tipo de huerto, comunidad y clima",
    caption: "Huerto: planificador familiar offline para decidir qué plantar, cuándo, cuánta agua y qué semillas preparar.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-hunting-fishing.jpg",
    alt: "Caza y Pesca con pesca de supervivencia, lección seleccionada y fichas editables",
    caption: "Pesca de supervivencia: fichas educativas para evaluar el entorno, el agua, riesgos y normativa.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/encyclopedia-hunting.jpg",
    alt: "Caza de Supervivencia con huellas y rastros, fichas visuales, referencia de tamaño y verificación",
    caption: "Caza de supervivencia: aprendizaje de huellas y rastros con enfoque legal, responsable y de emergencia.",
    category: "IA y enciclopedia",
  },
  {
    src: "/screenshots/app/internet-alerts.jpg",
    alt: "Pantalla de alertas de catástrofes con fuentes GDACS, EMSC e IFRC, zona, tipo de alerta y aviso de incendio forestal",
    caption: "Alertas online: fuentes externas, zona elegida, tipo de alerta, ubicación aproximada y enlace a la fuente.",
    category: "Alertas",
  },
  {
    src: "/screenshots/app/internet-weather.jpg",
    alt: "Pantalla de El Tiempo con temperatura, humedad, viento, precipitación, amanecer, atardecer y aviso de calor",
    caption: "El Tiempo: previsión con temperatura, sensación, humedad, viento, lluvia y avisos de supervivencia.",
    category: "Tiempo",
  },
  {
    src: "/screenshots/app/sos.jpg",
    alt: "Modo SOS con botón Activar SOS, llamada al 112 y contactos favoritos",
    caption: "Modo SOS: llamada al 112, señales internacionales y Caja Negra solo si está autorizada.",
    category: "SOS",
  },
  {
    src: "/screenshots/app/crisis-mode.jpg",
    alt: "Modo Crisis con listado de emergencias ordenables y botón para añadir nueva crisis",
    caption: "Modo Crisis: emergencias ordenables, crisis personalizadas y acceso rápido a instrucciones.",
    category: "Modo Crisis",
  },
];

type AppUseCase = {
  title: string;
  text: string;
  image: string;
  alt: string;
  points: string[];
  images?: Array<{
    src: string;
    alt: string;
  }>;
};
const appUseCases: AppUseCase[] = [
  {
    title: "Pantalla principal: todo empieza desde un centro claro",
    text: "La app abre con modo offline activo, buscador, avisos de zona, favoritos y accesos rápidos. La idea es que una persona no tenga que recordar dónde está cada herramienta cuando está nerviosa.",
    image: "/screenshots/app/home.jpg",
    alt: "Pantalla principal de Modo Crisis Survival",
    points: ["Buscador central", "Avisos visibles", "Modo Crisis", "SOS", "Brújula offline"],
  },
  {
    title: "Modo Crisis: elegir la emergencia y actuar por prioridades",
    text: "El usuario selecciona qué está ocurriendo: apagón, sin cobertura, falta de agua, heridos, falta de comida, evacuación u otras crisis personalizadas. La app ordena el caos en pasos consultables.",
    image: "/screenshots/app/crisis-mode.jpg",
    alt: "Pantalla de Modo Crisis con emergencias ordenables",
    points: ["Emergencias ordenables", "Añadir nueva crisis", "Instrucciones inmediatas", "Uso offline"],
  },
  {
    title: "SOS: ayuda rápida sin prometer lo que no hace",
    text: "El modo SOS prioriza llamada al 112, señal visual, contactos favoritos y herramientas de socorro. La Caja Negra se muestra con claridad y solo debe activarse si el usuario la autoriza.",
    image: "/screenshots/app/sos.jpg",
    alt: "Pantalla Modo SOS con llamada al 112",
    points: ["Llamar al 112", "Contactos favoritos", "Señales de socorro", "Caja Negra autorizada"],
  },
  {
    title: "Herramientas y recursos: una biblioteca organizada por tareas",
    text: "Las funciones no aparecen como una lista interminable: están agrupadas en guías, herramientas personales, recursos avanzados, aprendizaje interactivo, IA y enciclopedia, y contenidos con Internet cuando lo necesitan.",
    image: "/screenshots/app/advanced-resources.jpg",
    alt: "Pantalla de recursos avanzados de Modo Crisis Survival",
    points: ["Herramientas personales", "Recursos avanzados", "Guías", "IA y enciclopedia", "Favoritos", "Categorías"],
  },
];

function isConfiguredDonationUrl(value: string) {
  return Boolean(value && !/configurar|pendiente|añadir/i.test(value));
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-badge"><span className="pulse-dot" aria-hidden />Modo offline activo · Preparación, crisis y supervivencia</p>
          <h1>La aplicación de supervivencia offline diseñada para emergencias reales</h1>
          <p className="lead">
            Modo Crisis Survival convierte tu teléfono móvil en una completa herramienta de preparación, orientación y supervivencia, incluso cuando no tienes conexión a Internet.
          </p>
          <p>
            En un apagón, una catástrofe natural, una avería en una zona aislada o una pérdida de cobertura, muchas funciones habituales del teléfono dejan de estar disponibles. Esta app está pensada para que la información y las herramientas importantes sigan contigo.
          </p>
          <div className="actions">
            <DownloadDonationGate
              apkUrl={siteConfig.apkUrl}
              label="Descargar aplicacion para Android"
            />
            <TrackedDonationLink className="hero-donate-button" href="/donaciones">
              <HeartHandshake size={20} aria-hidden />
              <span>
                <strong>Apoyar el proyecto</strong>
                <small>Ayuda a mantener la app viva</small>
              </span>
            </TrackedDonationLink>
            <Link className="hero-download-center-button" href="/centro-descargas">
              <HardDriveDownload size={20} aria-hidden />
              <span>
                <strong>Centro de descargas</strong>
                <small>Mapas, IA y cómo instalarlo</small>
              </span>
            </Link>
            <Link className="hero-report-button" href="/contacto#reportar-fallo">
              <Bug size={20} aria-hidden />
              <span>
                <strong>Reportar fallo</strong>
                <small>Avisa de errores facilmente</small>
              </span>
            </Link>
            <Link className="update-notice-button" href="/actualizaciones" aria-label="Ver actualización disponible de Modo Crisis Survival">
              <span>Nueva actualización</span>
              <strong>{siteConfig.currentVersion}</strong>
              <small>Revisa cambios antes de descargar</small>
            </Link>
          </div>
          <p className="hero-donation-note">
            Supervivencia Offline es gratuita y completa. Las aportaciones son voluntarias y ayudan a mantener la web, mejorar la app, corregir errores y preparar nuevos recursos offline.
          </p>
          <PublicHomeCounters donatedEuros={siteConfig.donations.donatedEuros} />
          <ul className="hero-pills" aria-label="Puntos destacados">
            <li>Modo Crisis</li>
            <li>SOS y 112</li>
            <li>Mapas MBTiles</li>
            <li>Favoritos</li>
            <li>IA local opcional</li>
          </ul>
        </div>
        <div className="hero-visual" aria-label="Captura de Modo Crisis Survival en teléfono">
          <div className="radar-ring" aria-hidden />
          <span className="float-chip chip-sos">SOS 112</span>
          <span className="float-chip chip-offline">99 % offline</span>
          <span className="float-chip chip-map">MBTiles</span>
          <div className="topo-grid" aria-hidden />
          <div className="app-brand-card">
            <img
              src={siteConfig.logo}
              alt="Logo de Modo Crisis Survival"
              width={512}
              height={512}
              decoding="async"
            />
            <span>v4.0 Ultra · confirmar APK final</span>
          </div>
          <div className="phone-mockup real-screen">
            <ResponsiveImage
              src={siteConfig.heroImage}
              alt="Pantalla principal de Modo Crisis Survival"
              width={576}
              height={880}
              widths={[360, 576]}
              sizes="(max-width: 768px) 76vw, 336px"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Barra de confianza">
        {trustItems.map((item) => <span key={item}>{item}</span>)}
      </section>

      <section className="content-band app-explainer">
        <SectionHeader
          eyebrow="Qué hace la aplicación"
          title="Prepararse, consultar y actuar desde el mismo sitio"
          description="La web ahora se apoya en capturas reales y en la estructura de la app: cada bloque explica qué puede hacer la persona antes, durante y después de una emergencia."
        />
        <div className="stats-grid" aria-label="Datos reales de la aplicación">
          {appStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
        <div className="use-case-grid">
          {appUseCases.map((item, index) => (
            <article className={item.images ? "use-case-card use-case-card-collage" : "use-case-card"} key={item.title}>
              <div className="use-case-copy">
                <span className="step-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div className={item.images ? "use-case-collage" : "use-case-phone"} aria-label={item.images ? item.alt : undefined}>
                {item.images ? (
                  item.images.map((image) => (
                    <ResponsiveImage
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      width={576}
                      height={1280}
                      widths={[240, 360, 576]}
                      sizes="(max-width: 760px) 46vw, 150px"
                      loading="lazy"
                      decoding="async"
                    />
                  ))
                ) : (
                  <ResponsiveImage
                    src={item.image}
                    alt={item.alt}
                    width={576}
                    height={880}
                    widths={[240, 360]}
                    sizes="(max-width: 768px) 72vw, 260px"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Módulos de la app"
          title="Una experiencia organizada como una herramienta real, no como un folleto"
        />
        <div className="module-grid">
          {moduleGroups.map((group) => (
            <article className="module-card" key={group.title}>
              <div className="module-shot">
                <ResponsiveImage
                  src={group.image}
                  alt={`Captura de ${group.title}`}
                  width={576}
                  height={880}
                  widths={[240, 360]}
                  sizes="(max-width: 768px) 84px, 170px"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <span>{group.kicker}</span>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <ul>
                  {group.items.map((item) => <li key={item}><CheckCircle2 aria-hidden />{item}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Flujos reales"
          title="Qué haría una persona con la app"
        />
        <div className="flow-grid">
          {realFlows.map((flow) => (
            <article className="flow-card" key={flow.title}>
              <h3>{flow.title}</h3>
              <p>{flow.text}</p>
              <div>
                {flow.steps.map((step) => <span key={step}>{step}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Recursos offline"
          title="Mapas, modelos y contenido preparados para uso local"
        />
        <div className="resource-panel">
          <div className="resource-heading">
            <Database aria-hidden />
            <h3>Arquitectura de recursos</h3>
            <p>Contenido local, mapas MBTiles, modelos GGUF y carpetas externas pensadas para ampliar la app sin rehacerla.</p>
          </div>
          <div className="resource-list">
            {resourceDetails.map((resource) => (
              <article key={resource.title}>
                <h4>{resource.title}</h4>
                <p>{resource.text}</p>
                <div>{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Problema y solución"
          title="Cuando Internet desaparece, la información importante debe seguir contigo"
          description="Durante un apagón, una inundación, un incendio, una tormenta, una avería en una zona aislada o una pérdida de cobertura, el móvil puede dejar de acceder a buscadores, mapas online, vídeos y servicios en la nube."
        />
        <div className="comparison-table" role="table" aria-label="Comparativa con aplicaciones convencionales">
          <div role="row"><strong>Aplicaciones convencionales</strong><strong>Modo Crisis Survival</strong></div>
          {[
            ["Dependen frecuentemente de Internet", "La mayoría de funciones trabajan offline"],
            ["La información está dispersa", "Herramientas y guías reunidas"],
            ["Mapas principalmente online", "Compatibilidad con mapas MBTiles"],
            ["Sin planificación familiar integrada", "Planes, inventarios y checklists"],
            ["Información difícil de localizar", "Buscador, favoritos y accesos rápidos"],
          ].map(([a, b]) => <div role="row" key={a}><span>{a}</span><span>{b}</span></div>)}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader eyebrow="Funciones destacadas" title="Una sola app para prepararte, orientarte y actuar" />
        <FeatureGrid features={features.filter((feature) => !["sos", "vehicle", "black-box", "plants"].includes(feature.id))} />
      </section>

      <section className="content-band permissions-section">
        <SectionHeader
          eyebrow="Permisos de la app"
          title="Por qué la app puede pedir permisos sensibles"
          description="La aplicación puede pedir permisos como ubicación, cámara, micrófono, archivos o notificaciones solo cuando una función concreta los necesita. Por ejemplo: ubicación para coordenadas y mapas, cámara o micrófono para Caja Negra si el usuario la autoriza, archivos para importar mapas, IA o documentos, y notificaciones para recordatorios."
        />
        <div className="permission-grid">
          {permissionGroups.map((group) => (
            <article className="permission-card" key={group.title}>
              <ShieldCheck aria-hidden />
              <h3>{group.title}</h3>
              <p>{group.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Capturas de la app"
          title="Todo lo que encontrarás en la aplicación"
        />
        <DeferredScreenshotGallery assets={screenshotAssets} />
      </section>

      {siteConfig.donations.enabled ? <section className="content-band donation-section">
        <div className="donation-copy">
          <SectionHeader
            eyebrow="Donaciones"
            title="Ayuda a mantener vivo el proyecto"
            description="Las donaciones son voluntarias. La app sigue siendo completa para todos: tu apoyo ayuda a cubrir mantenimiento, recursos, pruebas y futuras actualizaciones."
          />
          <div className="actions">
            <TrackedDonationLink className="hero-donate-button" href="/donaciones">
              <HeartHandshake size={18} aria-hidden /> Ver cómo donar
            </TrackedDonationLink>
            <TrackedDonationLink className="button secondary" href="/donaciones">Por qué apoyar</TrackedDonationLink>
          </div>
        </div>
        <div className="donation-card">
          <HeartHandshake aria-hidden />
          <h3>Apoyo voluntario, impacto real</h3>
          <p>{siteConfig.donations.note}</p>
          <div className="donation-platforms" aria-label="Opciones de donación">
            <span>PayPal: {isConfiguredDonationUrl(siteConfig.donations.paypalUrl) ? "configurado" : "pendiente"}</span>
            <span>Bizum: {/configurar|pendiente|añadir/i.test(siteConfig.donations.bizumInfo) ? "pendiente" : "configurado"}</span>
            <span>Ko-fi: {isConfiguredDonationUrl(siteConfig.donations.kofiUrl) ? "configurado" : "pendiente"}</span>
            <span>Patreon: {isConfiguredDonationUrl(siteConfig.donations.patreonUrl) ? "configurado" : "pendiente"}</span>
          </div>
        </div>
      </section> : null}

      <DownloadCard />
      <SafetyWarning>
        Modo Crisis Survival ofrece información educativa y herramientas de apoyo. No garantiza la seguridad ni sustituye formación profesional, instrucciones de autoridades, servicios de emergencia, médicos o sanitarios.
      </SafetyWarning>
      <Link className="mobile-download-bar" href="/descargar"><Map aria-hidden /> Descargar la app</Link>
    </>
  );
}
