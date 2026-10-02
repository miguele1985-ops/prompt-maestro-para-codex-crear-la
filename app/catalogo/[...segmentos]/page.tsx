import { notFound } from 'next/navigation';
import { paginatedCatalogs, resolveCatalogPage, catalogPageHref } from '@/content/catalogs';
import { PortalLibrary } from '@/components/PortalLibrary';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return paginatedCatalogs().map(({ catalog, page }) => ({ segmentos: [...catalog.key.split('/'), String(page)] }));
}
type PageProps = { params: Promise<{ segmentos: string[] }> };
export async function generateMetadata({ params }: PageProps) {
  const resolved = resolveCatalogPage((await params).segmentos);
  if (!resolved) return {};
  const { catalog, page } = resolved;
  return pageMetadata({ title: `${catalog.title}: página ${page}`, description: catalog.description, slug: catalogPageHref(catalog, page).slice(1) });
}
export default async function CatalogPage({ params }: PageProps) {
  const resolved = resolveCatalogPage((await params).segmentos);
  if (!resolved) notFound();
  const { catalog, page } = resolved;
  return <PortalLibrary title={catalog.title} description={catalog.description} href={catalog.href} items={catalog.items} catalogKey={catalog.key} currentPage={page} />;
}
