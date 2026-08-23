import {
  AppConfig,
  LicenseDeviceRecord,
  LicenseRecord,
  LicensingStore,
  RemoteMessage,
  defaultAppConfig,
  generateLicenseCode,
  hashLicenseCode,
  licenseLast4,
  normalizeLicenseCode,
  randomId,
  validateHttpsUrl,
  type AppMode,
  type LicenseStatus,
  type LicenseType,
  type MessageType,
} from "@/lib/licensing-core";

type D1Result<T> = {
  success: boolean;
  result?: Array<{ results?: T[]; meta?: { changed_db?: boolean; changes?: number } }>;
  errors?: Array<{ message: string }>;
};

type D1Config = {
  accountId: string;
  databaseId: string;
  apiToken: string;
};

export function getD1Config(): D1Config | null {
  const accountId = process.env.LICENSES_D1_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.LICENSES_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.LICENSES_D1_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !databaseId || !apiToken) return null;
  return { accountId, databaseId, apiToken };
}

function d1Url(config: D1Config) {
  return `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;
}

export async function queryD1<T = Record<string, unknown>>(sql: string, params: unknown[] = []) {
  const config = getD1Config();
  if (!config) throw new Error("D1 no esta configurado. Faltan LICENSES_D1_ACCOUNT_ID, LICENSES_D1_DATABASE_ID o LICENSES_D1_API_TOKEN.");

  const response = await fetch(d1Url(config), {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as D1Result<T> | null;
  if (!response.ok || !payload?.success) {
    const details = payload?.errors?.map((error) => error.message).join("; ") || `HTTP ${response.status}`;
    throw new Error(`Error D1: ${details}`);
  }

  return payload.result?.[0] || { results: [], meta: {} };
}

function bool(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function toAppConfig(row: Record<string, unknown>): AppConfig {
  return {
    licensingEnabled: bool(row.licensing_enabled),
    globalLockEnabled: bool(row.global_lock_enabled),
    appMode: (row.app_mode as AppMode) || "FREE",
    gracePeriodEnabled: bool(row.grace_period_enabled),
    gracePeriodEnd: (row.grace_period_end as string | null) || null,
    minimumSupportedVersion: Number(row.minimum_supported_version || 1),
    latestVersion: Number(row.latest_version || 1),
    purchaseUrl: (row.purchase_url as string) || defaultAppConfig.purchaseUrl,
    supportUrl: (row.support_url as string) || defaultAppConfig.supportUrl,
    configurationVersion: Number(row.configuration_version || 1),
    updatedAt: (row.updated_at as string) || new Date(0).toISOString(),
  };
}

function toLicense(row: Record<string, unknown>): LicenseRecord {
  return {
    id: String(row.id),
    codeHash: String(row.code_hash),
    codeLast4: String(row.code_last4),
    status: row.status as LicenseStatus,
    maxDevices: Number(row.max_devices || 2),
    licenseType: row.license_type as LicenseType,
    createdAt: String(row.created_at),
    activatedAt: (row.activated_at as string | null) || null,
    expiresAt: (row.expires_at as string | null) || null,
    paymentReference: (row.payment_reference as string | null) || null,
    customerReference: (row.customer_reference as string | null) || null,
    notes: (row.notes as string | null) || null,
    createdBy: (row.created_by as string | null) || null,
    revokedAt: (row.revoked_at as string | null) || null,
  };
}

function toDevice(row: Record<string, unknown>): LicenseDeviceRecord {
  return {
    id: String(row.id),
    licenseId: String(row.license_id),
    installationIdHash: String(row.installation_id_hash),
    deviceLabel: (row.device_label as string | null) || null,
    appVersion: (row.app_version as string | null) || null,
    firstActivatedAt: String(row.first_activated_at),
    lastSeenAt: String(row.last_seen_at),
    active: bool(row.active),
    releasedAt: (row.released_at as string | null) || null,
  };
}

function toMessage(row: Record<string, unknown>): RemoteMessage {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    buttonText: (row.button_text as string | null) || null,
    buttonUrl: (row.button_url as string | null) || null,
    type: row.type as MessageType,
    dismissible: bool(row.dismissible),
    blocking: bool(row.blocking),
    enabled: bool(row.enabled),
    startsAt: String(row.starts_at),
    endsAt: (row.ends_at as string | null) || null,
    minimumVersion: row.minimum_version === null || row.minimum_version === undefined ? null : Number(row.minimum_version),
    maximumVersion: row.maximum_version === null || row.maximum_version === undefined ? null : Number(row.maximum_version),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function readAppConfig(): Promise<AppConfig> {
  if (!getD1Config()) return defaultAppConfig;
  const result = await queryD1<Record<string, unknown>>("SELECT * FROM app_config WHERE id = 1 LIMIT 1");
  return result.results?.[0] ? toAppConfig(result.results[0]) : defaultAppConfig;
}

export async function updateAppConfig(input: Partial<AppConfig>) {
  const purchaseUrl = validateHttpsUrl(input.purchaseUrl);
  const supportUrl = validateHttpsUrl(input.supportUrl);
  const appMode = input.appMode;
  await queryD1(
    `UPDATE app_config
     SET licensing_enabled = ?,
         global_lock_enabled = ?,
         app_mode = ?,
         grace_period_enabled = ?,
         grace_period_end = ?,
         minimum_supported_version = ?,
         latest_version = ?,
         purchase_url = COALESCE(?, purchase_url),
         support_url = COALESCE(?, support_url),
         configuration_version = configuration_version + 1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = 1`,
    [
      input.licensingEnabled ? 1 : 0,
      input.globalLockEnabled ? 1 : 0,
      appMode || "FREE",
      input.gracePeriodEnabled ? 1 : 0,
      input.gracePeriodEnd || null,
      Number(input.minimumSupportedVersion || 1),
      Number(input.latestVersion || 1),
      purchaseUrl,
      supportUrl,
    ],
  );
  return readAppConfig();
}

export class D1LicensingStore implements LicensingStore {
  async getLicenseByHash(codeHash: string) {
    const result = await queryD1<Record<string, unknown>>("SELECT * FROM licenses WHERE code_hash = ? LIMIT 1", [codeHash]);
    return result.results?.[0] ? toLicense(result.results[0]) : null;
  }

  async getActiveDevice(licenseId: string, installationIdHash: string) {
    const result = await queryD1<Record<string, unknown>>(
      "SELECT * FROM license_devices WHERE license_id = ? AND installation_id_hash = ? AND active = 1 LIMIT 1",
      [licenseId, installationIdHash],
    );
    return result.results?.[0] ? toDevice(result.results[0]) : null;
  }

  async countActiveDevices(licenseId: string) {
    const result = await queryD1<{ count: number }>("SELECT COUNT(*) as count FROM license_devices WHERE license_id = ? AND active = 1", [licenseId]);
    return Number(result.results?.[0]?.count || 0);
  }

  async createDevice(input: { id: string; licenseId: string; installationIdHash: string; deviceLabel?: string | null; appVersion?: string | null }) {
    const released = await queryD1<Record<string, unknown>>(
      "SELECT * FROM license_devices WHERE license_id = ? AND installation_id_hash = ? AND active = 0 LIMIT 1",
      [input.licenseId, input.installationIdHash],
    );
    if (released.results?.[0]) {
      const activeDevices = await this.countActiveDevices(input.licenseId);
      const license = await queryD1<{ max_devices: number }>("SELECT max_devices FROM licenses WHERE id = ? LIMIT 1", [input.licenseId]);
      if (activeDevices >= Number(license.results?.[0]?.max_devices || 2)) throw new Error("DEVICE_LIMIT");
      const releasedId = String(released.results[0].id);
      await queryD1(
        "UPDATE license_devices SET active = 1, released_at = NULL, last_seen_at = CURRENT_TIMESTAMP, device_label = COALESCE(?, device_label), app_version = COALESCE(?, app_version) WHERE id = ?",
        [input.deviceLabel || null, input.appVersion || null, releasedId],
      );
      const restored = await queryD1<Record<string, unknown>>("SELECT * FROM license_devices WHERE id = ? LIMIT 1", [releasedId]);
      if (!restored.results?.[0]) throw new Error("Dispositivo no encontrado.");
      return toDevice(restored.results[0]);
    }

    await queryD1(
      `INSERT INTO license_devices (id, license_id, installation_id_hash, device_label, app_version)
       SELECT ?, ?, ?, ?, ?
       WHERE (
         SELECT COUNT(*) FROM license_devices WHERE license_id = ? AND active = 1
       ) < (
         SELECT max_devices FROM licenses WHERE id = ?
       )`,
      [input.id, input.licenseId, input.installationIdHash, input.deviceLabel || null, input.appVersion || null, input.licenseId, input.licenseId],
    );

    const result = await queryD1<Record<string, unknown>>("SELECT * FROM license_devices WHERE id = ? LIMIT 1", [input.id]);
    if (!result.results?.[0]) throw new Error("DEVICE_LIMIT");
    return toDevice(result.results[0]);
  }

  async touchDevice(deviceId: string, appVersion?: string | null) {
    await queryD1("UPDATE license_devices SET last_seen_at = CURRENT_TIMESTAMP, app_version = COALESCE(?, app_version) WHERE id = ?", [
      appVersion || null,
      deviceId,
    ]);
    const result = await queryD1<Record<string, unknown>>("SELECT * FROM license_devices WHERE id = ? LIMIT 1", [deviceId]);
    if (!result.results?.[0]) throw new Error("Dispositivo no encontrado.");
    return toDevice(result.results[0]);
  }

  async markLicenseActivated(licenseId: string) {
    await queryD1("UPDATE licenses SET activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP) WHERE id = ?", [licenseId]);
  }
}

export async function createLicenses(input: {
  count?: number;
  maxDevices?: number;
  licenseType?: LicenseType;
  expiresAt?: string | null;
  paymentReference?: string | null;
  customerReference?: string | null;
  notes?: string | null;
  createdBy?: string | null;
}) {
  const count = Math.max(1, Math.min(200, Math.floor(input.count || 1)));
  const created: Array<{ id: string; code: string; codeLast4: string }> = [];

  for (let index = 0; index < count; index += 1) {
    const code = generateLicenseCode();
    const normalized = normalizeLicenseCode(code);
    const id = randomId("lic");
    await queryD1(
      `INSERT INTO licenses (id, code_hash, code_last4, max_devices, license_type, expires_at, payment_reference, customer_reference, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        await hashLicenseCode(code),
        licenseLast4(normalized),
        Math.max(1, Math.min(20, Math.floor(input.maxDevices || 2))),
        input.licenseType || "PERMANENT",
        input.expiresAt || null,
        input.paymentReference || null,
        input.customerReference || null,
        input.notes || null,
        input.createdBy || null,
      ],
    );
    created.push({ id, code, codeLast4: licenseLast4(normalized) });
  }

  return created;
}

