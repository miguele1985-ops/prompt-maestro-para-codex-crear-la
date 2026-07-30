import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "mcs_admin_session";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

async function expectedSessionValue() {
  const token = process.env.ADMIN_TOKEN || (process.env.NODE_ENV === "production" ? "" : "modo-crisis-local");
  const secret = process.env.ADMIN_SESSION_SECRET || token;
  if (!token || !secret) return "";
  return sha256(`${token}:${secret}`);
}

async function hasValidSession(request: NextRequest) {
  const session = request.cookies.get(sessionCookieName)?.value || "";
  const expected = await expectedSessionValue();
  return Boolean(expected && session && session === expected);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname === "/administracion" || pathname.startsWith("/administracion/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAuthApi = pathname === "/api/admin/login" || pathname === "/api/admin/logout";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isAuthApi) return NextResponse.next();

  const authenticated = await hasValidSession(request);
  if (authenticated) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (isAdminApi) {
    return NextResponse.json({ ok: false, message: "Sesión de administración no válida." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin-login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/administracion/:path*", "/api/admin/:path*"],
};

