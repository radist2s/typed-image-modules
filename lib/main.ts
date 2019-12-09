import path from "path";
import slash from "slash";

import { generate, listDifferent, MainOptions, watch } from "./core";
import * as fs from "fs";

function makePattern(imageFormat: string, pathGlob: string) {
  return slash(path.resolve(pathGlob, `**/*.${imageFormat}`));
}

export const main = async (
  filesGlob: string | string[],
  options: MainOptions
) => {
  const { imageFormats } = options;

  if (!imageFormats || !imageFormats.length) {
    throw new Error("Image formats are empty");
  }

  filesGlob = typeof filesGlob === "string" ? [filesGlob] : filesGlob;

  const patterns: string[] = filesGlob.reduce((carry: string[], fileGlob) => {
    if (fs.existsSync(fileGlob) && fs.lstatSync(fileGlob).isDirectory()) {
      return carry.concat(
        imageFormats.map(format => makePattern(format, fileGlob))
      );
    }

    return carry.concat(fileGlob);
  }, []);

  if (options.listDifferent) {
    listDifferent(patterns, options);
    return;
  }

  if (options.watch) {
    watch(patterns, options);
  } else {
    await generate(patterns, options);
  }
};
