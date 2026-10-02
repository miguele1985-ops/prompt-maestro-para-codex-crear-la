import { notFound } from "next/navigation";
import { portalContent, portalTopics } from "@/content/portal";
import { ContentCard, ContentCatalog } from "@/components/ContentCatalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
const categories = portalTopics.filter((t) =>
  portalContent.some((p) => p.kind === "Guía" && p.topic === t[0]),
);
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((t) => ({ categoria: t[0] }));
}
export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const t = categories.find((t) => t[0] === categoria);
  return t
    ? pageMetadata({
        title: `Guías de ${t[1].toLowerCase()}`,
        description: t[2],
        slug: `guias-supervivencia/${categoria}`,
      })
    : {};
}
export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const t = categories.find((t) => t[0] === categoria);
  if (!t) notFound();
  const items = portalContent.filter((p) => p.kind === "Guía" && p.topic === categoria);
  return (
    <div className="editorial-library">
      <div className="journal-section">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Guías", href: "/guias-supervivencia" },
            { label: t[1], href: `/guias-supervivencia/${categoria}` },
          ]}
        />
        <header className="editorial-library-heading">
          <h1>{t[1]}</h1>
          <p>{t[2]}</p>
        </header>
        <h2>Guías destacadas</h2>
        <div className="portal-grid">
          {items.slice(0, 3).map((item) => (
            <ContentCard key={item.href} item={item} />
          ))}
        </div>
        <h2>Todas las guías de {t[1].toLowerCase()}</h2>
        <ContentCatalog items={items} topics={portalTopics} catalogKey={`guias/${categoria}`} catalogHref={`/guias-supervivencia/${categoria}`} />
      </div>
    </div>
  );
}
