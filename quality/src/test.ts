import { jestConfig, runCmdFromCallee } from "./util";

export const runTests = () => {
  const testCmdParts = ["jest", "--config", jestConfig, "--passWithNoTests"];
  runCmdFromCallee("yarn", testCmdParts);
};
