import { NextRequest, NextResponse } from "next/server";
import { addBugReport } from "@/lib/bug-reports";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const windowSeconds = 60 * 60;
  if (await isRateLimited({ key: rateLimitKey(request, "contact", windowSeconds), limit: 5, windowSeconds })) {
    return rateLimitResponse("Has enviado varios mensajes. Espera un rato antes de enviar otro.");
  }

  const text = await request.text();
  if (text.length > 8000) {
    return NextResponse.json({ ok: false, message: "El mensaje es demasiado largo." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(text || "{}");
  } catch {
    return NextResponse.json({ ok: false, message: "JSON invalido." }, { status: 400 });
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, message: "Revisa los campos obligatorios." }, { status: 400 });
  }

  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, message: "Introduce un correo válido." }, { status: 400 });
  }

  try {
    const report = await addBugReport({
      source: `Contacto: ${subject}`,
      message: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      userAgent: request.headers.get("user-agent") || undefined,
    });
    return NextResponse.json({ ok: true, report }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo enviar el mensaje." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