export async function listLicenses(status?: LicenseStatus | "ALL") {
  const result = status && status !== "ALL"
    ? await queryD1<Record<string, unknown>>("SELECT * FROM licenses WHERE status = ? ORDER BY created_at DESC LIMIT 200", [status])
    : await queryD1<Record<string, unknown>>("SELECT * FROM licenses ORDER BY created_at DESC LIMIT 200");
  return (result.results || []).map(toLicense);
}

export async function updateLicense(id: string, input: { status?: LicenseStatus; maxDevices?: number; notes?: string | null }) {
  await queryD1(
    `UPDATE licenses
     SET status = COALESCE(?, status),
         max_devices = COALESCE(?, max_devices),
         notes = COALESCE(?, notes),
         revoked_at = CASE WHEN ? = 'REVOKED' THEN CURRENT_TIMESTAMP ELSE revoked_at END
     WHERE id = ?`,
    [input.status || null, input.maxDevices || null, input.notes || null, input.status || null, id],
  );
}

export async function listLicenseDevices(licenseId: string) {
  const result = await queryD1<Record<string, unknown>>("SELECT * FROM license_devices WHERE license_id = ? ORDER BY first_activated_at DESC", [licenseId]);
  return (result.results || []).map(toDevice);
}

export async function releaseDevice(deviceId: string) {
  await queryD1("UPDATE license_devices SET active = 0, released_at = CURRENT_TIMESTAMP WHERE id = ?", [deviceId]);
}

