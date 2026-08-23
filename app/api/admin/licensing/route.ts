import { requireAdminToken } from "../_utils";
import { readDashboardSummary } from "@/lib/licensing-d1";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  try {
    return Response.json({ ok: true, configured: true, dashboard: await readDashboardSummary() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: false,
        message: error instanceof Error ? error.message : "No se pudo leer D1.",
      },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
