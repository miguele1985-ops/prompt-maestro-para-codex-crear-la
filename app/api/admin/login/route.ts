import {
  adminSessionCookieName,
  adminSessionValue,
  configuredAdminToken,
  safeEqual,
} from "../_utils";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const maxAttempts = 8;
const windowSeconds = 10 * 60;

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  if (await isRateLimited({ key: rateLimitKey(request, "admin-login", windowSeconds), limit: maxAttempts, windowSeconds })) {
    return rateLimitResponse("Demasiados intentos. Espera unos minutos.");
  }

  const body = await request.json().catch(() => ({})) as {
    username?: string;
    password?: string;
    token?: string;
  };

  const expectedToken = configuredAdminToken();
  const expectedUser = process.env.ADMIN_USERNAME || (process.env.NODE_ENV === "production" ? "" : "admin");
  const expectedPassword = process.env.ADMIN_PASSWORD || expectedToken;

  const tokenOk = Boolean(body.token && expectedToken && safeEqual(body.token, expectedToken));
  const userOk = Boolean(body.username && expectedUser && safeEqual(body.username, expectedUser));
  const passwordOk = Boolean(body.password && expectedPassword && safeEqual(body.password, expectedPassword));

  if (!tokenOk && !(userOk && passwordOk)) {
    return Response.json({ ok: false, message: "Credenciales incorrectas." }, { status: 401 });
  }

  const session = await adminSessionValue();
  if (!session) {
    return Response.json({ ok: false, message: "ADMIN_TOKEN no está configurado." }, { status: 500 });
  }

  const response = Response.json({ ok: true, message: "Sesión iniciada." });
  response.headers.append(
    "Set-Cookie",
    [
      `${adminSessionCookieName}=${session}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Strict",
      process.env.NODE_ENV === "production" ? "Secure" : "",
      "Max-Age=28800",
    ].filter(Boolean).join("; "),
  );
  return response;
}
