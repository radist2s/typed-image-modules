import { NameFormat } from "./file-to-image-size";

const nameFormatDefault: NameFormat = "kebab";
const moduleNameFormatDefault: NameFormat = "camel";
const defaultImageTypes = "jpg,jpeg,gif,png,webp,svg".split(",");

export { nameFormatDefault, moduleNameFormatDefault, defaultImageTypes };

export {
  Aliases,
  NameFormat,
  NAME_FORMATS,
  Options,
  fileToImageSize
} from "./file-to-image-size";
