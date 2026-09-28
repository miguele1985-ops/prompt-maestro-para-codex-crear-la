import { orderedBlogPosts } from "./blog";
import { practicalGuides } from "./practical-guides";
import { readingMinutes } from "@/lib/editorial";

export type ContentKind = "Guía" | "Artículo" | "Comparativa" | "Calculadora" | "Checklist" | "App" | "Herramienta";
export type PortalItem = {
  href: string;
  title: string;
  excerpt: string;
  kind: ContentKind;
  topic: string;
  image?: string;
  alt?: string;
  minutes?: number;
  date?: string;
};
export const webCalculators: Record<string, string> = {
  "calculadora-gestion-agua-supervivencia": "Reserva de agua",
  "calculadora-captacion-lluvia-supervivencia": "Captación de lluvia",
  "calculadora-energia-powerbank-emergencia": "Energía y powerbanks",
  "calculadora-velocidad-necesaria-ruta": "Velocidad necesaria",
  "calculadora-sensacion-termica-frio-calor": "Sensación térmica",
  "calculadora-horas-luz-ruta": "Horas de luz",
  "calculadora-potabilizacion-quimica-agua": "Potabilización química: pauta de etiqueta",
  "calculadora-destilacion-solar-agua": "Destilación solar",
  "calculadora-cruce-rios-seguridad": "Cruce de ríos: límites y corriente",
  "calculadora-conversor-survival-unidades": "Conversor survival",
  "calculadora-silbato-emergencia-senales": "Silbatos de emergencia",
  "calculadora-senales-humo-supervivencia": "Señales de humo",
  "calculadora-hipotermia-riesgo": "Hipotermia: signos observables",
};
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const portalTopics = [
  ["agua", "Agua", "Reserva, captación y tratamiento", "reserva-agua-natural"],
  [
    "alimentacion",
    "Alimentación",
    "Conservación y planificación de alimentos",
    "familia-preparada-natural",
  ],
  [
    "primeros-auxilios",
    "Primeros auxilios",
    "Botiquín y preparación de cuidados",
    "botiquin-natural",
  ],
  ["refugio", "Refugio y hogar", "Organización y protección del hogar", "hogar-calor-natural"],
  ["orientacion", "Orientación", "Mapas y preparación de rutas", "aprendizaje-campo-natural"],
  [
    "energia",
    "Apagones y energía",
    "Baterías, iluminación y autonomía",
    "energia-comunicacion-natural",
  ],
  [
    "comunicacion",
    "Comunicación",
    "Contactos, señales y comunicación sin cobertura",
    "energia-comunicacion-natural",
  ],
  ["vehiculo", "Vehículo", "Preparación del coche y desplazamientos", "equipo-coche-natural"],
  ["equipo", "Mochila y equipo", "Organiza y revisa el material", "mochila-natural"],
  [
    "familia",
    "Preparación familiar",
    "Acuerdos, documentos y práctica en casa",
    "familia-preparada-natural",
  ],
  [
    "naturaleza",
    "Montaña y naturaleza",
    "Observación de plantas, fauna y exterior",
    "aprendizaje-campo-natural",
  ],
  ["nudos", "Nudos", "Funciones, práctica y límites de uso", "practica-cuerda-natural"],
  [
    "desastres",
    "Desastres naturales",
    "Alertas, evacuación y prevención",
    "lluvia-prevencion-editorial",
  ],
] as const;
export function portalTopic(slug: string): string {
  const s = normalize(slug);
  if (/que-hacer-si-te-pierdes/.test(s)) return "orientacion";
  if (/tormenta-solar/.test(s)) return "energia";
  if (/confinamiento-emergencia/.test(s)) return "refugio";
  if (/medicamentos-tratamientos/.test(s)) return "primeros-auxilios";
  if (/caza|pesca/.test(s)) return "naturaleza";
  if (/ciberataque|desinformacion/.test(s)) return "comunicacion";
  if (/cadena-suministro/.test(s)) return "alimentacion";
  if (/espana-2030/.test(s)) return "desastres";
  if (/nudo/.test(s)) return "nudos";
  if (/dana|inundacion|incendio|alert|eclipse|verano|calor-extremo/.test(s)) return "desastres";
  if (/agua|lluvia|potabiliza|destilacion/.test(s)) return "agua";
  if (/alimento|comida/.test(s)) return "alimentacion";
  if (/botiquin|medic|mayores/.test(s)) return "primeros-auxilios";
  if (/coche|vehiculo|semaforo|averia/.test(s)) return "vehiculo";
  if (/planta|fauna|animales|seta|huerto|mascota|termica|hipotermia/.test(s)) return "naturaleza";
  if (/mapa|gps|ruta|luz-ruta|rios|orienta/.test(s)) return "orientacion";
  if (/radio|cobertura|contact|senal|silbato|sos/.test(s)) return "comunicacion";
  if (/apagon|energia|bateria|powerbank|generador|linterna|luz-y/.test(s)) return "energia";
  if (/mochila|equipo|kit|conversor/.test(s)) return "equipo";
  if (/refugio|casa|hogar|vivienda/.test(s)) return "refugio";
  return "familia";
}
export function editorialCover(slug: string) {
  const guide = practicalGuides.find(item => item.slug === slug);
  if (guide) return { image: `/screenshots/app/${guide.image}.jpg`, alt: `Pantalla de la app: ${guide.title}.` };
  const specific: Record<string, {image: string; alt: string}> = {
    nudos: { image: '/images/blog/nudos-basicos-supervivencia-practica.jpg', alt: 'Cuerda preparada para practicar nudos sin carga. Imagen ilustrativa.' },
    plantas: { image: '/screenshots/app/encyclopedia-plants-animals.jpg', alt: 'Biblioteca de plantas y animales de la app.' },
    senales: { image: '/screenshots/app/advanced-hand-signals.jpg', alt: 'Guía de señales con las manos de la app.' },
  };
  if (specific[slug]) return specific[slug];
  const topic = portalTopics.find((t) => t[0] === portalTopic(slug))!;
  return {
    image: `/images/blog/${topic[3]}.jpg`,
    alt: `${topic[1]}. Imagen editorial ilustrativa generada con IA.`,
  };
}
export function contentKind(slug: string, category: string): ContentKind {
  if (webCalculators[slug]) return "Calculadora";
  if (/^calculadora-|aplicacion|^app-|archivo-mbtiles/.test(slug)) return "App";
  if (
    /generador-en-casa-normativa|lluvia-autoconsumo|bateria-10000|gps-movil|diferencias-alertas/.test(
      slug,
    )
  )
    return "Artículo";
  if (slug === "kit-de-emergencia-para-el-coche-que-llevar-en-2026") return "Guía";
  if (category === "Comparativas") return "Comparativa";
  if (/Actualidad|Aprendizaje|Supervivencia práctica/.test(category) || /mitos|que-ha-cambiado|que-es-/.test(slug))
    return "Artículo";
  return "Guía";
}
export const portalContent: PortalItem[] = [
  {href:'/calendario-lunar',title:'Calendario lunar',excerpt:'Fases aproximadas y fracción iluminada por día. No equivale a visibilidad nocturna.',kind:'Herramienta',topic:'orientacion'},
  { href: "/codigo-morse", title: "Código Morse", excerpt: "Traductor de texto, puntos y rayas con alfabeto de consulta.", kind: "Herramienta", topic: "comunicacion" },
  ...orderedBlogPosts.map((p) => ({
    href: `/supervivencia/${p.slug}`,
    title: p.title,
    excerpt: p.excerpt,
    kind: contentKind(p.slug, p.category),
    topic: portalTopic(p.slug),
    ...(webCalculators[p.slug] ? {} : p.image.startsWith("/screenshots/")
      ? editorialCover(p.slug)
      : { image: p.image, alt: p.imageAlt }),
    minutes: readingMinutes(p),
    date: p.updatedAt || p.publishedAt,
  })),
  ...practicalGuides.map((g) => ({
    href: `/preparacion-practica/${g.slug}`,
    title: g.title,
    excerpt: g.summary,
    kind: "Guía" as const,
    topic: portalTopic(g.slug),
    ...editorialCover(g.slug),
  })),
  {
    href: "/checklists",
    title: "Listas de preparación",
    excerpt: "Marca tareas, revisa tu progreso y descarga o imprime tu lista.",
    kind: "Checklist",
    topic: "familia",
  },
  {
    href: "/nudos",
    title: "Nudos por función",
    excerpt: "19 fichas con usos y límites para practicar sin carga.",
    kind: "Guía",
    topic: "nudos",
    ...editorialCover("nudos"),
  },
  {
    href: "/plantas-y-fauna",
    title: "Plantas y observación del entorno",
    excerpt: "Fotografías y criterios de observación, sin identificar comestibilidad.",
    kind: "Guía",
    topic: "naturaleza",
    ...editorialCover("plantas"),
  },
  {
    href: "/senales-en-grupo",
    title: "Señales para tu grupo",
    excerpt: "Láminas y ejercicios para acordar señales antes de salir.",
    kind: "Guía",
    topic: "comunicacion",
    ...editorialCover("senales"),
  },
];
export const webTools = portalContent
  .filter((p) => p.kind === "Calculadora" || p.kind === "Checklist" || p.kind === "Herramienta")
  .map((p) => ({
    ...p,
    href: p.kind === "Calculadora" ? `${p.href}#calculadora` : p.href,
    title: webCalculators[p.href.split("/").pop()!] || p.title,
    image: undefined,
  }));
