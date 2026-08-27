import { getMcsAppKv } from "@/lib/mcs-app-kv";
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
  type LicenseStatus,
  type LicenseType,
  type MessageType,
} from "@/lib/licensing-core";

const LICENSING_STATE_KEY = "licensing:state:v1";
const licenseStatuses = new Set<LicenseStatus>(["ACTIVE", "REVOKED", "SUSPENDED", "REFUNDED"]);
const licenseTypes = new Set<LicenseType>(["PERMANENT", "ANNUAL", "CUSTOM"]);
const messageTypes = new Set<MessageType>(["INFO", "IMPORTANT", "UPDATE", "PROMOTION", "LICENSE", "BLOCKING"]);

type AuditRecord = {
  id: string;
  action: string;
  adminUser: string | null;
  ip: string | null;
  result: string;
  details: unknown;
  createdAt: string;
};

type KvLicensingState = {
  config: AppConfig;
  licenses: LicenseRecord[];
  devices: LicenseDeviceRecord[];
  messages: RemoteMessage[];
  auditLog: AuditRecord[];
};

function nowIso() {
  return new Date().toISOString();
}

function clampInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Math.floor(Number(value || fallback));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function cleanText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanOptionalText(value: unknown, maxLength: number) {
  const text = cleanText(value, maxLength);
  return text || null;
}

function cleanId(value: unknown, fallbackPrefix: string) {
  const text = cleanText(value, 100).replace(/[^a-zA-Z0-9._-]/g, "-");
  return text || randomId(fallbackPrefix);
}

function cleanDate(value: unknown) {
  if (!value) return null;
  const text = String(value).trim();
  return Number.isFinite(Date.parse(text)) ? text : null;
}

function toConfig(value: Partial<AppConfig> | undefined): AppConfig {
  return {
    ...defaultAppConfig,
    ...(value || {}),
    licensingEnabled: Boolean(value?.licensingEnabled),
    globalLockEnabled: Boolean(value?.globalLockEnabled),
    appMode: value?.appMode || defaultAppConfig.appMode,
    gracePeriodEnabled: Boolean(value?.gracePeriodEnabled),
    gracePeriodEnd: value?.gracePeriodEnd || null,
    minimumSupportedVersion: Number(value?.minimumSupportedVersion || defaultAppConfig.minimumSupportedVersion),
    latestVersion: Number(value?.latestVersion || defaultAppConfig.latestVersion),
    configurationVersion: Number(value?.configurationVersion || defaultAppConfig.configurationVersion),
    updatedAt: value?.updatedAt || defaultAppConfig.updatedAt,
  };
}

function toLicense(value: Partial<LicenseRecord>): LicenseRecord | null {
  if (!value.id || !value.codeHash || !value.codeLast4) return null;
  return {
    id: String(value.id),
    codeHash: String(value.codeHash),
    codeLast4: String(value.codeLast4),
    status: licenseStatuses.has(value.status as LicenseStatus) ? (value.status as LicenseStatus) : "ACTIVE",
    maxDevices: clampInteger(value.maxDevices, 2, 1, 20),
    licenseType: licenseTypes.has(value.licenseType as LicenseType) ? (value.licenseType as LicenseType) : "PERMANENT",
    createdAt: value.createdAt || nowIso(),
    activatedAt: value.activatedAt || null,
    expiresAt: value.expiresAt || null,
    paymentReference: value.paymentReference || null,
    customerReference: value.customerReference || null,
    notes: value.notes || null,
    createdBy: value.createdBy || null,
    revokedAt: value.revokedAt || null,
  };
}

function toDevice(value: Partial<LicenseDeviceRecord>): LicenseDeviceRecord | null {
  if (!value.id || !value.licenseId || !value.installationIdHash) return null;
  return {
    id: String(value.id),
    licenseId: String(value.licenseId),
    installationIdHash: String(value.installationIdHash),
    deviceLabel: value.deviceLabel || null,
    appVersion: value.appVersion || null,
    firstActivatedAt: value.firstActivatedAt || nowIso(),
    lastSeenAt: value.lastSeenAt || nowIso(),
    active: value.active !== false,
    releasedAt: value.releasedAt || null,
  };
}

