import { jsonResponse, methodNotAllowed, readMcsMessages, requireMcsAdmin, writeMcsMessages } from "@/lib/mcs-app-kv";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  return methodNotAllowed();
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = requireMcsAdmin(request);
  if (auth) return auth;

  const { id } = await context.params;
  const messages = await readMcsMessages();
  const next = messages.map((message) => (message.id === id ? { ...message, published: false } : message));

  await writeMcsMessages(next);
  return jsonResponse({ ok: true, id });
}
