import type { BlogPost } from "./blog";

const units = { title: "NIST: unidades y factores de conversión", url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9" };
const family = { title: "Protección Civil: Plan Familia Preparada", url: "https://ficheros.proteccioncivil.es/unidadesFormativas/01_Manal_Plan_Familia_Preparada.pdf" };
const morse = { title: "UIT: Morse internacional, M.1677", url: "https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" };

// References support the stated units, method or safety context, not an endorsement of the tool.
export const articleSourceAdditions: Record<string, NonNullable<BlogPost["sources"]>> = {
  "calculadora-gestion-agua-supervivencia": [{ title: "CDC: preparar y almacenar una reserva de agua", url: "https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html" }],
  "calculadora-captacion-lluvia-supervivencia": [{ title: "NIST: volumen y relación entre litros y metros cúbicos", url: "https://www.nist.gov/pml/owm/si-units-volume" }],
  "calculadora-energia-powerbank-emergencia": [units],
  "calculadora-conversor-survival-unidades": [units],
  "calculadora-horas-luz-ruta": [{ title: "SunCalc: biblioteca utilizada para la puesta de sol aproximada", url: "https://github.com/mourner/suncalc/tree/v1.9.0" }],
  "calculadora-sensacion-termica-frio-calor": [{ title: "NWS: fórmula del índice de calor y límites", url: "https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml" }, { title: "NWS: sensación térmica por frío y viento", url: "https://www.weather.gov/safety/cold-wind-chill-chart" }],
  "calculadora-velocidad-necesaria-ruta": [{ title: "NPS: planificación previa de una salida; contexto de seguridad, no validación de la estimación", url: "https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm" }],
  "calculadora-potabilizacion-quimica-agua": [{ title: "CDC: tratamiento del agua en una emergencia", url: "https://www.cdc.gov/water-emergency/about/index.html" }],
  "calculadora-destilacion-solar-agua": [{ title: "NIST Chemistry WebBook: datos termodinámicos del agua; el rendimiento real no se deduce de ellos", url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Units=SI&Mask=4" }],
  "calculadora-cruce-rios-seguridad": [{ title: "NWS: no atravesar agua de inundación; contexto de seguridad", url: "https://www.weather.gov/safety/flood-turn-around-dont-drown" }],
  "calculadora-silbato-emergencia-senales": [morse],
  "calculadora-senales-humo-supervivencia": [{ title: "NPS: prevenir incendios; la simulación no requiere encender fuego", url: "https://www.nps.gov/articles/campfires.htm" }],
  "calculadora-hipotermia-riesgo": [{ title: "NHS: hipotermia como urgencia médica", url: "https://www.nhs.uk/conditions/hypothermia/" }],
  "mascotas-en-emergencias-apagon-calor-y-evacuacion": [family, { title: "CDC: monóxido de carbono y protección de personas y animales", url: "https://www.cdc.gov/carbon-monoxide/about/index.html" }],
  "objetos-de-casa-que-pueden-ayudarte-en-una-emergencia": [family],
  "sin-mochila-sin-equipo": [family],
  "psicologia-emergencia-errores-mentales": [{ title: "OMS: primera ayuda psicológica; contexto de apoyo, no diagnóstico", url: "https://www.who.int/publications/i/item/9789241548205" }],
  "eclipse-del-12-de-agosto-de-2026-por-que-hubo-avisos": [{ title: "Ministerio de Ciencia: recomendaciones para observar el eclipse", url: "https://www.ciencia.gob.es/Noticias/2026/mayo/recomendaciones-observacion-segura-eclipse.html" }, { title: "Ministerio de Consumo: protección ocular certificada", url: "https://www.dsca.gob.es/es/comunicacion/notas-prensa/consumo-recuerda-que-eclipse-debe-verse-gafas-certificadas-recomienda" }],
  "verano-de-2026-el-mas-calido-de-la-serie-en-espana": [{ title: "AEMET: balance de olas de calor de 2026 y ámbito del recuento", url: "https://www.aemet.es/es/noticias/2026/09/olas_de_calor_2026" }],
};
