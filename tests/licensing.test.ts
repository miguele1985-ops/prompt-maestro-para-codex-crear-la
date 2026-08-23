import { describe, expect, it } from "vitest";
import {
  activateLicense,
  generateLicenseCode,
  hashLicenseCode,
  licenseLast4,
  normalizeLicenseCode,
  randomId,
  verifyLicenseCertificate,
  type LicenseDeviceRecord,
  type LicenseRecord,
  type LicensingStore,
} from "@/lib/licensing-core";

class MemoryLicensingStore implements LicensingStore {
  licenses = new Map<string, LicenseRecord>();
  devices = new Map<string, LicenseDeviceRecord>();

  async addLicense(code: string, input: Partial<LicenseRecord> = {}) {
    const normalized = normalizeLicenseCode(code);
    const license: LicenseRecord = {
      id: randomId("lic"),
      codeHash: await hashLicenseCode(code),
      codeLast4: licenseLast4(normalized),
      status: "ACTIVE",
      maxDevices: 2,
      licenseType: "PERMANENT",
      createdAt: new Date().toISOString(),
      activatedAt: null,
      expiresAt: null,
      paymentReference: null,
      customerReference: null,
      notes: null,
      createdBy: "test",
      revokedAt: null,
      ...input,
    };
    this.licenses.set(license.codeHash, license);
    return license;
  }

  async getLicenseByHash(codeHash: string) {
    return this.licenses.get(codeHash) || null;
  }

  async getActiveDevice(licenseId: string, installationIdHash: string) {
    return [...this.devices.values()].find((device) => device.licenseId === licenseId && device.installationIdHash === installationIdHash && device.active) || null;
  }

  async countActiveDevices(licenseId: string) {
    return [...this.devices.values()].filter((device) => device.licenseId === licenseId && device.active).length;
  }

  async createDevice(input: { id: string; licenseId: string; installationIdHash: string; deviceLabel?: string | null; appVersion?: string | null }) {
    const license = [...this.licenses.values()].find((item) => item.id === input.licenseId);
    if (!license) throw new Error("No license");
    if ((await this.countActiveDevices(input.licenseId)) >= license.maxDevices) throw new Error("DEVICE_LIMIT");
    const now = new Date().toISOString();
    const device: LicenseDeviceRecord = {
      id: input.id,
      licenseId: input.licenseId,
      installationIdHash: input.installationIdHash,
      deviceLabel: input.deviceLabel || null,
      appVersion: input.appVersion || null,
      firstActivatedAt: now,
      lastSeenAt: now,
      active: true,
      releasedAt: null,
    };
    this.devices.set(device.id, device);
    return device;
  }

  async touchDevice(deviceId: string, appVersion?: string | null) {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error("No device");
    device.lastSeenAt = new Date().toISOString();
    device.appVersion = appVersion || device.appVersion;
    return device;
  }

  async markLicenseActivated(licenseId: string) {
    const license = [...this.licenses.values()].find((item) => item.id === licenseId);
    if (license) license.activatedAt = license.activatedAt || new Date().toISOString();
  }

  releaseOne() {
    const first = [...this.devices.values()].find((device) => device.active);
    if (first) {
      first.active = false;
      first.releasedAt = new Date().toISOString();
    }
  }
}

async function signingKeys() {
  const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return {
    privateJwk: JSON.stringify(await crypto.subtle.exportKey("jwk", keyPair.privateKey)),
    publicJwk: (await crypto.subtle.exportKey("jwk", keyPair.publicKey)) as JsonWebKey,
  };
}

describe("licensing core", () => {
  it("keeps a valid license to two active devices and rejects the third", async () => {
    const store = new MemoryLicensingStore();
    const keys = await signingKeys();
    const code = generateLicenseCode();
    await store.addLicense(code);

    const first = await activateLicense(store, { licenseCode: code, installationId: "install-device-0001", privateJwk: keys.privateJwk });
    const firstAgain = await activateLicense(store, { licenseCode: code, installationId: "install-device-0001", privateJwk: keys.privateJwk });
    const second = await activateLicense(store, { licenseCode: code, installationId: "install-device-0002", privateJwk: keys.privateJwk });
    const third = await activateLicense(store, { licenseCode: code, installationId: "install-device-0003", privateJwk: keys.privateJwk });

    expect(first.ok).toBe(true);
    expect(firstAgain.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(third).toMatchObject({ ok: false, reason: "DEVICE_LIMIT" });
    expect(await store.countActiveDevices((first as Extract<typeof first, { ok: true }>).license.id)).toBe(2);
  });

  it("allows a new device after one activation is released", async () => {
    const store = new MemoryLicensingStore();
    const keys = await signingKeys();
    const code = generateLicenseCode();
    await store.addLicense(code);

    await activateLicense(store, { licenseCode: code, installationId: "install-device-0001", privateJwk: keys.privateJwk });
    await activateLicense(store, { licenseCode: code, installationId: "install-device-0002", privateJwk: keys.privateJwk });
    store.releaseOne();
    const third = await activateLicense(store, { licenseCode: code, installationId: "install-device-0003", privateJwk: keys.privateJwk });

    expect(third.ok).toBe(true);
  });

  it("rejects revoked, missing and manipulated codes", async () => {
    const store = new MemoryLicensingStore();
    const keys = await signingKeys();
    const code = generateLicenseCode();
    await store.addLicense(code, { status: "REVOKED" });

    await expect(activateLicense(store, { licenseCode: "MCS-XXXX-XXXX-XXXX", installationId: "install-device-0001", privateJwk: keys.privateJwk })).resolves.toMatchObject({
      ok: false,
      reason: "INVALID_CODE",
    });
    await expect(activateLicense(store, { licenseCode: code, installationId: "install-device-0001", privateJwk: keys.privateJwk })).resolves.toMatchObject({
      ok: false,
      reason: "REVOKED",
    });
  });

  it("signs a certificate that fails verification if tampered", async () => {
    const store = new MemoryLicensingStore();
    const keys = await signingKeys();
    const code = generateLicenseCode();
    await store.addLicense(code);

    const result = await activateLicense(store, { licenseCode: code, installationId: "install-device-0001", privateJwk: keys.privateJwk });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(await verifyLicenseCertificate(result.certificate, keys.publicJwk)).toBe(true);
    const tampered = { ...result.certificate, payload: { ...result.certificate.payload, maxDevices: 99 } };
    expect(await verifyLicenseCertificate(tampered, keys.publicJwk)).toBe(false);
  });
});
