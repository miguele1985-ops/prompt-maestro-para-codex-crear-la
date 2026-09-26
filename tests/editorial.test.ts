import { describe, it, expect } from "vitest";
import {
  rainLitres,
  rainInverse,
  waterDays,
  energyHours,
  windChill,
  heatIndex,
  daylight,
  automaticSunset,
  routeEstimate,
} from "../src/lib/calculators";
import { monetizationPolicy } from "../src/lib/monetization";
import { absoluteUrl } from "../src/lib/seo";
import articles from "../src/content/editorial-articles.json";
import index from "../src/content/editorial-index.json";
import { blogPosts } from "../src/content/blog";
import { relatedArticles } from "../src/lib/editorial";
import upgrades from "../src/content/article-upgrades.json";
import { existsSync } from "node:fs";
describe("editorial migration", () => {
  it("publishes all 30 authored revisions with images, takeaways and valid next reads", () => {
    expect(Object.keys(upgrades)).toHaveLength(30);
    for (const [slug, revision] of Object.entries(upgrades)) {
      const html = articles[slug as keyof typeof articles];
      expect(html).toContain(revision.intro);
      expect(html).toContain(revision.action);
      expect(html).not.toMatch(/Artículo\s+\d+\s*·/);
      expect(revision.keys).toHaveLength(3);
      expect(blogPosts.some((p) => p.slug === revision.next)).toBe(true);
      const post = blogPosts.find((p) => p.slug === slug)!;
      expect(post.updatedAt).toBe("2026-09-26");
      expect(existsSync(`public${post.image}`)).toBe(true);
      for (const width of [240, 360, 576, 960, 1200]) expect(existsSync(`public${post.image.replace('.jpg', `-${width}.webp`)}`)).toBe(true);
    }
  });
  it("prioritizes explicit related articles without mutating the library", () => {
    const base = blogPosts[0];
    const current = { ...base, slug: "test-current", relatedLinks: [{ label: "Elegido", href: "/blog/test-explicit" }] };
    const candidates = [current, { ...base, slug: "test-other" }, { ...base, slug: "test-explicit" }];
    const order = candidates.map((post) => post.slug);
    expect(relatedArticles(current, candidates)[0].slug).toBe("test-explicit");
    expect(relatedArticles(current, candidates).some((post) => post.slug === current.slug)).toBe(false);
    expect(candidates.map((post) => post.slug)).toEqual(order);
  });
  it("keeps every imported article accessible through a unique existing or new slug", () => {
    expect(new Set(blogPosts.map((p) => p.slug)).size).toBe(blogPosts.length);
    for (const slug of Object.keys(articles))
      expect(blogPosts.some((p) => p.slug === slug)).toBe(true);
    expect(Object.keys(articles)).toHaveLength(38);
  });
  it("retains article navigation, sources and strips executable markup", () => {
    for (const [slug, html] of Object.entries(articles)) {
      expect(html).not.toMatch(/<script|\son\w+=|javascript:/i);
      for (const section of index[slug as keyof typeof index].toc)
        expect(html).toContain(`id="${section.id}"`);
    }
  });
  it("keeps external download URLs intact", () =>
    expect(absoluteUrl("https://descargas.modocrisissurvival.com/apk/test.apk")).toBe(
      "https://descargas.modocrisissurvival.com/apk/test.apk",
    ));
  it("blocks monetization on critical and download routes", () => {
    for (const path of [
      "/sos",
      "/modo-crisis/apagon",
      "/descargar",
      "/donaciones",
      "/checklists",
      "/blog/calculadora-hipotermia-riesgo",
      "/blog/plantas-comestibles-y-peligrosas-que-se-pueden-confundir",
    ])
      expect(monetizationPolicy(path)).toMatchObject({
        affiliate: false,
        displayEligible: false,
        displayEnabled: false,
      });
    expect(
      monetizationPolicy("/blog/mejores-mochilas-de-emergencia-72h-en-espana-2026").affiliate,
    ).toBe(true);
  });
});
describe("web calculators", () => {
  it("calculates rainfall and inverse consistently", () => {
    expect(rainLitres(10, 20, 80)).toBe(160);
    expect(rainInverse(160, 10, 80)).toBe(20);
    expect(rainLitres(0, 20, 80)).toBe(0);
    expect(() => rainInverse(10, 0, 80)).toThrow();
  });
  it("calculates reserve and energy with explicit assumptions", () => {
    expect(waterDays(18, 3, 3)).toBe(2);
    expect(energyHours(100, 10, 80)).toBe(8);
    expect(() => waterDays(1, 0, 3)).toThrow();
    expect(() => waterDays(1, 1.5, 3)).toThrow();
    expect(() => energyHours(1, 0, 80)).toThrow();
  });
  it("bounds wind chill and heat index", () => {
    expect(windChill(0, 20)).toBeCloseTo(-5.24, 1);
    expect(heatIndex(32.2222222, 70)).toBeCloseTo(41.068, 1);
    expect(() => windChill(15, 20)).toThrow();
    expect(() => windChill(0, 0)).toThrow();
    expect(() => heatIndex(10, 50)).toThrow();
    expect(() => heatIndex(30, 101)).toThrow();
  });
  it("does not invent overnight daylight after sunset", () => {
    expect(daylight("16:00", "20:00", 45)).toEqual({ remaining: 240, usable: 195, limit: "19:15" });
    expect(daylight("21:00", "20:00", 45).remaining).toBe(0);
    expect(() => daylight("25:00", "20:00", 45)).toThrow();
  });
  it("calculates sunset with explicit timezone and handles polar day", () => {
    expect(automaticSunset("2026-06-21", 40.4168, -3.7038, 2)).toMatch(/^21:[45]\d$/);
    expect(() => automaticSunset("2026-06-21", 89, 0, 0)).toThrow();
    expect(() => automaticSunset("2026-02-31", 40, 0, 0)).toThrow();
  });
  it("includes terrain, ascent and stops without judging route safety", () =>
    expect(routeEstimate(10, 5, 600, 1, 30)).toBe(3.5));
});
