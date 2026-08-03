import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SafetyWarning } from "@/components/Badges";
import { ContactForm } from "@/components/ContactForm";
import { DownloadCard } from "@/components/DownloadCard";
import { FeatureGrid } from "@/components/FeatureCard";
import { CalculatorGrid, CrisisDemo, FaqAccordion, GuideSearch } from "@/components/Interactive";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { changelog, downloadInfo } from "@/content/downloads";
import { faqs } from "@/content/faqs";
import { features } from "@/content/features";
import { blogPosts } from "@/content/blog";
import { guideCategories } from "@/content/guides";
import { allContentPages, calculators, crisisScenarios } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allContentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = allContentPages.find((item) => item.slug === slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    slug: page.slug,
    keywords: page.keywords,
  });
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = allContentPages.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{page.eyebrow || "Modo Crisis Survival"}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <ShareButtons title={page.title} />
      </section>

      <section className="content-band page-content">
        {page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {page.highlights ? (
          <ul className="hero-pills">{page.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        ) : null}
        {page.sections?.map((section) => {
          const hasShowcase = Boolean(section.image || section.steps || section.tips);
          return (
            <article className={hasShowcase ? "option-showcase" : "mini-card"} key={section.title}>
              {section.image ? (
                <div className="option-screen">
                  <img src={section.image} alt={section.imageAlt || section.title} />
                </div>
              ) : null}
              <div className="option-copy">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.items ? (
                  <div className="option-list">
                    <strong>QuÃƒÆ’Ã‚Â© permite hacer</strong>
                    <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ) : null}
                {section.steps ? (
                  <div className="option-list">
                    <strong>CÃƒÆ’Ã‚Â³mo usarlo</strong>
                    <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  </div>
                ) : null}
                {section.tips ? (
                  <div className="option-list">
                    <strong>Para sacarle el mÃƒÆ’Ã‚Â¡ximo partido</strong>
                    <ul>{section.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
                  </div>
                ) : null}
                                {section.warning ? <SafetyWarning>{section.warning}</SafetyWarning> : null}
                {page.slug === "herramientas-supervivencia" && section.title === "Mapa Offline" ? (
                  <Link className="option-link-button" href="/centro-descargas">Como descargar e instalar los mapas</Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      {page.slug === "funciones" ? <section className="content-band"><FeatureGrid features={features} /></section> : null}
      {page.slug === "modo-crisis" ? <section className="content-band"><CrisisDemo scenarios={crisisScenarios} /></section> : null}
      {page.slug === "guias-supervivencia" ? (
        <section className="content-band">
          <GuideSearch categories={guideCategories} />
          <div className="blog-list blog-list-linked">
            <h2>Articulos del blog</h2>
            <p>Contenido practico para ampliar las guias de supervivencia y aprender a usar mejor las funciones de la app.</p>
            {blogPosts.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.slug}>
                <span>{article.category}</span>
                <strong>{article.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
            {page.slug === "herramientas-supervivencia" ? (
        <section className="content-band">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Herramientas de calculo</p>
            <h2>Calculadoras</h2>
            <p>Estimaciones orientativas para agua, energia, potabilizacion, destilacion solar, rios, conversor survival, silbato, senales de humo e hipotermia.</p>
          </div>
          <CalculatorGrid calculators={calculators} />
        </section>
      ) : null}
      {page.slug === "descargar" ? (
        <section className="content-band">
          <DownloadCard />
          <article className="mini-card">
            <h2>Instrucciones de instalaciÃƒÆ’Ã‚Â³n</h2>
            <ol>{downloadInfo.installSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            <SafetyWarning>No descargues copias de webs no oficiales. Verifica el hash SHA-256 cuando estÃƒÆ’Ã‚Â© disponible.</SafetyWarning>
          </article>
          <article className="mini-card">
            <h2>Permisos posibles</h2>
            <ul>{downloadInfo.permissions.map((permission) => <li key={permission}>{permission}</li>)}</ul>
          </article>
        </section>
      ) : null}
      {page.slug === "preguntas-frecuentes" ? (
        <section className="content-band">
          <FaqAccordion items={faqs} />
          <SeoJsonLd data={faqJsonLd()} />
        </section>
      ) : null}
      {page.slug === "actualizaciones" ? (
        <section className="content-band changelog">
          {changelog.map((entry) => (
            <article className="mini-card" key={entry.version}>
              <h2>{entry.version} Ãƒâ€šÃ‚Â· {entry.title}</h2>
              <p>{entry.date}</p>
              <ul>{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul>
            </article>
          ))}
        </section>
      ) : null}
      {page.slug === "contacto" ? <section className="content-band"><ContactForm /></section> : null}
    </>
  );
}
