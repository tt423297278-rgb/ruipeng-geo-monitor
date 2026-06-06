import { spawn } from "node:child_process";
import { openSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const nodeBinDir = resolve(
  process.env.USERPROFILE || "",
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin",
);
const nextCli = resolve(root, "node_modules/next/dist/bin/next");
const out = openSync(resolve(root, ".next-dev.log"), "a");
const err = openSync(resolve(root, ".next-dev.err.log"), "a");

const child = spawn(process.execPath, [nextCli, "dev", "-p", "3000"], {
  cwd: root,
  detached: true,
  stdio: ["ignore", out, err],
  env: {
    ...process.env,
    PATH: `${nodeBinDir};${process.env.PATH || ""}`,
  },
  windowsHide: true,
});

child.unref();
console.log(`Next dev server started in background. PID=${child.pid}`);
