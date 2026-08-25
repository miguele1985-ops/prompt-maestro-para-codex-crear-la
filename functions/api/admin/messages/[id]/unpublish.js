import { handleOptions, json, readMessages, requireAdmin, writeMessages } from "../../../_shared.js";

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const auth = requireAdmin(context.request, context.env);
  if (!auth.ok) return auth.response;

  const id = String(context.params.id || "");
  const messages = await readMessages(context.env);
  const next = messages.map((message) => (message.id === id ? { ...message, published: false } : message));

  await writeMessages(context.env, next);
  return json({ ok: true, id });
}
