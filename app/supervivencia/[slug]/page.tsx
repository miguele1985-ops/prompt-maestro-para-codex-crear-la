import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Smartphone } from "lucide-react";
import { SafetyWarning } from "@/components/Badges";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { blogPosts, getBlogPost } from "@/content/blog";
import { batchTwoRevisions } from "@/content/batch-two";
import { everydayUpdates } from "@/content/everyday-survival";
import originals from "@/content/editorial-articles.json";
import { articleIndex, articleTopic, readingMinutes, relatedArticles } from "@/lib/editorial";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ArticleEquipment } from "@/components/ArticleEquipment";
import { monetizationPolicy } from "@/lib/monetization";
import { SurvivalCalculator } from "@/components/SurvivalCalculator";
import { PlantPhotoGallery } from "@/components/PlantPhotoGallery";
import { AppDownloadActions } from "@/components/AppDownloadActions";
import { contentKind, portalTopic, portalTopics, editorialCover } from "@/content/portal";

export const dynamicParams = false;
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  const metadata = pageMetadata({
    title: post.seoTitle || post.title,
    description: post.excerpt,
    slug: `supervivencia/${post.slug}`,
    keywords: post.keywords,
    image: post.image,
    imageAlt: post.imageAlt,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
    },
  };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const revised = Boolean(batchTwoRevisions[post.slug]) || everydayUpdates.has(post.slug);
  const original = revised ? undefined : (originals as Record<string, string>)[post.slug];
  const info = revised ? undefined : articleIndex[post.slug];
  const sections = original
    ? []
    : post.sections.filter((section) => section.heading !== "Transparencia comercial");
  const toc = info?.toc ?? sections.map((s, i) => ({ id: `seccion-${i + 1}`, title: s.heading }));
  const related = relatedArticles(post, blogPosts);
  const sources = post.sources ?? info?.sources ?? [];
  const kind=contentKind(post.slug,post.category);
  const parent=kind==='Comparativa'?{label:'Comparativas',href:'/comparativas'}:kind==='Calculadora'?{label:'Herramientas',href:'/herramientas-supervivencia'}:kind==='App'?{label:'App',href:'/aplicacion-supervivencia-offline'}:kind==='Guía'?{label:'Guías',href:'/guias-supervivencia'}:{label:'Artículos',href:'/supervivencia'};
  const topic=portalTopics.find(t=>t[0]===portalTopic(post.slug))!;
  const cover=post.image.startsWith('/screenshots/')&&kind!=='App'?editorialCover(post.slug):{image:post.image,alt:post.imageAlt};
  return (
    <div className="editorial-article-page">
      <div className="editorial-article-shell">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            parent,
            ...(kind==='Guía'?[{label:topic[1],href:`/guias-supervivencia/${topic[0]}`}]:[]),
            { label: post.title, href: `/supervivencia/${post.slug}` },
          ]}
        />
        <header className="editorial-article-heading">
          <p className="journal-kicker">{kind} · {articleTopic(post)}</p>
          {kind==='App'?<p className="portal-app-notice">Esta guía explica una función de Android. No es una calculadora web. <Link href="/herramientas-supervivencia">Ver herramientas web disponibles</Link></p>:null}
          <h1>{post.title}</h1>
          <p className="editorial-standfirst">{post.excerpt}</p>
          <div className="editorial-byline">
            <span>Redacción Modo Crisis Survival</span>
            <span>
              <Clock size={15} aria-hidden /> {readingMinutes(post)} min de lectura
            </span>
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {new Date(`${post.publishedAt}T12:00:00`).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </div>
        </header>
        {kind!=='Calculadora'?<figure className="editorial-article-photo">
          <ResponsiveImage
            src={cover.image}
            alt={cover.alt}
            width={1200}
            height={750}
            widths={[360, 576, 960, 1200]}
            sizes="(max-width:760px) 100vw, 1080px"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            Imagen ilustrativa. Consulta las fuentes del artículo para contrastar los datos; una
            imagen no permite identificar especies ni verificar un producto.
          </figcaption>
        </figure>:<SurvivalCalculator slug={post.slug} />}
        <div className="editorial-reading-layout">
          <aside className="editorial-toc">
            <details open>
              <summary>
                <BookOpen size={18} aria-hidden /> En esta guía
              </summary>
              <ol>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ol>
            </details>
            <Link href="/supervivencia">
              Explorar la biblioteca <ArrowRight size={16} aria-hidden />
            </Link>
          </aside>
          <article className="editorial-prose">
            {post.warning ? (
              <SafetyWarning title="Antes de empezar">{post.warning}</SafetyWarning>
            ) : null}
            {original ? (
              <div className="article-original" dangerouslySetInnerHTML={{ __html: original }} />
            ) : null}
            {sections.map((section, i) => {
              const links = section.links?.filter((l) => !l.sponsored);
              if (original && !links?.length) return null;
              return (
                <section
                  className="editorial-text-section"
                  key={section.heading}
                  id={original ? undefined : `seccion-${i + 1}`}
                >
                   <h2>{section.heading === "Transparencia comercial" ? "Consultar en Amazon" : section.heading}</h2>
                  {section.heading !== "Transparencia comercial" ? <p>{section.body}</p> : null}
                  {section.image ? <figure className={section.image.fullWidth ? "article-field-reference" : "article-app-reference"}>
                    <a href={section.image.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${section.image.alt}`}><ResponsiveImage src={section.image.src} alt={section.image.alt} width={section.image.fullWidth ? 1200 : 360} height={section.image.fullWidth ? 900 : 720} loading="lazy" widths={section.image.fullWidth ? [360,576,960,1200] : undefined} sizes={section.image.fullWidth ? "(max-width:760px) 90vw, 760px" : "(max-width:400px) 85vw, 320px"} /></a>
                    <figcaption>{section.image.caption || 'Captura de la aplicación Modo Crisis Survival.'}</figcaption>
                  </figure> : null}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {links?.length ? (
                    <div className="blog-section-links">
                      {links.map((link) =>
                        link.href.startsWith("http") ? (
                          <a
                            href={link.href}
                            key={link.href}
                            rel={
                              link.sponsored
                                ? "sponsored nofollow noopener noreferrer"
                                : "noopener noreferrer"
                            }
                            target="_blank"
                          >
                            {link.sponsored ? "Ver en Amazon" : link.label}
                          </a>
                        ) : (
                          <Link key={link.href} href={link.href}>
                            {link.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })}
            {post.slug === "plantas-comestibles-y-peligrosas-que-se-pueden-confundir" ? <PlantPhotoGallery /> : null}
            {post.slug === "5-nudos-basicos-de-supervivencia-que-merece-la-pena-practicar" ? <p><Link href="/nudos">Consultar las 19 fichas de nudos de la aplicación, adaptadas para la web</Link></p> : null}
            {post.relatedLinks?.length ? (
              <nav className="editorial-resource-links" aria-label="Recursos relacionados con este artículo">
                <h2>Recursos para ponerlo en práctica</h2>
                <ul>
                  {post.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}<ArrowRight size={18} aria-hidden /></Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            <section className="editorial-review-note">
              <h2>Fuentes y criterio editorial</h2>
              <p>
                Este contenido es educativo. Las comparativas documentales no son pruebas propias de
                producto; los precios o especificaciones fechados pueden cambiar. Comprueba el
                manual y la fuente original antes de decidir.
              </p>
              {sources.length ? (
                <ul>
                  {sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noopener noreferrer">
                        {source.title || new URL(source.url).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  Contrasta las indicaciones con los servicios oficiales y las instrucciones del
                  equipo. Puedes <Link href="/contacto">comunicar una corrección</Link>.
                </p>
              )}
              <Link href="/sobre-nosotros">Cómo trabajamos y cómo se financia la web</Link>
            </section>
            {monetizationPolicy(`/supervivencia/${post.slug}`).affiliate ? <ArticleEquipment slug={post.slug} /> : null}
            <section className="editorial-app-cta">
              <Smartphone size={26} aria-hidden />
              <div>
                <h2>Prepara también tu móvil</h2>
                <p>Lleva guías y recursos offline con Modo Crisis Survival.</p>
                <AppDownloadActions />
              </div>
            </section>
          </article>
        </div>
        <section className="editorial-related">
          <h2>Continúa preparando tu plan</h2>
          <div className="editorial-library-grid">
            {related.map((item) => (
              <article key={item.slug}>
                <Link href={`/supervivencia/${item.slug}`}>
                  <ResponsiveImage
                    src={item.image}
                    alt={item.imageAlt}
                    width={576}
                    height={360}
                    loading="lazy"
                    sizes="(max-width:700px) 90vw, 320px"
                  />
                  <div>
                    <span className="journal-kicker">{articleTopic(item)}</span>
                    <h3>{item.title}</h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
        <SeoJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: absoluteUrl(post.image),
            mainEntityOfPage: absoluteUrl(`/supervivencia/${post.slug}`),
            author: {
              "@type": "Organization",
              name: "Modo Crisis Survival",
              url: absoluteUrl("/sobre-nosotros"),
            },
            publisher: {
              "@type": "Organization",
              name: "Modo Crisis Survival",
              logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.jpg") },
            },
            inLanguage: "es",
            ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
            ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
            ...(info ? { wordCount: info.words } : {}),
          }}
        />
      </div>
    </div>
  );
}
