import { handleOptions, json, readMessages } from "../_shared.js";

const isActive = (message, now = Date.now()) => {
  const start = message.validFrom ? Date.parse(message.validFrom) : null;
  const end = message.validUntil ? Date.parse(message.validUntil) : null;
  if (Number.isFinite(start) && now < start) return false;
  if (Number.isFinite(end) && now > end) return false;
  return true;
};

export async function onRequest(context) {
  const options = handleOptions(context.request);
  if (options) return options;
  if (context.request.method !== "GET") return json({ error: "Método no permitido" }, 405);

  try {
    const messages = (await readMessages(context.env))
      .filter((message) => message.published !== false)
      .filter(isActive);
    return json({ messages });
  } catch (error) {
    return json({ error: error.message || "Error de mensajes" }, 500);
  }
}
