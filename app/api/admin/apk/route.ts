import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { apkPath, readAdminData, requireAdminToken, writeAdminData } from "../_utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export async function POST(request: Request) {
  const tokenError = requireAdminToken(request);
  if (tokenError) return tokenError;

  const formData = await request.formData();
  const file = formData.get("apk");
  const version = String(formData.get("version") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!(file instanceof File)) {
    return Response.json({ ok: false, message: "No se ha recibido ningún APK." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".apk")) {
    return Response.json({ ok: false, message: "El archivo debe tener extensión .apk." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(path.dirname(apkPath), { recursive: true });
  await fs.writeFile(apkPath, bytes);

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const size = formatBytes(bytes.length);
  const data = await readAdminData();

  data.site = {
    ...(data.site || {}),
    currentVersion: version || data.site?.currentVersion || "Añadir versión actual",
    apkSize: size,
    apkSha256: sha256,
    lastUpdated: date || new Date().toISOString().slice(0, 10),
    apkUrl: "/downloads/modo-crisis-survival.apk",
  };

  data.download = {
    ...(data.download || {}),
    version: data.site.currentVersion,
    size,
    sha256,
    date: data.site.lastUpdated,
    apkUrl: "/downloads/modo-crisis-survival.apk",
  };

  await writeAdminData(data);

  return Response.json({
    ok: true,
    message: "APK guardado y metadatos actualizados.",
    apkUrl: "/downloads/modo-crisis-survival.apk",
    size,
    sha256,
    version: data.site.currentVersion,
    date: data.site.lastUpdated,
  });
}

