import chokidar from "chokidar";

import { alerts } from "./alerts";
import { writeFile } from "./write-file";
import { MainOptions } from "./types";

/**
 * Watch a file glob and generate the corresponding types.
 *
 * @param patterns the file pattern to watch for file changes or additions
 * @param options the CLI options
 */
export const watch = (patterns: string[], options: MainOptions): void => {
  alerts.success("Watching files...");

  chokidar
    .watch(patterns, {
      ignoreInitial: options.ignoreInitial,
      ignored: options.ignore
    })
    .on("change", path => {
      alerts.info(`[CHANGED] ${path}`);
      writeFile(path, options);
    })
    .on("add", path => {
      alerts.info(`[ADDED] ${path}`);
      writeFile(path, options);
    });
};
