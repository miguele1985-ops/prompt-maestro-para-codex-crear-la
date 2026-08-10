import { NextRequest, NextResponse } from "next/server";
import { addBugReport } from "@/lib/bug-reports";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
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