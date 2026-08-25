export type BugReport = {
  id: string;
  source: string;
  message: string;
  createdAt: string;
  userAgent?: string;
};

const bugReportsKey = "modo-crisis:bug-reports";
const maxReports = 100;

function getReportsKvConfig() {
  const accountId = process.env.REPORTS_KV_ACCOUNT_ID || process.env.ADMIN_CONTENT_KV_ACCOUNT_ID || process.env.COUNTERS_KV_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.REPORTS_KV_NAMESPACE_ID || process.env.ADMIN_CONTENT_KV_NAMESPACE_ID || process.env.COUNTERS_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = process.env.REPORTS_KV_API_TOKEN || process.env.ADMIN_CONTENT_KV_API_TOKEN || process.env.COUNTERS_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !namespaceId || !apiToken) return null;
  return { accountId, namespaceId, apiToken };
}

function reportsTarget() {
  const config = getReportsKvConfig();
  if (!config) return null;
  const key = encodeURIComponent(bugReportsKey);
  return {
    url: `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${key}`,
    token: config.apiToken,
  };
}

export function isBugReportStorageConfigured() {
  return Boolean(getReportsKvConfig());
}

function normalizeReports(value: unknown): BugReport[] {
  return Array.isArray(value)
    ? value.filter((item): item is BugReport => Boolean(item && typeof item === "object" && "id" in item && "message" in item))
    : [];
}

export async function readBugReports() {
  const target = reportsTarget();
  if (!target) return [];

  const response = await fetch(target.url, {
    headers: { authorization: `Bearer ${target.token}` },
    cache: "no-store",
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error("No se pudieron leer los reportes de fallos en Cloudflare KV.");

  const text = await response.text();
  if (!text.trim()) return [];
  return normalizeReports(JSON.parse(text));
}

export async function writeBugReports(reports: BugReport[]) {
  const target = reportsTarget();
  if (!target) throw new Error("Cloudflare KV no esta configurado para guardar reportes de fallos.");

  const response = await fetch(target.url, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${target.token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(reports.slice(0, maxReports)),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`No se pudo guardar el reporte en Cloudflare KV. ${details}`.trim());
  }
}

export async function addBugReport(input: { source: string; message: string; userAgent?: string }) {
  const source = input.source.trim().slice(0, 120) || "Web";
  const message = input.message.trim().slice(0, 4000);

  if (message.length < 8) throw new Error("El reporte es demasiado corto.");

  const report: BugReport = {
    id: `${Date.now()}-${crypto.randomUUID()}`,
    source,
    message,
    createdAt: new Date().toISOString(),
    userAgent: input.userAgent?.slice(0, 220),
  };

  const current = await readBugReports();
  await writeBugReports([report, ...current]);
  return report;
}

export async function deleteBugReport(id: string) {
  const reportId = id.trim();
  if (!reportId) throw new Error("ID de reporte no válido.");

  const current = await readBugReports();
  const next = current.filter((report) => report.id !== reportId);
  await writeBugReports(next);
  return { deleted: next.length !== current.length, reports: next };
}