export async function readActiveMessages(appVersion?: number) {
  const now = new Date().toISOString();
  const result = await queryD1<Record<string, unknown>>(
    `SELECT * FROM messages
     WHERE enabled = 1
       AND starts_at <= ?
       AND (ends_at IS NULL OR ends_at >= ?)
       AND (minimum_version IS NULL OR minimum_version <= ?)
       AND (maximum_version IS NULL OR maximum_version >= ?)
     ORDER BY blocking DESC, starts_at DESC
     LIMIT 20`,
    [now, now, appVersion || 999999, appVersion || 0],
  );
  return (result.results || []).map(toMessage);
}

export async function listMessages() {
  const result = await queryD1<Record<string, unknown>>("SELECT * FROM messages ORDER BY created_at DESC LIMIT 200");
  return (result.results || []).map(toMessage);
}

export async function upsertMessage(input: Partial<RemoteMessage> & { title: string; body: string }) {
  const id = input.id || randomId("msg");
  const safeUrl = validateHttpsUrl(input.buttonUrl);
  await queryD1(
    `INSERT INTO messages (id, title, body, button_text, button_url, type, dismissible, blocking, enabled, starts_at, ends_at, minimum_version, maximum_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       body = excluded.body,
       button_text = excluded.button_text,
       button_url = excluded.button_url,
       type = excluded.type,
       dismissible = excluded.dismissible,
       blocking = excluded.blocking,
       enabled = excluded.enabled,
       starts_at = excluded.starts_at,
       ends_at = excluded.ends_at,
       minimum_version = excluded.minimum_version,
       maximum_version = excluded.maximum_version,
       updated_at = CURRENT_TIMESTAMP`,
    [
      id,
      input.title.slice(0, 140),
      input.body.slice(0, 4000),
      input.buttonText?.slice(0, 80) || null,
      safeUrl,
      input.type || "INFO",
      input.dismissible === false ? 0 : 1,
      input.blocking ? 1 : 0,
      input.enabled ? 1 : 0,
      input.startsAt || new Date().toISOString(),
      input.endsAt || null,
      input.minimumVersion || null,
      input.maximumVersion || null,
    ],
  );
  return id;
}

