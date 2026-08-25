"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import type { Calculator, FaqItem, GuideCategory, MediaAsset, Scenario } from "@/types/content";

export function CrisisDemo({ scenarios }: { scenarios: Scenario[] }) {
  const [selected, setSelected] = useState(scenarios[0]);
  return (
    <div className="crisis-demo">
      <div className="scenario-list" role="list" aria-label="Escenarios de crisis">
        {scenarios.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => setSelected(scenario)} aria-pressed={selected.id === scenario.id}>
            {scenario.title}
          </button>
        ))}
      </div>
      <article className="scenario-detail">
        <p className="eyebrow">Demostración web</p>
        <h3>{selected.title}</h3>
        <strong>Prioridad inmediata</strong>
        <p>{selected.priority}</p>
        <strong>Primeras acciones</strong>
        <ul>{selected.firstActions.map((item) => <li key={item}>{item}</li>)}</ul>
        <strong>Riesgos</strong>
        <ul>{selected.risks.map((item) => <li key={item}>{item}</li>)}</ul>
        <strong>Material recomendado</strong>
        <ul>{selected.materials.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="muted">Ante emergencia real, llama al 112 siempre que sea posible.</p>
      </article>
    </div>
  );
}

export function GuideSearch({ categories }: { categories: GuideCategory[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) => {
      const searchableText = [
        category.title,
        category.description,
        category.articleCountLabel,
        category.expansion,
        ...(category.articleExamples ?? []),
        ...(category.usageTips ?? []),
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [categories, query]);
  return (
    <section className="search-panel">
      <label htmlFor="guide-search">Buscar categorías</label>
      <div className="search-box">
        <Search size={18} aria-hidden />
        <input id="guide-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Agua, alimentación, primeros auxilios..." />
      </div>
      <div className="category-grid guide-category-grid">
        {filtered.map((category) => (
          <article key={category.id} className="mini-card guide-category-card">
            <div className="mini-card-head">
              <h3>{category.title}</h3>
              <span>{category.articleCountLabel}</span>
            </div>
            <p>{category.description}</p>
            {category.expansion ? <p className="mini-card-detail">{category.expansion}</p> : null}
            {category.articleExamples?.length ? (
              <div className="mini-card-block">
                <strong>Artículos y ampliaciones</strong>
                <ul className="mini-card-list">
                  {category.articleExamples.map((article) => <li key={article}>{article}</li>)}
                </ul>
              </div>
            ) : null}
            {category.usageTips?.length ? (
              <div className="mini-card-block">
                <strong>Modo de uso en la app</strong>
                <ul className="mini-card-list">
                  {category.usageTips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question} name="faq" open={index === 0}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CalculatorGrid({ calculators }: { calculators: Calculator[] }) {
  return (
    <div className="feature-grid">
      {calculators.map((calculator) => (
        <article className="feature-card" key={calculator.id}>
          <h3>{calculator.title}</h3>
          <p>{calculator.description}</p>
          <strong>Solicita</strong>
          <ul>{calculator.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
          <strong>Ofrece</strong>
          <ul>{calculator.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
          {calculator.warnings.map((warning) => <p className="warning-text" key={warning}>{warning}</p>)}
        </article>
      ))}
    </div>
  );
}

export function ScreenshotGallery({ assets }: { assets: MediaAsset[] }) {
  const [active, setActive] = useState<MediaAsset | null>(null);
  return (
    <section className="gallery" aria-label="Galería de capturas">
      <div className="gallery-grid">
        {assets.map((asset) => (
          <button type="button" key={asset.src} onClick={() => setActive(asset)} className="screenshot-thumb">
            <span className="phone-frame">
              <ResponsiveImage
                src={asset.src}
                alt=""
                aria-hidden
                width={576}
                height={880}
                widths={[240, 360]}
                sizes="(max-width: 768px) 42vw, 190px"
                loading="lazy"
                decoding="async"
              />
            </span>
            <strong>{asset.alt}</strong>
          </button>
        ))}
      </div>
      {active ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.alt}>
          <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Cerrar vista ampliada"><X /></button>
          <div className="phone-frame large">
            <ResponsiveImage
              src={active.src}
              alt={active.alt}
              width={576}
              height={880}
              widths={[360, 576]}
              sizes="(max-width: 768px) 80vw, 384px"
              loading="eager"
              decoding="async"
            />
          </div>
          <p>{active.caption}</p>
        </div>
      ) : null}
    </section>
  );
}
