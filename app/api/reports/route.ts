import { NextRequest, NextResponse } from "next/server";
import { addBugReport } from "@/lib/bug-reports";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const windowSeconds = 60 * 60;
  if (await isRateLimited({ key: rateLimitKey(request, "bug-report", windowSeconds), limit: 5, windowSeconds })) {
    return rateLimitResponse("Has enviado varios reportes. Espera un rato antes de enviar otro.");
  }

  const text = await request.text();
  if (text.length > 6000) {
    return NextResponse.json({ ok: false, message: "El reporte es demasiado largo." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(text || "{}");
  } catch {
    return NextResponse.json({ ok: false, message: "JSON invalido." }, { status: 400 });
  }
  const message = String(payload.message || "").trim();
  const source = String(payload.source || "Web").trim();

  if (message.length < 8) {
    return NextResponse.json({ ok: false, message: "Escribe un poco mas de detalle para poder revisar el fallo." }, { status: 400 });
  }

  try {
    const report = await addBugReport({
      source,
      message,
      userAgent: request.headers.get("user-agent") || undefined,
    });
    return NextResponse.json({ ok: true, report }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el reporte." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
