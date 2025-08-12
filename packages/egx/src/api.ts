//@ts-ignore
import esbuild from "esbuild";
import { join } from "node:path";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
} from "node:fs";

const EXT = [".tsx", ".ts", ".js", ".jsx", ".cjs", ".mjs"];

function rimraf(dir_path: string) {
  if (existsSync(dir_path)) {
    readdirSync(dir_path).forEach(function (entry) {
      var entry_path = join(dir_path, entry);
      if (lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        unlinkSync(entry_path);
      }
    });
    rmdirSync(dir_path);
  }
}
function readDir(dir: string) {
  const files: string[] = [];
  const getFiles = (path: string) => {
    const dirs = readdirSync(path, { withFileTypes: true });
    for (const dirEntry of dirs) {
      if (dirEntry.isDirectory()) {
        getFiles(join(path, dirEntry.name));
      } else if (dirEntry.isFile()) {
        files.push(join(path, dirEntry.name));
      }
    }
  };
  getFiles(dir);
  return files;
}
export const build = (
  src: string = "src",
  out: string = "dist",
  config: esbuild.BuildOptions = {},
) => {
  const list = readDir(src);
  const entries = [] as string[];
  list.forEach((path) => {
    const hashExt = EXT.findIndex((ext) => path.endsWith(ext)) !== -1;
    if (hashExt) entries.push(path);
  });
  rimraf(out);
  mkdirSync(out);
  config.format ??= "cjs";
  config.target ??= "ES2020";
  esbuild.buildSync({
    bundle: false,
    entryPoints: entries,
    outdir: out,
    platform: "node",
    ...config,
  });
};
