import { portalContent, portalTopics, type PortalItem } from './portal';

export const topicDirectory = [
  ...portalTopics.map(([slug, title, description, image]) => ({ slug, title, description, image })),
  { slug: 'frecuencias', title: 'Guías de frecuencia', description: 'Radio, recepción y preparación de comunicaciones.', image: 'energia-comunicacion-natural' },
  { slug: 'calendario-lunar', title: 'Calendario lunar', description: 'Fases de la Luna y planificación de luz.', image: 'aprendizaje-campo-natural' },
  { slug: 'plantas-espana', title: 'Plantas de España', description: 'Observación, fotografías y límites de identificación.', image: 'aprendizaje-campo-natural' },
  { slug: 'huertos', title: 'Huertos', description: 'Espacio, agua y observación antes de sembrar.', image: 'reserva-agua-natural' },
  { slug: 'comparativas', title: 'Comparativas', description: 'Criterios para elegir equipo sin compras innecesarias.', image: 'mochila-natural' },
  { slug: 'caza', title: 'Caza y observación de fauna', description: 'Preparación, rastros y límites legales y sanitarios.', image: 'caza-observacion-editorial' },
  { slug: 'pesca', title: 'Pesca', description: 'Preparar una salida, material y cuidado del entorno.', image: 'pesca-ribera-editorial' },
  { slug: 'mitos', title: 'Mitos de supervivencia', description: 'Contrastar consejos antes de ponerlos en práctica.', image: 'familia-preparada-natural' },
  { slug: 'cosas-de-casa', title: 'Cosas de casa', description: 'Aprovechar, organizar y revisar lo que ya tienes.', image: 'familia-preparada-natural' },
].map(t => t.slug === 'naturaleza' ? { ...t, title: 'Plantas, animales y naturaleza' } : t);

const matches: Record<string, RegExp> = {
  frecuencias: /radio|frecuencia|cobertura|codigo-morse/,
  'calendario-lunar': /calendario-lunar|horas-luz/,
  'plantas-espana': /plantas|setas/,
  huertos: /huerto/,
  caza: /caza|animales|fauna/,
  pesca: /pesca|nudos/,
  mitos: /mitos|desinformacion/,
  'cosas-de-casa': /objetos-casa|objetos-de-casa|inventario|revision-por-temporadas|hogar|casa-principiantes/,
};
export function contentsForTopic(slug: string): PortalItem[] {
  return portalContent.filter(p => p.topic === slug || (slug === 'comparativas' && (p.kind === 'Comparativa' || /comparar-equipo/.test(p.href))) || matches[slug]?.test(p.href));
}
