import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Next preserves JSX; component tests need the React transform.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
