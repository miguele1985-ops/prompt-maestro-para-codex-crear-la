export const catalogPageSize = 12;

export function catalogPageHref(catalog: { key: string; href: string }, page: number) {
  return page === 1 ? catalog.href : `/catalogo/${catalog.key}/${page}`;
}