function toMessage(value: Partial<RemoteMessage>): RemoteMessage | null {
  const title = cleanText(value.title, 140);
  const body = cleanText(value.body, 4000);
  if (!value.id || !title || !body) return null;
  return {
    id: cleanId(value.id, "msg"),
    title,
    body,
    buttonText: cleanOptionalText(value.buttonText, 80),
    buttonUrl: validateHttpsUrl(value.buttonUrl),
    type: messageTypes.has(value.type as MessageType) ? (value.type as MessageType) : "INFO",
    dismissible: value.dismissible !== false,
    blocking: Boolean(value.blocking),
    enabled: Boolean(value.enabled),
    startsAt: value.startsAt || nowIso(),
    endsAt: value.endsAt || null,
    minimumVersion: value.minimumVersion ?? null,
    maximumVersion: value.maximumVersion ?? null,
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function emptyState(): KvLicensingState {
  return {
    config: { ...defaultAppConfig },
    licenses: [],
    devices: [],
    messages: [],
    auditLog: [],
  };
}

function normalizeState(value: Partial<KvLicensingState> | null): KvLicensingState {
  const state = emptyState();
  if (!value) return state;
  return {
    config: toConfig(value.config),
    licenses: Array.isArray(value.licenses) ? value.licenses.map(toLicense).filter((item): item is LicenseRecord => Boolean(item)) : [],
    devices: Array.isArray(value.devices) ? value.devices.map(toDevice).filter((item): item is LicenseDeviceRecord => Boolean(item)) : [],
    messages: Array.isArray(value.messages) ? value.messages.map(toMessage).filter((item): item is RemoteMessage => Boolean(item)) : [],
    auditLog: Array.isArray(value.auditLog) ? value.auditLog.slice(-100) as AuditRecord[] : [],
  };
}

async function readState() {
  const saved = await getMcsAppKv().get<Partial<KvLicensingState>>(LICENSING_STATE_KEY, "json");
  return normalizeState(saved);
}

async function writeState(state: KvLicensingState) {
  await getMcsAppKv().put(LICENSING_STATE_KEY, JSON.stringify(state));
}

export async function readKvAppConfig(): Promise<AppConfig> {
  return (await readState()).config;
}

export async function updateKvAppConfig(input: Partial<AppConfig>) {
  const state = await readState();
  const purchaseUrl = validateHttpsUrl(input.purchaseUrl) || state.config.purchaseUrl;
  const supportUrl = validateHttpsUrl(input.supportUrl) || state.config.supportUrl;
  state.config = {
    ...state.config,
    licensingEnabled: Boolean(input.licensingEnabled),
    globalLockEnabled: Boolean(input.globalLockEnabled),
    appMode: input.appMode || "FREE",
    gracePeriodEnabled: Boolean(input.gracePeriodEnabled),
    gracePeriodEnd: cleanDate(input.gracePeriodEnd),
    minimumSupportedVersion: clampInteger(input.minimumSupportedVersion, 1, 1, 999999),
    latestVersion: clampInteger(input.latestVersion, 1, 1, 999999),
    purchaseUrl,
    supportUrl,
    configurationVersion: Number(state.config.configurationVersion || 0) + 1,
    updatedAt: nowIso(),
  };
  await writeState(state);
  return state.config;
}

export class KvLicensingStore implements LicensingStore {
  async getLicenseByHash(codeHash: string) {
    const state = await readState();
    return state.licenses.find((license) => license.codeHash === codeHash) || null;
  }

  async getActiveDevice(licenseId: string, installationIdHash: string) {
    const state = await readState();
    return state.devices.find((device) => device.licenseId === licenseId && device.installationIdHash === installationIdHash && device.active) || null;
  }

  async countActiveDevices(licenseId: string) {
    const state = await readState();
    return state.devices.filter((device) => device.licenseId === licenseId && device.active).length;
  }

  async createDevice(input: { id: string; licenseId: string; installationIdHash: string; deviceLabel?: string | null; appVersion?: string | null }) {
    const state = await readState();
    const license = state.licenses.find((item) => item.id === input.licenseId);
    if (!license) throw new Error("Licencia no encontrada.");

    const released = state.devices.find((device) => device.licenseId === input.licenseId && device.installationIdHash === input.installationIdHash && !device.active);
    const activeDevices = state.devices.filter((device) => device.licenseId === input.licenseId && device.active).length;
    if (activeDevices >= license.maxDevices) throw new Error("DEVICE_LIMIT");

    if (released) {
      released.active = true;
      released.releasedAt = null;
      released.lastSeenAt = nowIso();
      released.deviceLabel = input.deviceLabel || released.deviceLabel;
      released.appVersion = input.appVersion || released.appVersion;
      await writeState(state);
      return released;
    }

    const device: LicenseDeviceRecord = {
      id: input.id,
      licenseId: input.licenseId,
      installationIdHash: input.installationIdHash,
      deviceLabel: cleanOptionalText(input.deviceLabel, 120),
      appVersion: cleanOptionalText(input.appVersion, 40),
      firstActivatedAt: nowIso(),
      lastSeenAt: nowIso(),
      active: true,
      releasedAt: null,
    };
    state.devices.unshift(device);
    await writeState(state);
    return device;
  }

  async touchDevice(deviceId: string, appVersion?: string | null) {
    const state = await readState();
    const device = state.devices.find((item) => item.id === deviceId);
    if (!device) throw new Error("Dispositivo no encontrado.");
    device.lastSeenAt = nowIso();
    device.appVersion = cleanOptionalText(appVersion, 40) || device.appVersion;
    await writeState(state);
    return device;
  }

  async markLicenseActivated(licenseId: string) {
    const state = await readState();
    const license = state.licenses.find((item) => item.id === licenseId);
    if (license && !license.activatedAt) {
      license.activatedAt = nowIso();
      await writeState(state);
    }
  }
}

export async function createKvLicenses(input: {
  count?: number;
  maxDevices?: number;
  licenseType?: LicenseType;
  expiresAt?: string | null;
  paymentReference?: string | null;
  customerReference?: string | null;
  notes?: string | null;
  createdBy?: string | null;
}) {
  const state = await readState();
  const count = clampInteger(input.count, 1, 1, 200);
  const maxDevices = clampInteger(input.maxDevices, 2, 1, 20);
  const licenseType = licenseTypes.has(input.licenseType as LicenseType) ? input.licenseType as LicenseType : "PERMANENT";
  const created: Array<{ id: string; code: string; codeLast4: string }> = [];

  for (let index = 0; index < count; index += 1) {
    const code = generateLicenseCode();
    const normalized = normalizeLicenseCode(code);
    const license: LicenseRecord = {
      id: randomId("lic"),
      codeHash: await hashLicenseCode(code),
      codeLast4: licenseLast4(normalized),
      status: "ACTIVE",
      maxDevices,
      licenseType,
      createdAt: nowIso(),
      activatedAt: null,
      expiresAt: cleanDate(input.expiresAt),
      paymentReference: cleanOptionalText(input.paymentReference, 160),
      customerReference: cleanOptionalText(input.customerReference, 160),
      notes: cleanOptionalText(input.notes, 1000),
      createdBy: cleanOptionalText(input.createdBy, 80),
      revokedAt: null,
    };
    state.licenses.unshift(license);
    created.push({ id: license.id, code, codeLast4: license.codeLast4 });
  }

  state.licenses = state.licenses.slice(0, 5000);
  await writeState(state);
  return created;
}

export async function listKvLicenses(status?: LicenseStatus | "ALL") {
  const state = await readState();
  return state.licenses
    .filter((license) => !status || status === "ALL" || license.status === status)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 200);
}

export async function updateKvLicense(id: string, input: { status?: LicenseStatus; maxDevices?: number; notes?: string | null }) {
  const state = await readState();
  const license = state.licenses.find((item) => item.id === id);
  if (!license) return;
  if (input.status && licenseStatuses.has(input.status)) {
    license.status = input.status;
    if (input.status === "REVOKED") license.revokedAt = nowIso();
  }
  if (input.maxDevices) license.maxDevices = clampInteger(input.maxDevices, license.maxDevices, 1, 20);
  if (input.notes !== undefined) license.notes = cleanOptionalText(input.notes, 1000);
  await writeState(state);
}

export async function listKvLicenseDevices(licenseId: string) {
  const state = await readState();
  return state.devices
    .filter((device) => device.licenseId === licenseId)
    .sort((left, right) => Date.parse(right.firstActivatedAt) - Date.parse(left.firstActivatedAt));
}

export async function releaseKvDevice(deviceId: string) {
  const state = await readState();
  const device = state.devices.find((item) => item.id === deviceId);
  if (!device) return;
  device.active = false;
  device.releasedAt = nowIso();
  await writeState(state);
}

export async function readKvActiveMessages(appVersion?: number) {
  const state = await readState();
  const now = Date.now();
  return state.messages
    .filter((message) => {
      if (!message.enabled) return false;
      if (message.startsAt && Date.parse(message.startsAt) > now) return false;
      if (message.endsAt && Date.parse(message.endsAt) < now) return false;
      if (message.minimumVersion !== null && message.minimumVersion > (appVersion || 999999)) return false;
      if (message.maximumVersion !== null && message.maximumVersion < (appVersion || 0)) return false;
      return true;
    })
    .sort((left, right) => Number(right.blocking) - Number(left.blocking) || Date.parse(right.startsAt) - Date.parse(left.startsAt))
    .slice(0, 20);
}

export async function listKvMessages() {
  const state = await readState();
  return state.messages.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, 200);
}

