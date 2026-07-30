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
  return process.env.ADMIN_TOKEN || (process.env.NODE_ENV === "production" ? "" : "modo-crisis-local");
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

export async function requireAdminToken(request: Request) {
  const expected = await adminSessionValue();
  const current = sessionFromCookie(request);

  if (expected && current && safeEqual(current, expected)) return null;

  return Response.json(
    { ok: false, message: "Sesion de administracion no valida." },
    { status: 401 },
  );
}
