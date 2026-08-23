import { requireAdminToken } from "../../../../../_utils";
import { releaseDevice, writeAuditLog } from "@/lib/licensing-d1";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string; deviceId: string }> }) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const { id, deviceId } = await context.params;
  await releaseDevice(deviceId);
  await writeAuditLog({ action: "LIBERAR_DISPOSITIVO", details: { licenseId: id, deviceId } });

  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
