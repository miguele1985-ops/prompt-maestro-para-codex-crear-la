// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ContentCatalog } from '../src/components/ContentCatalog';
import { catalogs, catalogPageCount, catalogPageHref, catalogPageSize, paginatedCatalogs, resolveCatalogPage } from '../src/content/catalogs';
import { blogPosts } from '../src/content/blog';
import { portalTopics, type PortalItem } from '../src/content/portal';
import sitemap from '../app/sitemap';
import ContentMapPage from '../app/mapa-web/page';
import { generateMetadata } from '../app/catalogo/[...segmentos]/page';

afterEach(cleanup);
const sampleItems: PortalItem[] = Array.from({length:25}, (_,i)=>({href:`/test-${i}`,title:`Contenido ${i}`,excerpt:i===24?'Especial':'Normal',kind:'Artículo',topic:'agua'}));

describe('crawlable content discovery', () => {
  it('renders later pages and navigation as HTML links before JavaScript runs', () => {
    const html = renderToStaticMarkup(<ContentCatalog items={sampleItems} topics={portalTopics} catalogKey="articulos" catalogHref="/supervivencia" currentPage={2} />);
    const document = new DOMParser().parseFromString(html,'text/html');
    expect(document.querySelectorAll('.portal-card')).toHaveLength(12);
    expect(document.querySelector('.portal-card a')?.getAttribute('href')).toBe('/test-12');
    expect(document.querySelector('.portal-pagination a[aria-label^="Página anterior"]')?.getAttribute('href')).toBe('/supervivencia');
    expect(document.querySelector('.portal-pagination a[aria-label^="Página siguiente"]')?.getAttribute('href')).toBe('/catalogo/articulos/3');
    expect(document.querySelectorAll('.portal-pagination button')).toHaveLength(0);
  });
  it('resets local filtering on a later page and restores the current URL page when cleared', () => {
    const ui = render(<ContentCatalog items={sampleItems} topics={portalTopics} catalogKey="articulos" catalogHref="/supervivencia" currentPage={2} />);
    fireEvent.change(ui.getByRole('searchbox'),{target:{value:'Especial'}});
    expect(ui.container.querySelectorAll('.portal-card')).toHaveLength(1);
    expect(ui.container.querySelector('.portal-card a')?.getAttribute('href')).toBe('/test-24');
    fireEvent.change(ui.getByRole('searchbox'),{target:{value:''}});
    expect(ui.container.querySelector('.portal-card a')?.getAttribute('href')).toBe('/test-12');
  });
  it('gives every generated page a valid route and its own canonical URL', async () => {
    for (const {catalog,page} of paginatedCatalogs()) {
      const segments=[...catalog.key.split('/'),String(page)];
      expect(resolveCatalogPage(segments)).toEqual({catalog,page});
      const metadata=await generateMetadata({params:Promise.resolve({segmentos:segments})});
      expect(metadata.alternates?.canonical).toBe(`https://www.modocrisissurvival.com${catalogPageHref(catalog,page)}`);
      expect(catalog.items.slice((page-1)*catalogPageSize,page*catalogPageSize).length).toBeGreaterThan(0);
    }
    for(const segments of [['articulos','1'],['articulos','0'],['articulos','02'],['articulos','999'],['articulos','2x'],['desconocido','2']]) expect(resolveCatalogPage(segments)).toBeUndefined();
    for(const catalog of catalogs) expect(catalogPageHref(catalog,1)).toBe(catalog.href);
    expect(catalogPageCount(catalogs.find(c=>c.key==='temas')!)).toBeGreaterThan(1);
  });
  it('links all articles directly from the server-rendered content map', () => {
    const document=new DOMParser().parseFromString(renderToStaticMarkup(<ContentMapPage />),'text/html');
    const links=new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')));
    for(const post of blogPosts) expect(links.has(`/supervivencia/${post.slug}`),post.slug).toBe(true);
  });
  it('lists unique canonical sitemap URLs, all articles, pagination and cover images', () => {
    const entries=sitemap();
    const urls=new Set(entries.map(entry=>entry.url));
    expect(urls.size).toBe(entries.length);
    expect(urls.has('https://www.modocrisissurvival.com/mapa-web')).toBe(true);
    for(const entry of entries) {
      expect(new URL(entry.url).origin).toBe('https://www.modocrisissurvival.com');
      expect(new URL(entry.url).pathname).not.toMatch(/^\/(buscar|administracion|admin-login|pago-licencia|blog|api)(\/|$)/);
    }
    for(const post of blogPosts) {
      const entry=entries.find(entry=>entry.url.endsWith(`/supervivencia/${post.slug}`));
      expect(entry?.images).toEqual([`https://www.modocrisissurvival.com${post.image}`]);
    }
    for(const {catalog,page} of paginatedCatalogs()) expect(urls.has(`https://www.modocrisissurvival.com${catalogPageHref(catalog,page)}`)).toBe(true);
  });
});
