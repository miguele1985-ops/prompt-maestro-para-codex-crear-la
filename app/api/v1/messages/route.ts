import { readActiveMessages } from "@/lib/licensing-d1";
import { readMcsMessages } from "@/lib/mcs-app-kv";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appVersion = Number(searchParams.get("appVersion") || "0");
  const kvMessages = await readMcsMessages().catch(() => []);
  const messages = kvMessages.length
    ? kvMessages
        .filter((message) => {
          const now = Date.now();
          if (!message.published) return false;
          if (message.validFrom && Date.parse(message.validFrom) > now) return false;
          if (message.validUntil && Date.parse(message.validUntil) < now) return false;
          return true;
        })
        .slice(0, 20)
    : await readActiveMessages(Number.isFinite(appVersion) ? appVersion : 0).catch(() => []);

  return Response.json(
    {
      schemaVersion: 1,
      messages: messages.map((message) => ({
        id: message.id,
        title: message.title,
        body: message.body,
        buttonText: message.buttonText,
        buttonUrl: "buttonUrl" in message ? message.buttonUrl : message.url,
        type: message.type,
        dismissible: message.dismissible,
        blocking: message.blocking,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
