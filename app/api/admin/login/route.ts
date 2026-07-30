import {
  adminSessionCookieName,
  adminSessionValue,
  configuredAdminToken,
  safeEqual,
} from "../_utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 10 * 60 * 1000;
const maxAttempts = 8;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "local";
}

function isRateLimited(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  attempts.set(key, current);
  return current.count > maxAttempts;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return Response.json({ ok: false, message: "Demasiados intentos. Espera unos minutos." }, { status: 429 });
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

  const session = adminSessionValue();
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

