import { requireAdminToken } from "../../../_utils";
import { listLicenseDevices, updateLicense, writeAuditLog } from "@/lib/licensing-d1";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";
import type { LicenseStatus } from "@/lib/licensing-core";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const statuses = new Set<LicenseStatus>(["ACTIVE", "REVOKED", "SUSPENDED", "REFUNDED"]);

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const tokenError = await requireAdminToken(_request);
  if (tokenError) return tokenError;
  const { id } = await context.params;
  const devices = await listLicenseDevices(id);
  return Response.json({ ok: true, devices }, { headers: { "cache-control": "no-store" } });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    status?: LicenseStatus;
    maxDevices?: number;
    notes?: string | null;
  };

  if (body.status && !statuses.has(body.status)) {
    return Response.json({ ok: false, message: "Estado de licencia no valido." }, { status: 400 });
  }

  await updateLicense(id, {
    status: body.status,
    maxDevices: body.maxDevices ? Math.max(1, Math.min(20, Math.floor(body.maxDevices))) : undefined,
    notes: body.notes ?? undefined,
  });

  await writeAuditLog({
    action: body.status === "REVOKED" ? "REVOCAR_LICENCIA" : "MODIFICAR_LICENCIA",
    details: { licenseId: id, status: body.status, maxDevices: body.maxDevices },
  });

  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
