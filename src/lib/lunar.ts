import SunCalc from './vendor/suncalc';
export function lunarMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return [];
  const [year, month] = value.split('-').map(Number);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return [];
  return Array.from({length: new Date(Date.UTC(year, month, 0)).getUTCDate()}, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1, i + 1, 12));
    const moon = SunCalc.getMoonIllumination(date);
    const phase = moon.phase < .03 || moon.phase > .97 ? 'Nueva' : moon.phase < .22 ? 'Creciente' : moon.phase < .28 ? 'Cuarto creciente' : moon.phase < .47 ? 'Gibosa creciente' : moon.phase < .53 ? 'Llena' : moon.phase < .72 ? 'Gibosa menguante' : moon.phase < .78 ? 'Cuarto menguante' : 'Menguante';
    return { day: i + 1, weekday: (date.getUTCDay() + 6) % 7, illumination: Math.round(moon.fraction * 100), phase };
  });
}
