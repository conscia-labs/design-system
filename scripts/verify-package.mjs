import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const expectedFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/foundation/index.js",
  "dist/patterns/index.js",
  "dist/primitives/index.js",
  "dist/styles.css",
];

await Promise.all(expectedFiles.map((file) => access(file)));

const entrySource = await readFile("dist/index.js", "utf8");
assert.match(
  entrySource,
  /^"use client";/,
  "The public JavaScript entry must preserve the React client boundary.",
);

const packageExports = await import("@conscia-code/design-system");
for (const exportName of ["Button", "DataTable", "SearchableSelect"]) {
  assert.equal(
    typeof packageExports[exportName],
    "function",
    `Expected the package to export ${exportName}.`,
  );
}

console.log("Package artifacts and public imports verified.");
