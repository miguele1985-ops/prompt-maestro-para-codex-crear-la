import { requireAdminToken } from "../_utils";
import { writeAdminContent } from "@/lib/admin-content";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const maxBodyChars = 1_200_000;

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const text = await request.text();
  if (text.length > maxBodyChars) {
    return Response.json({ ok: false, message: "El contenido es demasiado grande." }, { status: 413 });
  }

  try {
    JSON.parse(text);
  } catch {
    return Response.json({ ok: false, message: "JSON invalido." }, { status: 400 });
  }

  try {
    await writeAdminContent(JSON.parse(text));
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo guardar en Cloudflare KV.",
      },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    message: "Cambios guardados en Cloudflare KV. La web usara estos datos cuando la pagina lea contenido dinamico.",
  });
}
