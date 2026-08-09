import type { ChangelogEntry, ContentPage } from "@/types/content";

export type AdminContentData = {
  site?: Record<string, unknown>;
  download?: Record<string, unknown>;
  changelog?: ChangelogEntry[];
  pages?: ContentPage[];
};

const adminContentKey = "modo-crisis:admin:content";

function getAdminContentKvConfig() {
  const accountId = process.env.ADMIN_CONTENT_KV_ACCOUNT_ID || process.env.COUNTERS_KV_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.ADMIN_CONTENT_KV_NAMESPACE_ID || process.env.COUNTERS_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = process.env.ADMIN_CONTENT_KV_API_TOKEN || process.env.COUNTERS_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !namespaceId || !apiToken) return null;
  return { accountId, namespaceId, apiToken };
}

function adminContentTarget() {
  const config = getAdminContentKvConfig();
  if (!config) return null;

  const key = encodeURIComponent(adminContentKey);
  return {
    url: `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${key}`,
    token: config.apiToken,
  };
}

export function isAdminContentStorageConfigured() {
  return Boolean(getAdminContentKvConfig());
}

export async function readAdminContent(): Promise<AdminContentData | null> {
  const target = adminContentTarget();
  if (!target) return null;

  const response = await fetch(target.url, {
    headers: { authorization: `Bearer ${target.token}` },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo leer el contenido guardado en Cloudflare KV.");

  return JSON.parse(await response.text()) as AdminContentData;
}

export async function writeAdminContent(data: AdminContentData) {
  const target = adminContentTarget();
  if (!target) {
    throw new Error(
      "Cloudflare KV no esta configurado. Anade ADMIN_CONTENT_KV_ACCOUNT_ID, ADMIN_CONTENT_KV_NAMESPACE_ID y ADMIN_CONTENT_KV_API_TOKEN, o usa las variables de contadores CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID y CLOUDFLARE_API_TOKEN.",
    );
  }

  const response = await fetch(target.url, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${target.token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`No se pudo guardar en Cloudflare KV. ${details}`.trim());
  }
}
