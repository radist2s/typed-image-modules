import camelcase from "camelcase";
import { paramCase } from "param-case";
import { imageSize } from "image-size";
import path from "path";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { moduleNameFormatDefault, nameFormatDefault } from "./index";

export type ClassName = string;
export type ClassNames = ClassName[];

export interface Aliases {
  [index: string]: string;
}

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface Options {
  nameFormat?: NameFormat;
  imageFormats?: string[];
  exportVariables?: boolean;
  moduleNameFormat?: NameFormat;
  variablePrefix?: string;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none"
];

export interface ImageVariablesMap {
  [key: string]: string;
}

export interface ImageModuleData {
  moduleName: string;
  moduleFullName: string;
  dimensions: ISizeCalculationResult;
  variables: ImageVariablesMap;
  exportedVariables: ImageVariablesMap;
}

export const fileToImageSize = (
  file: string,
  {
    nameFormat = nameFormatDefault,
    moduleNameFormat = moduleNameFormatDefault,
    variablePrefix = ""
  }: Options = {} as Options
) => {
  const transformDefault = classNameTransformer("kebab");
  const transformerVariables = classNameTransformer(nameFormat);
  const transformerExported = classNameTransformer(moduleNameFormat);

  function getVariableName(
    fileName: string,
    variableName: string,
    transformer: Transformer
  ) {
    return transformer(
      transformDefault(`${variablePrefix} ${fileName} ${variableName}`)
    );
  }

  function getVariablesMap(
    fileName: string,
    dimensions: ISizeCalculationResult,
    transformer: Transformer
  ): ImageVariablesMap {
    return {
      [getVariableName(
        fileName,
        "width",
        transformer
      )]: `${dimensions.width}px`,
      [getVariableName(
        fileName,
        "height",
        transformer
      )]: `${dimensions.height}px`
    };
  }

  return new Promise<ImageModuleData>((resolve, reject) => {
    imageSize(file, (err, dimensions) => {
      if (err) {
        reject(err);
        return;
      }

      if (!dimensions) {
        reject(`No dimensions found for file ${file}`);
        return;
      }

      const fileExtName = path.extname(file);
      const fileName = path.basename(file, fileExtName);

      const variables = {
        ...getVariablesMap(fileName, dimensions, transformerVariables),
        [getVariableName(
          fileName,
          "size",
          transformerVariables
        )]: `(width: ${dimensions.width}px, height: ${dimensions.height}px)`
      };

      resolve({
        moduleName: transformerVariables(fileName),
        moduleFullName: transformerVariables(`${fileName}${fileExtName}`),
        dimensions,
        variables,
        exportedVariables: getVariablesMap(
          fileName,
          dimensions,
          transformerExported
        )
      });
    });
  });
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return className => paramCase(className);
    case "camel":
      return className => camelcase(className);
    case "dashes":
      return className =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return className => className;
  }
};