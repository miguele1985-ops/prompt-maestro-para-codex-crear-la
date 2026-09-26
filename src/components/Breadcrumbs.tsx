import Link from "next/link";
import { SeoJsonLd } from "./SeoJsonLd";
import { absoluteUrl } from "@/lib/seo";
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <>
      <nav className="editorial-breadcrumbs" aria-label="Ruta de navegación">
        <ol>
          {items.map((item, i) => (
            <li key={item.href}>
              {i === items.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <SeoJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
