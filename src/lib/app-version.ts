import { officialApkUrl, siteConfig } from "@/content/site-config";
import { readAdminContent } from "@/lib/admin-content";

function cleanVersion(version: unknown) {
  const value = String(version || "1.0.0").trim();
  return value.replace(/^v\s*/i, "") || "1.0.0";
}

function cleanBuild(build: unknown) {
  const value = Number.parseInt(String(build || "0").replace(/\D/g, ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function absoluteUrl(pathOrUrl: unknown, fallback: string) {
  const value = String(pathOrUrl || "").trim();
  if (/^https?:\/\//i.test(value)) return value;

  const configuredBase = String(siteConfig.siteUrl || "").replace(/\/$/, "");
  const base =
    configuredBase && !/dominio-pendiente|example/i.test(configuredBase)
      ? configuredBase
      : "https://modocrisissurvival.com";
  if (!value) return `${base}${fallback}`;
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function buildAppVersionPayload() {
  let site = siteConfig as Record<string, unknown>;
  let download: Record<string, unknown> = {};

  try {
    const saved = await readAdminContent();
    if (saved?.site) site = { ...site, ...saved.site };
    if (saved?.download) download = saved.download;
  } catch {
    // If KV is not configured or temporarily fails, the app still gets the bundled defaults.
  }

  const version = cleanVersion(
    download.latestVersion || download.currentVersion || download.version || site.currentVersion || siteConfig.currentVersion,
  );
  const latestBuild = cleanBuild(download.latestBuild || download.versionCode || site.latestBuild);
  const downloadUrl = officialApkUrl;
  const force = download.force === true;
  const enabled = download.enabled !== false;

  return {
    enabled,
    updateEnabled: enabled,
    latestVersion: version,
    latestVersionLabel: String(
      download.latestVersionLabel || download.currentVersion || download.version || site.currentVersion || `V ${version}`,
    ),
    latestBuild,
    minimumSupportedVersion: cleanVersion(download.minimumSupportedVersion || "1.0.0"),
    force,
    forceUpdate: force,
    mandatory: force,
    title: String(download.updateTitle || "Actualizacion disponible"),
    message: String(
      download.updateMessage ||
        "Hay una nueva version de Modo Crisis Survival disponible. Descargala desde la web oficial para mantener la app actualizada.",
    ),
    downloadUrl,
    releaseNotesUrl: absoluteUrl(download.releaseNotesUrl || "/actualizaciones", "/actualizaciones"),
    apkUrl: officialApkUrl,
    apkSize: String(download.apkSize || site.apkSize || siteConfig.apkSize),
    publishedAt: String(download.lastUpdated || site.lastUpdated || siteConfig.lastUpdated),
  };
}
