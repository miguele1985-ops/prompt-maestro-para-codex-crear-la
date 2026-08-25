import {
  handleOptions,
  isSafeUrl,
  jsonResponse,
  methodNotAllowed,
  normalizeForceFlag,
  normalizeMode,
  readMcsConfig,
  requireMcsAdmin,
  writeMcsConfig,
} from "@/lib/mcs-app-kv";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  return methodNotAllowed();
}

export function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function POST(request: Request) {
  const auth = requireMcsAdmin(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    if (body.purchaseUrl && !isSafeUrl(body.purchaseUrl)) return jsonResponse({ error: "purchaseUrl no permitida" }, 400);

    const current = await readMcsConfig();
    const force = normalizeForceFlag(body, current);
    const next = {
      ...current,
      ...body,
      appMode: normalizeMode(body.appMode || current.appMode),
      licensingEnabled: Boolean(body.licensingEnabled),
      globalLockEnabled: Boolean(body.globalLockEnabled),
      updateEnabled: body.updateEnabled === undefined ? current.updateEnabled : Boolean(body.updateEnabled),
      force,
      forceUpdate: force,
      mandatory: force,
      configurationVersion: Number(current.configurationVersion || 0) + 1,
    };

    await writeMcsConfig(next);
    return jsonResponse({ ok: true, config: next });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "No se pudo guardar la configuración" }, 400);
  }
}
