import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageUrl = new URL("../package.json", import.meta.url);
const readmeUrl = new URL("../README.md", import.meta.url);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

const packageManifest = JSON.parse(await readFile(packageUrl, "utf8"));
const readme = await readFile(readmeUrl, "utf8");
const releaseLine = /^> \*\*Current release:\*\* `[^`]+` is the latest stable v1 release\.$/m;
const nextReleaseLine = `> **Current release:** \`${packageManifest.version}\` is the latest stable v1 release.`;

if (!releaseLine.test(readme)) {
  throw new Error("README.md is missing its current-release marker.");
}

const nextReadme = readme.replace(releaseLine, nextReleaseLine);
if (nextReadme !== readme) await writeFile(readmeUrl, nextReadme);

await import("./build-agent-manifest.mjs");

console.log(
  `Synchronized release metadata for ${packageManifest.name} ${packageManifest.version} from ${repositoryRoot}.`,
);
