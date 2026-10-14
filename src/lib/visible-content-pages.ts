import { allContentPages } from '@/content/pages';
import { webPolicyPages } from '@/content/web-policies';
import type { ContentPage } from '@/types/content';

export function visibleContentPages(saved?: ContentPage[]) {
  const pages = new Map(allContentPages.map(page => [page.slug, page]));
  for (const page of saved || []) pages.set(page.slug, page);
  for (const page of webPolicyPages) pages.set(page.slug, page);
  return [...pages.values()];
}
