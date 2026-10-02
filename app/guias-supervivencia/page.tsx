import Link from "next/link";
import { portalContent, portalTopics } from "@/content/portal";
import { ContentCatalog } from "@/components/ContentCatalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Guías de supervivencia por temas",
  description:
    "Aprende a prepararte antes de una emergencia. Biblioteca de guías de agua, energía, orientación, hogar y familia.",
  slug: "guias-supervivencia",
});
export default function GuidesPage() {
  const guides = portalContent.filter((p) => p.kind === "Guía");
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
          <h1>Guías de supervivencia</h1>
          <p>
            Aprende a prepararte antes de una emergencia y consulta rápidamente qué hacer cuando
            algo ocurre.
          </p>
        </header>
        <ContentCatalog
          catalogKey="guias"
          catalogHref="/guias-supervivencia"
          items={guides}
          topics={portalTopics}
          placeholder="Buscar una guía: agua, apagón, refugio, orientación..."
        >
          <h2>Categorías</h2>
          <div className="portal-categories">
            {portalTopics
              .filter((t) => guides.some((p) => p.topic === t[0]))
              .map((t) => (
                <Link key={t[0]} href={`/guias-supervivencia/${t[0]}`}>
                  <ResponsiveImage
                    src={`/images/blog/${t[3]}.jpg`}
                    alt={`${t[1]}. Imagen editorial ilustrativa.`}
                    width={360}
                    height={180}
                    sizes="(max-width:700px) 90vw, 260px"
                    loading="lazy"
                  />
                  <strong>{t[1]}</strong>
                  <span>{t[2]}</span>
                  <small>{guides.filter((p) => p.topic === t[0]).length} guías · Ver guías</small>
                </Link>
              ))}
          </div>
          <h2>Todas las guías</h2>
        </ContentCatalog>
      </div>
    </div>
  );
}
