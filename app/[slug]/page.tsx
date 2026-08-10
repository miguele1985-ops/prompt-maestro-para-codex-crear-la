import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SafetyWarning } from "@/components/Badges";
import { ContactForm } from "@/components/ContactForm";
import { DownloadCard } from "@/components/DownloadCard";
import { BugReportForm } from "@/components/BugReportForm";
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
import { siteConfig } from "@/content/site-config";
import { blogPosts } from "@/content/blog";
import { guideCategories } from "@/content/guides";
import { allContentPages, calculators, crisisScenarios } from "@/content/pages";
import { readAdminContent } from "@/lib/admin-content";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const dynamicParams = true;

type DownloadResource = (typeof downloadInfo.resources)[number];

function isAiResource(resource: DownloadResource) {
  const searchable = `${resource.label} ${resource.description} ${resource.url}`.toLowerCase();
  return searchable.includes("ia") || searchable.includes("gguf") || searchable.includes("hugging") || searchable.includes("qwen");
}

function ResourceDownloadsPanel({
  resources = downloadInfo.resources,
  showAiImage = true,
}: {
  resources?: DownloadResource[];
  showAiImage?: boolean;
}) {
  const visibleResources = resources.length ? resources : downloadInfo.resources;
  const mapResources = visibleResources.filter((resource) => !isAiResource(resource));
  const aiResource = visibleResources.find(isAiResource) || downloadInfo.resources.find(isAiResource);

  return (
    <article className="map-downloads-panel" aria-labelledby="resource-downloads-title">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Recursos opcionales</p>
        <h2 id="resource-downloads-title">Mapas e IA para preparar la app</h2>
        <p>
          Estos recursos se descargan aparte del APK para no hacer la instalacion principal demasiado pesada. Descargalos antes
          de necesitarlos sin cobertura y anadelos desde la app.
        </p>
      </div>

      <div className="section-heading compact-heading resource-subheading">
        <p className="eyebrow">Mapas disponibles</p>
        <h3>Descargar mapas MBTiles</h3>
      </div>
      <div className="map-download-grid">
        {mapResources.map((map) => (
          <div className="map-download-card" key={map.url}>
            <div>
              <h3>{map.label}</h3>
              <p>{map.description}</p>
              <span>Ocupa {map.size}</span>
            </div>
            <TrackedDownloadLink className="map-download-button" href={map.url}>
              Descargar mapa
            </TrackedDownloadLink>
          </div>
        ))}
      </div>
      <SafetyWarning>
        Los mapas son recursos opcionales. Pueden tardar bastante en descargarse y necesitan espacio libre suficiente en el
        dispositivo. Revisa tambien la licencia y la actualidad del mapa antes de usarlo.
      </SafetyWarning>

      <div className="section-heading compact-heading resource-subheading">
        <p className="eyebrow">IA local opcional</p>
        <h3>Descargar modelo GGUF</h3>
      </div>
      <div className="map-download-grid single-download-grid">
        <div className={`map-download-card ai-resource-card${showAiImage ? "" : " ai-resource-card-no-image"}`}>
          {showAiImage ? (
            <img src="/screenshots/app/encyclopedia-offline-resources.jpg" alt="Pantalla de recursos offline e IA local en Supervivencia Offline" />
          ) : null}
          <div>
            <h3>{aiResource?.label || "IA local desde Hugging Face"}</h3>
            <p>{aiResource?.description || "Modelo GGUF opcional para usar el asistente local cuando el telefono sea compatible."}</p>
            <p>
              Supervivencia Offline no aloja, modifica ni redistribuye este archivo. La descarga se realiza desde la pagina
              oficial del modelo en Hugging Face.
            </p>
            <span>Ocupa {aiResource?.size || "415 MB"}</span>
          </div>
          <a
            className="map-download-button external-download-button"
            href={aiResource?.url || "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/tree/main"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar IA local desde Hugging Face
          </a>
        </div>
      </div>
      <SafetyWarning>
        La IA local puede cometer errores. Sus respuestas son orientativas y no sustituyen al 112, servicios oficiales,
        autoridades, profesionales sanitarios ni formacion especializada.
      </SafetyWarning>
    </article>
  );
}

async function getVisibleContent() {
  const savedContent = await readAdminContent().catch(() => null);
  return {
    pages: savedContent?.pages?.length ? savedContent.pages : allContentPages,
    visibleChangelog: savedContent?.changelog?.length ? savedContent.changelog : changelog,
    visibleDownloadInfo: savedContent?.download as Partial<typeof downloadInfo> | undefined,
    visibleSite: savedContent?.site as Partial<typeof siteConfig> | undefined,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { pages } = await getVisibleContent();
  const page = pages.find((item) => item.slug === slug);
  if (!page) return {};

  const metadata = pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    slug: page.slug,
    keywords: page.keywords,
  });

  if (page.slug !== "donaciones") return metadata;

  const ogTitle = "Apoyar Supervivencia Offline";
  const ogDescription = "La app es gratuita. Si te resulta util, puedes apoyar el proyecto con una donacion voluntaria.";
  const ogImage = absoluteUrl("/assets/img/og-supervivencia-offline.jpg");

  return {
    ...metadata,
    title: "Apoyar Supervivencia Offline | Donacion voluntaria",
    description:
      "Apoya Supervivencia Offline con una donacion voluntaria. La app es gratuita y puede usarse completa sin pagar. Tu ayuda permite mantener y mejorar el proyecto.",
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
  const { pages, visibleChangelog, visibleDownloadInfo, visibleSite } = await getVisibleContent();
  const page = pages.find((item) => item.slug === slug);
  if (!page) notFound();

  const visibleDownloadResources = visibleDownloadInfo?.resources?.length ? visibleDownloadInfo.resources : downloadInfo.resources;
  const visibleDonations = { ...siteConfig.donations, ...(visibleSite?.donations || {}) };
  const showPageContent = page.slug !== "donaciones" && page.slug !== "centro-descargas";

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{page.eyebrow || "Modo Crisis Survival"}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        {page.cta && page.ctaHref ? (
          <Link className="button primary page-hero-cta" href={page.ctaHref}>
            {page.cta}
          </Link>
        ) : null}
        <ShareButtons title={page.title} />
      </section>

      {showPageContent ? (
        <section className="content-band page-content">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {page.highlights ? (
            <ul className="hero-pills">
              {page.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
                      <strong>Que permite hacer</strong>
                      <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  ) : null}
                  {section.steps ? (
                    <div className="option-list">
                      <strong>Como usarlo</strong>
                      <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                    </div>
                  ) : null}
                  {section.tips ? (
                    <div className="option-list">
                      <strong>Para sacarle el maximo partido</strong>
                      <ul>{section.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
                    </div>
                  ) : null}
                  {section.warning ? <SafetyWarning>{section.warning}</SafetyWarning> : null}
                  {page.slug === "herramientas-supervivencia" && section.title === "Mapa Offline" ? (
                    <Link className="option-link-button" href="/centro-descargas">
                      Como descargar e instalar los mapas
                    </Link>
                  ) : null}
                  {section.buttonLabel && section.buttonHref ? (
                    <Link className="option-link-button" href={section.buttonHref}>
                      {section.buttonLabel}
                    </Link>
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
              <p>Los mapas, la web y las guias de instalacion requieren mantenimiento. La app sigue siendo gratuita y completa.</p>
            </div>
            <TrackedDonationLink className="hero-donate-button" href="/donaciones">
              Apoyar el proyecto
            </TrackedDonationLink>
          </article>
          <ResourceDownloadsPanel resources={visibleDownloadResources} showAiImage={false} />
          <BugReportForm source="Centro de descargas" title="Reportar un fallo de descarga" />
        </section>
      ) : null}

      {page.slug === "funciones" ? (
        <section className="content-band">
          <FeatureGrid features={features} />
        </section>
      ) : null}

      {page.slug === "modo-crisis" ? (
        <section className="content-band">
          <CrisisDemo scenarios={crisisScenarios} />
        </section>
      ) : null}

      {page.slug === "guias-supervivencia" ? (
        <>
          <section className="content-band">
            <GuideSearch categories={guideCategories} />
          </section>
          <section className="content-band">
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
        </>
      ) : null}

      {page.slug === "herramientas-supervivencia" ? (
        <section className="content-band">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Herramientas de calculo</p>
            <h2>Calculadoras</h2>
            <p>
              Estimaciones orientativas para agua, energia, potabilizacion, destilacion solar, rios, conversor survival,
              silbato, senales de humo e hipotermia.
            </p>
          </div>
          <CalculatorGrid calculators={calculators} />
        </section>
      ) : null}

      {page.slug === "descargar" ? (
        <section className="content-band">
          <DownloadCard />
          <ResourceDownloadsPanel resources={visibleDownloadResources} />
          <BugReportForm source="Descargar aplicacion" title="Reportar un fallo de descarga" />
          <article className="mini-card">
            <h2>Instrucciones de instalacion</h2>
            <ol>{(visibleDownloadInfo?.installSteps || downloadInfo.installSteps).map((step) => <li key={step}>{step}</li>)}</ol>
            <SafetyWarning>No descargues copias de webs no oficiales. Verifica el hash SHA-256 cuando este disponible.</SafetyWarning>
          </article>
          <article className="mini-card">
            <h2>Permisos posibles</h2>
            <ul>{(visibleDownloadInfo?.permissions || downloadInfo.permissions).map((permission) => <li key={permission}>{permission}</li>)}</ul>
          </article>
        </section>
      ) : null}

      {page.slug === "donaciones" ? (
        <>
          <SeoJsonLd data={donationFaqJsonLd()} />
          <PayPalDonationBlock donations={visibleDonations} />
        </>
      ) : null}

      {page.slug === "preguntas-frecuentes" ? (
        <section className="content-band">
          <SeoJsonLd data={faqJsonLd()} />
          <FaqAccordion items={faqs} />
        </section>
      ) : null}

      {page.slug === "actualizaciones" ? (
        <section className="content-band changelog">
          {visibleChangelog.map((entry) => (
            <article className="mini-card" key={entry.version}>
              <h2>{entry.version} - {entry.title}</h2>
              <p>{entry.date}</p>
              <ul>{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul>
            </article>
          ))}
        </section>
      ) : null}

      {page.slug === "contacto" ? (
        <section className="content-band">
          <ContactForm />
        </section>
      ) : null}
    </>
  );
}
