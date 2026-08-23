export type AppMode = "FREE" | "NOTICE" | "GRACE_PERIOD" | "LICENSE_REQUIRED";
export type LicenseStatus = "ACTIVE" | "REVOKED" | "SUSPENDED" | "REFUNDED";
export type LicenseType = "PERMANENT" | "ANNUAL" | "CUSTOM";
export type MessageType = "INFO" | "IMPORTANT" | "UPDATE" | "PROMOTION" | "LICENSE" | "BLOCKING";

export type AppConfig = {
  licensingEnabled: boolean;
  globalLockEnabled: boolean;
  appMode: AppMode;
  gracePeriodEnabled: boolean;
  gracePeriodEnd: string | null;
  minimumSupportedVersion: number;
  latestVersion: number;
  purchaseUrl: string;
  supportUrl: string;
  configurationVersion: number;
  updatedAt: string;
};

export type LicenseRecord = {
  id: string;
  codeHash: string;
  codeLast4: string;
  status: LicenseStatus;
  maxDevices: number;
  licenseType: LicenseType;
  createdAt: string;
  activatedAt: string | null;
  expiresAt: string | null;
  paymentReference: string | null;
  customerReference: string | null;
  notes: string | null;
  createdBy: string | null;
  revokedAt: string | null;
};

export type LicenseDeviceRecord = {
  id: string;
  licenseId: string;
  installationIdHash: string;
  deviceLabel: string | null;
  appVersion: string | null;
  firstActivatedAt: string;
  lastSeenAt: string;
  active: boolean;
  releasedAt: string | null;
};

export type RemoteMessage = {
  id: string;
  title: string;
  body: string;
  buttonText: string | null;
  buttonUrl: string | null;
  type: MessageType;
  dismissible: boolean;
  blocking: boolean;
  enabled: boolean;
  startsAt: string;
  endsAt: string | null;
  minimumVersion: number | null;
  maximumVersion: number | null;
  createdAt: string;
  updatedAt: string;
};

export type LicenseCertificatePayload = {
  certificateVersion: 1;
  product: "modo-crisis-survival";
  licenseId: string;
  installationIdHash: string;
  issuedAt: string;
  expiresAt: string | null;
  licenseType: LicenseType;
  maxDevices: number;
};

export type SignedLicenseCertificate = {
  payload: LicenseCertificatePayload;
  signature: string;
  algorithm: "ECDSA_P256_SHA256";
};

export type LicenseActivationResult =
  | { ok: true; license: LicenseRecord; device: LicenseDeviceRecord; certificate: SignedLicenseCertificate }
  | { ok: false; reason: "INVALID_CODE" | "REVOKED" | "SUSPENDED" | "REFUNDED" | "EXPIRED" | "DEVICE_LIMIT" | "SIGNING_NOT_CONFIGURED"; message: string };

export type LicensingStore = {
  getLicenseByHash(codeHash: string): Promise<LicenseRecord | null>;
  getActiveDevice(licenseId: string, installationIdHash: string): Promise<LicenseDeviceRecord | null>;
  countActiveDevices(licenseId: string): Promise<number>;
  createDevice(input: {
    id: string;
    licenseId: string;
    installationIdHash: string;
    deviceLabel?: string | null;
    appVersion?: string | null;
  }): Promise<LicenseDeviceRecord>;
  touchDevice(deviceId: string, appVersion?: string | null): Promise<LicenseDeviceRecord>;
  markLicenseActivated(licenseId: string): Promise<void>;
};

export const defaultAppConfig: AppConfig = {
  licensingEnabled: false,
  globalLockEnabled: false,
  appMode: "FREE",
  gracePeriodEnabled: false,
  gracePeriodEnd: null,
  minimumSupportedVersion: 1,
  latestVersion: 1,
  purchaseUrl: "https://modo-crisis-survival.pages.dev/donaciones",
  supportUrl: "https://modo-crisis-survival.pages.dev/contacto",
  configurationVersion: 1,
  updatedAt: new Date(0).toISOString(),
};

const licenseAlphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export function normalizeLicenseCode(code: string) {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
}

