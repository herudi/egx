import { build } from "./api";

const args = process.argv?.slice(2) ?? [];

const source = args[0] ?? "src";
const out = args[1] ?? "dist";
const format = (args[2] ?? "--cjs").slice(2) as any;

build(source, out, { format });

console.log(
  `Success build project from ${source} to ${out} with format ${format}`,
);
