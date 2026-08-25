import Link from "next/link";
import type { Metadata } from "next";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { blogPosts } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog de supervivencia offline y preparacion",
  description: "Articulos practicos de Modo Crisis Survival sobre apagones, mapas offline, planes familiares, agua, bateria, DANA, documentacion y preparacion ante emergencias.",
  slug: "blog",
  keywords: ["blog supervivencia", "preparacion emergencias", "supervivencia offline", "Modo Crisis Survival"],
});

export default function BlogPage() {
  return (
    <>
      <section className="page-hero blog-hero">
        <p className="eyebrow">Blog y recursos</p>
        <h1>Blog de Modo Crisis Survival</h1>
        <p>
          Guias practicas para entender mejor la app, preparar recursos antes de una emergencia y usar sus funciones offline con criterio.
        </p>
      </section>

      <section className="content-band">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Articulos preparados</p>
          <h2>Aprende a sacar mas partido a la aplicacion</h2>
          <p>
            Estos articulos amplian las funciones principales: guias, mapas offline, plan familiar, bateria, alertas, documentacion y revisiones.
          </p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <ResponsiveImage
                src={post.image}
                alt={post.imageAlt}
                width={576}
                height={880}
                widths={[240, 360, 576]}
                sizes="(max-width: 760px) 100vw, 360px"
                loading="lazy"
                decoding="async"
              />
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.category}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>Leer articulo</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
