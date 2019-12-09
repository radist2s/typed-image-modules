import {
  ImageModuleData,
  ImageVariablesMap
} from "lib/sass/file-to-image-size";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

function variablesTemplate(variables: ImageVariablesMap, prefix = ""): string {
  const variableRows = Object.keys(variables).map(variableName => {
    return `${prefix}${variableName}: ${variables[variableName]};\n`;
  });

  return variableRows.join("");
}

export const classNamesToTypeDefinitions = (
  imageModuleData: ImageModuleData,
  exportType?: boolean
): string | null => {
  let code = variablesTemplate(imageModuleData.variables, "$");

  if (exportType) {
    code += `\n//noinspection CssInvalidPseudoSelector\n`; // suppress IDE error
    code += `:export {\n`;
    code += variablesTemplate(imageModuleData.exportedVariables, "  ");
    code += `}`;
  }

  return code.trim() || null;
};