export async function writeAuditLog(input: { action: string; adminUser?: string | null; ip?: string | null; result?: string; details?: unknown }) {
  if (!getD1Config()) return;
  await queryD1(
    "INSERT INTO audit_log (id, action, admin_user, ip, result, details) VALUES (?, ?, ?, ?, ?, ?)",
    [randomId("aud"), input.action, input.adminUser || null, input.ip || null, input.result || "OK", JSON.stringify(input.details || {})],
  );
}

export async function readDashboardSummary() {
  const [config, licenseRows, activeRows, revokedRows, deviceRows, messageRows] = await Promise.all([
    readAppConfig(),
    queryD1<{ count: number }>("SELECT COUNT(*) as count FROM licenses"),
    queryD1<{ count: number }>("SELECT COUNT(*) as count FROM licenses WHERE status = 'ACTIVE'"),
    queryD1<{ count: number }>("SELECT COUNT(*) as count FROM licenses WHERE status = 'REVOKED'"),
    queryD1<{ count: number }>("SELECT COUNT(*) as count FROM license_devices WHERE active = 1"),
    queryD1<{ count: number }>("SELECT COUNT(*) as count FROM messages WHERE enabled = 1"),
  ]);

  return {
    config,
    totals: {
      licenses: Number(licenseRows.results?.[0]?.count || 0),
      activeLicenses: Number(activeRows.results?.[0]?.count || 0),
      revokedLicenses: Number(revokedRows.results?.[0]?.count || 0),
      activeDevices: Number(deviceRows.results?.[0]?.count || 0),
      activeMessages: Number(messageRows.results?.[0]?.count || 0),
    },
  };
}
