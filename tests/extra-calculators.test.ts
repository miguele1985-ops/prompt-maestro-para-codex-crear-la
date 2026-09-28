import { describe, expect, it } from 'vitest';
import { convertUnit, solarYield, labelDose } from '../src/lib/extra-calculators';
import { lunarMonth, nextLunarPhases } from '../src/lib/lunar';
describe('Additional calculators', () => {
  it('converts units and temperature without crossing dimensions', () => {
    expect(convertUnit(1,'Volumen','gal (EE. UU.)','L')).toBeCloseTo(3.785411784);
    expect(convertUnit(32,'Temperatura','°F','°C')).toBe(0);
    expect(convertUnit(0,'Temperatura','°C','K')).toBe(273.15);
    expect(()=>convertUnit(1,'Volumen','L','kg')).toThrow();
    expect(()=>convertUnit(-1,'Volumen','L','mL')).toThrow();
    expect(()=>convertUnit(-300,'Temperatura','°C','K')).toThrow();
    expect(()=>convertUnit(NaN,'Volumen','L','mL')).toThrow();
  });
  it('uses explicit solar assumptions and label proportions', () => {
    expect(solarYield(.5,650,6,33)).toBeCloseTo(1.02504,4);
    expect(solarYield(.5,0,6,33)).toBe(0);
    expect(()=>solarYield(.5,650,25,33)).toThrow();
    expect(labelDose(10,2,1)).toBe(5);
    expect(()=>labelDose(1,0,1)).toThrow();
  });
  it('finds two future phase crossings within a lunar cycle', () => {
    const day=lunarMonth('2024-04')[7];
    expect(day.fraction).toBeLessThan(.02);
    const next=nextLunarPhases(day.date);
    expect(new Set(next.map(p=>p.name)).size).toBe(2);
    for(const p of next) { expect(p.days).toBeGreaterThan(0);expect(p.days).toBeLessThanOrEqual(31); }
    expect(nextLunarPhases('bad')).toEqual([]);
    const september=nextLunarPhases('2026-09-23T12:00:00Z');
    expect(september.find(p=>p.name==='Luna nueva')!.days).toBeGreaterThan(10);
    expect(september.find(p=>p.name==='Luna llena')!.days).toBeLessThan(7);
  });
});
