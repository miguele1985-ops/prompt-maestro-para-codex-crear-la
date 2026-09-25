export const amazonAffiliateTag = "cociesfaci-21";

export function amazonSearchUrl(query: string) {
  const params = new URLSearchParams({
    k: query,
    tag: amazonAffiliateTag,
  });
  return `https://www.amazon.es/s?${params.toString()}`;
}

export const affiliateDisclosure =
  "Esta página contiene enlaces de afiliado de Amazon. Si compras a través de ellos, el proyecto puede recibir una comisión sin coste adicional para ti. La preparación urgente, el 112 y las guías críticas no dependen de comprar nada.";

export const comparisonCategories = [
  {
    slug: "filtros-agua",
    title: "Filtros de agua portátiles",
    summary:
      "Compara filtros para rutas, mochila de emergencia o reposición básica. Ningún filtro convierte cualquier agua en segura: revisa bacterias, protozoos, virus y límites químicos.",
    amazonQuery: "filtro agua portatil supervivencia",
    guideHref: "/blog/filtros-agua-portatiles-comparativa-riesgo",
    checklist: ["Tipo de contaminante", "Litros por cartucho", "Recambios disponibles", "Facilidad de limpieza", "Peso real en mochila"],
  },
  {
    slug: "baterias-externas",
    title: "Baterías externas y powerbanks",
    summary:
      "El número de mAh no equivale directamente a cargas completas. Mira Wh, salidas, cables compatibles, peso y uso real del teléfono durante una emergencia.",
    amazonQuery: "powerbank 20000mah carga rapida",
    guideHref: "/blog/calculadora-energia-powerbank-emergencia",
    checklist: ["Wh y capacidad útil", "USB-C y cables", "Peso", "Linterna integrada si procede", "Carga de varios dispositivos"],
  },
  {
    slug: "radios-emergencia",
    title: "Radios de emergencia",
    summary:
      "Una radio aporta una vía distinta al móvil si hay cortes de luz o red. Revisa pilas, batería, carga USB y facilidad de uso antes de necesitarla.",
    amazonQuery: "radio emergencia manivela solar",
    guideHref: "/blog/radio-frecuencias-emergencia-sin-cobertura",
    checklist: ["AM/FM", "Pilas reemplazables", "USB", "Linterna", "Uso sencillo con poca luz"],
  },
  {
    slug: "linternas-frontales",
    title: "Linternas frontales",
    summary:
      "Una frontal deja las manos libres para revisar el cuadro eléctrico, caminar o atender a otra persona. Valora autonomía más que lúmenes extremos.",
    amazonQuery: "linterna frontal recargable emergencia",
    guideHref: "/blog/como-prepararse-para-un-apagon",
    checklist: ["Autonomía baja/media", "Carga USB o pilas", "Comodidad", "Modo rojo", "Resistencia a salpicaduras"],
  },
  {
    slug: "botiquines",
    title: "Botiquines y reposición",
    summary:
      "Un botiquín comprado debe adaptarse a tu familia. Revisa guantes, gasas, apósitos, medicación propia y fechas antes de guardarlo.",
    amazonQuery: "botiquin emergencia casa completo",
    guideHref: "/blog/botiquin-emergencia-casa",
    checklist: ["Guantes", "Gasas y apósitos", "Tijeras", "Manta térmica", "Espacio para medicación personal"],
  },
];
