import fs from "fs";

import { alerts } from "./alerts";
import { getDefinitionPath, classNamesToTypeDefinitions } from "../typescript";
import { fileToImageSize } from "../sass";
import { MainOptions } from "./types";

/**
 * Given a single file generate the proper types.
 *
 * @param file the SCSS file to generate types for
 * @param options the CLI options
 */
export const writeFile = (
  file: string,
  options: MainOptions
): Promise<void> => {
  return fileToImageSize(file, options)
    .then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions(
        classNames,
        options.exportVariables
      );

      if (!typeDefinition) {
        alerts.notice(`[NO GENERATED TYPES] ${file}`);
        return;
      }

      const path = getDefinitionPath(file);

      fs.writeFileSync(path, typeDefinition);
      alerts.success(`[GENERATED TYPES] ${path}`);
    })
    .catch(message => {
      alerts.error(`${file}\n${message}`);
    });
};
