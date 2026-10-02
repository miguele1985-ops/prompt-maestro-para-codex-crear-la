import { notFound } from 'next/navigation';
import { topicDirectory, contentsForTopic } from '@/content/topic-directory';
import { portalTopics } from '@/content/portal';
import { ContentCatalog } from '@/components/ContentCatalog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() { return topicDirectory.map(t => ({ tema: t.slug })); }
export async function generateMetadata({params}:{params:Promise<{tema:string}>}) {
  const {tema}=await params; const t=topicDirectory.find(t=>t.slug===tema);
  return t ? pageMetadata({ title: `${t.title}: guías, artículos y herramientas`, description: t.description, slug: `temas/${tema}` }) : {};
}
export default async function TopicPage({params}:{params:Promise<{tema:string}>}) {
  const {tema}=await params; const t=topicDirectory.find(t=>t.slug===tema); if(!t) notFound();
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{label:'Inicio',href:'/'},{label:'Todos los temas',href:'/temas'},{label:t.title,href:`/temas/${tema}`}]} />
    <header className="editorial-library-heading"><h1>{t.title}</h1><p>{t.description}</p></header>
    <ContentCatalog items={contentsForTopic(tema)} topics={portalTopics} catalogKey={`temas/${tema}`} catalogHref={`/temas/${tema}`} />
  </div></div>;
}
