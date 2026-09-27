"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, ClipboardCheck, Search } from "lucide-react";
import type { PortalItem } from "@/content/portal";
import { ResponsiveImage } from "./ResponsiveImage";

export function ContentCard({ item }: { item: PortalItem }) {
  return (
    <article className="portal-card">
      <Link href={item.href}>
        {item.image ? (
          <ResponsiveImage
            src={item.image}
            alt={item.alt || item.title}
            width={576}
            height={360}
            loading="lazy"
            sizes="(max-width:700px) 92vw, (max-width:1050px) 44vw, 360px"
          />
        ) : (
          <span className="portal-tool-icon">
            {item.kind === "Checklist" ? (
              <ClipboardCheck size={36} aria-hidden />
            ) : (
              <Calculator size={36} aria-hidden />
            )}
          </span>
        )}
        <div className="portal-card-copy">
          <span className="portal-kind">
            {item.kind}
            {item.minutes ? ` · ${item.minutes} min` : ""}
          </span>
          <h3>{item.title}</h3>
          <p>{item.excerpt}</p>
          {item.date ? (
            <time dateTime={item.date}>
              {new Date(`${item.date}T12:00:00`).toLocaleDateString("es-ES")}
            </time>
          ) : null}
          <span className="portal-read">
            {item.kind === "Calculadora"
              ? "Abrir calculadora"
              : item.kind === "Checklist"
                ? "Usar checklist"
                : item.kind === "App"
                  ? "Ver función de Android"
                  : `Leer ${item.kind.toLowerCase()}`}{" "}
            <ArrowRight size={17} aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function ContentCatalog({
  items,
  topics,
  placeholder = "Buscar por tema o título...",
  id = "catalogo",
  children,
}: {
  items: PortalItem[];
  topics: readonly (readonly string[])[];
  placeholder?: string;
  id?: string;
  children?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const filtered = items.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      (!kind || p.kind === kind) &&
      normalize(`${p.title} ${p.excerpt} ${p.kind}`).includes(normalize(query.trim())),
  );
  const kinds = [...new Set(items.map((p) => p.kind))];
  const total = Math.max(1, Math.ceil(filtered.length / 12));
  return (
    <section className="portal-catalog" id={id} aria-label="Catálogo de contenidos">
      <div className="portal-filters">
        <label className="portal-search">
          <span>
            <Search size={18} aria-hidden /> Buscar
          </span>
          <input
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Tema
          <select
            aria-label="Tema"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los temas</option>
            {topics
              .filter((t) => items.some((p) => p.topic === t[0]))
              .map((t) => (
                <option key={t[0]} value={t[0]}>
                  {t[1]}
                </option>
              ))}
          </select>
        </label>
        {kinds.length > 1 ? (
          <label>
            Tipo
            <select
              aria-label="Tipo"
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos los tipos</option>
              {kinds.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      {!query && !topic && !kind && page === 1 ? children : null}
      <p role="status">{filtered.length} contenidos encontrados</p>
      <div className="portal-grid">
        {filtered.slice((page - 1) * 12, page * 12).map((item) => (
          <ContentCard key={item.href} item={item} />
        ))}
      </div>
      {!filtered.length ? (
        <p>No hay resultados. Prueba con otro término o cambia los filtros.</p>
      ) : null}
      {total > 1 ? (
        <nav className="portal-pagination" aria-label="Páginas del catálogo">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <span>
            Página {page} de {total}
          </span>
          <button disabled={page === total} onClick={() => setPage(page + 1)}>
            Siguiente
          </button>
        </nav>
      ) : null}
    </section>
  );
}
