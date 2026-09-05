import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

async function git(args, { allowFailure = false } = {}) {
  try {
    const result = await execFileAsync("git", args, {
      cwd: repositoryRoot,
      encoding: "utf8",
    });

    return {
      code: 0,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (error) {
    if (allowFailure) {
      return {
        code: typeof error.code === "number" ? error.code : 1,
        stdout: error.stdout?.trim() ?? "",
        stderr: error.stderr?.trim() ?? "",
      };
    }

    const detail = error.stderr?.trim() || error.message;
    throw new Error(`git ${args.join(" ")} failed: ${detail}`);
  }
}

async function createReleaseTag() {
  const packageManifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const releaseTag = `v${packageManifest.version}`;
  const branch = await git(["branch", "--show-current"]);

  if (branch.stdout !== "main") {
    throw new Error(
      `Release tags must be created from main; current branch is ${branch.stdout || "detached HEAD"}.`,
    );
  }

  const status = await git(["status", "--porcelain"]);
  if (status.stdout) {
    throw new Error("Release requires a clean worktree. Commit or stash local changes first.");
  }

  console.log("Checking that local main matches origin/main...");
  await git(["fetch", "--no-tags", "origin", "main"]);
  const head = await git(["rev-parse", "HEAD"]);
  const remoteHead = await git(["rev-parse", "origin/main"]);

  if (head.stdout !== remoteHead.stdout) {
    throw new Error(
      "Local main is not exactly origin/main. Pull the released commit before tagging.",
    );
  }

  const localTag = await git(["tag", "--list", releaseTag]);
  if (localTag.stdout === releaseTag) {
    throw new Error(`Tag ${releaseTag} already exists locally.`);
  }

  const remoteTag = await git(
    ["ls-remote", "--exit-code", "--tags", "origin", `refs/tags/${releaseTag}`],
    { allowFailure: true },
  );
  if (remoteTag.code === 0) {
    throw new Error(`Tag ${releaseTag} already exists on origin.`);
  }

  console.log(`Creating ${releaseTag} for ${packageManifest.name} ${packageManifest.version}...`);
  await git(["tag", "-a", releaseTag, "-m", `Release ${releaseTag}`]);
  await git(["push", "origin", releaseTag]);
  console.log(`Release ${releaseTag} pushed. Pages and npm release workflows are now running.`);
}

try {
  await createReleaseTag();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
