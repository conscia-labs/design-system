import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    pool: "vmThreads",
    maxWorkers: 1,
    // Recharts' CommonJS build requires ESM-only Redux Toolkit, which Node 20 cannot load,
    // so tests use its ES build and let Vite transform it.
    alias: [{ find: /^recharts$/, replacement: "recharts/es6/index.js" }],
    server: { deps: { inline: ["recharts"] } },
  },
});
