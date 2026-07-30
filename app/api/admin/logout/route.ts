import { adminSessionCookieName } from "../_utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = Response.json({ ok: true, message: "Sesión cerrada." });
  response.headers.append(
    "Set-Cookie",
    `${adminSessionCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
  );
  return response;
}

