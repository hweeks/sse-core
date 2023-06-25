import { runCmdFromCallee } from "./util";

export const buildTypes = () => {
  const typeCmdParts = ["tsc"];
  runCmdFromCallee("yarn", typeCmdParts);
};
