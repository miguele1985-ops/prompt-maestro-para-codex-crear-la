import { blogPosts } from '@/content/blog';
import { SavedLibrary } from '@/components/SavedLibrary';
import { pageMetadata } from '@/lib/seo';
export const metadata = { ...pageMetadata({ title: 'Mi biblioteca de preparación', description: 'Tus guías guardadas en este navegador.', slug: 'mi-biblioteca' }), robots: { index: false, follow: true } };
export default function LibraryPage() {
  return <div className="journal-section"><header className="editorial-library-heading"><p className="eyebrow">Lecturas pendientes</p><h1>Mi biblioteca</h1><p>Guarda lo que quieras practicar y vuelve cuando lo necesites.</p></header><SavedLibrary articles={blogPosts.map(({ slug, title, excerpt }) => ({ slug, title, excerpt }))} /></div>;
}
