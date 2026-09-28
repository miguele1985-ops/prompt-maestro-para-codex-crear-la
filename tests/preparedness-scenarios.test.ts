import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { blogPosts, getBlogPost } from '../src/content/blog';
import { preparednessScenarios } from '../src/content/preparedness-scenarios';
import { equipmentForArticle } from '../src/content/article-equipment';
describe('Five preparedness scenarios', () => {
  it('publishes unique articles with metadata, images and real internal destinations', () => {
    expect(preparednessScenarios).toHaveLength(5);
    for (const post of preparednessScenarios) {
      expect(blogPosts.filter(p => p.slug === post.slug)).toHaveLength(1);
      expect(post.seoTitle).toBeTruthy();
      expect(post.sources?.length).toBeGreaterThan(0);
      expect(post.sections.length).toBeGreaterThanOrEqual(8);
      expect(existsSync(`public${post.image}`)).toBe(true);
      for (const width of [240,360,576,960,1200]) expect(existsSync(`public${post.image.replace('.jpg', `-${width}.webp`)}`)).toBe(true);
      for (const link of [...(post.relatedLinks || []), ...post.sections.flatMap(s => s.links || [])]) {
        if (link.href.startsWith('/supervivencia/')) expect(getBlogPost(link.href.slice('/supervivencia/'.length).split('#')[0])).toBeDefined();
      }
      expect(post.sections.some(s => s.links?.some(l => l.href === '#equipo-articulo'))).toBe(true);
      expect(equipmentForArticle(post.slug)).toHaveLength(2);
    }
  });
  it('keeps urgent safety and medical limits explicit', () => {
    expect(preparednessScenarios[4].warning).toContain('no esperes diez minutos');
    expect(preparednessScenarios[2].warning).toContain('No cambies dosis');
    expect(equipmentForArticle(preparednessScenarios[2].slug)[0].name).toContain('vacío');
    expect(preparednessScenarios[0].warning).toContain('hipotético');
  });
});
