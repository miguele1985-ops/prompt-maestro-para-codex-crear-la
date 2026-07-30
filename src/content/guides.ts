import type { GuideCategory } from "@/types/content";

export const guideCategories: GuideCategory[] = [
  "Agua", "Alimentación", "Primeros auxilios", "Fuego", "Refugios", "Orientación",
  "Comunicación", "Seguridad familiar", "Hogar preparado", "Supervivencia con vehículo",
  "Energía", "Supervivencia urbana", "Catástrofes en España", "Psicología y estrés",
  "Higiene y salud", "Supervivencia en montaña", "Campamento y exterior", "Guías para niños",
  "Guías para personas mayores", "Seguridad personal", "Plantas y animales", "Desastres naturales",
  "Habilidades outdoor", "Caza de supervivencia", "Pesca de supervivencia", "Nudos útiles"
].map((title, index) => ({
  id: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title,
  description: "Categoría preparada para artículos editables, favoritos y filtros dentro de la aplicación.",
  articleCountLabel: index === 0 ? "Artículos reales: pendiente de añadir" : "Preparada para ampliar",
}));

export const blogArticles = [
  "Qué debe incluir una aplicación de supervivencia offline",
  "Cómo prepararse para un apagón",
  "Cómo crear un plan familiar de emergencia",
  "Qué guardar en una mochila de 72 horas",
  "Cómo utilizar mapas offline",
  "Qué es un archivo MBTiles",
  "Cómo ahorrar batería durante una emergencia",
  "Qué hacer cuando no hay cobertura",
  "Cómo guardar agua para emergencias",
  "Cómo preparar el coche para una avería",
  "Qué hacer durante una DANA",
  "Diferencias entre alertas oficiales y avisos meteorológicos",
  "Cómo preparar a los niños sin asustarlos",
  "Qué documentación conviene tener disponible",
  "Cómo revisar un kit de emergencia",
];
