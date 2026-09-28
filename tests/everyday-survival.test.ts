import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { blogPosts, getBlogPost } from '../src/content/blog';
import { everydayArticles, everydayAliases, everydayUpdates } from '../src/content/everyday-survival';
import { portalContent } from '../src/content/portal';
import sitemap from '../app/sitemap';
import config from '../next.config';

describe('five everyday survival articles and URL migration', () => {
  it('adds three and expands two without duplicate slugs', () => {
    expect(everydayArticles).toHaveLength(5);
    expect(everydayUpdates.size).toBe(2);
    expect(blogPosts).toHaveLength(98);
    expect(new Set(blogPosts.map(p => p.slug)).size).toBe(98);
    for (const entry of everydayArticles) {
      const post = getBlogPost(entry.slug)!;
      expect(post.sections).toEqual(entry.sections);
      expect(post.title).toBe(entry.title);
      expect(existsSync(`public${post.image}`)).toBe(true);
      expect(portalContent.some(p => p.href === `/supervivencia/${post.slug}` && p.kind === 'Artículo')).toBe(true);
    }
    expect(everydayArticles[0].sections.filter(s => /^\d+\./.test(s.heading))).toHaveLength(20);
    expect(everydayArticles[1].sections.filter(s => /^\d+\./.test(s.heading))).toHaveLength(7);
    expect(everydayArticles[4].sections.filter(s => /^\d+\./.test(s.heading))).toHaveLength(15);
  });
  it('lists only canonical destinations in sitemap and portal', () => {
    const urls = sitemap().map(p => p.url);
    expect(urls.some(p => p.includes('/blog'))).toBe(false);
    for (const post of blogPosts) expect(urls.filter(p => p.endsWith(`/supervivencia/${post.slug}`))).toHaveLength(1);
    expect(portalContent.some(p => p.href.startsWith('/blog'))).toBe(false);
  });
  it('permanently redirects old URLs and requested aliases without chains', async () => {
    const redirects = await config.redirects!();
    expect(redirects).toContainEqual({ source: '/blog/:slug', destination: '/supervivencia/:slug', permanent: true });
    for (const [alias, canonical] of Object.entries(everydayAliases)) {
      expect(getBlogPost(alias)).toBeUndefined();
      expect(getBlogPost(canonical)).toBeDefined();
      for (const base of ['blog', 'supervivencia']) expect(redirects).toContainEqual({ source: `/${base}/${alias}`, destination: `/supervivencia/${canonical}`, permanent: true });
    }
  });
});
