import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { buildTypes } from "./build-types";
import { runRome, runRomeFix } from "./lint";
import { runTests } from "./test";

yargs(hideBin(process.argv))
  .command(
    "lint",
    "check the code formatting and lint",
    () => {},
    (argv) => {
      runRome();
    },
  )
  .command(
    "lint-fix",
    "fix the code formatting and lint",
    () => {},
    (argv) => {
      runRomeFix();
    },
  )
  .command(
    "build-types",
    "check code quality",
    () => {},
    (argv) => {
      buildTypes();
    },
  )
  .command(
    "test",
    "run tests",
    () => {},
    (argv) => {
      runTests();
    },
  )
  .demandCommand(1)
  .parse();
