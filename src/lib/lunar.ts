import SunCalc from './vendor/suncalc';
export function lunarMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return [];
  const [year, month] = value.split('-').map(Number);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return [];
  return Array.from({length: new Date(Date.UTC(year, month, 0)).getUTCDate()}, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1, i + 1, 12));
    const moon = SunCalc.getMoonIllumination(date);
    const phase = moon.phase < .03 || moon.phase > .97 ? 'Nueva' : moon.phase < .22 ? 'Creciente' : moon.phase < .28 ? 'Cuarto creciente' : moon.phase < .47 ? 'Gibosa creciente' : moon.phase < .53 ? 'Llena' : moon.phase < .72 ? 'Gibosa menguante' : moon.phase < .78 ? 'Cuarto menguante' : 'Menguante';
    return { day: i + 1, date: date.toISOString(), phaseValue: moon.phase, fraction: moon.fraction, age: moon.phase * 29.53059, weekday: (date.getUTCDay() + 6) % 7, illumination: Math.round(moon.fraction * 100), phase };
  });
}

export function nextLunarPhases(iso: string) {
  const start = new Date(iso).getTime();
  if (!Number.isFinite(start)) return [];
  const result: { name: string; date: string; days: number }[] = [];
  let previous = SunCalc.getMoonIllumination(new Date(start)).phase;
  for (let hour = 1; hour <= 35 * 24 && result.length < 2; hour++) {
    const time = start + hour * 3600000;
    const phase = SunCalc.getMoonIllumination(new Date(time)).phase;
    const name = previous > .9 && phase < .1 ? 'Luna nueva' : previous < .5 && phase >= .5 ? 'Luna llena' : '';
    if (name && !result.some(r => r.name === name)) result.push({ name, date: new Date(time).toISOString(), days: Math.ceil(hour / 24) });
    previous = phase;
  }
  return result;
}
