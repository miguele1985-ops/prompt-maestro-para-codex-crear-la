import { defaultAppConfig, hashLicenseCode } from "@/lib/licensing-core";
import { D1LicensingStore, readAppConfig } from "@/lib/licensing-d1";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  if (await isRateLimited({ key: rateLimitKey(request, "license-status", 60), limit: 60, windowSeconds: 60 })) {
    return rateLimitResponse("Demasiadas comprobaciones. Espera un minuto.");
  }

  const body = (await request.json().catch(() => ({}))) as {
    licenseCode?: string;
    installationId?: string;
  };

  const config = await readAppConfig().catch(() => defaultAppConfig);
  if (!config.licensingEnabled && config.appMode === "FREE") {
    return Response.json({ ok: true, mode: "FREE", valid: true }, { headers: { "cache-control": "no-store" } });
  }

  const store = new D1LicensingStore();
  const license = await store.getLicenseByHash(await hashLicenseCode(body.licenseCode || ""));
  if (!license || license.status !== "ACTIVE") {
    return Response.json({ ok: false, valid: false, reason: "INVALID_OR_INACTIVE" }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  return Response.json(
    {
      ok: true,
      valid: true,
      license: {
        id: license.id,
        type: license.licenseType,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
