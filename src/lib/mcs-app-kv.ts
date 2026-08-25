export const MCS_CONFIG_KEY = "config";
export const MCS_MESSAGES_KEY = "messages";

type McsKvValueType = "text" | "json";

export interface McsKvNamespace {
  get(key: string): Promise<string | null>;
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  get(key: string, type: McsKvValueType): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

export interface McsAppConfig {
  appMode: "FREE" | "NOTICE" | "GRACE_PERIOD" | "LICENSE_REQUIRED";
  licensingEnabled: boolean;
  globalLockEnabled: boolean;
  minimumSupportedVersion: string | number | null;
  minimumSupportedVersionCode: number | null;
  latestVersion: string | number | null;
  latestVersionCode: number | null;
  updateEnabled?: boolean;
  enabled?: boolean;
  force?: boolean;
  forceUpdate?: boolean;
  mandatory?: boolean;
  title?: string;
  message?: string;
  downloadUrl?: string;
  releaseNotesUrl?: string;
  purchaseUrl: string;
  supportUrl?: string;
  configurationVersion: number;
  licenseMessage: string;
  gracePeriodEndsAt: string | null;
  globalLockTitle: string;
  globalLockMessage: string;
}

export interface McsAdminMessage {
  id: string;
  version: string;
  title: string;
  body: string;
  buttonText: string;
  url: string | null;
  dismissible: boolean;
  blocking: boolean;
  type: "INFO" | "IMPORTANT" | "UPDATE" | "PROMOTION" | "LICENSE" | "BLOCKING";
  published: boolean;
  validFrom: string | null;
  validUntil: string | null;
}

export const DEFAULT_MCS_CONFIG: McsAppConfig = {
  appMode: "FREE",
  licensingEnabled: false,
  globalLockEnabled: false,
  minimumSupportedVersion: null,
  minimumSupportedVersionCode: null,
  latestVersion: null,
  latestVersionCode: null,
  purchaseUrl: "https://modo-crisis-survival.pages.dev/donaciones",
  supportUrl: "https://modo-crisis-survival.pages.dev/contacto",
  configurationVersion: 1,
  licenseMessage:
    "La app está actualmente en modo gratuito. Si en el futuro se requiere activación, podrás introducir aquí tu código.",
  gracePeriodEndsAt: null,
  globalLockTitle: "Aplicación no disponible temporalmente",
  globalLockMessage: "El administrador ha bloqueado temporalmente el acceso.",
};

const ADMIN_MESSAGE_TYPES = new Set<McsAdminMessage["type"]>([
  "INFO",
  "IMPORTANT",
  "UPDATE",
  "PROMOTION",
  "LICENSE",
  "BLOCKING",
]);
const APP_MODES = new Set<McsAppConfig["appMode"]>(["FREE", "NOTICE", "GRACE_PERIOD", "LICENSE_REQUIRED"]);

function runtimeEnv() {
  return process.env as unknown as {
    MCS_APP_KV?: McsKvNamespace;
    MCS_ADMIN_TOKEN?: string;
  };
}

export function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function methodNotAllowed() {
  return jsonResponse({ error: "Método no permitido" }, 405, { allow: "POST" });
}

export function handleOptions(request: Request) {
  if (request.method !== "OPTIONS") return methodNotAllowed();
  return jsonResponse(
    { ok: true },
    200,
    {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
    },
  );
}

export function getMcsAppKv() {
  const kv = runtimeEnv().MCS_APP_KV;
  if (!kv) throw new Error("Falta el binding KV MCS_APP_KV");
  return kv;
}

export function requireMcsAdmin(request: Request) {
  const expected = String(runtimeEnv().MCS_ADMIN_TOKEN || "").trim();
  if (!expected) return jsonResponse({ error: "MCS_ADMIN_TOKEN no está configurado" }, 500);

  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token || token !== expected) return jsonResponse({ error: "No autorizado" }, 401);

  return null;
}

export function isSafeUrl(value: unknown) {
  if (!value) return true;
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function normalizeMode(value: unknown): McsAppConfig["appMode"] {
  return APP_MODES.has(value as McsAppConfig["appMode"]) ? (value as McsAppConfig["appMode"]) : "FREE";
}

export function booleanFromPayload(value: unknown, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 1 || value === "1" || value === "true";
}

export function normalizeForceFlag(raw: Record<string, unknown>, current?: Partial<McsAppConfig>) {
  if ("force" in raw) return booleanFromPayload(raw.force);
  if ("forceUpdate" in raw) return booleanFromPayload(raw.forceUpdate);
  if ("mandatory" in raw) return booleanFromPayload(raw.mandatory);
  return Boolean(current?.force || current?.forceUpdate || current?.mandatory);
}

export async function readMcsConfig() {
  const saved = await getMcsAppKv().get<Partial<McsAppConfig>>(MCS_CONFIG_KEY, "json");
  return { ...DEFAULT_MCS_CONFIG, ...(saved || {}) };
}

export async function writeMcsConfig(config: McsAppConfig) {
  await getMcsAppKv().put(MCS_CONFIG_KEY, JSON.stringify(config));
}

export async function readMcsMessages() {
  const saved = await getMcsAppKv().get<McsAdminMessage[]>(MCS_MESSAGES_KEY, "json");
  return Array.isArray(saved) ? saved : [];
}

export async function writeMcsMessages(messages: McsAdminMessage[]) {
  await getMcsAppKv().put(MCS_MESSAGES_KEY, JSON.stringify(messages));
}

export function normalizeAdminMessage(raw: Record<string, unknown>): McsAdminMessage {
  const id = String(raw.id || `mensaje-${Date.now()}`).trim();
  const title = String(raw.title || "").trim();
  const body = String(raw.body || raw.message || "").trim();
  const type = raw.type as McsAdminMessage["type"];

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
    blocking: Boolean(raw.blocking) || type === "BLOCKING",
    type: ADMIN_MESSAGE_TYPES.has(type) ? type : "INFO",
    published: raw.published !== false,
    validFrom: raw.validFrom ? String(raw.validFrom) : null,
    validUntil: raw.validUntil ? String(raw.validUntil) : null,
  };
}
