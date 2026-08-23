import { readActiveMessages } from "@/lib/licensing-d1";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appVersion = Number(searchParams.get("appVersion") || "0");
  const messages = await readActiveMessages(Number.isFinite(appVersion) ? appVersion : 0).catch(() => []);

  return Response.json(
    {
      schemaVersion: 1,
      messages: messages.map((message) => ({
        id: message.id,
        title: message.title,
        body: message.body,
        buttonText: message.buttonText,
        buttonUrl: message.buttonUrl,
        type: message.type,
        dismissible: message.dismissible,
        blocking: message.blocking,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

