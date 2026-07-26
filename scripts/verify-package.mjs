import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const expectedFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/foundation/index.js",
  "dist/patterns/index.js",
  "dist/primitives/index.js",
  "dist/utils/index.js",
  "dist/foundation.css",
  "dist/tailwind.css",
  "dist/standalone.css",
  "dist/styles.css",
];

await Promise.all(expectedFiles.map((file) => access(file)));

const entrySource = await readFile("dist/index.js", "utf8");
assert.match(
  entrySource,
  /^"use client";/,
  "The component root must be an intentional client-only entry.",
);

const foundationCss = await readFile("dist/foundation.css", "utf8");
const tailwindCss = await readFile("dist/tailwind.css", "utf8");
const standaloneCss = await readFile("dist/standalone.css", "utf8");

assert.match(foundationCss, /@theme inline/);
assert.match(foundationCss, /@custom-variant dark/);
assert.doesNotMatch(foundationCss, /@tailwind utilities/);
assert.doesNotMatch(foundationCss, /\.flex\s*\{/);
assert.doesNotMatch(foundationCss, /box-sizing:border-box/);
assert.match(tailwindCss, /@import "\.\/foundation\.css"/);
assert.match(tailwindCss, /@source "\.\/\*\*\/\*\.js"/);
assert.match(standaloneCss, /\.flex\{/);

const utilitySource = await readFile("dist/utils/index.js", "utf8");
assert.doesNotMatch(
  utilitySource,
  /^"use client";/,
  "Server-safe utilities must remain importable from React Server Components.",
);

const packageExports = await import("@conscia-labs/design-system");
for (const exportName of ["Button", "DataTable", "SearchableSelect"]) {
  assert.equal(
    typeof packageExports[exportName],
    "function",
    `Expected the package to export ${exportName}.`,
  );
}

console.log("Package artifacts and public imports verified.");
