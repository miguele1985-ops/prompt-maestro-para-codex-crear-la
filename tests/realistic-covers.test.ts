import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { blogPosts } from '../src/content/blog';
import credits from '../src/content/realistic-cover-credits.json';

describe('distinct photographic article covers', () => {
  it('assigns a real raster photograph to every non-calculator article without sharing files', () => {
    const articles = blogPosts.filter(post => !post.slug.startsWith('calculadora-'));
    expect(articles).toHaveLength(88);
    expect(Object.keys(credits)).toHaveLength(88);
    expect(new Set(articles.map(post => post.image)).size).toBe(88);
    const hashes = articles.map(post => {
      expect(post.image, post.slug).toMatch(/^\/images\/editorial\/realistic\/.+\.webp$/);
      expect(post.imageAlt, post.slug).not.toContain('Diagrama editorial');
      expect(post.imageCredit?.source, post.slug).toBe(post.image);
      expect(post.imageCredit?.licenseUrl, post.slug).toBe('/politica-editorial#imagenes');
      return createHash('sha256').update(readFileSync(`public${post.image}`)).digest('hex');
    });
    expect(new Set(hashes).size).toBe(88);
  });

  it('ships every advertised responsive width as a valid WebP with the exact pixel width', async () => {
    for (const credit of Object.values(credits)) {
      const base = await sharp(`public${credit.image}`).metadata();
      expect(base.format).toBe('webp');
      expect(base.width).toBeGreaterThanOrEqual(1200);
      for (const width of [240, 360, 576, 960, 1200]) {
        const file = `public${credit.image.replace('.webp', `-${width}.webp`)}`;
        expect(existsSync(file), file).toBe(true);
        const meta = await sharp(file).metadata();
        expect(meta.width, file).toBe(width);
        expect(meta.format, file).toBe('webp');
        expect(meta.height! / meta.width!, file).toBeCloseTo(base.height! / base.width!, 2);
      }
    }
  }, 15000);
});
