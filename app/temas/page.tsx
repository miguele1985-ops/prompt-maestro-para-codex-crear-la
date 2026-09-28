import Link from 'next/link';
import { topicDirectory, contentsForTopic } from '@/content/topic-directory';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { ContentCatalog } from '@/components/ContentCatalog';
import { portalContent, portalTopics } from '@/content/portal';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Todos los temas de supervivencia', description: 'Encuentra artículos, guías, comparativas y herramientas por tema: comunicación, plantas, huerto, pesca, caza, hogar y preparación.', slug: 'temas' });
export default function TopicsPage() {
  return <div className="editorial-library"><div className="journal-section">
    <header className="editorial-library-heading"><h1>Todos los temas</h1><p>Elige un tema y encuentra sus artículos, guías, herramientas y recursos relacionados.</p></header>
    <div className="portal-categories">{topicDirectory.map(topic => <Link href={`/temas/${topic.slug}`} key={topic.slug}>
      <ResponsiveImage src={`/images/blog/${topic.image}.jpg`} alt={topic.title + '. Imagen ilustrativa.'} width={360} height={180} loading="lazy" sizes="(max-width:700px) 90vw, 260px" />
      <strong>{topic.title}</strong><span>{topic.description}</span><small>{contentsForTopic(topic.slug).length} contenidos</small>
    </Link>)}</div>
    <h2>Todo el contenido</h2><ContentCatalog items={portalContent} topics={portalTopics} />
  </div></div>;
}
