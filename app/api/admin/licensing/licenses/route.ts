import { requireAdminToken } from "../../_utils";
import { createLicenses, listLicenses, writeAuditLog } from "@/lib/licensing-d1";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";
import type { LicenseStatus, LicenseType } from "@/lib/licensing-core";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const licenseTypes = new Set<LicenseType>(["PERMANENT", "ANNUAL", "CUSTOM"]);
const licenseStatuses = new Set<LicenseStatus | "ALL">(["ALL", "ACTIVE", "REVOKED", "SUSPENDED", "REFUNDED"]);

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "ALL";
  if (!licenseStatuses.has(status as LicenseStatus | "ALL")) {
    return Response.json({ ok: false, message: "Filtro de estado no valido." }, { status: 400 });
  }

  const licenses = await listLicenses(status as LicenseStatus | "ALL");
  return Response.json({ ok: true, licenses }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  if (await isRateLimited({ key: rateLimitKey(request, "admin-license-generate", 60), limit: 20, windowSeconds: 60 })) {
    return rateLimitResponse("Demasiadas acciones seguidas. Espera un minuto.");
  }

  const body = (await request.json().catch(() => ({}))) as {
    count?: number;
    maxDevices?: number;
    licenseType?: LicenseType;
    expiresAt?: string | null;
    paymentReference?: string | null;
    customerReference?: string | null;
    notes?: string | null;
  };

  const licenseType = licenseTypes.has(body.licenseType || "PERMANENT") ? body.licenseType : "PERMANENT";
  const created = await createLicenses({
    count: body.count,
    maxDevices: body.maxDevices,
    licenseType,
    expiresAt: body.expiresAt || null,
    paymentReference: body.paymentReference || null,
    customerReference: body.customerReference || null,
    notes: body.notes || null,
    createdBy: "admin-web",
  });

  await writeAuditLog({
    action: "GENERAR_LICENCIAS",
    details: { count: created.length, maxDevices: body.maxDevices || 2, licenseType },
  });

  return Response.json(
    {
      ok: true,
      message: "Codigos generados. Copialos ahora: por seguridad no se volveran a mostrar completos.",
      licenses: created,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
