import { PreparationChecklist } from "@/components/PreparationChecklist";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "16 listas de preparación y emergencia para imprimir",
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
          <p>16 listas para tu hogar, mochilas, vehículo, familia y mascotas. Adaptadas del contenido de la app a una revisión previa, según tus necesidades y los riesgos de tu zona.</p>
        </header>
        <p className="field-safety">Estas listas son para prepararte con antelación. En una emergencia activa, sigue las indicaciones oficiales y no retrases una llamada al 112 para completar tareas.</p>
        <PreparationChecklist />
      </div>
    </div>
  );
}
