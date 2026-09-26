import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import provenance from "../docs/mobile-signals-provenance.json";
describe("selected app signal images", () => {
  it("ships all four inspected images and responsive variants", () => {
    expect(provenance.mobileReadOnly).toBe(true);
    expect(provenance.assets).toHaveLength(14);
    for(const asset of provenance.assets) {
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(existsSync(`public${asset.destination}`)).toBe(true);
      for(const width of [360,576,960]) expect(existsSync(`public${asset.destination.replace('.jpg',`-${width}.webp`)}`)).toBe(true);
    }
  });
  it("states scope and links to preparation rather than presenting a universal code", () => {
    const page = readFileSync('app/senales-en-grupo/page.tsx','utf8');
    expect(page).toContain('no señales universales');
    expect(page).toContain('href="/checklists"');
    expect(page).toContain('Descargar imagen');
  });
});
