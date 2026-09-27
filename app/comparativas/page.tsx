import { PortalLibrary } from "@/components/PortalLibrary";
import { portalContent } from "@/content/portal";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Comparativas de equipo de supervivencia y emergencia",
  description:
    "Compara características, ventajas, limitaciones y criterios importantes antes de comprar.",
  slug: "comparativas",
});
export default function ComparisonPage() {
  return (
    <PortalLibrary
      title="Comparativas de equipo"
      description="Compara características, ventajas, limitaciones y criterios importantes antes de comprar."
      href="/comparativas"
      items={portalContent.filter((p) => p.kind === "Comparativa")}
    >
      <p>
        Análisis documentales, no pruebas propias de productos. Las imágenes son ilustrativas.
        Revisa la ficha y los recambios del modelo exacto; reutilizar lo que ya tienes también es
        una opción.
      </p>
    </PortalLibrary>
  );
}
