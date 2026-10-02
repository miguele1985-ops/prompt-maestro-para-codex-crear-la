import { Breadcrumbs } from "./Breadcrumbs";
import { ContentCatalog } from "./ContentCatalog";
import { portalTopics, type PortalItem } from "@/content/portal";
import { catalogs } from '@/content/catalogs';
export function PortalLibrary({
  title,
  description,
  href,
  items,
  children,
  catalogKey,
  currentPage = 1,
}: {
  title: string;
  description: string;
  href: string;
  items: PortalItem[];
  children?: React.ReactNode;
  catalogKey?: string;
  currentPage?: number;
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
        <ContentCatalog key={`${href}:${currentPage}`} items={items} topics={portalTopics} catalogKey={catalogKey || catalogs.find(catalog => catalog.href === href)?.key} catalogHref={href} currentPage={currentPage} />
      </div>
    </div>
  );
}
