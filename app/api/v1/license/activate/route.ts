import { activateLicense } from "@/lib/licensing-core";
import { D1LicensingStore, readAppConfig } from "@/lib/licensing-d1";
import { defaultAppConfig } from "@/lib/licensing-core";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const maxBodyChars = 4000;

export async function POST(request: Request) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();
  if (await isRateLimited({ key: rateLimitKey(request, "license-activate", 60), limit: 20, windowSeconds: 60 })) {
    return rateLimitResponse("Demasiados intentos de activacion. Espera un minuto.");
  }

  const text = await request.text();
  if (text.length > maxBodyChars) {
    return Response.json({ ok: false, message: "Solicitud demasiado grande." }, { status: 413 });
  }

  let body: {
    licenseCode?: string;
    installationId?: string;
    appVersion?: string;
    deviceLabel?: string;
  };
  try {
    body = JSON.parse(text || "{}") as typeof body;
  } catch {
    return Response.json({ ok: false, message: "JSON no valido." }, { status: 400 });
  }

  const config = await readAppConfig().catch(() => defaultAppConfig);
  if (!config.licensingEnabled && config.appMode === "FREE") {
    return Response.json(
      { ok: true, mode: "FREE", message: "La aplicacion esta actualmente en modo gratuito. No hace falta licencia." },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const result = await activateLicense(new D1LicensingStore(), {
    licenseCode: body.licenseCode || "",
    installationId: body.installationId || "",
    appVersion: body.appVersion || null,
    deviceLabel: body.deviceLabel || null,
    privateJwk: process.env.LICENSE_PRIVATE_KEY_JWK,
  });

  if (!result.ok) {
    return Response.json({ ok: false, reason: result.reason, message: result.message }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  return Response.json(
    {
      ok: true,
      certificate: result.certificate,
      license: {
        id: result.license.id,
        type: result.license.licenseType,
        expiresAt: result.license.expiresAt,
        maxDevices: result.license.maxDevices,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
