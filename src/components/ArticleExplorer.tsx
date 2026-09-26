"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { ResponsiveImage } from "./ResponsiveImage";
export type ArticlePreview = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  topic: string;
  minutes: number;
};
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function ArticleExplorer({
  posts,
  topics,
}: {
  posts: ArticlePreview[];
  topics: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Todos");
  const visible = useMemo(
    () =>
      posts.filter(
        (post) =>
          (topic === "Todos" || post.topic === topic) &&
          normalize(`${post.title} ${post.excerpt}`).includes(normalize(query)),
      ),
    [posts, topic, query],
  );
  return (
    <>
      <div className="editorial-filters">
        <label>
          <Search size={19} aria-hidden />
          <span className="sr-only">Buscar artículos</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: agua, apagón, mochila…"
          />
        </label>
        <label>
          Tema
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="editorial-count" role="status">
        {visible.length} artículos
      </p>
      <div className="editorial-library-grid">
        {visible.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <ResponsiveImage
                src={post.image}
                alt={post.imageAlt}
                width={576}
                height={360}
                sizes="(max-width:700px) 90vw, 360px"
                loading="lazy"
              />
              <div>
                <span className="journal-kicker">
                  {post.topic} · {post.minutes} min
                </span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="journal-read">
                  Leer la guía <ArrowRight size={16} aria-hidden />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {!visible.length ? (
        <p>No hay coincidencias. Prueba otro término o selecciona todos los temas.</p>
      ) : null}
    </>
  );
}
