import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
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

// The standalone bundle inlines Inter's @font-face rules, whose URLs point at
// the fontsource package's ./files folder. Ship those files next to the bundle
// so it loads the package's own fonts with no CDN.
const require = createRequire(import.meta.url);
const interFiles = path.join(path.dirname(require.resolve("@fontsource-variable/inter/opsz.css")), "files");
await mkdir("dist/fonts", { recursive: true });
for (const file of await readdir(interFiles)) {
  if (file.endsWith("-opsz-normal.woff2")) await cp(path.join(interFiles, file), path.join("dist/fonts", file));
}
const standalone = await readFile("dist/standalone.css", "utf8");
await writeFile("dist/standalone.css", standalone.replaceAll("url(./files/inter-", "url(./fonts/inter-"));
