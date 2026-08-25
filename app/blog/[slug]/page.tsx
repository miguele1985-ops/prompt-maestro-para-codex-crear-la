import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SafetyWarning } from "@/components/Badges";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { blogAppUseGuides, blogPosts, getBlogPost } from "@/content/blog";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    slug: `blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const appUseGuide = blogAppUseGuides[post.slug];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Organization", name: "Modo Crisis Survival" },
    publisher: { "@type": "Organization", name: "Modo Crisis Survival" },
  };

  return (
    <>
      <SeoJsonLd data={articleJsonLd} />
      <section className="page-hero blog-post-hero">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="blog-article-meta">
          <span>{post.readingTime}</span>
          <span>{post.date}</span>
        </div>
      </section>

      <article className="content-band blog-article">
        <ResponsiveImage
          className="blog-article-cover"
          src={post.image}
          alt={post.imageAlt}
          width={576}
          height={880}
          widths={[360, 576]}
          sizes="min(100vw - 2rem, 960px)"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {post.warning ? <SafetyWarning title="Aviso importante">{post.warning}</SafetyWarning> : null}

        {post.sections.map((section) => (
          <section className="blog-article-section" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
            {section.bullets ? (
              <ul>
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </section>
        ))}

        {appUseGuide ? (
          <section className="blog-article-section blog-app-use">
            <h2>{appUseGuide.title}</h2>
            <p>{appUseGuide.intro}</p>
            <ol>
              {appUseGuide.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
        ) : null}

        {post.relatedLinks?.length ? (
          <nav className="blog-related" aria-label="Enlaces relacionados">
            <h2>Seguir explorando</h2>
            <div>
              {post.relatedLinks.map((link) => (
                <Link href={link.href} key={link.href}>{link.label}</Link>
              ))}
              <Link href="/blog">Volver al blog</Link>
            </div>
          </nav>
        ) : (
          <nav className="blog-related" aria-label="Enlaces relacionados">
            <Link href="/blog">Volver al blog</Link>
          </nav>
        )}
      </article>
    </>
  );
}
