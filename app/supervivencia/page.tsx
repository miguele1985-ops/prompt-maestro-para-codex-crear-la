import { PortalLibrary } from "@/components/PortalLibrary";
import { portalContent } from "@/content/portal";
import { ContentCard } from "@/components/ContentCatalog";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Artículos de supervivencia y preparación",
  description:
    "Actualidad, explicaciones y análisis para entender mejor la preparación y las emergencias.",
  slug: "supervivencia",
});
export default function BlogPage() {
  const items = portalContent.filter((p) => p.kind === "Artículo");
  return (
    <PortalLibrary
      title="Artículos de supervivencia y preparación"
      description="Explicaciones, actualidad y análisis para tomar decisiones con más contexto."
      href="/supervivencia"
      items={items}
    >
      <h2>Lecturas destacadas</h2>
      <div className="portal-grid">
        {items.slice(0, 3).map((item) => (
          <ContentCard key={item.href} item={item} />
        ))}
      </div>
      <h2>Últimos artículos</h2>
    </PortalLibrary>
  );
}
