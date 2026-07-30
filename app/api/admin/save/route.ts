import { requireAdminToken } from "../_utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const maxBodyChars = 1_200_000;

export async function POST(request: Request) {
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

  return Response.json(
    {
      ok: false,
      message:
        "Cloudflare Pages no puede guardar cambios directamente en archivos del proyecto. Para publicar cambios, editalos en GitHub/local y vuelve a desplegar, o conecta almacenamiento externo como Cloudflare KV/R2.",
    },
    { status: 501 },
  );
}
