import { requireAdminToken } from "../_utils";
import { isAdminContentStorageConfigured, readAdminContent } from "@/lib/admin-content";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  if (!isAdminContentStorageConfigured()) {
    return Response.json({
      ok: false,
      configured: false,
      message: "Cloudflare KV no esta configurado para contenido editable.",
    });
  }

  try {
    const data = await readAdminContent();
    return Response.json({
      ok: true,
      configured: true,
      data,
      message: data ? "Contenido cargado desde Cloudflare KV." : "No hay cambios guardados todavia.",
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: true,
        message: error instanceof Error ? error.message : "No se pudo cargar el contenido guardado.",
      },
      { status: 500 },
    );
  }
}
