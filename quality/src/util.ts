import { resolve } from "path";
import { spawnSync, type SpawnOptions } from "child_process";

export const rootDir = resolve(__dirname, "..", "..", "..");
export const configBase = resolve(__dirname, "..");
export const romeConfig = resolve(__dirname, "configs");
export const jestConfig = resolve(romeConfig, "jest.js");

export const runCmdFromHere = (cmd: string, args: string[]) => {
  const opts: SpawnOptions = {
    env: { ...process.env },
    shell: true,
    stdio: "inherit",
    cwd: configBase,
  };
  spawnSync(cmd, args, opts);
};

export const runCmdFromCallee = (cmd: string, args: string[]) => {
  const opts: SpawnOptions = {
    env: { ...process.env },
    shell: true,
    stdio: "inherit",
    cwd: process.cwd(),
  };
  spawnSync(cmd, args, opts);
};
