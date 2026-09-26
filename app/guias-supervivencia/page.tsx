import Link from "next/link";
import { blogPosts } from "@/content/blog";
import { articleTopic, topics } from "@/lib/editorial";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
export const metadata = pageMetadata({
  title: "Guías de supervivencia por temas",
  description:
    "Biblioteca de guías prácticas de agua, energía, hogar, naturaleza y equipamiento. Consulta los artículos completos sin instalar la aplicación.",
  slug: "guias-supervivencia",
});
export default function GuidesPage() {
  return (
    <div className="editorial-library">
      <div className="journal-section">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Guías", href: "/guias-supervivencia" },
          ]}
        />
        <header className="editorial-library-heading">
          <p className="journal-kicker">De la duda al plan</p>
          <h1>Guías de supervivencia</h1>
          <p>Explora por necesidad. Cada enlace abre una guía completa disponible en la web.</p>
        </header>
        <nav className="journal-topics" aria-label="Temas de las guías">
          {topics
            .filter((t) => t !== "Todos")
            .map((t, i) => (
              <a href={`#tema-${i}`} key={t}>
                {t}
              </a>
            ))}
        </nav>
        {topics
          .filter((t) => t !== "Todos")
          .map((topic, i) => (
            <section className="guide-topic" id={`tema-${i}`} key={topic}>
              <h2>{topic}</h2>
              <ul>
                {blogPosts
                  .filter((p) => articleTopic(p) === topic)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      <p>{p.excerpt}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        <p>
          <Link href="/aplicacion-supervivencia-offline">
            Conoce también las guías y funciones offline de la aplicación.
          </Link>
        </p>
      </div>
    </div>
  );
}
