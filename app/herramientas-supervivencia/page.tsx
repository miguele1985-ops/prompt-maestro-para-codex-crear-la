import Link from "next/link";
import { ContentCard } from "@/components/ContentCatalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { webTools } from "@/content/portal";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Herramientas y calculadoras de supervivencia",
  description:
    "Calculadoras web de agua, lluvia, energía, velocidad, sensación térmica y horas de luz. Listas de preparación descargables.",
  slug: "herramientas-supervivencia",
});
export default function ToolsPage() {
  return (
    <div className="editorial-library">
      <div className="journal-section">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Herramientas", href: "/herramientas-supervivencia" },
          ]}
        />
        <header className="editorial-library-heading">
          <h1>Herramientas de supervivencia</h1>
          <p>
            Calculadoras y utilidades gratuitas para preparar recursos, estimar necesidades y tomar
            decisiones con más información.
          </p>
        </header>
        <h2>Calculadoras de supervivencia</h2>
        <div className="portal-grid">
          {webTools
            .filter((p) => p.kind === "Calculadora")
            .map((item) => (
              <ContentCard key={item.href} item={item} />
            ))}
        </div>
        <h2>Comunicación y naturaleza</h2>
        <div className="portal-grid">{webTools.filter(p => p.kind === "Herramienta").map(item => <ContentCard key={item.href} item={item} />)}</div>
        <h2>Planificación</h2>
        <div className="portal-grid">
          {webTools
            .filter((p) => p.kind === "Checklist")
            .map((item) => (
              <ContentCard key={item.href} item={item} />
            ))}
        </div>
        <p>
          Estimaciones orientativas, no garantías de seguridad. Las listas pueden imprimirse o
          descargarse.
        </p>
        <p>
          <Link href="/aplicacion-supervivencia-offline/herramientas">
            Herramientas personales exclusivas de Android
          </Link>{" "}
          · <Link href="/guias-supervivencia">Guías y recursos de aprendizaje</Link>
        </p>
      </div>
    </div>
  );
}
