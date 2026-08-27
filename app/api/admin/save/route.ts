import { requireAdminToken } from "../_utils";
import { officialApkUrl } from "@/content/site-config";
import { writeAdminContent } from "@/lib/admin-content";
import { readMcsConfig, writeMcsConfig } from "@/lib/mcs-app-kv";
import { forbiddenOriginResponse, hasValidBrowserOrigin } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const maxBodyChars = 1_200_000;

async function syncDownloadConfig(data: Record<string, unknown>) {
  const download = data.download as Record<string, unknown> | undefined;
  if (!download) return;

  const current = await readMcsConfig().catch(() => null);
  if (!current) return;

  const force = download.force === true;
  const updateEnabled = download.enabled !== false;
  const latestBuild = Number.parseInt(String(download.latestBuild || current.latestVersionCode || "0").replace(/\D/g, ""), 10);

  await writeMcsConfig({
    ...current,
    latestVersion: String(download.latestVersion || download.version || current.latestVersion || "1.0.0"),
    minimumSupportedVersion: String(download.minimumSupportedVersion || current.minimumSupportedVersion || "1.0.0"),
    latestVersionCode: Number.isFinite(latestBuild) ? latestBuild : current.latestVersionCode,
    updateEnabled,
    enabled: updateEnabled,
    force,
    forceUpdate: force,
    mandatory: force,
    title: String(download.updateTitle || current.title || "Actualizacion disponible"),
    message: String(download.updateMessage || current.message || "Hay una nueva version disponible."),
    downloadUrl: officialApkUrl,
    releaseNotesUrl: String(download.releaseNotesUrl || current.releaseNotesUrl || "/actualizaciones"),
    configurationVersion: Number(current.configurationVersion || 0) + 1,
  });
}

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const text = await request.text();
  if (text.length > maxBodyChars) {
    return Response.json({ ok: false, message: "El contenido es demasiado grande." }, { status: 413 });
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, message: "JSON invalido." }, { status: 400 });
  }

  try {
    await writeAdminContent(data);
    await syncDownloadConfig(data);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo guardar en Cloudflare KV.",
      },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    message: "Cambios guardados en Cloudflare KV. La web usara estos datos cuando la pagina lea contenido dinamico.",
  });
}
