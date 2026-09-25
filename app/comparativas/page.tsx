import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, ShieldCheck, ShoppingBag } from "lucide-react";
import { affiliateDisclosure, amazonSearchUrl, comparisonCategories } from "@/content/affiliate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Comparativas de equipo de emergencia",
  description:
    "Comparativas de filtros de agua, baterías externas, radios, linternas y botiquines para preparar el hogar y la mochila sin compras impulsivas.",
  slug: "comparativas",
  keywords: ["comparativas emergencia", "equipo supervivencia", "filtros agua", "powerbank emergencia", "radio emergencia"],
});

export default function ComparativasPage() {
  return (
    <>
      <section className="page-hero comparison-hero">
        <p className="eyebrow">Preparación antes de la emergencia</p>
        <h1>Comparativas y recomendaciones documentadas</h1>
        <p>
          Elige equipo con criterio: qué mirar, qué límites tiene cada producto y cuándo comprar no resuelve el problema.
          Las pantallas urgentes de Modo Crisis Survival se mantienen sin publicidad.
        </p>
      </section>

      <section className="content-band affiliate-disclosure">
        <ShieldCheck aria-hidden />
        <div>
          <h2>Transparencia de afiliación</h2>
          <p>{affiliateDisclosure}</p>
        </div>
      </section>

      <section className="content-band comparison-category-grid" aria-label="Categorías de comparativas">
        {comparisonCategories.map((category) => (
          <article className="comparison-category-card" key={category.slug}>
            <div className="comparison-category-icon">
              <ShoppingBag aria-hidden />
            </div>
            <div>
              <p className="eyebrow">Comparativa</p>
              <h2>{category.title}</h2>
              <p>{category.summary}</p>
              <div className="comparison-checklist">
                {category.checklist.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="comparison-actions">
              <a href={amazonSearchUrl(category.amazonQuery)} target="_blank" rel="sponsored noopener noreferrer">
                Ver opciones en Amazon <ExternalLink size={16} aria-hidden />
              </a>
              <Link href={category.guideHref}>
                Leer criterio de compra
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-band editorial-method">
        <p className="eyebrow">Método editorial</p>
        <h2>Cómo usamos las comparativas</h2>
        <p>
          Las comparativas no sustituyen instrucciones oficiales, formación ni sentido común. Sirven para preparar antes:
          revisar necesidades reales, peso, mantenimiento, límites declarados por el fabricante y compatibilidad con la app
          o la mochila familiar.
        </p>
        <div className="method-grid">
          <article>
            <h3>No se compra en mitad de una urgencia</h3>
            <p>Primero seguridad, 112 y fuentes oficiales. La compra se decide antes, con calma y pruebas básicas.</p>
          </article>
          <article>
            <h3>Sin datos inventados</h3>
            <p>No publicamos reseñas de uso ni puntuaciones si no se han probado. Separamos ficha documental y prueba real.</p>
          </article>
          <article>
            <h3>La app sigue siendo gratuita</h3>
            <p>La afiliación ayuda a mantener el proyecto, pero las guías y recursos críticos siguen accesibles.</p>
          </article>
        </div>
      </section>
    </>
  );
}
