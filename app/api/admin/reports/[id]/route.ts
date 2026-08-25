import { requireAdminToken } from "../../_utils";
import { deleteBugReport } from "@/lib/bug-reports";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const { id } = await context.params;

  try {
    const result = await deleteBugReport(decodeURIComponent(id));
    return Response.json({ ok: true, ...result }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo borrar el reporte." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
