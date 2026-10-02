import { portalContent, portalTopics, type PortalItem } from './portal';
import { contentsForTopic, topicDirectory } from './topic-directory';
import { catalogPageSize } from '@/lib/catalog-pagination';
export { catalogPageHref, catalogPageSize } from '@/lib/catalog-pagination';

export type Catalog = { key: string; href: string; title: string; description: string; items: PortalItem[] };
export const catalogs: Catalog[] = [
  { key: 'articulos', href: '/supervivencia', title: 'Artículos de supervivencia y preparación', description: 'Explicaciones, actualidad y análisis para tomar decisiones con más contexto.', items: portalContent.filter(p => p.kind === 'Artículo') },
  { key: 'guias', href: '/guias-supervivencia', title: 'Guías de supervivencia', description: 'Guías de agua, energía, orientación, hogar y familia para preparar tus próximos pasos.', items: portalContent.filter(p => p.kind === 'Guía') },
  { key: 'comparativas', href: '/comparativas', title: 'Comparativas de equipo', description: 'Características, ventajas, limitaciones y criterios importantes antes de comprar.', items: portalContent.filter(p => p.kind === 'Comparativa') },
  { key: 'temas', href: '/temas', title: 'Todos los temas de supervivencia', description: 'Artículos, guías, comparativas y herramientas de preparación.', items: portalContent },
  { key: 'preparacion-practica', href: '/preparacion-practica', title: 'Preparación práctica', description: 'Inventario, documentos, mapas, batería y ejercicios familiares.', items: portalContent.filter(p => p.href.startsWith('/preparacion-practica/')) },
  ...topicDirectory.map(topic => ({ key: `temas/${topic.slug}`, href: `/temas/${topic.slug}`, title: topic.title, description: topic.description, items: contentsForTopic(topic.slug) })),
  ...portalTopics.filter(topic => portalContent.some(p => p.kind === 'Guía' && p.topic === topic[0])).map(topic => ({ key: `guias/${topic[0]}`, href: `/guias-supervivencia/${topic[0]}`, title: `Guías de ${topic[1].toLowerCase()}`, description: topic[2], items: portalContent.filter(p => p.kind === 'Guía' && p.topic === topic[0]) })),
];

export function catalogPageCount(catalog: Catalog) {
  return Math.max(1, Math.ceil(catalog.items.length / catalogPageSize));
}
export function paginatedCatalogs() {
  return catalogs.flatMap(catalog => Array.from({ length: catalogPageCount(catalog) - 1 }, (_, i) => ({ catalog, page: i + 2 })));
}
export function resolveCatalogPage(segments: string[]) {
  const number = segments.at(-1) || '';
  if (!/^[1-9]\d*$/.test(number)) return undefined;
  const page = Number(number);
  const catalog = catalogs.find(item => item.key === segments.slice(0, -1).join('/'));
  if (!catalog || page < 2 || page > catalogPageCount(catalog)) return undefined;
  return { catalog, page };
}
