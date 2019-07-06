import typescript from "typescript";
import ts from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.ts",

  plugins: [
    ts({ typescript })
  ],
  external: ["tshkt"],
  watch: {
    include: "src/**"
  },
  output: [{
    file: pkg.module,
    format: "es",
    sourcemap: true
  }]
}
