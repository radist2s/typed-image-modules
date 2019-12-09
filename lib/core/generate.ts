import glob from "glob";

import { alerts } from "./alerts";
import { MainOptions } from "./types";
import { writeFile } from "./write-file";

/**
 * Given a file glob generate the corresponding types once.
 *
 * @param patterns the file pattern to generate type definitions for
 * @param options the CLI options
 */
export const generate = async (
  patterns: string[] | string,
  options: MainOptions
): Promise<void> => {
  // Find all the files that match the provided pattern.

  if (typeof patterns === "string") {
    patterns = [patterns];
  }

  const files = patterns
    .map(pattern => glob.sync(pattern, { ignore: options.ignore }))
    .reduce((filesAll, filesGroup) => filesAll.concat(filesGroup));

  if (!files || !files.length) {
    alerts.error("No files found.");
    return;
  }

  // This case still works as expected but it's easy to do on accident so
  // provide a (hopefully) helpful warning.
  if (files.length === 1) {
    alerts.warn(
      `Only 1 file found for ${patterns}. If using a glob pattern (eg: dir/**/*.scss) make sure to wrap in quotes (eg: "dir/**/*.scss").`
    );
  }

  alerts.success(`Found ${files.length} files. Generating type definitions...`);

  // Wait for all the type definitions to be written.
  await Promise.all(files.map(file => writeFile(file, options)));
};
