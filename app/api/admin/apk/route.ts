import { requireAdminToken } from "../_utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(file: File) {
  return toHex(await crypto.subtle.digest("SHA-256", await file.arrayBuffer()));
}

export async function POST(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;

  const formData = await request.formData();
  const file = formData.get("apk");

  if (!(file instanceof File)) {
    return Response.json({ ok: false, message: "No se ha recibido ningun APK." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".apk")) {
    return Response.json({ ok: false, message: "El archivo debe tener extension .apk." }, { status: 400 });
  }

  return Response.json(
    {
      ok: false,
      message:
        "Cloudflare Pages no puede guardar el APK desde el panel sin almacenamiento externo. Sube el APK a public/downloads en el proyecto y vuelve a publicar, o configura Cloudflare R2 para subidas desde el admin.",
      fileName: file.name,
      size: formatBytes(file.size),
      sha256: await sha256(file),
    },
    { status: 501 },
  );
}
