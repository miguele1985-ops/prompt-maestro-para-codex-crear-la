export const adminSessionCookieName = "mcs_admin_session";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

export function configuredAdminToken() {
  const runtimeGlobal = globalThis as typeof globalThis & { [key: symbol]: unknown };
  const cloudflareContext = runtimeGlobal[Symbol.for("__cloudflare-request-context__")] as { env?: Record<string, unknown> } | undefined;
  const cloudflareEnv = cloudflareContext?.env || {};

  return (
    process.env.ADMIN_TOKEN ||
    process.env.MCS_ADMIN_TOKEN ||
    String(cloudflareEnv.ADMIN_TOKEN || "") ||
    String(cloudflareEnv.MCS_ADMIN_TOKEN || "") ||
    (process.env.NODE_ENV === "production" ? "" : "modo-crisis-local")
  );
}

export async function adminSessionValue() {
  const token = configuredAdminToken();
  const secret = process.env.ADMIN_SESSION_SECRET || token;
  if (!token || !secret) return "";
  return sha256(`${token}:${secret}`);
}

export function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function sessionFromCookie(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const sessionCookie = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${adminSessionCookieName}=`));

  return sessionCookie?.split("=").slice(1).join("=") || "";
}

function bearerTokenFromHeader(request: Request) {
  const header = request.headers.get("authorization") || "";
  return header.replace(/^Bearer\s+/i, "").trim();
}

export async function requireAdminToken(request: Request) {
  const expected = await adminSessionValue();
  const current = sessionFromCookie(request);

  if (expected && current && safeEqual(current, expected)) return null;

  const bearer = bearerTokenFromHeader(request);
  const configuredToken = configuredAdminToken();
  if (bearer && configuredToken && safeEqual(bearer, configuredToken)) return null;

  return Response.json(
    { ok: false, message: "Sesion de administracion no valida." },
    { status: 401 },
  );
}
