import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Smartphone } from "lucide-react";
import { SafetyWarning } from "@/components/Badges";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { blogPosts, getBlogPost } from "@/content/blog";
import { usesOriginalBody, articleWordCount } from '@/lib/article-body';
import { articleQualityRevisions } from '@/content/article-quality-revisions';
import { distinctGuideRevisions } from '@/content/distinct-guide-revisions';
import originals from "@/content/editorial-articles.json";
import { articleIndex, articleTopic, readingMinutes, relatedArticles, articleDescription } from "@/lib/editorial";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ArticleEquipment } from "@/components/ArticleEquipment";
import { monetizationPolicy } from "@/lib/monetization";
import { SurvivalCalculator } from "@/components/SurvivalCalculator";
import { PlantPhotoGallery } from "@/components/PlantPhotoGallery";
import { AppDownloadActions } from "@/components/AppDownloadActions";
import { contentKind, portalTopic, portalTopics, editorialCover } from "@/content/portal";
import { ArticleActions } from '@/components/ArticleActions';
import legacyFAQ from '@/content/legacy-faq-index.json';
import { growthRevisions } from '@/content/growth-revisions';

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
    description: articleDescription(post),
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
  const revised = !usesOriginalBody(post.slug);
  const original = revised ? undefined : (originals as Record<string, string>)[post.slug];
  const info = revised ? undefined : articleIndex[post.slug];
  const sections = original
    ? growthRevisions[post.slug]?.sections || []
    : post.sections.filter((section) => section.heading !== "Transparencia comercial");
  const sectionId = (index: number) => `${original ? 'ampliacion' : 'seccion'}-${index + 1}`;
  const toc = [...(info?.toc || []), ...sections.map((s, i) => ({ id: sectionId(i), title: s.heading })), ...(post.faq?.length ? [{ id: 'preguntas-frecuentes', title: 'Preguntas de esta revisión' }] : [])];
  const related = relatedArticles(post, blogPosts);
  const sources = post.sources ?? info?.sources ?? [];
  const faq = post.faq || (original ? (legacyFAQ as Record<string, Array<{question: string; answer: string}>>)[post.slug] : undefined);
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
            <Link href="/politica-editorial#responsable">Redacción Modo Crisis Survival</Link>
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
            {post.updatedAt ? <span>Actualizado: <time dateTime={post.updatedAt}>{new Date(`${post.updatedAt}T12:00:00`).toLocaleDateString("es-ES")}</time></span> : null}
          </div>
        </header>
        <ArticleActions slug={post.slug} title={post.title} />
        {kind!=='Calculadora'?<figure className="editorial-article-photo">
          <ResponsiveImage
            src={cover.image}
            alt={cover.alt}
            width={1200}
            height={800}
            widths={[360, 576, 960, 1200]}
            sizes="(max-width:700px) calc(100vw - 32px), (max-width:1120px) calc(100vw - 48px), 1072px"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            {post.imageCredit ? <>{post.imageCredit.author}. <a href={post.imageCredit.source}>Ver imagen y fuente</a> · <a href={post.imageCredit.licenseUrl}>{post.imageCredit.license}</a>. </> : null}
            {!post.imageCredit && post.slug === 'eclipse-del-12-de-agosto-de-2026-por-que-hubo-avisos' && <>Foto de archivo de 2017, no del eclipse de 2026: NASA/Aubrey Gemignani, dominio público. </>}
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
              return (
                <section
                  className="editorial-text-section"
                  key={section.heading}
                  id={sectionId(i)}
                >
                   <h2>{section.heading === "Transparencia comercial" ? "Consultar en Amazon" : section.heading}</h2>
                  {section.heading !== "Transparencia comercial" ? section.body.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : null}
                  {section.steps ? <ol>{section.steps.map(step => <li key={step}>{step}</li>)}</ol> : null}
                  {section.table ? <div className="article-table-scroll" tabIndex={0} role="region" aria-label={section.table.caption}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
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
            {post.faq?.length ? <section className="article-faq" id="preguntas-frecuentes"><h2>Preguntas frecuentes</h2>{post.faq.map(item => <details key={item.question}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>)}</section> : null}
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
              <Link href="/politica-editorial">Cómo trabajamos y cómo se financia la web</Link>
            </section>
            {!articleQualityRevisions[post.slug] && !distinctGuideRevisions[post.slug] && monetizationPolicy(`/supervivencia/${post.slug}`).affiliate ? <ArticleEquipment slug={post.slug} /> : null}
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
              url: absoluteUrl("/politica-editorial#responsable"),
            },
            publisher: {
              "@type": "Organization",
              name: "Modo Crisis Survival",
              logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.jpg") },
            },
            inLanguage: "es",
            ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
            ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
            wordCount: articleWordCount(post),
          }}
        />
        {faq?.length ? <SeoJsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }} /> : null}
      </div>
    </div>
  );
}
