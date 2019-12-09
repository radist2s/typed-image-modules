#!/usr/bin/env node

import yargs from "yargs";

import {
  NAME_FORMATS,
  nameFormatDefault,
  defaultImageTypes,
  moduleNameFormatDefault
} from "./sass";
import { main } from "./main";

const { _: patterns, ...rest } = yargs
  .usage(
    "Generate .svg.scss from image files containing image size variables.\nUsage: $0 <glob pattern> [<glob pattern>] [options]"
  )
  .example(
    "$0 src",
    `All image files at any level in the src directory. Default image formats are: ${defaultImageTypes.join(
      ", "
    )}`
  )
  .example(
    "$0 src/**/*.svg src/**/*.png",
    "All .svg and .png files at any level in the src directory"
  )
  .example(
    "$0 src/**/*.svg --watch",
    "Watch all .svg files at any level in the src directory that are added or changed"
  )
  .example(
    "$0 src/**/*.svg --ignore **/secret.svg",
    'Ignore any file names "secret.svg"'
  )
  .demandCommand(1)
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n",
    describe:
      "The name format that should be used to transform image variables."
  })
  .option("variablePrefix", {
    string: true,
    alias: "p",
    describe: "Additional prefix for variables."
  })
  .option("exportVariables", {
    boolean: true,
    default: false,
    alias: "e",
    describe: "Export variables for CSS modules."
  })
  .option("watch", {
    boolean: true,
    default: false,
    alias: "w",
    describe:
      "Watch for added or changed files and (re-)generate the type definitions."
  })
  .option("ignoreInitial", {
    boolean: true,
    default: false,
    describe: "Skips the initial build when passing the watch flag."
  })
  .option("listDifferent", {
    boolean: true,
    default: false,
    alias: "l",
    describe:
      "List any type definitions that are different than those that would be generated."
  })
  .option("ignore", {
    string: true,
    array: true,
    default: [],
    describe: "Add a pattern or an array of glob patterns to exclude matches."
  })
  .option("imageFormats", {
    string: true,
    array: true,
    default: defaultImageTypes,
    alias: "f",
    describe: `Add a pattern or an array of image formats.`
  })
  .option("moduleNameFormat", {
    choices: NAME_FORMATS,
    default: moduleNameFormatDefault,
    alias: "m",
    describe:
      "The name format that should be used to transform export image variables."
  }).argv;

main(patterns, { ...rest });
