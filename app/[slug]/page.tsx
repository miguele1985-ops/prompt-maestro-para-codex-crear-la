import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SafetyWarning } from "@/components/Badges";
import { ContactForm } from "@/components/ContactForm";
import { DownloadCard } from "@/components/DownloadCard";
import { BugReportForm } from "@/components/BugReportForm";
import { FeatureGrid } from "@/components/FeatureCard";
import { CrisisDemo, FaqAccordion, GuideSearch } from "@/components/Interactive";
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
import { orderedBlogPosts } from "@/content/blog";
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

const mapInstallGuide = [
  {
    title: "Abrir Mapas desde la app",
    text:
      "Entra en la aplicaci\u00f3n y abre la opci\u00f3n Mapas. Dentro de la pantalla de mapas pulsa el bot\u00f3n Descargas. La app abrir\u00e1 el Centro de descargas de la web para que puedas bajar los mapas disponibles.",
    images: [
      {
        src: "/screenshots/app/map-guide/paso-1-mapas-app.jpg",
        alt: "Pantalla de mapa offline de la app con el bot\u00f3n Descargar visible",
      },
    ],
  },
  {
    title: "Elegir el mapa que quieres descargar",
    text:
      "En el Centro de descargas hay dos mapas preparados: Espa\u00f1a completo topogr\u00e1fico y Espa\u00f1a completa relieve. Descarga el que necesites con una conexi\u00f3n estable. Tambi\u00e9n puedes usar otros mapas propios si est\u00e1n en formato .mbtiles.",
    images: [
      {
        src: "/screenshots/app/map-guide/paso-2-centro-descargas.jpg",
        alt: "Centro de descargas con los mapas MBTiles disponibles para descargar",
      },
    ],
  },
  {
    title: "Localizar el archivo descargado",
    text:
      "Cuando termine la descarga, el archivo normalmente queda en la carpeta Descargas del m\u00f3vil. Vuelve a la app, entra otra vez en Mapas y selecciona la pesta\u00f1a correcta, por ejemplo Relieve si has descargado el mapa de relieve.",
    images: [
      {
        src: "/screenshots/app/map-guide/paso-3-archivo-descargado.jpg",
        alt: "Archivo espana-relieve.mbtiles descargado en el m\u00f3vil",
      },
      {
        src: "/screenshots/app/map-guide/paso-3-pestana-relieve.jpg",
        alt: "Pantalla de mapas con la pesta\u00f1a Relieve seleccionada",
      },
    ],
  },
  {
    title: "Importar el mapa en la app",
    text:
      "Pulsa Mapas, abre la gesti\u00f3n de mapas y toca Importar otro mapa. Selecciona el archivo .mbtiles descargado. La importaci\u00f3n puede tardar un poco; cuando termine, la app mostrar\u00e1 el mapa como importado.",
    images: [
      {
        src: "/screenshots/app/map-guide/paso-4-importar-mapa.jpg",
        alt: "Ventana de gesti\u00f3n de mapas offline con el bot\u00f3n Importar otro mapa",
      },
      {
        src: "/screenshots/app/map-guide/paso-4-mapa-importado.jpg",
        alt: "Mapa de relieve importado y activo dentro de la app",
      },
    ],
  },
  {
    title: "Cambiar entre mapas instalados",
    text:
      "Si tienes m\u00e1s de un mapa instalado, vuelve al bot\u00f3n Mapas y elige cu\u00e1l quieres usar. As\u00ed puedes guardar varios mapas MBTiles y cambiar entre mapa normal, topogr\u00e1fico, relieve u otros mapas seg\u00fan la zona.",
    images: [
      {
        src: "/screenshots/app/map-guide/paso-5-cambiar-mapa.jpg",
        alt: "Lista de mapas offline instalados para cambiar entre mapas MBTiles",
      },
    ],
  },
];

