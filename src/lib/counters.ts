export type CounterName = "visits" | "downloads" | "donations";

export type CounterBreakdown = {
  today: number;
  week: number;
  month: number;
  total: number;
};

export type SiteStats = {
  configured: boolean;
  visits: CounterBreakdown;
  downloads: CounterBreakdown;
  donations: CounterBreakdown;
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

function missingKvConfigMessage() {
  const missing = [
    process.env.COUNTERS_KV_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID ? "" : "COUNTERS_KV_ACCOUNT_ID",
    process.env.COUNTERS_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID ? "" : "COUNTERS_KV_NAMESPACE_ID",
    process.env.COUNTERS_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN ? "" : "COUNTERS_KV_API_TOKEN",
  ].filter(Boolean);

  return missing.length
    ? `Faltan variables para contadores reales: ${missing.join(", ")}.`
    : "Configura Cloudflare KV para activar contadores reales.";
}

function valueTarget(keyName: string) {
  const config = getKvConfig();
  if (!config) return null;

  const key = encodeURIComponent(keyName);
  return {
    url: `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${key}`,
    token: config.apiToken,
  };
}

function getMadridDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value || "0");
  const month = Number(parts.find((part) => part.type === "month")?.value || "0");
  const day = Number(parts.find((part) => part.type === "day")?.value || "0");
  return { year, month, day };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getIsoWeek(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const weekYear = date.getUTCFullYear();
  const firstDay = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil(((date.getTime() - firstDay.getTime()) / 86400000 + 1) / 7);
  return `${weekYear}-W${pad(week)}`;
}

function currentPeriodKeys(name: CounterName) {
  const { year, month, day } = getMadridDateParts();
  const base = counterKeys[name];
  return {
    total: base,
    today: `${base}:day:${year}-${pad(month)}-${pad(day)}`,
    week: `${base}:week:${getIsoWeek(year, month, day)}`,
    month: `${base}:month:${year}-${pad(month)}`,
  };
}

async function readCounterKey(key: string, label: string) {
  const target = valueTarget(key);
  if (!target) return 0;

  const response = await fetch(target.url, {
    headers: { authorization: `Bearer ${target.token}` },
    cache: "no-store",
  });

  if (response.status === 404) return 0;
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`No se pudo leer el contador ${label}. Cloudflare respondio ${response.status}. ${details}`.trim());
  }

  const value = Number.parseInt((await response.text()).trim(), 10);
  return Number.isFinite(value) ? value : 0;
}

async function writeCounterKey(key: string, label: string, value: number) {
  const target = valueTarget(key);
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

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`No se pudo guardar el contador ${label}. Cloudflare respondio ${response.status}. ${details}`.trim());
  }
}

async function readCounterBreakdown(name: CounterName): Promise<CounterBreakdown> {
  const keys = currentPeriodKeys(name);
  const [today, week, month, total] = await Promise.all([
    readCounterKey(keys.today, `${name} de hoy`),
    readCounterKey(keys.week, `${name} de esta semana`),
    readCounterKey(keys.month, `${name} de este mes`),
    readCounterKey(keys.total, `${name} total`),
  ]);

  return { today, week, month, total };
}

async function incrementCounterKey(key: string, label: string) {
  const current = await readCounterKey(key, label);
  const next = current + 1;
  await writeCounterKey(key, label, next);
  return next;
}

const emptyBreakdown: CounterBreakdown = {
  today: 0,
  week: 0,
  month: 0,
  total: 0,
};

export async function readSiteStats(): Promise<SiteStats> {
  if (!getKvConfig()) {
    return {
      configured: false,
      visits: emptyBreakdown,
      downloads: emptyBreakdown,
      donations: emptyBreakdown,
      message: missingKvConfigMessage(),
    };
  }

  const [visits, downloads, donations] = await Promise.all([
    readCounterBreakdown("visits"),
    readCounterBreakdown("downloads"),
    readCounterBreakdown("donations"),
  ]);

  return { configured: true, visits, downloads, donations };
}

export async function incrementCounter(name: CounterName) {
  if (!getKvConfig()) return null;

  const keys = currentPeriodKeys(name);
  const [today] = await Promise.all([
    incrementCounterKey(keys.today, `${name} de hoy`),
    incrementCounterKey(keys.week, `${name} de esta semana`),
    incrementCounterKey(keys.month, `${name} de este mes`),
    incrementCounterKey(keys.total, `${name} total`),
  ]);
  return today;
}
