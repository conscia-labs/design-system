import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

const expectedFiles = [
  "AGENT_GUIDE.md",
  "agent-manifest.json",
  "bin/conscia-design-system.mjs",
  "dist/index.js",
  "dist/index.d.ts",
  "dist/charts/index.js",
  "dist/charts/index.d.ts",
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

const chartsSource = await readFile("dist/charts/index.js", "utf8");
assert.match(chartsSource, /^"use client";/, "The charts entry must be client-only.");

// Recharts is an optional peer: only the charts entry may reach it.
async function staticImportGraph(entry) {
  const seen = new Set();
  const pending = [entry];
  while (pending.length) {
    const file = pending.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/(?:from|import)\s*["'](\.{1,2}\/[^"']+\.js)["']/g)) {
      pending.push(new URL(match[1], new URL(file, `file://${process.cwd()}/`)).pathname.slice(process.cwd().length + 1));
    }
  }
  return seen;
}
for (const entry of ["dist/index.js", "dist/patterns/index.js", "dist/primitives/index.js", "dist/foundation/index.js", "dist/utils/index.js"]) {
  for (const file of await staticImportGraph(entry)) {
    assert.doesNotMatch(await readFile(file, "utf8"), /["']recharts["']/, `${entry} must not import recharts (via ${file}).`);
  }
}
const chartsGraph = await Promise.all([...(await staticImportGraph("dist/charts/index.js"))].map((file) => readFile(file, "utf8")));
assert.ok(chartsGraph.some((source) => /["']recharts["']/.test(source)), "The charts entry must import recharts as an external peer.");

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
assert.match(
  foundationCss,
  /\[data-sidebar-variant=.auto.\]\[data-sidebar-treatment=.quiet.\]/,
  "The quiet treatment must follow semantic roles for appearance-aware sidebars.",
);
assert.match(
  foundationCss,
  /\[data-sidebar-variant=.light.\]\[data-sidebar-treatment=.quiet.\]/,
  "The quiet treatment must support the light sidebar variant.",
);
assert.doesNotMatch(
  foundationCss,
  /(?:^|})\[data-sidebar-treatment=.quiet.\]\s*\{/,
  "The quiet treatment must not override the explicit dark sidebar variant.",
);
assert.match(
  foundationCss,
  /--sidebar-active-background:\s*var\(--selection-background\)/,
  "The quiet sidebar treatment must use the semantic selection role.",
);
assert.match(
  standaloneCss,
  /--sidebar-active-background:\s*var\(--selection-background\)/,
  "The standalone stylesheet must include the quiet sidebar token mapping.",
);
assert.match(
  standaloneCss,
  /grid-template-columns:repeat\(1,minmax\(0,1fr\)\)/,
  "The standalone stylesheet must include compact full-width metric rows.",
);
for (const declaration of [
  "--palette-burgundy: #1e0721",
  "--palette-electric-blue: #4962ff",
  "--palette-green: #1c4e51",
  "--brand: var(--palette-burgundy)",
  "--brand-accent: var(--palette-electric-blue)",
  "--brand-supporting: var(--palette-green)",
  "--brand-secondary: var(--brand-supporting)",
  "--color-brand-accent: var(--brand-accent)",
  "--color-brand-supporting: var(--brand-supporting)",
]) {
  assert.ok(
    bundledCss.includes(declaration),
    `Published CSS must include ${declaration}.`,
  );
}
assert.doesNotMatch(foundationCss, /@tailwind utilities/);
assert.doesNotMatch(foundationCss, /\.flex\s*\{/);
assert.doesNotMatch(foundationCss, /box-sizing:border-box/);
assert.match(tailwindCss, /@import "\.\/foundation\.css"/);
assert.match(tailwindCss, /@source "\.\/\*\*\/\*\.js"/);
assert.match(standaloneCss, /\.flex\{/);

// Every font the standalone bundle requests ships inside the package.
const standaloneFonts = [...standaloneCss.matchAll(/url\(([^)]+\.woff2)\)/g)].map((match) => match[1]);
assert.ok(standaloneFonts.length > 0, "The standalone stylesheet must bundle Inter.");
for (const font of standaloneFonts) {
  assert.match(font, /^\.\/fonts\/inter-/, `Standalone font ${font} must be a packaged file.`);
  await access(new URL(`../dist/${font.slice(2)}`, import.meta.url));
}
assert.doesNotMatch(bundledCss, /Saans|Source Sans|fonts\.googleapis/);

const utilitySource = await readFile("dist/utils/index.js", "utf8");
assert.doesNotMatch(
  utilitySource,
  /^"use client";/,
  "Server-safe utilities must remain importable from React Server Components.",
);

const packageManifest = JSON.parse(await readFile("package.json", "utf8"));
const agentManifest = JSON.parse(
  await readFile("agent-manifest.json", "utf8"),
);
assert.equal(agentManifest.package, packageManifest.name);
assert.equal(agentManifest.version, packageManifest.version);
assert.ok(agentManifest.componentFamilies.length > 0);
assert.equal(
  packageManifest.bin?.["conscia-design-system"],
  "./bin/conscia-design-system.mjs",
);
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
assert.equal(packageExports.TrendLineChart, undefined, "Charts must stay out of the root entry.");

const chartExports = await import("@conscia-labs/design-system/charts");
for (const exportName of ["ChartContainer", "TrendLineChart", "TrendAreaChart", "CategoryBarChart", "DonutChart", "Sparkline", "chartColor"]) {
  assert.equal(typeof chartExports[exportName], "function", `Expected the charts entry to export ${exportName}.`);
}

console.log("Package artifacts and public imports verified.");
