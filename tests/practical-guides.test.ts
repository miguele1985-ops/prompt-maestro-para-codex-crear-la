import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { practicalGuides } from "../src/content/practical-guides";
import { moreGroupSignals } from "../src/content/more-group-signals";
import provenance from "../docs/mobile-signals-provenance.json";
describe("practical app content",()=>{
  it("includes twelve substantive guides with real images and valid next links",()=>{
    expect(practicalGuides).toHaveLength(12);
    expect(new Set(practicalGuides.map(guide=>guide.slug)).size).toBe(practicalGuides.length);
    for(const guide of practicalGuides){
      expect(guide.introduction.length).toBeGreaterThan(200);
      expect(guide.sections).toHaveLength(3);
      for(const section of guide.sections)expect(section.text.length).toBeGreaterThan(200);
      expect(guide.tasks.length).toBeGreaterThanOrEqual(5);
      expect(practicalGuides.some(item=>item.slug===guide.next)).toBe(true);
      expect(existsSync(`public/screenshots/app/${guide.image}.jpg`)).toBe(true);
      for(const width of [240,360,576])expect(existsSync(`public/screenshots/app/${guide.image}-${width}.webp`)).toBe(true);
    }
  });
  it("backs every added signal with an inspected asset and an explicit limit",()=>{
    expect(moreGroupSignals).toHaveLength(10);
    for(const signal of moreGroupSignals){expect(provenance.assets.some(asset=>asset.id===signal.id)).toBe(true);expect(signal.limit.length).toBeGreaterThan(60);}
  });
});
