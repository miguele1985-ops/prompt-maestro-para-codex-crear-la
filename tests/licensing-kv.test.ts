import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createKvLicenses, listKvLicenses } from "@/lib/licensing-kv";

type TestGlobal = typeof globalThis & {
  __MCS_APP_KV__?: {
    get<T = unknown>(key: string, type?: "json"): Promise<T | string | null>;
    put(key: string, value: string): Promise<void>;
  };
};

describe("KV licensing fallback", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    (globalThis as TestGlobal).__MCS_APP_KV__ = {
      async get<T = unknown>(key: string, type?: "json") {
        const value = store.get(key) || null;
        if (type === "json") return value ? JSON.parse(value) as T : null;
        return value;
      },
      async put(key: string, value: string) {
        store.set(key, value);
      },
    };
  });

  afterEach(() => {
    delete (globalThis as TestGlobal).__MCS_APP_KV__;
  });

  it("generates a code once and stores only its hash", async () => {
    const [created] = await createKvLicenses({ count: 1, maxDevices: 2, licenseType: "PERMANENT" });
    const licenses = await listKvLicenses("ALL");
    const rawState = store.get("licensing:state:v1") || "";

    expect(created.code).toMatch(/^MCS-/);
    expect(licenses).toHaveLength(1);
    expect(licenses[0].codeHash).toHaveLength(64);
    expect(rawState).not.toContain(created.code);
  });
});
