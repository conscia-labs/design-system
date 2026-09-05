#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const startMarker = "<!-- conscia-design-system:start -->";
const endMarker = "<!-- conscia-design-system:end -->";
const defaultPlaygroundUrl = "https://conscia-labs.github.io/design-system/";

export function agentInstructionsBlock({
  playgroundUrl = defaultPlaygroundUrl,
} = {}) {
  return `${startMarker}
## Conscia design system

- Use \`@conscia-labs/design-system\` for shared product UI.
- Before implementing or modifying UI, read \`node_modules/@conscia-labs/design-system/AGENT_GUIDE.md\`.
- Prefer published patterns over recreating the same workflow from primitives.
- Do not copy design-system components into this repository.
- Do not add Base UI, Radix, or shadcn replacements for behavior the package already provides.
- Keep routing, data access, permissions, validation, and business behavior in this application.
- Use the live visual reference at ${playgroundUrl}
${endMarker}`;
}

export async function initAgentInstructions({
  cwd = process.cwd(),
  dryRun = false,
  playgroundUrl = defaultPlaygroundUrl,
} = {}) {
  const agentsPath = resolve(cwd, "AGENTS.md");
  const block = agentInstructionsBlock({ playgroundUrl });
  let existing = "";

  try {
    existing = await readFile(agentsPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const newline = existing.includes("\r\n") ? "\r\n" : "\n";
  const normalizedBlock = block.replaceAll("\n", newline);
  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker);
  let next;
  let action;

  if (start !== -1 && end !== -1 && end > start) {
    next = `${existing.slice(0, start)}${normalizedBlock}${existing.slice(end + endMarker.length)}`;
    action = next === existing ? "unchanged" : "updated";
  } else {
    const prefix = existing.trimEnd();
    next = prefix ? `${prefix}${newline}${newline}${normalizedBlock}${newline}` : `${normalizedBlock}${newline}`;
    action = "created";
  }

  if (!dryRun && next !== existing) await writeFile(agentsPath, next);

  return { action, content: next, path: agentsPath };
}

function printHelp() {
  console.log(`Conscia Design System

Usage:
  conscia-design-system init-agents [--dry-run]

Commands:
  init-agents  Add or update the managed Conscia section in ./AGENTS.md.
`);
}

async function main() {
  const [command, ...options] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command !== "init-agents") {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  const unsupported = options.filter((option) => option !== "--dry-run");
  if (unsupported.length > 0) {
    console.error(`Unknown option: ${unsupported[0]}`);
    process.exitCode = 1;
    return;
  }

  const result = await initAgentInstructions({
    dryRun: options.includes("--dry-run"),
  });
  console.log(
    options.includes("--dry-run")
      ? result.content
      : `${result.action === "unchanged" ? "Kept" : "Updated"} ${result.path}`,
  );
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (entryPath === fileURLToPath(import.meta.url)) {
  await main();
}
