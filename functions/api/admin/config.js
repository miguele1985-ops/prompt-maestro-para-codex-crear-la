import {
  handleOptions,
  isSafeUrl,
  json,
  normalizeForceFlag,
  normalizeMode,
  readConfig,
  requireAdmin,
  writeConfig,
} from "../_shared.js";

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const auth = requireAdmin(context.request, context.env);
  if (!auth.ok) return auth.response;

  try {
    const body = await context.request.json();
    if (body.purchaseUrl && !isSafeUrl(body.purchaseUrl)) return json({ error: "purchaseUrl no permitida" }, 400);

    const current = await readConfig(context.env);
    const force = normalizeForceFlag(body, current);
    const next = {
      ...current,
      ...body,
      appMode: normalizeMode(body.appMode || current.appMode),
      licensingEnabled: body.licensingEnabled === undefined ? current.licensingEnabled : Boolean(body.licensingEnabled),
      globalLockEnabled: body.globalLockEnabled === undefined ? current.globalLockEnabled : Boolean(body.globalLockEnabled),
      updateEnabled: body.updateEnabled === undefined ? current.updateEnabled : Boolean(body.updateEnabled),
      force,
      forceUpdate: force,
      mandatory: force,
      configurationVersion: Number(current.configurationVersion || 0) + 1,
    };

    await writeConfig(context.env, next);
    return json({ ok: true, config: next });
  } catch (error) {
    return json({ error: error.message || "No se pudo guardar la configuración" }, 400);
  }
}