function MapInstallGuide() {
  return (
    <section className="map-install-guide" aria-labelledby="map-install-guide-title">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Tutorial de instalaci&oacute;n</p>
        <h3 id="map-install-guide-title">C&oacute;mo descargar e importar mapas en la app</h3>
        <p>
          Sigue estos pasos para descargar un mapa MBTiles desde la web y dejarlo listo dentro de Supervivencia Offline.
          Hazlo con Wi-Fi si puedes: los mapas ocupan bastante espacio.
        </p>
      </div>

      <div className="map-install-steps">
        {mapInstallGuide.map((step, index) => (
          <article className="map-install-step" key={step.title}>
            <div className="map-install-step-copy">
              <span>Paso {index + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
            <div className={`map-install-images ${step.images.length > 1 ? "map-install-images-pair" : ""}`}>
              {step.images.map((image) => (
                <img src={image.src} alt={image.alt} key={image.src} loading="lazy" />
              ))}
            </div>
          </article>
        ))}
      </div>

      <SafetyWarning>
        Comprueba que el archivo termina en .mbtiles, que tienes espacio libre suficiente y que el mapa se ha importado
        correctamente antes de depender de &eacute;l sin cobertura.
      </SafetyWarning>
    </section>
  );
}

const aiInstallGuide = [
  {
    title: "Abrir el asistente IA offline",
    text:
      "Entra en la aplicación y abre Asistente Offline IA. Dentro de esa pantalla pulsa Centro de descargas IA y recursos para abrir la página de descargas.",
    images: [
      {
        src: "/screenshots/app/ai-guide/paso-1-asistente-ia.jpg",
        alt: "Pantalla del asistente IA offline con acceso al centro de descargas",
      },
    ],
  },
  {
    title: "Entrar en la descarga del modelo",
    text:
      "En el Centro de descargas pulsa Descargar IA local desde Hugging Face. La descarga se realiza desde la página oficial del modelo.",
    images: [
      {
        src: "/screenshots/app/ai-guide/paso-2-centro-descargas-ia.jpg",
        alt: "Centro de descargas con el botón de IA local",
      },
    ],
  },
  {
    title: "Descargar el archivo GGUF recomendado",
    text:
      "En Hugging Face busca el archivo qwen2.5-0.5b-instruct-q5_0.gguf. Es el modelo recomendado para teléfonos compatibles y pesa aproximadamente 490 MB. Pulsa la flecha de descarga.",
    images: [
      {
        src: "/screenshots/app/ai-guide/paso-3-hugging-face-modelo.jpg",
        alt: "Página oficial de Hugging Face con el archivo GGUF recomendado",
      },
    ],
  },
  {
    title: "Importar el modelo desde Recursos",
    text:
      "Cuando termine la descarga, vuelve a la app. Entra en Recursos y pulsa Importar modelo GGUF. Si tu móvil no es de gama alta, evita modelos más grandes porque consumen mucha memoria, batería y procesador.",
    images: [
      {
        src: "/screenshots/app/ai-guide/paso-4-importar-gguf.jpg",
        alt: "Pantalla de recursos offline con el botón Importar modelo GGUF",
      },
    ],
  },
  {
    title: "Seleccionar el archivo y usar la IA",
    text:
      "Selecciona el archivo GGUF descargado. Cuando aparezca el mensaje de modelo importado, la IA se cargará automáticamente y ya podrás usar el asistente offline.",
    images: [
      {
        src: "/screenshots/app/ai-guide/paso-5-seleccionar-archivo.jpg",
        alt: "Selector de archivos para elegir el modelo GGUF descargado",
      },
      {
        src: "/screenshots/app/ai-guide/paso-5-modelo-importado.jpg",
        alt: "Mensaje de modelo GGUF importado correctamente",
      },
      {
        src: "/screenshots/app/ai-guide/paso-5-ia-lista.jpg",
        alt: "Asistente IA offline listo para responder dentro de la app",
      },
    ],
  },
];

function AiInstallGuide() {
  return (
    <section className="map-install-guide ai-install-guide" aria-labelledby="ai-install-guide-title">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Tutorial de IA local</p>
        <h3 id="ai-install-guide-title">Cómo descargar e importar la IA local</h3>
        <p>
          La IA local se descarga aparte porque el modelo ocupa mucho espacio. Usa Wi-Fi, comprueba el espacio libre y
          descarga el archivo oficial desde Hugging Face.
        </p>
      </div>

      <div className="map-install-steps">
        {aiInstallGuide.map((step, index) => (
          <article className="map-install-step" key={step.title}>
            <div className="map-install-step-copy">
              <span>Paso {index + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
            <div className={`map-install-images ${step.images.length > 1 ? "map-install-images-triple" : ""}`}>
              {step.images.map((image) => (
                <img src={image.src} alt={image.alt} key={image.src} loading="lazy" />
              ))}
            </div>
          </article>
        ))}
      </div>

      <SafetyWarning>
        La IA local puede cometer errores. Sus respuestas son orientativas y no sustituyen al 112, servicios oficiales,
        autoridades, profesionales sanitarios ni formación especializada.
      </SafetyWarning>
    </section>
  );
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
          Estos recursos se descargan aparte del APK para no hacer la instalación principal demasiado pesada. Descárgalos
          antes de necesitarlos sin cobertura y añádelos desde la app.
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
      <MapInstallGuide />

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
              Supervivencia Offline no aloja, modifica ni redistribuye este archivo. La descarga se realiza desde la página
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
        autoridades, profesionales sanitarios ni formación especializada.
      </SafetyWarning>
      <AiInstallGuide />
    </article>
  );
}

async function getVisibleContent() {
  const savedContent = await readAdminContent().catch(() => null);
  const savedPages = savedContent?.pages?.length ? savedContent.pages : allContentPages;
  return {
    pages: savedPages.map((page) =>
      page.slug === "descargar"
        ? { ...page, body: [], highlights: [], sections: [] }
        : page,
    ),
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
  const isDownloadPage = slug === "descargar" || page.slug === "descargar";
  const isResourcesPage = slug === "recursos-avanzados" || page.slug === "recursos-avanzados";
  const showPageHero = !isDownloadPage;
  const showPageContent = page.slug !== "donaciones" && page.slug !== "centro-descargas" && !isDownloadPage;
  const sectionsToRender = isResourcesPage
    ? page.sections?.filter((section) => section.title !== "Calculadoras")
    : page.sections;

  return (
    <>
      {showPageHero ? (
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
      ) : null}

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
          {sectionsToRender?.map((section) => {
            const hasShowcase = Boolean(section.image || section.steps || section.tips);
            return (
              <Fragment key={section.title}>
                <article className={hasShowcase ? "option-showcase" : "mini-card"}>
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
              </Fragment>
            );
          })}
          {isResourcesPage ? (
            <article className="resource-calculator-block resource-calculator-block-compact">
              <div className="section-heading compact-heading">
                <p className="eyebrow">Herramientas de calculo</p>
                <h2>Calculadoras</h2>
                <p>
                  Estimaciones orientativas para agua, captacion de lluvia, energia, velocidad necesaria,
                  sensacion termica, horas de luz, potabilizacion, destilacion solar, rios, conversor survival,
                  silbato, senales de humo e hipotermia.
                </p>
              </div>
              <div className="compact-calculator-grid">
                {calculators.map((calculator) => (
                  <article className="compact-calculator-card" key={calculator.id}>
                    <h3>{calculator.title}</h3>
                    <p>{calculator.description}</p>
                  </article>
                ))}
              </div>
            </article>
          ) : null}
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
              {orderedBlogPosts.map((article) => (
                <Link href={`/blog/${article.slug}`} key={article.slug}>
                  <span>{article.category}</span>
                  <strong>{article.title}</strong>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {page.slug === "descargar" ? (
        <section className="content-band download-only-band">
          <DownloadCard info={visibleDownloadInfo} />
          <BugReportForm source="Descargar aplicacion" title="Reportar un fallo de descarga" />
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
          <div id="reportar-fallo">
            <BugReportForm source="Contacto" title="Reportar un fallo de la app o la web" />
          </div>
        </section>
      ) : null}
    </>
  );
}
