import { createHash, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export const adminDataPath = path.join(process.cwd(), "src", "content", "admin-overrides.json");
export const apkPath = path.join(process.cwd(), "public", "downloads", "modo-crisis-survival.apk");
export const adminSessionCookieName = "mcs_admin_session";

export function configuredAdminToken() {
  return process.env.ADMIN_TOKEN || (process.env.NODE_ENV === "production" ? "" : "modo-crisis-local");
}

export function adminSessionValue() {
  const token = configuredAdminToken();
  const secret = process.env.ADMIN_SESSION_SECRET || token;
  if (!token || !secret) return "";
  return createHash("sha256").update(`${token}:${secret}`).digest("hex");
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function readSessionCookie(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${adminSessionCookieName}=`))
    ?.split("=")[1] || "";
}

export function requireAdminToken(request: Request) {
  const expectedSession = adminSessionValue();
  const session = readSessionCookie(request);

  if (expectedSession && session && safeEqual(session, expectedSession)) return null;

  const expectedToken = configuredAdminToken();
  const providedToken = request.headers.get("x-admin-token") || "";

  if (!expectedToken || !providedToken || !safeEqual(providedToken, expectedToken)) {
    return Response.json(
      { ok: false, message: "Sesión de administración inválida." },
      { status: 401 },
    );
  }

  return null;
}

export async function readAdminData() {
  const raw = await fs.readFile(adminDataPath, "utf8");
  return JSON.parse(raw) as {
    site?: Record<string, unknown>;
    download?: Record<string, unknown>;
    changelog?: unknown[];
    pages?: unknown[];
  };
}

export async function writeAdminData(data: unknown) {
  await fs.writeFile(adminDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

