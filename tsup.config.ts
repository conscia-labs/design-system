import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "foundation/index": "src/foundation/index.ts",
    "patterns/index": "src/patterns/index.ts",
    "primitives/index": "src/primitives/index.ts",
  },
  format: ["esm"],
  target: "es2020",
  platform: "neutral",
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  minify: false,
  banner: {
    js: '"use client";',
  },
  external: ["react", "react-dom"],
});
