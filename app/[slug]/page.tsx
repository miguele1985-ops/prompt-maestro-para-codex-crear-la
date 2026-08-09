import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SafetyWarning } from "@/components/Badges";
import { ContactForm } from "@/components/ContactForm";
import { DownloadCard } from "@/components/DownloadCard";
import { FeatureGrid } from "@/components/FeatureCard";
import { CalculatorGrid, CrisisDemo, FaqAccordion, GuideSearch } from "@/components/Interactive";
import { PayPalDonationBlock } from "@/components/PayPalDonationBlock";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { TrackedDownloadLink } from "@/components/TrackedDownloadLink";
import { TrackedDonationLink } from "@/components/TrackedDonationLink";
import { changelog, downloadInfo } from "@/content/downloads";
import { donationFaqJsonLd } from "@/content/donations";
import { faqs } from "@/content/faqs";
import { features } from "@/content/features";
import { blogPosts } from "@/content/blog";
import { guideCategories } from "@/content/guides";
import { allContentPages, calculators, crisisScenarios } from "@/content/pages";
import { readAdminContent } from "@/lib/admin-content";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const dynamicParams = true;

const mapDownloads = [
  {
    title: "Espa\u00f1a completo topogr\u00e1fico",
    description: "Mapa MBTiles topogr\u00e1fico para consultar Espa\u00f1a sin conexi\u00f3n desde la app.",
    size: "2,55 GB",
    href: "https://descargas.modocrisissurvival.com/mapas/espana-topografico-n.mbtiles",
  },
  {
    title: "Espa\u00f1a completa relieve",
    description: "Mapa MBTiles de relieve para consultar el terreno y la forma del terreno sin conexi\u00f3n.",
    size: "1,68 GB",
    href: "https://descargas.modocrisissurvival.com/mapas/espana-relieve.mbtiles",
  },
];

const aiLocalDownload = {
  title: "IA local desde Hugging Face",
  description: "Modelo GGUF opcional para usar el asistente local cuando el tel\u00e9fono sea compatible.",
  href: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/tree/main",
  model: "Qwen2.5-0.5B-Instruct-GGUF",
  size: "415 MB",
  image: "/screenshots/app/encyclopedia-offline-resources.jpg",
};

