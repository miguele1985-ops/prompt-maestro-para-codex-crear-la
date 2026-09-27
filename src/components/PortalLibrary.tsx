import { Breadcrumbs } from "./Breadcrumbs";
import { ContentCatalog } from "./ContentCatalog";
import { portalTopics, type PortalItem } from "@/content/portal";
export function PortalLibrary({
  title,
  description,
  href,
  items,
  children,
}: {
  title: string;
  description: string;
  href: string;
  items: PortalItem[];
  children?: React.ReactNode;
}) {
  return (
    <div className="editorial-library">
      <div className="journal-section">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: title, href },
          ]}
        />
        <header className="editorial-library-heading">
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
        <ContentCatalog items={items} topics={portalTopics} />
      </div>
    </div>
  );
}
