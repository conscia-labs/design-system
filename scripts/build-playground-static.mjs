import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const nextBinary = fileURLToPath(
  new URL(
    `../node_modules/.bin/next${process.platform === "win32" ? ".cmd" : ""}`,
    import.meta.url,
  ),
);

execFileSync(nextBinary, ["build", "playground"], {
  cwd: repositoryRoot,
  env: {
    ...process.env,
    NEXT_PUBLIC_BASE_PATH:
      process.env.NEXT_PUBLIC_BASE_PATH || "/design-system",
    NEXT_TELEMETRY_DISABLED: "1",
    PLAYGROUND_STATIC_EXPORT: "true",
  },
  stdio: "inherit",
});
