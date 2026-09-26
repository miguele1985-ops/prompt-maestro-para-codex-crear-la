import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { plantLibrary, knotLibrary } from "../src/content/mobile-field-library";
import provenance from "../docs/mobile-field-provenance.json";

describe("mobile field library", () => {
  it("retains all nineteen knot IDs from the app without importing execution instructions", () => {
    expect(knotLibrary).toHaveLength(19);
    expect(new Set(knotLibrary.map((item) => item.id)).size).toBe(19);
    expect(knotLibrary.map((item) => item.id).sort()).toEqual(provenance.knotsSource.entries.map((item) => item.id).sort());
    for (const knot of knotLibrary) {
      expect(knot.limit.length).toBeGreaterThan(50);
      expect(knot.purpose.length).toBeGreaterThan(30);
      expect(knot).not.toHaveProperty("stepByStep");
    }
  });
  it("uses only the three selected local plant images with responsive variants", () => {
    expect(plantLibrary).toHaveLength(3);
    for (const plant of plantLibrary) {
      expect(provenance.assets.some((asset) => asset.destination === plant.image)).toBe(true);
      expect(existsSync(`public${plant.image}`)).toBe(true);
      for (const width of [360, 576, 960]) expect(existsSync(`public${plant.image.replace('.jpg', `-${width}.webp`)}`)).toBe(true);
      expect(new URL(plant.source).protocol).toBe("https:");
      expect(plant.limit.length).toBeGreaterThan(70);
    }
  });
  it("keeps imports read-only and excludes unreviewed diagrams", () => {
    expect(provenance.mobileReadOnly).toBe(true);
    for (const asset of provenance.assets) expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(readFileSync("app/nudos/page.tsx", "utf8")).not.toContain("knots-ai/");
  });
});
