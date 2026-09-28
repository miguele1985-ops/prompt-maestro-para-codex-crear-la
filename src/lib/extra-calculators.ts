export const extraCalculatorKinds: Record<string, string> = {
  'calculadora-potabilizacion-quimica-agua': 'chemical',
  'calculadora-destilacion-solar-agua': 'solar',
  'calculadora-cruce-rios-seguridad': 'river',
  'calculadora-conversor-survival-unidades': 'converter',
  'calculadora-silbato-emergencia-senales': 'whistle',
  'calculadora-senales-humo-supervivencia': 'smoke',
  'calculadora-hipotermia-riesgo': 'hypothermia',
};
export const unitGroups: Record<string, Record<string, number>> = {
  Volumen: { L: 1, mL: .001, 'gal (EE. UU.)': 3.785411784, 'fl oz (EE. UU.)': .0295735295625 },
  Masa: { kg: 1, g: .001, lb: .45359237, oz: .028349523125 },
  Distancia: { m: 1, km: 1000, mi: 1609.344, 'milla náutica': 1852, ft: .3048 },
  Velocidad: { 'm/s': 1, 'km/h': 1/3.6, mph: .44704, nudos: 1852/3600 },
  Energía: { Wh: 1, kWh: 1000, J: 1/3600, kJ: 1/3.6 },
  Tiempo: { s: 1, min: 60, h: 3600, días: 86400 },
  Presión: { Pa: 1, hPa: 100, bar: 100000, psi: 6894.757293 },
  Temperatura: { '°C': 1, '°F': 1, K: 1 },
};
export function convertUnit(value: number, group: string, from: string, to: string) {
  const units = unitGroups[group];
  if (!Number.isFinite(value) || !units?.[from] || !units[to]) throw new Error('Revisa cantidad y unidades.');
  if (group === 'Temperatura') {
    const c = from === '°F' ? (value - 32) * 5/9 : from === 'K' ? value - 273.15 : value;
    if (c < -273.15) throw new Error('Temperatura inferior al cero absoluto.');
    return to === '°F' ? c * 9/5 + 32 : to === 'K' ? c + 273.15 : c;
  }
  if (value < 0) throw new Error('La cantidad no puede ser negativa.');
  return value * units[from] / units[to];
}
export function solarYield(area: number, irradiance: number, hours: number, efficiency: number) {
  if (![area, irradiance, hours, efficiency].every(Number.isFinite) || area <= 0 || irradiance < 0 || irradiance > 1500 || hours < 0 || hours > 24 || efficiency <= 0 || efficiency > 100) throw new Error('Revisa los valores del modelo.');
  return area * irradiance * hours * 3600 * efficiency / 100 / 2260000;
}
export function labelDose(litres: number, batchLitres: number, quantity: number) {
  if (![litres, batchLitres, quantity].every(Number.isFinite) || litres <= 0 || batchLitres <= 0 || quantity <= 0) throw new Error('Introduce valores positivos de la etiqueta.');
  return litres / batchLitres * quantity;
}
