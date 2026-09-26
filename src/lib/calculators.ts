import SunCalc from "./vendor/suncalc";

function number(value: number, label: string, min = 0, max = 1e9) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw new Error(`${label}: introduce un valor entre ${min} y ${max}.`);
  return value;
}
export function rainLitres(mm: number, area: number, efficiency: number) {
  return (
    (number(mm, "Lluvia") * number(area, "Superficie") * number(efficiency, "Eficiencia", 0, 100)) /
    100
  );
}
export function rainInverse(litres: number, known: number, efficiency: number) {
  number(litres, "Litros");
  number(known, "Dato conocido", 0.001);
  number(efficiency, "Eficiencia", 0.001, 100);
  return litres / ((known * efficiency) / 100);
}
export function waterDays(litres: number, people: number, daily: number) {
  number(litres, "Reserva");
  number(people, "Personas", 1, 10000);
  if (!Number.isInteger(people)) throw new Error("Personas: usa un número entero.");
  number(daily, "Consumo diario", 0.01, 10000);
  return litres / (people * daily);
}
export function energyHours(wh: number, watts: number, efficiency: number) {
  number(wh, "Energía");
  number(watts, "Potencia", 0.01);
  number(efficiency, "Eficiencia", 0, 100);
  return (wh * efficiency) / 100 / watts;
}
export function windChill(celsius: number, kmh: number) {
  number(celsius, "Temperatura", -60, 10);
  number(kmh, "Viento", 4.83, 200);
  const t = celsius * 1.8 + 32,
    v = Math.pow(kmh / 1.609344, 0.16);
  return (35.74 + 0.6215 * t - 35.75 * v + 0.4275 * t * v - 32) / 1.8;
}
export function heatIndex(celsius: number, humidity: number) {
  number(celsius, "Temperatura", 26.7, 50);
  number(humidity, "Humedad", 0, 100);
  const t = celsius * 1.8 + 32,
    r = humidity;
  const simple = 0.5 * (t + 61 + (t - 68) * 1.2 + r * 0.094);
  if ((simple + t) / 2 < 80) return (simple - 32) / 1.8;
  let h =
    -42.379 +
    2.04901523 * t +
    10.14333127 * r -
    0.22475541 * t * r -
    0.00683783 * t * t -
    0.05481717 * r * r +
    0.00122874 * t * t * r +
    0.00085282 * t * r * r -
    0.00000199 * t * t * r * r;
  if (r < 13 && t >= 80 && t <= 112) h -= ((13 - r) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
  if (r > 85 && t >= 80 && t <= 87) h += ((r - 85) / 10) * ((87 - t) / 5);
  return (h - 32) / 1.8;
}
export function routeEstimate(
  distance: number,
  speed: number,
  ascent: number,
  factor: number,
  stops: number,
) {
  number(distance, "Distancia");
  number(speed, "Velocidad", 0.1, 30);
  number(ascent, "Ascenso", 0, 10000);
  number(factor, "Factor terreno y carga", 1, 3);
  number(stops, "Paradas", 0, 1440);
  return (distance / speed) * factor + ascent / 600 + stops / 60;
}
export function daylight(now: string, sunset: string, margin: number) {
  const minutes = (value: string) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
      throw new Error("Introduce horas válidas en formato 24 h.");
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  };
  number(margin, "Margen", 0, 360);
  const end = minutes(sunset),
    start = minutes(now);
  return {
    remaining: Math.max(0, end - start),
    usable: Math.max(0, end - start - margin),
    limit: `${String(Math.floor(Math.max(0, end - margin) / 60)).padStart(2, "0")}:${String(Math.max(0, end - margin) % 60).padStart(2, "0")}`,
  };
}
export function automaticSunset(
  date: string,
  latitude: number,
  longitude: number,
  utcOffset: number,
) {
  number(latitude, "Latitud", -90, 90);
  number(longitude, "Longitud", -180, 180);
  number(utcOffset, "Huso UTC", -12, 14);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Introduce una fecha válida.");
  const anchor = new Date(date + "T12:00:00Z");
  if (!Number.isFinite(anchor.getTime()) || anchor.toISOString().slice(0, 10) !== date)
    throw new Error("Fecha no válida.");
  // Anchor at local solar noon to avoid selecting the adjacent UTC day.
  anchor.setTime(anchor.getTime() - (longitude / 15) * 3600000);
  const result = SunCalc.getTimes(anchor, latitude, longitude).sunset;
  if (!Number.isFinite(result.getTime()))
    throw new Error("No hay puesta de sol calculable para esa fecha y latitud.");
  const local = new Date(result.getTime() + utcOffset * 3600000);
  if (local.toISOString().slice(0, 10) !== date)
    throw new Error(
      "La puesta de sol cae en otro día con ese huso. Revisa el huso o utiliza el modo manual.",
    );
  return `${String(local.getUTCHours()).padStart(2, "0")}:${String(local.getUTCMinutes()).padStart(2, "0")}`;
}
