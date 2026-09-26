import { PreparationChecklist } from "@/components/PreparationChecklist";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Checklist de preparación familiar para imprimir",
  description:
    "Revisa tu plan familiar, agua, documentación, equipo y suministros. Marca las tareas y descarga o imprime una copia sin registrar tus datos.",
  slug: "checklists",
});
export default function ChecklistPage() {
  return (
    <div className="editorial-library">
      <div className="journal-section">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Checklist familiar", href: "/checklists" },
          ]}
        />
        <header className="editorial-library-heading">
          <p className="journal-kicker">Preparación en casa</p>
          <h1>Tu próxima revisión, por escrito</h1>
          <p>Una lista de partida para adaptar a tu familia y a los riesgos de tu zona.</p>
        </header>
        <PreparationChecklist />
      </div>
    </div>
  );
}