export function formatLicenseCode(normalized: string) {
  const raw = normalized.startsWith("MCS") ? normalized.slice(3) : normalized;
  return `MCS-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

export function licenseLast4(normalizedCode: string) {
  return normalizedCode.slice(-4);
}

export async function hashLicenseCode(code: string) {
  return sha256Hex(normalizeLicenseCode(code));
}

export function generateLicenseCode() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes)
    .map((byte) => licenseAlphabet[byte % licenseAlphabet.length])
    .join("");
  return formatLicenseCode(`MCS${body}`);
}

export function randomId(prefix: string) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `${prefix}_${base64UrlEncode(bytes)}`;
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}

async function importPrivateSigningKey(jwkText: string) {
  return crypto.subtle.importKey(
    "jwk",
    JSON.parse(jwkText),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

export async function signLicenseCertificate(payload: LicenseCertificatePayload, privateJwk: string): Promise<SignedLicenseCertificate> {
  const key = await importPrivateSigningKey(privateJwk);
  const bytes = new TextEncoder().encode(canonicalJson(payload));
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, bytes);
  return {
    payload,
    signature: base64UrlEncode(signature),
    algorithm: "ECDSA_P256_SHA256",
  };
}

export async function verifyLicenseCertificate(certificate: SignedLicenseCertificate, publicJwk: JsonWebKey) {
  const key = await crypto.subtle.importKey(
    "jwk",
    publicJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
  const signatureBase64 = certificate.signature.replace(/-/g, "+").replace(/_/g, "/");
  const signature = Uint8Array.from(atob(signatureBase64.padEnd(Math.ceil(signatureBase64.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
  return crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    signature,
    new TextEncoder().encode(canonicalJson(certificate.payload)),
  );
}

export function validateHttpsUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function createLicenseCertificate(
  license: LicenseRecord,
  installationIdHash: string,
  privateJwk: string,
): Promise<SignedLicenseCertificate> {
  return signLicenseCertificate(
    {
      certificateVersion: 1,
      product: "modo-crisis-survival",
      licenseId: license.id,
      installationIdHash,
      issuedAt: new Date().toISOString(),
      expiresAt: license.expiresAt,
      licenseType: license.licenseType,
      maxDevices: license.maxDevices,
    },
    privateJwk,
  );
}

export async function activateLicense(
  store: LicensingStore,
  input: { licenseCode: string; installationId: string; appVersion?: string | null; deviceLabel?: string | null; privateJwk?: string },
): Promise<LicenseActivationResult> {
  const normalizedCode = normalizeLicenseCode(input.licenseCode || "");
  const normalizedInstallation = (input.installationId || "").trim();
  if (normalizedCode.length < 12 || normalizedInstallation.length < 12) {
    return { ok: false, reason: "INVALID_CODE", message: "Codigo de licencia o instalacion no valido." };
  }

  const codeHash = await sha256Hex(normalizedCode);
  const installationIdHash = await sha256Hex(normalizedInstallation);
  const license = await store.getLicenseByHash(codeHash);
  if (!license) return { ok: false, reason: "INVALID_CODE", message: "Codigo de licencia no encontrado." };
  if (license.status !== "ACTIVE") {
    return { ok: false, reason: license.status, message: `La licencia esta ${license.status.toLowerCase()}.` };
  }
  if (license.expiresAt && Date.parse(license.expiresAt) < Date.now()) {
    return { ok: false, reason: "EXPIRED", message: "La licencia ha caducado." };
  }
  if (!input.privateJwk) {
    return { ok: false, reason: "SIGNING_NOT_CONFIGURED", message: "La firma de licencias no esta configurada." };
  }

  const existingDevice = await store.getActiveDevice(license.id, installationIdHash);
  if (existingDevice) {
    const touched = await store.touchDevice(existingDevice.id, input.appVersion);
    return { ok: true, license, device: touched, certificate: await createLicenseCertificate(license, installationIdHash, input.privateJwk) };
  }

  const activeDevices = await store.countActiveDevices(license.id);
  if (activeDevices >= license.maxDevices) {
    return { ok: false, reason: "DEVICE_LIMIT", message: "Esta licencia ya tiene todas sus activaciones usadas." };
  }

  let device: LicenseDeviceRecord;
  try {
    device = await store.createDevice({
      id: randomId("dev"),
      licenseId: license.id,
      installationIdHash,
      deviceLabel: input.deviceLabel || null,
      appVersion: input.appVersion || null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DEVICE_LIMIT") {
      return { ok: false, reason: "DEVICE_LIMIT", message: "Esta licencia ya tiene todas sus activaciones usadas." };
    }
    throw error;
  }
  await store.markLicenseActivated(license.id);
  return { ok: true, license, device, certificate: await createLicenseCertificate(license, installationIdHash, input.privateJwk) };
}
