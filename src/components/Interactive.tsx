"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
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
    return categories.filter((category) => category.title.toLowerCase().includes(query.toLowerCase()));
  }, [categories, query]);
  return (
    <section className="search-panel">
      <label htmlFor="guide-search">Buscar categorías</label>
      <div className="search-box">
        <Search size={18} aria-hidden />
        <input id="guide-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Agua, fuego, nudos..." />
      </div>
      <div className="category-grid">
        {filtered.map((category) => (
          <article key={category.id} className="mini-card">
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <span>{category.articleCountLabel}</span>
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
              <img src={asset.src} alt="" aria-hidden />
            </span>
            <strong>{asset.alt}</strong>
          </button>
        ))}
      </div>
      {active ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.alt}>
          <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Cerrar vista ampliada"><X /></button>
          <div className="phone-frame large">
            <img src={active.src} alt={active.alt} />
          </div>
          <p>{active.caption}</p>
        </div>
      ) : null}
    </section>
  );
}
