import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const fixtureSource = join(
  repositoryRoot,
  "test/fixtures/packaged-consumer",
);
const temporaryRoot = await mkdtemp(
  join(tmpdir(), "conscia-design-system-consumer-"),
);
const fixtureRoot = join(temporaryRoot, "app");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(args, cwd = repositoryRoot) {
  execFileSync(pnpm, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
}

run(["pack", "--pack-destination", temporaryRoot]);

const tarballName = (await readdir(temporaryRoot)).find((file) =>
  file.endsWith(".tgz"),
);
assert.ok(tarballName, "pnpm pack must create a package tarball");

await cp(fixtureSource, fixtureRoot, { recursive: true });
const fixturePackagePath = join(fixtureRoot, "package.json");
const fixturePackage = await readFile(fixturePackagePath, "utf8");
await writeFile(
  fixturePackagePath,
  fixturePackage.replace(
    "__DESIGN_SYSTEM_TARBALL__",
    relative(fixtureRoot, join(temporaryRoot, tarballName)),
  ),
);

run(["install", "--frozen-lockfile=false"], fixtureRoot);
run(["build"], fixtureRoot);

async function findCssFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findCssFiles(path)));
    else if (entry.name.endsWith(".css")) files.push(path);
  }
  return files;
}

const cssFiles = await findCssFiles(join(fixtureRoot, ".next/static"));
assert.ok(cssFiles.length > 0, "Next.js must emit production CSS");
const productionCss = (
  await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))
).join("\n");

const checks = [
  ["card padding", /padding-inline:var\(--ds-surface-padding\)/],
  ["sidebar background", /background-color:var\(--sidebar-canvas\)/],
  ["flex layout", /display:flex/],
  ["dropdown opacity", /opacity:\.7/],
  ["borders", /border-style:var\(--tw-border-style\)/],
  ["responsive topbar columns", /minmax\(0,1fr\).*auto/],
  ["large breakpoint", /@media ?\((?:min-width:|width>=)64rem\)/],
  ["dialog positioning", /position:fixed/],
  ["dark mode", /\.dark/],
];

for (const [name, pattern] of checks) {
  assert.match(productionCss, pattern, `Missing packaged ${name} styles`);
}

const installedPackageRoot = join(
  fixtureRoot,
  "node_modules/@conscia-labs/design-system",
);
const installedFoundation = await readFile(
  join(installedPackageRoot, "dist/foundation.css"),
  "utf8",
);
assert.doesNotMatch(
  installedFoundation,
  /\.flex\s*\{/,
  "Tailwind applications must not receive generic precompiled utilities",
);

console.log(
  `Packaged consumer production build verified from ${basename(tarballName)}.`,
);
