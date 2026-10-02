import Link from 'next/link';
import { orderedBlogPosts } from '@/content/blog';
import { allContentPages } from '@/content/pages';
import { practicalGuides } from '@/content/practical-guides';
import { portalTopic, portalTopics } from '@/content/portal';
import { topicDirectory } from '@/content/topic-directory';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Mapa de contenidos de supervivencia', description: 'Todas las guías, artículos, calculadoras y recursos de Modo Crisis Survival, organizados por tema.', slug: 'mapa-web' });
export default function ContentMapPage() {
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Mapa de contenidos', href: '/mapa-web' }]} />
    <header className="editorial-library-heading"><h1>Mapa de contenidos</h1><p>Encuentra una guía, revisa un tema o continúa con una herramienta de preparación.</p></header>
    <nav aria-label="Temas del mapa de contenidos" className="content-map-topics">
      {portalTopics.filter(topic => orderedBlogPosts.some(post => portalTopic(post.slug) === topic[0])).map(topic => <a key={topic[0]} href={`#${topic[0]}`}>{topic[1]}</a>)}
    </nav>
    <div className="content-map-sections">
      {portalTopics.map(topic => {
        const posts = orderedBlogPosts.filter(post => portalTopic(post.slug) === topic[0]);
        if (!posts.length) return null;
        return <section key={topic[0]} id={topic[0]}><h2><Link href={`/temas/${topic[0]}`}>{topic[1]}</Link></h2><ul>{posts.map(post => <li key={post.slug}><Link href={`/supervivencia/${post.slug}`}>{post.title}</Link></li>)}</ul></section>;
      })}
      <section><h2>Preparación práctica</h2><ul>{practicalGuides.map(guide => <li key={guide.slug}><Link href={`/preparacion-practica/${guide.slug}`}>{guide.title}</Link></li>)}</ul></section>
      <section><h2>Temas y bibliotecas</h2><ul>{topicDirectory.map(topic => <li key={topic.slug}><Link href={`/temas/${topic.slug}`}>{topic.title}</Link></li>)}</ul></section>
      <section><h2>Aplicación, recursos y proyecto</h2><ul>{allContentPages.map(page => <li key={page.slug}><Link href={`/${page.slug}`}>{page.title}</Link></li>)}<li><Link href="/codigo-morse">Traductor de código Morse</Link></li><li><Link href="/calendario-lunar">Calendario lunar</Link></li><li><Link href="/nudos">Nudos por función</Link></li><li><Link href="/senales-en-grupo">Señales para tu grupo</Link></li><li><Link href="/checklists">Listas de preparación</Link></li></ul></section>
    </div>
  </div></div>;
}
