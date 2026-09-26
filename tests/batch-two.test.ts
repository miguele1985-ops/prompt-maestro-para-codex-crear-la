import {describe,it,expect} from "vitest";
import {blogPosts,getBlogPost} from "../src/content/blog";
import {batchTwoAliases,batchTwoRevisions} from "../src/content/batch-two";
import {existsSync} from "node:fs";
describe("second article batch",()=>{
  it("merges five topics into existing canonical pages without duplicate entries",()=>{
    expect(Object.keys(batchTwoRevisions)).toHaveLength(5);
    for(const [alias,canonical] of Object.entries(batchTwoAliases)){
      expect(getBlogPost(alias)).toBeUndefined();
      expect(blogPosts.filter(post=>post.slug===canonical)).toHaveLength(1);
      const post=getBlogPost(canonical)!;
      expect(post.sections).toEqual(batchTwoRevisions[canonical].sections);
      expect(post.sections.length).toBeGreaterThanOrEqual(5);
      expect(post.sections.some(section=>section.links?.some(link=>link.href.startsWith('https://')))).toBe(true);
      expect(existsSync(`public${post.image}`)).toBe(true);
      for(const link of post.relatedLinks||[])if(link.href.startsWith('/blog/'))expect(getBlogPost(link.href.slice(6))).toBeDefined();
    }
  });
  it("corrects the outdated generator, traffic and blackout claims",()=>{
    const combined=JSON.stringify(batchTwoRevisions);
    expect(combined).toContain('20 de marzo de 2026');
    expect(combined).toContain('V16 conectada');
    expect(combined).toContain('aproximadamente 6 metros');
    expect(combined).not.toContain('27.564');
    expect(combined).not.toContain('41,6%');
  });
});
