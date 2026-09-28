import { describe, expect, it } from 'vitest';
import { topicDirectory, contentsForTopic } from '../src/content/topic-directory';
import { portalContent } from '../src/content/portal';
import { lunarMonth } from '../src/lib/lunar';
describe('Topic directory',()=>{
  it('covers every item and avoids duplicate destinations within a theme',()=>{
    for(const item of portalContent) expect(topicDirectory.some(t=>contentsForTopic(t.slug).some(p=>p.href===item.href))).toBe(true);
    for(const t of topicDirectory){const items=contentsForTopic(t.slug);expect(items.length).toBeGreaterThan(0);expect(new Set(items.map(p=>p.href)).size).toBe(items.length);}
  });
  it('includes all requested families without cloning existing posts',()=>{
    for(const slug of ['comunicacion','frecuencias','calendario-lunar','naturaleza','plantas-espana','huertos','comparativas','caza','pesca','mitos','cosas-de-casa']) expect(contentsForTopic(slug).length).toBeGreaterThan(0);
    expect(contentsForTopic('calendario-lunar').some(p=>p.href==='/calendario-lunar')).toBe(true);
  });
});
describe('Lunar month',()=>{
  it('validates months and leap years',()=>{expect(lunarMonth('2024-02')).toHaveLength(29);expect(lunarMonth('2025-02')).toHaveLength(28);for(const v of ['','2026-13','1800-01'])expect(lunarMonth(v)).toEqual([]);});
  it('returns bounded illumination and a near-new moon at the April 2024 eclipse',()=>{const days=lunarMonth('2024-04');expect(days[7].illumination).toBeLessThan(2);for(const d of days){expect(d.illumination).toBeGreaterThanOrEqual(0);expect(d.illumination).toBeLessThanOrEqual(100);}});
});
