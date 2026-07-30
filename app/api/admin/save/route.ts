import { readAdminData, requireAdminToken, writeAdminData } from "../_utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxBodyChars = 1_200_000;

export async function POST(request: Request) {
  const tokenError = requireAdminToken(request);
  if (tokenError) return tokenError;

  const text = await request.text();
  if (text.length > maxBodyChars) {
    return Response.json({ ok: false, message: "El contenido es demasiado grande." }, { status: 413 });
  }

  let nextData: unknown;
  try {
    nextData = JSON.parse(text);
  } catch {
    return Response.json({ ok: false, message: "JSON inválido." }, { status: 400 });
  }

  const current = await readAdminData();
  const candidate = nextData as {
    site?: unknown;
    download?: unknown;
    changelog?: unknown;
    pages?: unknown;
  };

  const safeData = {
    site: typeof candidate.site === "object" && candidate.site ? candidate.site : current.site || {},
    download: typeof candidate.download === "object" && candidate.download ? candidate.download : current.download || {},
    changelog: Array.isArray(candidate.changelog) ? candidate.changelog : current.changelog || [],
    pages: Array.isArray(candidate.pages) ? candidate.pages : current.pages || [],
  };

  await writeAdminData(safeData);

  return Response.json({
    ok: true,
    message: "Cambios guardados. Ejecuta una nueva build para publicarlos en hosting estático.",
  });
}