function ResourceDownloadsPanel({ showAiImage = true }: { showAiImage?: boolean }) {
  return (
    <article className="map-downloads-panel" aria-labelledby="resource-downloads-title">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Recursos opcionales</p>
        <h2 id="resource-downloads-title">Mapas e IA para preparar la app</h2>
        <p>
          {"Estos recursos se descargan aparte del APK para no hacer la instalaci\u00f3n principal demasiado pesada. Desc\u00e1rgalos antes de necesitarlos sin cobertura y a\u00f1\u00e1delos desde la app."}
        </p>
      </div>

      <div className="section-heading compact-heading resource-subheading">
        <p className="eyebrow">Mapas disponibles</p>
        <h3>Descargar mapas MBTiles</h3>
      </div>
      <div className="map-download-grid">
        {mapDownloads.map((map) => (
          <div className="map-download-card" key={map.href}>
            <div>
              <h3>{map.title}</h3>
              <p>{map.description}</p>
              <span>Ocupa {map.size}</span>
            </div>
            <TrackedDownloadLink className="map-download-button" href={map.href}>
              Descargar mapa
            </TrackedDownloadLink>
          </div>
        ))}
      </div>
      <SafetyWarning>{"Los mapas son recursos opcionales. Pueden tardar bastante en descargarse y necesitan espacio libre suficiente en el dispositivo. Revisa tambi\u00e9n la licencia y la actualidad del mapa antes de usarlo."}</SafetyWarning>

      <div className="section-heading compact-heading resource-subheading">
        <p className="eyebrow">IA local opcional</p>
        <h3>Descargar modelo GGUF</h3>
      </div>
      <div className="map-download-grid single-download-grid">
        <div className={`map-download-card ai-resource-card${showAiImage ? "" : " ai-resource-card-no-image"}`}>
          {showAiImage ? <img src={aiLocalDownload.image} alt="Pantalla de recursos offline e IA local en Supervivencia Offline" /> : null}
          <div>
            <h3>{aiLocalDownload.title}</h3>
            <p>
              {"La IA local puede usar el modelo "}{aiLocalDownload.model}{". En Hugging Face debes descargar la versi\u00f3n GGUF de aproximadamente "}{aiLocalDownload.size}{"."}
            </p>
            <p>{"Supervivencia Offline no aloja, modifica ni redistribuye este archivo. La descarga se realiza desde la p\u00e1gina oficial del modelo en Hugging Face."}</p>
            <span>Ocupa {aiLocalDownload.size}</span>
          </div>
          <a className="map-download-button external-download-button" href={aiLocalDownload.href} target="_blank" rel="noopener noreferrer">
            Descargar IA local desde Hugging Face
          </a>
        </div>
      </div>
      <SafetyWarning>{"La IA local puede cometer errores. Sus respuestas son orientativas y no sustituyen al 112, servicios oficiales, autoridades, profesionales sanitarios ni formaci\u00f3n especializada."}</SafetyWarning>
    </article>
  );
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const savedContent = await readAdminContent().catch(() => null);
  const contentPages = savedContent?.pages?.length ? savedContent.pages : allContentPages;
  const page = contentPages.find((item) => item.slug === slug);
  if (!page) return {};
  const metadata = pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    slug: page.slug,
    keywords: page.keywords,
  });

  if (page.slug === "donaciones") {
    const ogTitle = "Apoyar Supervivencia Offline";
    const ogDescription = "La app es gratuita. Si te resulta útil, puedes apoyar el proyecto con una donación voluntaria.";
    const ogImage = absoluteUrl("/assets/img/og-supervivencia-offline.jpg");

    return {
      ...metadata,
      title: "Apoyar Supervivencia Offline | Donación voluntaria",
      description: "Apoya Supervivencia Offline con una donación voluntaria. La app es gratuita y puede usarse completa sin pagar. Tu ayuda permite mantener y mejorar el proyecto.",
      openGraph: {
        ...metadata.openGraph,
        title: ogTitle,
        description: ogDescription,
        images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      },
      twitter: {
        ...metadata.twitter,
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
    };
  }

  return metadata;
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
  const savedContent = await readAdminContent().catch(() => null);
  const contentPages = savedContent?.pages?.length ? savedContent.pages : allContentPages;
  const visibleChangelog = savedContent?.changelog?.length ? savedContent.changelog : changelog;
  const visibleDownloadInfo = savedContent?.download as Partial<typeof downloadInfo> | undefined;
  const page = contentPages.find((item) => item.slug === slug);
  if (!page) notFound();
  const showPageContent = page.slug !== "donaciones" && page.slug !== "centro-descargas";

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{page.eyebrow || "Modo Crisis Survival"}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <ShareButtons title={page.title} />
      </section>

      {showPageContent ? (
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
                    <strong>Qué permite hacer</strong>
                    <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ) : null}
                {section.steps ? (
                  <div className="option-list">
                    <strong>Cómo usarlo</strong>
                    <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  </div>
                ) : null}
                {section.tips ? (
                  <div className="option-list">
                    <strong>Para sacarle el máximo partido</strong>
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
      ) : null}

      {page.slug === "centro-descargas" ? (
        <section className="content-band">
          <article className="download-center-donation-card">
            <div>
              <p className="eyebrow">Apoyo voluntario</p>
              <h2>Ayuda a mantener descargas seguras</h2>
              <p>{"Los mapas, la web y las guías de instalación requieren mantenimiento. La app sigue siendo gratuita y completa; donar solo ayuda a sostener el proyecto."}</p>
            </div>
            <TrackedDonationLink className="hero-donate-button" href="/donaciones">
              Apoyar el proyecto
            </TrackedDonationLink>
          </article>
          <ResourceDownloadsPanel showAiImage={false} />
        </section>
      ) : null}

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
          <DownloadCard info={visibleDownloadInfo} />
          <ResourceDownloadsPanel />
          <article className="mini-card">
            <h2>Instrucciones de instalación</h2>
            <ol>{downloadInfo.installSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            <SafetyWarning>No descargues copias de webs no oficiales. Verifica el hash SHA-256 cuando esté disponible.</SafetyWarning>
          </article>
          <article className="mini-card">
            <h2>Permisos posibles</h2>
            <ul>{downloadInfo.permissions.map((permission) => <li key={permission}>{permission}</li>)}</ul>
          </article>
        </section>
      ) : null}
      {page.slug === "donaciones" ? (
        <>
          <PayPalDonationBlock />
          <SeoJsonLd data={donationFaqJsonLd()} />
        </>
      ) : null}
      {page.slug === "preguntas-frecuentes" ? (
        <section className="content-band">
          <FaqAccordion items={faqs} />
          <SeoJsonLd data={faqJsonLd()} />
        </section>
      ) : null}
      {page.slug === "actualizaciones" ? (
        <section className="content-band changelog">
          {visibleChangelog.map((entry) => (
            <article className="mini-card" key={entry.version}>
              <h2>{entry.version} · {entry.title}</h2>
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
