import { readAppConfig } from "@/lib/licensing-d1";
import { buildAppVersionPayload } from "@/lib/app-version";
import { officialApkUrl } from "@/content/site-config";
import { booleanFromPayload, readMcsConfig, type McsAppConfig } from "@/lib/mcs-app-kv";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function optionalBoolean(value: unknown) {
  if (value === undefined || value === null) return undefined;
  return booleanFromPayload(value);
}

function optionalText(value: unknown) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

function updateValue(config: McsAppConfig | null, key: keyof McsAppConfig, fallback: unknown) {
  return optionalText(config?.[key]) ?? fallback;
}

export async function GET() {
  const [config, mcsConfig, update] = await Promise.all([
    readAppConfig().catch(() => null),
    readMcsConfig().catch(() => null),
    buildAppVersionPayload(),
  ]);
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
  const updateEnabled = optionalBoolean(mcsConfig?.updateEnabled ?? mcsConfig?.enabled) ?? update.updateEnabled;
  const force = optionalBoolean(mcsConfig?.force ?? mcsConfig?.forceUpdate ?? mcsConfig?.mandatory) ?? update.force;
  const latestVersion = updateValue(mcsConfig, "latestVersion", update.latestVersion);
  const minimumSupportedVersion = updateValue(mcsConfig, "minimumSupportedVersion", update.minimumSupportedVersion);

  return Response.json(
    {
      schemaVersion: 1,
      appMode: mcsConfig?.appMode || safeConfig.appMode,
      licensingEnabled: mcsConfig?.licensingEnabled ?? safeConfig.licensingEnabled,
      globalLockEnabled: mcsConfig?.globalLockEnabled ?? safeConfig.globalLockEnabled,
      minimumSupportedVersion,
      latestVersion,
      updateEnabled,
      force,
      forceUpdate: force,
      mandatory: force,
      title: updateValue(mcsConfig, "title", update.title),
      message: updateValue(mcsConfig, "message", update.message),
      downloadUrl: officialApkUrl,
      releaseNotesUrl: updateValue(mcsConfig, "releaseNotesUrl", update.releaseNotesUrl),
      latestBuild: mcsConfig?.latestVersionCode ?? update.latestBuild,
      latestVersionLabel: update.latestVersionLabel,
      apkUrl: officialApkUrl,
      apkSize: update.apkSize,
      licensingMinimumSupportedVersion: safeConfig.minimumSupportedVersion,
      licensingLatestVersion: safeConfig.latestVersion,
      licenseMessage: mcsConfig?.licenseMessage,
      gracePeriodEndsAt: mcsConfig?.gracePeriodEndsAt,
      globalLockTitle: mcsConfig?.globalLockTitle,
      globalLockMessage: mcsConfig?.globalLockMessage,
      purchaseUrl: mcsConfig?.purchaseUrl || safeConfig.purchaseUrl,
      supportUrl: mcsConfig?.supportUrl || safeConfig.supportUrl,
      configurationVersion: mcsConfig?.configurationVersion || safeConfig.configurationVersion,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
