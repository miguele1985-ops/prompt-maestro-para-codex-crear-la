import {describe,it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import {blogPosts,getBlogPost} from '../src/content/blog';
import {continuityArticles,continuityUpdates} from '../src/content/continuity-articles';
describe('Continuity articles',()=>{
 it('publishes three new pages and updates two existing canonical pages',()=>{
  expect(continuityArticles).toHaveLength(5);expect(continuityUpdates.size).toBe(2);
  expect(new Set(blogPosts.map(p=>p.slug)).size).toBe(blogPosts.length);
  for(const entry of continuityArticles){const post=getBlogPost(entry.slug)!;expect(post).toBeDefined();expect(post.sections).toEqual(entry.sections);expect(post.seoTitle).toBeTruthy();expect(post.sources?.length).toBeGreaterThan(0);expect(existsSync(`public${post.image}`)).toBe(true);for(const width of [360,576,960,1200])expect(existsSync(`public${post.image.replace('.jpg',`-${width}.webp`)}`)).toBe(true);for(const link of post.relatedLinks||[])if(link.href.startsWith('/supervivencia/'))expect(getBlogPost(link.href.slice('/supervivencia/'.length))).toBeDefined();}
  expect(getBlogPost('espana-sin-agua-7-dias')).toBeUndefined();expect(getBlogPost('dana-aislado-72-horas-que-hacer')).toBeUndefined();
 });
 it('labels scenarios, avoids dangerous drills and distinguishes a mnemonic from official guidance',()=>{
  expect(continuityArticles[0].warning).toContain('no un aviso');
  expect(continuityArticles[3].warning).toContain('no un plazo de espera');
  expect(continuityArticles[4].sections.some(s=>s.heading.includes('no un protocolo oficial'))).toBe(true);
  expect(JSON.stringify(continuityArticles[1])).toContain('No te desplaces');
 });
});
