import { requireAdminToken } from "../../_utils";
import { updateAppConfig, writeAuditLog } from "@/lib/licensing-d1";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const body = (await request.json().catch(() => ({}))) as {
    appMode?: string;
    licensingEnabled?: boolean;
    globalLockEnabled?: boolean;
    confirmation?: string;
    resetFree?: boolean;
    minimumSupportedVersion?: number;
    latestVersion?: number;
    purchaseUrl?: string;
    supportUrl?: string;
    gracePeriodEnabled?: boolean;
    gracePeriodEnd?: string | null;
  };

  const dangerous = body.appMode === "LICENSE_REQUIRED" || body.licensingEnabled || body.globalLockEnabled;
  if (dangerous && body.confirmation !== "ACTIVAR LICENCIAS") {
    return Response.json({ ok: false, message: "Escribe ACTIVAR LICENCIAS para aplicar este cambio." }, { status: 400 });
  }

  const next = body.resetFree
    ? await updateAppConfig({
        appMode: "FREE",
        licensingEnabled: false,
        globalLockEnabled: false,
        gracePeriodEnabled: false,
        minimumSupportedVersion: body.minimumSupportedVersion || 1,
        latestVersion: body.latestVersion || 1,
        purchaseUrl: body.purchaseUrl,
        supportUrl: body.supportUrl,
      })
    : await updateAppConfig({
        appMode: body.appMode === "NOTICE" || body.appMode === "GRACE_PERIOD" || body.appMode === "LICENSE_REQUIRED" ? body.appMode : "FREE",
        licensingEnabled: Boolean(body.licensingEnabled),
        globalLockEnabled: Boolean(body.globalLockEnabled),
        gracePeriodEnabled: Boolean(body.gracePeriodEnabled),
        gracePeriodEnd: body.gracePeriodEnd || null,
        minimumSupportedVersion: body.minimumSupportedVersion || 1,
        latestVersion: body.latestVersion || 1,
        purchaseUrl: body.purchaseUrl,
        supportUrl: body.supportUrl,
      });

  await writeAuditLog({
    action: body.resetFree ? "RESTABLECER_MODO_GRATIS" : "CAMBIAR_CONFIG_LICENCIAS",
    details: { appMode: next.appMode, licensingEnabled: next.licensingEnabled, globalLockEnabled: next.globalLockEnabled },
  });

  return Response.json({ ok: true, config: next }, { headers: { "cache-control": "no-store" } });
}

