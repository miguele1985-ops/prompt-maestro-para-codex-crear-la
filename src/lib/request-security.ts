type RateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function currentWindow(windowSeconds: number) {
  return Math.floor(Date.now() / 1000 / windowSeconds);
}

export function rateLimitKey(request: Request, scope: string, windowSeconds: number) {
  return `modo-crisis:rate:${scope}:${clientIp(request)}:${currentWindow(windowSeconds)}`;
}

function getKvConfig() {
  const accountId = process.env.RATE_LIMIT_KV_ACCOUNT_ID || process.env.COUNTERS_KV_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.RATE_LIMIT_KV_NAMESPACE_ID || process.env.COUNTERS_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = process.env.RATE_LIMIT_KV_API_TOKEN || process.env.COUNTERS_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !namespaceId || !apiToken) return null;
  return { accountId, namespaceId, apiToken };
}

function kvValueTarget(keyName: string) {
  const config = getKvConfig();
  if (!config) return null;
  return {
    url: `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${encodeURIComponent(keyName)}`,
    token: config.apiToken,
  };
}

async function readKvNumber(key: string) {
  const target = kvValueTarget(key);
  if (!target) return null;
  const response = await fetch(target.url, {
    headers: { authorization: `Bearer ${target.token}` },
    cache: "no-store",
  });
  if (response.status === 404) return 0;
  if (!response.ok) return null;
  const value = Number.parseInt((await response.text()).trim(), 10);
  return Number.isFinite(value) ? value : 0;
}

async function writeKvNumber(key: string, value: number, expirationTtl: number) {
  const target = kvValueTarget(key);
  if (!target) return false;
  const separator = target.url.includes("?") ? "&" : "?";
  const response = await fetch(`${target.url}${separator}expiration_ttl=${expirationTtl}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${target.token}`,
      "content-type": "text/plain; charset=utf-8",
    },
    body: String(value),
    cache: "no-store",
  });
  return response.ok;
}

function memoryRateLimit(options: RateLimitOptions) {
  const now = Date.now();
  const resetAt = now + options.windowSeconds * 1000;
  const current = memoryBuckets.get(options.key);
  if (!current || current.resetAt < now) {
    memoryBuckets.set(options.key, { count: 1, resetAt });
    return false;
  }
  current.count += 1;
  memoryBuckets.set(options.key, current);
  return current.count > options.limit;
}

export async function isRateLimited(options: RateLimitOptions) {
  const current = await readKvNumber(options.key);
  if (current === null) return memoryRateLimit(options);
  if (current >= options.limit) return true;
  const written = await writeKvNumber(options.key, current + 1, options.windowSeconds + 60);
  return written ? false : memoryRateLimit(options);
}

export function rateLimitResponse(message = "Demasiadas peticiones. Intentalo de nuevo mas tarde.") {
  return Response.json({ ok: false, message }, { status: 429, headers: { "cache-control": "no-store" } });
}

export function forbiddenOriginResponse() {
  return Response.json(
    { ok: false, message: "Peticion rechazada por seguridad." },
    { status: 403, headers: { "cache-control": "no-store" } },
  );
}

export function hasValidBrowserOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
