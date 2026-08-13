import { adminSessionCookieName } from "../_utils";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const response = Response.json({ ok: true, message: "Sesion cerrada." });
  response.headers.append(
    "Set-Cookie",
    `${adminSessionCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
  );
  return response;
}
