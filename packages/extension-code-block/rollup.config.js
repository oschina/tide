import { plugins } from "../../script/rollup.common";
import packageJson from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        name: packageJson.name,
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins,
  },
];
