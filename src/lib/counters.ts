export type CounterName = "visits" | "downloads" | "donations";

export type SiteStats = {
  configured: boolean;
  visits: number;
  downloads: number;
  donations: number;
  message?: string;
};

const counterKeys: Record<CounterName, string> = {
  visits: "modo-crisis:stats:visits",
  downloads: "modo-crisis:stats:downloads",
  donations: "modo-crisis:stats:donations",
};

function getKvConfig() {
  const accountId = process.env.COUNTERS_KV_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.COUNTERS_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = process.env.COUNTERS_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !namespaceId || !apiToken) return null;
  return { accountId, namespaceId, apiToken };
}

function valueTarget(name: CounterName) {
  const config = getKvConfig();
  if (!config) return null;

  const key = encodeURIComponent(counterKeys[name]);
  return {
    url: `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${key}`,
    token: config.apiToken,
  };
}

async function readCounter(name: CounterName) {
  const target = valueTarget(name);
  if (!target) return 0;

  const response = await fetch(target.url, {
    headers: { authorization: `Bearer ${target.token}` },
    cache: "no-store",
  });

  if (response.status === 404) return 0;
  if (!response.ok) throw new Error(`No se pudo leer el contador ${name}`);

  const value = Number.parseInt((await response.text()).trim(), 10);
  return Number.isFinite(value) ? value : 0;
}

async function writeCounter(name: CounterName, value: number) {
  const target = valueTarget(name);
  if (!target) return;

  const response = await fetch(target.url, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${target.token}`,
      "content-type": "text/plain; charset=utf-8",
    },
    body: String(Math.max(0, Math.floor(value))),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`No se pudo guardar el contador ${name}`);
}

export async function readSiteStats(): Promise<SiteStats> {
  if (!getKvConfig()) {
    return {
      configured: false,
      visits: 0,
      downloads: 0,
      donations: 0,
      message: "Configura Cloudflare KV para activar contadores reales.",
    };
  }

  const [visits, downloads, donations] = await Promise.all([
    readCounter("visits"),
    readCounter("downloads"),
    readCounter("donations"),
  ]);

  return { configured: true, visits, downloads, donations };
}

export async function incrementCounter(name: CounterName) {
  if (!getKvConfig()) return null;

  const current = await readCounter(name);
  const next = current + 1;
  await writeCounter(name, next);
  return next;
}
