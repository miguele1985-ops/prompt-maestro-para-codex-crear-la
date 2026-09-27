import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { blogPosts, getBlogPost } from "../src/content/blog";
import { resilienceArticles } from "../src/content/resilience-articles";
import { contentKind } from "../src/content/portal";

describe("Resilience article batch", () => {
  it("updates the existing blackout guide and adds four unique articles", () => {
    expect(resilienceArticles).toHaveLength(5);
    expect(blogPosts).toHaveLength(93);
    expect(getBlogPost("apagon-total-72-horas-sin-luz-internet")).toBeUndefined();
    for (const entry of resilienceArticles) {
      const matches = blogPosts.filter((p) => p.slug === entry.slug);
      expect(matches).toHaveLength(1);
      const post = matches[0];
      expect(post.seoTitle).toBeTruthy();
      expect(post.sources?.length).toBeGreaterThan(0);
      expect(post.sections.length).toBeGreaterThanOrEqual(8);
      expect(existsSync(`public${post.image}`)).toBe(true);
      for (const width of [360, 576, 960, 1200])
        expect(existsSync(`public${post.image.replace(".jpg", `-${width}.webp`)}`)).toBe(true);
      for (const link of post.relatedLinks || [])
        if (link.href.startsWith("/blog/")) expect(getBlogPost(link.href.slice(6))).toBeDefined();
    }
    for (const entry of resilienceArticles.slice(1))
      expect(contentKind(entry.slug, entry.category)).toBe("Artículo");
    expect(
      getBlogPost("como-prepararse-para-un-apagon")?.sections.some(
        (s) => s.heading === "Qué usar dentro de la app",
      ),
    ).toBe(true);
  });
  it("distinguishes hypothetical scenarios and avoids unsafe verification advice", () => {
    expect(resilienceArticles[2].warning).toContain("hipotético");
    expect(resilienceArticles[3].warning).toContain("no una previsión");
    expect(resilienceArticles[4].warning).toContain("no para comprobar rumores");
    expect(resilienceArticles[4].warning).toContain("No retrases");
    expect(resilienceArticles[1].sections.some((s) => s.body.includes("bloqueará llamadas"))).toBe(
      true,
    );
  });
});
