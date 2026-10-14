import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { blogPosts, getBlogPost } from "../src/content/blog";
import { articleAliases, canonicalArticleHref } from "../src/content/article-consolidation";
import { distinctGuideRevisions } from "../src/content/distinct-guide-revisions";
import { articleIndex } from "../src/lib/editorial";
import nextConfig from "../next.config";
import sitemap from "../app/sitemap";
import ArticlePage from "../app/supervivencia/[slug]/page";
import { allContentPages } from "../src/content/pages";
import { PayPalDonationBlock } from "../src/components/PayPalDonationBlock";
import originals from "../src/content/editorial-articles.json";
import { growthRevisions } from '../src/content/growth-revisions';

describe("useful canonical editorial library", () => {
  it("consolidates twelve old introductions without orphaning their addresses", async () => {
    expect(Object.keys(articleAliases)).toHaveLength(12);
    expect(blogPosts.length + Object.keys(articleAliases).length).toBe(113);
    const redirects = await nextConfig.redirects!();
    const urls = new Set(sitemap().map(entry => new URL(entry.url).pathname));
    for (const [alias, destination] of Object.entries(articleAliases)) {
      expect(blogPosts.some(post => post.slug === alias)).toBe(false);
      expect(blogPosts.some(post => post.slug === destination)).toBe(true);
      expect(getBlogPost(alias)?.slug).toBe(destination);
      expect(urls.has(`/supervivencia/${alias}`)).toBe(false);
      expect(urls.has(`/supervivencia/${destination}`)).toBe(true);
      for (const prefix of ["blog", "supervivencia"]) expect(redirects).toContainEqual({ source: `/${prefix}/${alias}`, destination: `/supervivencia/${destination}`, permanent: true });
    }
    expect(canonicalArticleHref('/blog/como-utilizar-mapas-offline#referencias')).toBe('/supervivencia/gps-movil-sin-internet-mapas-offline#referencias');
    expect(canonicalArticleHref('https://example.com/blog/test')).toBe('https://example.com/blog/test');
  });
  it("keeps all retained articles referenced and new organizational guides focused on tasks", async () => {
    for (const post of blogPosts) expect((post.sources ?? articleIndex[post.slug]?.sources ?? []).length).toBeGreaterThan(0);
    expect(Object.keys(distinctGuideRevisions)).toHaveLength(11);
    for (const [slug, revision] of Object.entries(distinctGuideRevisions)) {
      const post = getBlogPost(slug)!;
      expect(post.excerpt).toBe(revision.excerpt); expect(post.sections).toHaveLength(6 + (growthRevisions[slug]?.sections.length || 0));
      const markup = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug }) }));
      expect(markup).toContain(revision.sections[0].heading);
      expect(markup).not.toContain('id="equipo-articulo"');
    }
  });
  it("removes imported instructions intended for an editor rather than readers", () => {
    for (const html of Object.values(originals)) expect(html).not.toContain('Codex no debe');
  });
  it("explains website behavior separately from Android and does not preload PayPal", () => {
    const privacy = allContentPages.find(page => page.slug === 'privacidad')!;
    expect(JSON.stringify(privacy)).toContain('Cloudflare KV');
    expect(JSON.stringify(privacy)).toContain('100 registros');
    expect(JSON.stringify(privacy)).toContain('No utilizamos Google Analytics');
    const cookies = allContentPages.find(page => page.slug === 'cookies')!;
    expect(JSON.stringify(cookies)).toContain('no es una CMP certificada');
    const paypal = renderToStaticMarkup(<PayPalDonationBlock />);
    expect(paypal).toContain('Activar botón de PayPal'); expect(paypal).not.toContain('donate-sdk.js');
  });
});
