import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { blogPosts } from '../src/content/blog';
import { portalContent } from '../src/content/portal';
import covers from '../src/content/article-covers.json';

describe('unique article covers', () => {
  it('assigns a different cover to every article, including renamed copies', async () => {
    const paths = new Set<string>();
    const files = new Set<string>();
    const pixels = new Set<string>();
    for (const post of blogPosts) {
      expect(paths.has(post.image), post.slug).toBe(false);
      paths.add(post.image);
      const buffer = readFileSync(`public${post.image}`);
      const hash = createHash('sha256').update(buffer).digest('hex');
      expect(files.has(hash), post.slug).toBe(false);
      files.add(hash);
      const normalized = await sharp(buffer).resize(64,64,{fit:'fill'}).removeAlpha().raw().toBuffer();
      const pixelHash = createHash('sha256').update(normalized).digest('hex');
      expect(pixels.has(pixelHash), post.slug).toBe(false);
      pixels.add(pixelHash);
      for (const width of [240,360,576,960,1200]) {
        expect(existsSync(`public${post.image.replace('.jpg', `-${width}.webp`)}`), `${post.slug}: ${width}`).toBe(true);
      }
      expect(post.imageAlt.length).toBeGreaterThan(15);
    }
  }, 20000);
  it('uses the assigned images in the actual article catalog', () => {
    const images = portalContent.filter(item => item.image).map(item => item.image);
    expect(new Set(images).size).toBe(images.length);
    for (const post of blogPosts) {
      const item = portalContent.find(item => item.href === `/supervivencia/${post.slug}`);
      expect(item, post.slug).toBeDefined();
      if (item?.image) expect(item.image).toBe(post.image);
    }
    for (const slug of Object.keys(covers)) expect(blogPosts.some(post => post.slug === slug), slug).toBe(true);
  });
});
