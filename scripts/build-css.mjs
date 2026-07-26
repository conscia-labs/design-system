import { cp, mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

await mkdir("dist", { recursive: true });

// Tailwind application entry points stay as CSS directives so the consuming
// Tailwind v4 compiler owns preflight, utility generation, and cascade order.
await cp("src/foundation/styles.css", "dist/foundation.css");
await cp("src/foundation/styles.css", "dist/styles.css");
await cp("src/foundation/tailwind.css", "dist/tailwind.css");

// Non-Tailwind applications may opt into the complete precompiled bundle.
await execFileAsync(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  [
    "exec",
    "tailwindcss",
    "-i",
    "src/foundation/package.css",
    "-o",
    "dist/standalone.css",
    "--minify",
  ],
  { stdio: "inherit" },
);
