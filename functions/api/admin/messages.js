import { handleOptions, json, normalizeAdminMessage, readMessages, requireAdmin, writeMessages } from "../_shared.js";

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const auth = requireAdmin(context.request, context.env);
  if (!auth.ok) return auth.response;

  try {
    const message = normalizeAdminMessage(await context.request.json());
    const messages = await readMessages(context.env);
    const index = messages.findIndex((item) => item.id === message.id);

    if (index >= 0) messages[index] = message;
    else messages.unshift(message);

    await writeMessages(context.env, messages.slice(0, 100));
    return json({ ok: true, message });
  } catch (error) {
    return json({ error: error.message || "No se pudo guardar el mensaje" }, 400);
  }
}
