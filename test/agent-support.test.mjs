import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  agentInstructionsBlock,
  initAgentInstructions,
} from "../bin/conscia-design-system.mjs";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

test("agent manifest stays aligned with the package and public site", async () => {
  const packageManifest = await readJson("package.json");
  const agentManifest = await readJson("agent-manifest.json");
  const publicManifest = await readJson("playground/public/agent-manifest.json");
  const installedGuide = await readFile("AGENT_GUIDE.md", "utf8");
  const publicGuide = await readFile("playground/public/agent-guide.md", "utf8");
  const llmsText = await readFile("playground/public/llms.txt", "utf8");

  assert.equal(agentManifest.package, packageManifest.name);
  assert.equal(agentManifest.version, packageManifest.version);
  assert.deepEqual(publicManifest, agentManifest);
  assert.equal(publicGuide, installedGuide);
  assert.ok(agentManifest.componentFamilies.length > 0);
  assert.match(llmsText, new RegExp(packageManifest.version.replaceAll(".", "\\.")));

  for (const entry of agentManifest.componentFamilies) {
    assert.match(llmsText, new RegExp(entry.family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(entry.exports.length > 0);
  }
});

test("consumer initializer creates an idempotent managed AGENTS.md block", async () => {
  const root = await mkdtemp(join(tmpdir(), "conscia-agent-init-"));
  await writeFile(join(root, "AGENTS.md"), "# Product instructions\n\nKeep this text.\n");

  const created = await initAgentInstructions({ cwd: root });
  const first = await readFile(join(root, "AGENTS.md"), "utf8");
  const unchanged = await initAgentInstructions({ cwd: root });
  const second = await readFile(join(root, "AGENTS.md"), "utf8");

  assert.equal(created.action, "created");
  assert.equal(unchanged.action, "unchanged");
  assert.equal(second, first);
  assert.match(first, /# Product instructions/);
  assert.match(first, /Keep this text\./);
  assert.match(first, /node_modules\/@conscia-labs\/design-system\/AGENT_GUIDE\.md/);
  assert.equal(first.match(/conscia-design-system:start/g)?.length, 1);
});

test("consumer initializer updates only its managed block", async () => {
  const root = await mkdtemp(join(tmpdir(), "conscia-agent-update-"));
  const originalBlock = agentInstructionsBlock({
    playgroundUrl: "https://old.example/",
  });
  await writeFile(
    join(root, "AGENTS.md"),
    `# Existing\n\n${originalBlock}\n\n## After\n\nPreserve me.\n`,
  );

  const result = await initAgentInstructions({ cwd: root });
  const updated = await readFile(join(root, "AGENTS.md"), "utf8");

  assert.equal(result.action, "updated");
  assert.doesNotMatch(updated, /old\.example/);
  assert.match(updated, /conscia-labs\.github\.io\/design-system/);
  assert.match(updated, /## After\n\nPreserve me\./);
  assert.equal(updated.match(/conscia-design-system:start/g)?.length, 1);
});

test("consumer initializer supports a non-mutating dry run", async () => {
  const root = await mkdtemp(join(tmpdir(), "conscia-agent-dry-run-"));
  const result = await initAgentInstructions({ cwd: root, dryRun: true });

  await assert.rejects(readFile(join(root, "AGENTS.md"), "utf8"), {
    code: "ENOENT",
  });
  assert.match(result.content, /## Conscia design system/);
});
