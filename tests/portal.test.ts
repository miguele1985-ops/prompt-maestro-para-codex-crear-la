import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { blogPosts } from "../src/content/blog";
import {
  portalContent,
  portalTopics,
  webTools,
  webCalculators,
  contentKind,
} from "../src/content/portal";
import { calculatorKinds } from "../src/components/SurvivalCalculator";
describe("Arquitectura del portal", () => {
  it("conserva todos los destinos de artículos sin duplicarlos", () => {
    expect(new Set(portalContent.map((p) => p.href)).size).toBe(portalContent.length);
    for (const post of blogPosts)
      expect(portalContent.some((p) => p.href === `/supervivencia/${post.slug}`)).toBe(true);
  });
  it("solo publica calculadoras implementadas y listas reales", () => {
    expect(Object.keys(webCalculators).sort()).toEqual(Object.keys(calculatorKinds).sort());
    expect(webTools).toHaveLength(9);
    expect(webTools.find(p => p.href === "/codigo-morse")?.kind).toBe("Herramienta");
    expect(contentKind("calculadora-cruce-rios-seguridad", "Calculadoras offline")).toBe("App");
  });
  it("usa imágenes existentes y temas conocidos", () => {
    for (const item of portalContent) {
      expect(portalTopics.some((t) => t[0] === item.topic)).toBe(true);
      if (item.image) expect(existsSync(`public${item.image}`)).toBe(true);
    }
  });
});
