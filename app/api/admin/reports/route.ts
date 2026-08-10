import { requireAdminToken } from "../_utils";
import { isBugReportStorageConfigured, readBugReports } from "@/lib/bug-reports";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  if (!isBugReportStorageConfigured()) {
    return Response.json({ ok: false, configured: false, reports: [], message: "Cloudflare KV no esta configurado para reportes de fallos." });
  }

  try {
    const reports = await readBugReports();
    return Response.json({ ok: true, configured: true, reports }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json(
      { ok: false, configured: true, reports: [], message: error instanceof Error ? error.message : "No se pudieron leer los reportes." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}