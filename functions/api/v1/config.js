import { handleOptions, json, readConfig } from "../_shared.js";

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "GET") return json({ error: "Método no permitido" }, 405);

  try {
    const config = await readConfig(context.env);
    const force = Boolean(config.force ?? config.forceUpdate ?? config.mandatory);

    return json({
      schemaVersion: 1,
      ...config,
      force,
      forceUpdate: force,
      mandatory: force,
    });
  } catch (error) {
    return json({ error: error.message || "Error de configuración" }, 500);
  }
}
