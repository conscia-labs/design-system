import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const inventoryPath = new URL(
  "../playground/src/components/component-inventory.ts",
  import.meta.url,
);
const packagePath = new URL("../package.json", import.meta.url);
const guidePath = new URL("../AGENT_GUIDE.md", import.meta.url);
const publicDirectory = new URL("../playground/public/", import.meta.url);
const playgroundUrl = "https://conscia-labs.github.io/design-system";

const [inventorySource, packageSource, guide] = await Promise.all([
  readFile(inventoryPath, "utf8"),
  readFile(packagePath, "utf8"),
  readFile(guidePath, "utf8"),
]);

const inventoryMatch = inventorySource.match(
  /export const componentInventory = (\[[\s\S]*?\]) as const satisfies/,
);

if (!inventoryMatch) {
  throw new Error(`Could not read the component inventory from ${inventoryPath}`);
}

const componentFamilies = Function(
  `"use strict"; return (${inventoryMatch[1]});`,
)();
const packageManifest = JSON.parse(packageSource);
const allowedCategories = new Set([
  "Foundation",
  "Primitive",
  "Pattern",
  "Compatibility",
]);

for (const entry of componentFamilies) {
  if (
    !allowedCategories.has(entry.category) ||
    typeof entry.family !== "string" ||
    typeof entry.description !== "string" ||
    typeof entry.route !== "string" ||
    !Array.isArray(entry.exports) ||
    entry.exports.some((name) => typeof name !== "string")
  ) {
    throw new Error(`Invalid component inventory entry: ${JSON.stringify(entry)}`);
  }
}

const manifest = {
  schemaVersion: 1,
  package: packageManifest.name,
  version: packageManifest.version,
  guide: "./AGENT_GUIDE.md",
  playground: `${playgroundUrl}/`,
  componentFamilies,
};
const serializedManifest = `${JSON.stringify(manifest, null, 2)}\n`;
const routeUrl = (route) =>
  route === "/" ? `${playgroundUrl}/` : `${playgroundUrl}${route}/`;
const llmsText = `# Conscia Design System

> Agent-oriented index for @conscia-labs/design-system ${packageManifest.version}.

- Live playground: ${playgroundUrl}/
- Agent guide: ${playgroundUrl}/agent-guide.md
- Machine-readable inventory: ${playgroundUrl}/agent-manifest.json
- Package: https://www.npmjs.com/package/${packageManifest.name}
- Source: https://github.com/conscia-labs/design-system

Read the agent guide before changing UI in a consuming application. Prefer a
published pattern over rebuilding the same workflow from primitives. Import
only public exports and keep routing, data, permissions, and business behavior
in the application.

## Component families

${componentFamilies
  .map(
    (entry) =>
      `- ${entry.family} (${entry.category}): ${entry.description} ${routeUrl(entry.route)} Exports: ${entry.exports.join(", ")}.`,
  )
  .join("\n")}
`;

await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL("../agent-manifest.json", import.meta.url), serializedManifest),
  writeFile(new URL("agent-manifest.json", publicDirectory), serializedManifest),
  writeFile(new URL("agent-guide.md", publicDirectory), guide),
  writeFile(new URL("llms.txt", publicDirectory), llmsText),
]);

console.log(
  `Generated agent guidance for ${componentFamilies.length} component families in ${repositoryRoot}.`,
);
