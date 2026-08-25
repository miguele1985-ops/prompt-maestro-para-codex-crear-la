import {
  jsonResponse,
  methodNotAllowed,
  normalizeAdminMessage,
  handleOptions,
  readMcsMessages,
  requireMcsAdmin,
  writeMcsMessages,
} from "@/lib/mcs-app-kv";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  return methodNotAllowed();
}

export function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function POST(request: Request) {
  const auth = requireMcsAdmin(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const message = normalizeAdminMessage(body);
    const messages = await readMcsMessages();
    const index = messages.findIndex((item) => item.id === message.id);

    if (index >= 0) messages[index] = message;
    else messages.unshift(message);

    await writeMcsMessages(messages.slice(0, 100));
    return jsonResponse({ ok: true, message });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "No se pudo guardar el mensaje" }, 400);
  }
}
