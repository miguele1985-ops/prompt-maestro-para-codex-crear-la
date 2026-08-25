import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("Cloudflare admin API routes", () => {
  it("publishes admin endpoints in the Next router and Pages Functions", () => {
    [
      "app/api/admin/config/route.ts",
      "app/api/admin/messages/route.ts",
      "functions/api/admin/config.js",
      "functions/api/admin/messages.js",
    ].forEach((path) => {
      expect(existsSync(join(root, path)), path).toBe(true);
    });
  });

  it("uses the MCS bindings required by the mobile creator app", () => {
    const sharedNext = read("src/lib/mcs-app-kv.ts");
    const sharedFunctions = read("functions/api/_shared.js");
    const combined = `${sharedNext}\n${sharedFunctions}`;

    expect(combined).toContain("MCS_APP_KV");
    expect(combined).toContain("MCS_ADMIN_TOKEN");
    expect(combined).not.toMatch(/\benv\.KV\b/);
  });

  it("keeps forced updates controlled by the explicit force flags", () => {
    const nextAdmin = read("app/api/admin/config/route.ts");
    const functionsAdmin = read("functions/api/admin/config.js");
    const functionsPublic = read("functions/api/v1/config.js");

    expect(nextAdmin).toContain("normalizeForceFlag");
    expect(functionsAdmin).toContain("normalizeForceFlag");
    expect(functionsPublic).toContain("forceUpdate");
    expect(functionsPublic).toContain("mandatory");
  });
});
