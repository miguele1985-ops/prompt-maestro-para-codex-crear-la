import { handleOptions, json, readConfig } from "../_shared.js";

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "GET") return json({ error: "Método no permitido" }, 405);

  try {
    return json(await readConfig(context.env));
  } catch (error) {
    return json({ error: error.message || "Error de configuración" }, 500);
  }
}
