import { romeConfig, runCmdFromHere } from "./util";

export const runRome = () => {
  const lintCmdParts = ["rome", "check", "--config-path", romeConfig, process.cwd()];
  const formatCmdParts = ["rome", "format", "--config-path", romeConfig, process.cwd()];
  runCmdFromHere("yarn", lintCmdParts);
  runCmdFromHere("yarn", formatCmdParts);
};

export const runRomeFix = () => {
  const lintCmdParts = ["rome", "check", "--config-path", romeConfig, process.cwd(), "--apply-unsafe"];
  const formatCmdParts = ["rome", "format", "--config-path", romeConfig, process.cwd(), "--write"];
  runCmdFromHere("yarn", lintCmdParts);
  runCmdFromHere("yarn", formatCmdParts);
};
