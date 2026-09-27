import { PortalLibrary } from "@/components/PortalLibrary";
import { portalContent } from "@/content/portal";
import { pageMetadata } from "@/lib/seo";
export const metadata = {
  ...pageMetadata({
    title: "Buscar en Modo Crisis Survival",
    description: "Encuentra guías, artículos, comparativas y herramientas de preparación.",
    slug: "buscar",
  }),
  robots: { index: false, follow: true },
};
export default function SearchPage() {
  return (
    <PortalLibrary
      title="¿Qué necesitas encontrar?"
      description="Guías, artículos, comparativas y herramientas, cada uno en su lugar."
      href="/buscar"
      items={portalContent}
    />
  );
}