export async function upsertKvMessage(input: Partial<RemoteMessage> & { title: string; body: string }) {
  const state = await readState();
  const id = cleanId(input.id, "msg");
  const existing = state.messages.find((message) => message.id === id);
  const message: RemoteMessage = {
    id,
    title: cleanText(input.title, 140),
    body: cleanText(input.body, 4000),
    buttonText: cleanOptionalText(input.buttonText, 80),
    buttonUrl: validateHttpsUrl(input.buttonUrl),
    type: messageTypes.has(input.type as MessageType) ? input.type as MessageType : "INFO",
    dismissible: input.dismissible !== false,
    blocking: Boolean(input.blocking),
    enabled: Boolean(input.enabled),
    startsAt: input.startsAt || existing?.startsAt || nowIso(),
    endsAt: cleanDate(input.endsAt),
    minimumVersion: input.minimumVersion ?? null,
    maximumVersion: input.maximumVersion ?? null,
    createdAt: existing?.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  if (!message.title || !message.body) throw new Error("Titulo y mensaje son obligatorios.");
  const index = state.messages.findIndex((item) => item.id === id);
  if (index >= 0) state.messages[index] = message;
  else state.messages.unshift(message);
  state.messages = state.messages.slice(0, 200);
  await writeState(state);
  return id;
}

export async function writeKvAuditLog(input: { action: string; adminUser?: string | null; ip?: string | null; result?: string; details?: unknown }) {
  const state = await readState();
  state.auditLog.push({
    id: randomId("aud"),
    action: cleanText(input.action, 120),
    adminUser: cleanOptionalText(input.adminUser, 120),
    ip: cleanOptionalText(input.ip, 80),
    result: cleanText(input.result || "OK", 40),
    details: input.details || {},
    createdAt: nowIso(),
  });
  state.auditLog = state.auditLog.slice(-100);
  await writeState(state);
}

export async function readKvDashboardSummary() {
  const state = await readState();
  return {
    config: state.config,
    totals: {
      licenses: state.licenses.length,
      activeLicenses: state.licenses.filter((license) => license.status === "ACTIVE").length,
      revokedLicenses: state.licenses.filter((license) => license.status === "REVOKED").length,
      activeDevices: state.devices.filter((device) => device.active).length,
      activeMessages: state.messages.filter((message) => message.enabled).length,
    },
  };
}
