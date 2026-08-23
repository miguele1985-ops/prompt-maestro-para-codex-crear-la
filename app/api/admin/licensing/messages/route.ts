import { requireAdminToken } from "../../_utils";
import { listMessages, upsertMessage, writeAuditLog } from "@/lib/licensing-d1";
import { validateHttpsUrl, type MessageType } from "@/lib/licensing-core";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const messageTypes = new Set<MessageType>(["INFO", "IMPORTANT", "UPDATE", "PROMOTION", "LICENSE", "BLOCKING"]);

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;
  const messages = await listMessages();
  return Response.json({ ok: true, messages }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  if (await isRateLimited({ key: rateLimitKey(request, "admin-message-save", 60), limit: 40, windowSeconds: 60 })) {
    return rateLimitResponse("Demasiadas acciones seguidas. Espera un minuto.");
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    title?: string;
    body?: string;
    buttonText?: string;
    buttonUrl?: string;
    type?: MessageType;
    dismissible?: boolean;
    blocking?: boolean;
    enabled?: boolean;
    startsAt?: string;
    endsAt?: string | null;
    minimumVersion?: number | null;
    maximumVersion?: number | null;
  };

  const title = (body.title || "").trim();
  const messageBody = (body.body || "").trim();
  if (!title || !messageBody) {
    return Response.json({ ok: false, message: "Titulo y mensaje son obligatorios." }, { status: 400 });
  }
  if (body.buttonUrl && !validateHttpsUrl(body.buttonUrl)) {
    return Response.json({ ok: false, message: "La URL del boton debe empezar por https://." }, { status: 400 });
  }

  const id = await upsertMessage({
    id: body.id,
    title,
    body: messageBody,
    buttonText: body.buttonText || null,
    buttonUrl: body.buttonUrl || null,
    type: messageTypes.has(body.type || "INFO") ? body.type : "INFO",
    dismissible: body.dismissible !== false,
    blocking: Boolean(body.blocking),
    enabled: Boolean(body.enabled),
    startsAt: body.startsAt || new Date().toISOString(),
    endsAt: body.endsAt || null,
    minimumVersion: body.minimumVersion ?? null,
    maximumVersion: body.maximumVersion ?? null,
  });

  await writeAuditLog({
    action: body.id ? "MODIFICAR_MENSAJE" : "CREAR_MENSAJE",
    details: { id, type: body.type || "INFO", enabled: Boolean(body.enabled), blocking: Boolean(body.blocking) },
  });

  return Response.json({ ok: true, id }, { headers: { "cache-control": "no-store" } });
}
