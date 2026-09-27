import { PortalLibrary } from "@/components/PortalLibrary";
import { portalContent } from "@/content/portal";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Preparación práctica: guías del hogar y el grupo",
  description:
    "Organiza inventario, documentos, mapas, batería y ejercicios familiares con listas descargables.",
  slug: "preparacion-practica",
});
export default function PracticalLibrary() {
  return (
    <PortalLibrary
      title="Preparación práctica"
      description="Revisa lo que tienes, acuerda cómo usarlo y prueba las pequeñas cosas antes de necesitarlas."
      href="/preparacion-practica"
      items={portalContent.filter((p) => p.href.startsWith("/preparacion-practica/"))}
    />
  );
}
