import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const expectedTag = `v${packageJson.version}`;
const releaseTag = process.env.GITHUB_REF_NAME;

assert.ok(
  releaseTag,
  "GITHUB_REF_NAME is required to verify the release version.",
);
assert.equal(
  releaseTag,
  expectedTag,
  `Release tag ${releaseTag} does not match package version ${packageJson.version}.`,
);

console.log(`Release tag ${releaseTag} matches ${packageJson.name}.`);
