import { describe,it,expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { ArticleEquipment } from "../src/components/ArticleEquipment";
import { equipmentForArticle } from "../src/content/article-equipment";
import { amazonSearchUrl } from "../src/content/affiliate";
import { blogPosts } from "../src/content/blog";
import { practicalGuides } from "../src/content/practical-guides";
import { monetizationPolicy } from "../src/lib/monetization";
describe("quiet article monetization",()=>{
  it("covers every blog article and practical guide with exactly two relevant options",()=>{
    for(const article of [...blogPosts,...practicalGuides]){
      const items=equipmentForArticle(article.slug);
      expect(items).toHaveLength(2);
      expect(items[0].query).not.toBe(items[1].query);
      for(const item of items){const url=new URL(amazonSearchUrl(item.query));expect(url.hostname).toBe('www.amazon.es');expect(url.searchParams.get('tag')).toBe('cociesfaci-21');expect(item.check.length).toBeGreaterThan(40);}
      const html=renderToStaticMarkup(createElement(ArticleEquipment,{slug:article.slug}));
      expect((html.match(/sponsored nofollow/g)||[])).toHaveLength(2);
      expect(html).toContain('Publicidad');expect(html).not.toContain('<script');
    }
  });
  it("keeps medical accessories nonclinical and distinguishes practice cord from safety equipment",()=>{
    expect(equipmentForArticle('calculadora-hipotermia-riesgo')[0].name).toContain('vacío');
    expect(equipmentForArticle('5-nudos-basicos')[0].check).toContain('No comprarlo como cuerda para escalada');
  });
  it("allows end-of-article links but leaves automatic ads disabled",()=>{
    for(const post of blogPosts)expect(monetizationPolicy(`/blog/${post.slug}`)).toMatchObject({affiliate:true,displayEnabled:false});
    expect(monetizationPolicy('/api/admin/config').affiliate).toBe(false);
    expect(monetizationPolicy('/descargar').affiliate).toBe(false);
  });
});
