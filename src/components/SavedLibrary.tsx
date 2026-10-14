"use client";
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { readSavedArticles, savedArticlesKey } from './ArticleActions';
type Item = { slug: string; title: string; excerpt: string };
export function SavedLibrary({ articles }: { articles: Item[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const load = () => { setSlugs(readSavedArticles()); setReady(true); };
    load(); window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);
  function remove(slug: string) {
    try { const next = readSavedArticles().filter(item => item !== slug); localStorage.setItem(savedArticlesKey, JSON.stringify(next)); setSlugs(next); }
    catch { setMessage('No se pudo modificar el almacenamiento.'); }
  }
  const saved = articles.filter(article => slugs.includes(article.slug));
return <section className="saved-library">{!ready ? <p role="status">Cargando biblioteca...</p> : saved.length ? <ul>{saved.map(article => <li key={article.slug}><div><Link href={`/supervivencia/${article.slug}`}><h2>{article.title}</h2></Link><p>{article.excerpt}</p></div><button type="button" onClick={() => remove(article.slug)} aria-label={`Retirar ${article.title}`} title="Retirar de la biblioteca"><Trash2 size={18} aria-hidden /></button></li>)}</ul> : <><h2>Tu próxima lectura empieza aquí</h2><p>Todavía no has guardado artículos en este navegador.</p><Link href="/guias-supervivencia">Explorar las guías</Link></>}<p role="status">{message}</p><p>Los artículos guardados permanecen en este navegador. No se envían al servidor ni se sincronizan con otros dispositivos. Se eliminan al borrar los datos del sitio.</p></section>;
}
