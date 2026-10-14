"use client";
import Link from 'next/link';
import { Bookmark, Check, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const savedArticlesKey = 'mcs-saved-articles';
export function readSavedArticles(): string[] {
  try { const value = JSON.parse(localStorage.getItem(savedArticlesKey) || '[]'); return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length <= 200 && /^[a-z0-9-]+$/.test(item)))].slice(0, 100) : []; }
  catch { return []; }
}
export function ArticleActions({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => { setSaved(readSavedArticles().includes(slug)); }, [slug]);
  function toggle() {
    try {
      const next = new Set(readSavedArticles());
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      if (next.size > 100) { setStatus('La biblioteca admite 100 artículos. Retira uno antes de añadir otro.'); return; }
      localStorage.setItem(savedArticlesKey, JSON.stringify([...next]));
      setSaved(next.has(slug));
      setStatus(next.has(slug) ? 'Guardado en este navegador.' : 'Retirado de tu biblioteca.');
    } catch { setStatus('El navegador no permite guardar. Puedes usar sus marcadores.'); }
  }
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setStatus('Enlace copiado.'); }
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setStatus('No se pudo compartir. Puedes copiar la dirección del navegador.'); }
  }
  return <div className="article-actions"><button type="button" onClick={toggle} aria-pressed={saved} title={saved ? 'Retirar de mi biblioteca' : 'Guardar en este navegador'}>{saved ? <Check size={18} aria-hidden /> : <Bookmark size={18} aria-hidden />}{saved ? 'Guardado' : 'Guardar'}</button><button type="button" onClick={share} title="Compartir artículo"><Share2 size={18} aria-hidden />Compartir</button><Link href="/mi-biblioteca">Mi biblioteca</Link><span role="status">{status}</span></div>;
}
