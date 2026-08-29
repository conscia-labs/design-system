import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

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

async function findJavaScriptFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await findJavaScriptFiles(path)));
    else if (/\.m?js$/.test(entry.name)) files.push(path);
  }
  return files;
}

const bundledJavaScript = (
  await Promise.all(
    (await findJavaScriptFiles("dist")).map((file) => readFile(file, "utf8")),
  )
).join("\n");
const legacyVariablePattern = /--(?:background|foreground|card|card-foreground|popover|popover-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-hover|accent-active|accent-background|accent-foreground|destructive|border|input|ring|sidebar)(?=\s*:)/;
const legacyUtilityPattern = /(?<![a-zA-Z0-9_-])(?:bg|text|border|ring|fill)-(?:background|foreground|card|card-foreground|popover|popover-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-hover|accent-active|accent-background|accent-foreground|destructive|border|input|ring|sidebar|sidebar-foreground|sidebar-accent|sidebar-active)(?![a-zA-Z0-9_-])/;
assert.doesNotMatch(
  bundledJavaScript,
  /(?:from|import\()\s*["']@base-ui\/react(?:\/[^"']*)?["']/,
  "The distribution must bundle Base UI instead of leaving consumer imports.",
);
assert.doesNotMatch(
  bundledJavaScript,
  /@radix-ui\//,
  "The distribution must not retain Radix runtime imports.",
);
assert.doesNotMatch(
  bundledJavaScript,
  /asChild/,
  "The v1 distribution must not retain the removed asChild API.",
);
assert.doesNotMatch(
  bundledJavaScript,
  legacyVariablePattern,
  "The distribution must not retain legacy semantic token variables.",
);
assert.doesNotMatch(
  bundledJavaScript,
  legacyUtilityPattern,
  "The distribution must not retain legacy semantic utility classes.",
);

const foundationCss = await readFile("dist/foundation.css", "utf8");
const tailwindCss = await readFile("dist/tailwind.css", "utf8");
const standaloneCss = await readFile("dist/standalone.css", "utf8");
const bundledCss = `${foundationCss}\n${tailwindCss}\n${standaloneCss}`;

assert.doesNotMatch(
  bundledCss,
  legacyVariablePattern,
  "Published CSS must not retain legacy semantic token variables.",
);
assert.doesNotMatch(
  bundledCss,
  /--color-(?:background|foreground|card|card-foreground|popover|popover-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-hover|accent-active|accent-background|accent-foreground|destructive|border|input|ring|sidebar|sidebar-foreground|sidebar-accent|sidebar-active)(?=\s*:)/,
  "Published CSS must not expose legacy Tailwind color mappings.",
);
assert.doesNotMatch(
  bundledCss,
  legacyUtilityPattern,
  "Published CSS must not emit legacy semantic utility classes.",
);

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

const packageManifest = JSON.parse(await readFile("package.json", "utf8"));
assert.ok(
  !packageManifest.keywords?.includes("radix-ui"),
  "Package metadata must not advertise Radix.",
);

const packageExports = await import("@conscia-labs/design-system");
for (const exportName of [
  "BrandIcon",
  "Button",
  "IconButton",
  "CardFooter",
  "TableCaption",
  "TableFooter",
  "DataTable",
  "SearchableSelect",
  "AlertDialog",
  "Popover",
  "ShortcutHint",
  "Spinner",
  "AvatarGroup",
  "FilterChip",
  "FilterBar",
  "CommandPalette",
  "ToastProvider",
  "ToastViewport",
  "useToast",
]) {
  assert.equal(
    typeof packageExports[exportName],
    "function",
    `Expected the package to export ${exportName}.`,
  );
}
assert.equal(
  packageExports.useRender,
  undefined,
  "Base UI composition utilities must remain internal.",
);
assert.equal(
  packageExports.mergeProps,
  undefined,
  "Base UI prop utilities must remain internal.",
);

console.log("Package artifacts and public imports verified.");
