import { buildAppVersionPayload } from "@/lib/app-version";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    await buildAppVersionPayload(),
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
