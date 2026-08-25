export const CONFIG_KEY = "config";
export const MESSAGES_KEY = "messages";

export const DEFAULT_CONFIG = {
  appMode: "FREE",
  licensingEnabled: false,
  globalLockEnabled: false,
  minimumSupportedVersion: null,
  minimumSupportedVersionCode: null,
  latestVersion: null,
  latestVersionCode: null,
  purchaseUrl: "https://modo-crisis-survival.pages.dev/donaciones",
  configurationVersion: 1,
  licenseMessage:
    "La app está actualmente en modo gratuito. Si en el futuro se requiere activación, podrás introducir aquí tu código.",
  gracePeriodEndsAt: null,
  globalLockTitle: "Aplicación no disponible temporalmente",
  globalLockMessage: "El administrador ha bloqueado temporalmente el acceso.",
};

const ADMIN_MESSAGE_TYPES = new Set(["INFO", "IMPORTANT", "UPDATE", "PROMOTION", "LICENSE", "BLOCKING"]);
const APP_MODES = new Set(["FREE", "NOTICE", "GRACE_PERIOD", "LICENSE_REQUIRED"]);

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
    },
  });

export const handleOptions = (request) => (request.method === "OPTIONS" ? json({ ok: true }) : null);

export const isSafeUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const requireAdmin = (request, env) => {
  const expected = String(env.MCS_ADMIN_TOKEN || "").trim();
  if (!expected) return { ok: false, response: json({ error: "MCS_ADMIN_TOKEN no está configurado" }, 500) };

  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token || token !== expected) return { ok: false, response: json({ error: "No autorizado" }, 401) };

  return { ok: true };
};

export const getStore = (env) => {
  if (!env.MCS_APP_KV) throw new Error("Falta el binding KV MCS_APP_KV");
  return env.MCS_APP_KV;
};

export const readConfig = async (env) => {
  const saved = await getStore(env).get(CONFIG_KEY, "json");
  return { ...DEFAULT_CONFIG, ...(saved || {}) };
};

export const writeConfig = async (env, config) => {
  await getStore(env).put(CONFIG_KEY, JSON.stringify(config));
};

export const readMessages = async (env) => {
  const saved = await getStore(env).get(MESSAGES_KEY, "json");
  return Array.isArray(saved) ? saved : [];
};

export const writeMessages = async (env, messages) => {
  await getStore(env).put(MESSAGES_KEY, JSON.stringify(messages));
};

export const normalizeMode = (value) => (APP_MODES.has(value) ? value : "FREE");

export const normalizeAdminMessage = (raw) => {
  const id = String(raw.id || `mensaje-${Date.now()}`).trim();
  const title = String(raw.title || "").trim();
  const body = String(raw.body || raw.message || "").trim();

  if (!title || !body) throw new Error("Título y mensaje son obligatorios");
  if (!isSafeUrl(raw.url)) throw new Error("La URL debe empezar por https:// o http://");

  return {
    id,
    version: String(raw.version || "1"),
    title,
    body,
    buttonText: String(raw.buttonText || "").trim(),
    url: raw.url ? String(raw.url).trim() : null,
    dismissible: raw.dismissible !== false,
    blocking: Boolean(raw.blocking) || raw.type === "BLOCKING",
    type: ADMIN_MESSAGE_TYPES.has(raw.type) ? raw.type : "INFO",
    published: raw.published !== false,
    validFrom: raw.validFrom || null,
    validUntil: raw.validUntil || null,
  };
};
