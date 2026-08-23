import { readAppConfig } from "@/lib/licensing-d1";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await readAppConfig().catch(() => null);
  const safeConfig = config || {
    licensingEnabled: false,
    globalLockEnabled: false,
    appMode: "FREE",
    minimumSupportedVersion: 1,
    latestVersion: 1,
    purchaseUrl: "https://modo-crisis-survival.pages.dev/donaciones",
    supportUrl: "https://modo-crisis-survival.pages.dev/contacto",
    configurationVersion: 1,
  };

  return Response.json(
    {
      schemaVersion: 1,
      appMode: safeConfig.appMode,
      licensingEnabled: safeConfig.licensingEnabled,
      globalLockEnabled: safeConfig.globalLockEnabled,
      minimumSupportedVersion: safeConfig.minimumSupportedVersion,
      latestVersion: safeConfig.latestVersion,
      purchaseUrl: safeConfig.purchaseUrl,
      supportUrl: safeConfig.supportUrl,
      configurationVersion: safeConfig.configurationVersion,
    },
    { headers: { "cache-control": "no-store" } },
  );
}

