import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/client.ts",
    "foundation/index": "src/foundation/index.ts",
    "patterns/index": "src/patterns/client.ts",
    "primitives/index": "src/primitives/client.ts",
    "utils/index": "src/primitives/utils.ts",
  },
  format: ["esm"],
  target: "es2020",
  platform: "browser",
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  minify: false,
  external: ["react", "react-dom", "use-sync-external-store"],
  noExternal: ["@base-ui/react"],
});
