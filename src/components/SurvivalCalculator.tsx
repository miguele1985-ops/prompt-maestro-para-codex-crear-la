"use client";
import { useState, type FormEvent } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import {
  automaticSunset,
  daylight,
  energyHours,
  heatIndex,
  rainInverse,
  rainLitres,
  routeEstimate,
  waterDays,
  windChill,
} from "@/lib/calculators";

export const calculatorKinds: Record<string, string> = {
  "calculadora-captacion-lluvia-supervivencia": "rain",
  "calculadora-gestion-agua-supervivencia": "water",
  "calculadora-energia-powerbank-emergencia": "energy",
  "calculadora-sensacion-termica-frio-calor": "thermal",
  "calculadora-horas-luz-ruta": "daylight",
  "calculadora-velocidad-necesaria-ruta": "speed",
};
type Field = {
  key: string;
  label: string;
  value: string;
  type?: string;
  min?: number;
  max?: number;
  step?: string;
};
const f = (key: string, label: string, value: string, min = 0, max = 1000000): Field => ({
  key,
  label,
  value,
  min,
  max,
});
const format = (v: number) => v.toLocaleString("es-ES", { maximumFractionDigits: 2 });
export function SurvivalCalculator({ slug }: { slug: string }) {
  const kind = calculatorKinds[slug];
  const [values, setValues] = useState<Record<string, string>>({});
  const [mode, setMode] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  if (!kind) return null;
  const options: Record<string, string> =
    kind === "rain"
      ? { collect: "Litros recogidos", area: "Superficie necesaria", rain: "Lluvia necesaria" }
      : kind === "thermal"
        ? { cold: "Frío y viento", heat: "Calor y humedad" }
        : kind === "daylight"
          ? { manual: "Hora conocida", auto: "Ubicación y fecha" }
          : kind === "speed"
            ? { time: "Tiempo de ruta", speed: "Velocidad necesaria" }
            : {};
  const active = mode || Object.keys(options)[0] || "default";
  let fields: Field[] = [];
  if (kind === "rain")
    fields = [
      ...(active !== "rain" ? [f("rain", "Lluvia (mm o L/m²)", "10")] : []),
      ...(active !== "area" ? [f("area", "Superficie (m²)", "20")] : []),
      ...(active !== "collect" ? [f("target", "Agua deseada (L)", "160")] : []),
      f("eff", "Eficiencia (%)", "80", 0.1, 100),
      f("tank", "Capacidad libre del depósito (L)", "200"),
      f("container", "Volumen de cada recipiente (L)", "5", 0.1),
      f("people", "Personas", "2", 1, 10000),
      f("daily", "Consumo supuesto (L/persona/día)", "3", 0.1, 10000),
    ];
  if (kind === "water")
    fields = [
      f("litres", "Agua disponible (L)", "18"),
      f("people", "Personas", "3", 1, 10000),
      f("daily", "Consumo supuesto (L/persona/día)", "3", 0.1, 10000),
    ];
  if (kind === "energy")
    fields = [
      f("wh", "Energía de la batería (Wh)", "37"),
      f("watts", "Consumo del equipo (W)", "5", 0.01),
      f("eff", "Eficiencia (%)", "80", 0.1, 100),
    ];
  if (kind === "thermal")
    fields = [
      f(
        "temp",
        "Temperatura (°C)",
        active === "cold" ? "0" : "32",
        active === "cold" ? -60 : 26.7,
        active === "cold" ? 10 : 50,
      ),
      active === "cold"
        ? f("wind", "Viento (km/h)", "20", 4.83, 200)
        : f("humidity", "Humedad relativa (%)", "60", 0, 100),
    ];
  if (kind === "daylight")
    fields = [
      { key: "now", label: "Hora actual (hora local de la ruta)", value: "16:00", type: "time" },
      ...(active === "manual"
        ? [{ key: "sunset", label: "Puesta del sol (misma fecha)", value: "20:00", type: "time" }]
        : [
            {
              key: "date",
              label: "Fecha de la ruta",
              value: new Date().toISOString().slice(0, 10),
              type: "date",
            },
            f("lat", "Latitud", "40.4168", -90, 90),
            f("lon", "Longitud", "-3.7038", -180, 180),
            f("utc", "Huso local UTC (incluye horario de verano)", "2", -12, 14),
          ]),
      f("margin", "Margen antes del ocaso (min)", "45", 0, 360),
      f("distance", "Distancia pendiente (km)", "5"),
      f("speed", "Velocidad prevista (km/h)", "4", 0.1, 30),
    ];
  if (kind === "speed")
    fields = [
      f("distance", "Distancia (km)", "10"),
      ...(active === "time"
        ? [f("speed", "Velocidad base (km/h)", "4", 0.1, 30)]
        : [f("hours", "Tiempo disponible (horas)", "4", 0.01, 72)]),
      f("ascent", "Ascenso acumulado (m)", "300", 0, 10000),
      f("factor", "Factor de terreno y carga (1 a 3)", "1.2", 1, 3),
      f("stops", "Paradas (min)", "30", 0, 1440),
    ];
  const value = (key: string) =>
    values[key] ?? fields.find((field) => field.key === key)?.value ?? "";
  const num = (key: string) => {
    const raw = value(key).trim();
    if (!raw) throw new Error("Completa todos los campos.");
    const n = Number(raw);
    if (!Number.isFinite(n)) throw new Error("Introduce números válidos.");
    return n;
  };
  function calculate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult([]);
    try {
      const lines: string[] = [];
      if (kind === "rain") {
        const amount =
          active === "collect" ? rainLitres(num("rain"), num("area"), num("eff")) : num("target");
        if (active !== "collect")
          lines.push(
            `${format(rainInverse(amount, num(active === "area" ? "rain" : "area"), num("eff")))} ${active === "area" ? "m² necesarios" : "mm de lluvia necesarios"}`,
          );
        const stored = Math.min(amount, num("tank"));
        lines.push(
          `${format(amount)} litros estimados`,
          `${format(stored)} litros almacenables; ${format(amount - stored)} litros sin capacidad de almacenamiento`,
          `${Math.floor(stored / num("container"))} recipientes completos y ${format(stored % num("container"))} L restantes`,
          `${format(waterDays(stored, num("people"), num("daily")))} días con el consumo indicado`,
        );
      }
      if (kind === "water")
        lines.push(
          `${format(waterDays(num("litres"), num("people"), num("daily")))} días de autonomía aritmética`,
        );
      if (kind === "energy")
        lines.push(`${format(energyHours(num("wh"), num("watts"), num("eff")))} horas estimadas`);
      if (kind === "thermal") {
        const t =
          active === "cold"
            ? windChill(num("temp"), num("wind"))
            : heatIndex(num("temp"), num("humidity"));
        lines.push(
          `${format(t)} °C de sensación estimada`,
          active === "cold"
            ? "Protege la piel expuesta y busca resguardo del viento. El resultado no estima un tiempo seguro de exposición."
            : "Estimación a la sombra. Busca un ambiente fresco y reduce el esfuerzo; no mide tu temperatura corporal.",
        );
      }
      if (kind === "daylight") {
        const sunset =
          active === "auto"
            ? automaticSunset(value("date"), num("lat"), num("lon"), num("utc"))
            : value("sunset");
        const d = daylight(value("now"), sunset, num("margin"));
        const route = (num("distance") / num("speed")) * 60;
        lines.push(
          `Puesta del sol: ${sunset}`,
          `Hora límite recomendada: ${d.limit}`,
          `${d.remaining} min hasta el ocaso; ${d.usable} min antes del margen`,
          route > d.usable
            ? "Sin margen para la ruta indicada"
            : `Margen de ruta: ${format(d.usable - route)} min. No garantiza una llegada segura.`,
        );
      }
      if (kind === "speed") {
        if (active === "time")
          lines.push(
            `${format(routeEstimate(num("distance"), num("speed"), num("ascent"), num("factor"), num("stops")))} horas estimadas`,
          );
        else {
          const moving = num("hours") - num("ascent") / 600 - num("stops") / 60;
          if (moving <= 0)
            throw new Error("No queda tiempo de marcha tras descontar ascenso y paradas.");
          lines.push(
            `${format((num("distance") * num("factor")) / moving)} km/h de velocidad base necesaria`,
          );
        }
      }
      setResult(lines);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revisa los datos.");
    }
  }
  return (
    <section className="survival-calculator" id="calculadora">
      <h2>
        <Calculator size={22} aria-hidden /> Calcula con tus datos
      </h2>
      <form onSubmit={calculate}>
        {Object.keys(options).length ? (
          <label className="calculator-mode">
            Modo
            <select
              value={active}
              onChange={(e) => {
                setMode(e.target.value);
                setValues({});
                setResult([]);
                setError("");
              }}
            >
              {Object.entries(options).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="calculator-fields">
          {fields.map((field) => (
            <label key={field.key}>
              {field.label}
              <input
                required
                type={field.type || "number"}
                min={field.min}
                max={field.max}
                step={field.type ? undefined : field.key === "people" ? "1" : "any"}
                value={value(field.key)}
                onChange={(e) => {
                  setValues({ ...values, [field.key]: e.target.value });
                  setResult([]);
                }}
              />
            </label>
          ))}
        </div>
        <div className="calculator-buttons">
          <button type="submit">
            <Calculator size={18} aria-hidden /> Calcular
          </button>
          <button
            type="button"
            onClick={() => {
              setValues({});
              setResult([]);
              setError("");
            }}
          >
            <RotateCcw size={18} aria-hidden /> Restablecer
          </button>
        </div>
        {error ? (
          <p role="alert" className="calculator-error">
            {error}
          </p>
        ) : null}
        <div className="calculator-result" role="status" aria-live="polite">
          {result.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </form>
      <p className="calculator-limit">
        {kind === "rain" || kind === "water"
          ? "Es una estimación de volumen, no una garantía de potabilidad ni una pauta sanitaria de consumo."
          : kind === "speed"
            ? "Modelo orientativo: distancia ÷ velocidad × factor + ascenso ÷ 600 + paradas. El factor es un supuesto elegido por ti, no una medición del terreno."
            : kind === "daylight"
              ? "La montaña, las nubes y el terreno pueden reducir la luz útil. El cálculo solar usa SunCalc 1.9 y requiere el huso correcto de la ruta."
              : kind === "thermal"
                ? "Fórmulas Wind Chill e índice de calor del NWS, solo dentro de sus límites de aplicación. No es un diagnóstico ni un aviso meteorológico."
                : "Energía útil = Wh × eficiencia. Autonomía = energía útil ÷ potencia. El consumo real puede variar."}
      </p>
      {kind === "thermal" ? (
        <a href="https://www.weather.gov/epz/wxcalc">
          Fuente de las fórmulas: National Weather Service
        </a>
      ) : null}
      <noscript>
        Activa JavaScript para calcular. El artículo y sus explicaciones permanecen disponibles.
      </noscript>
    </section>
  );
}
