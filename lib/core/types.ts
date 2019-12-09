import { Options } from "../sass";

export interface MainOptions extends Options {
  ignore: string[];
  listDifferent: boolean;
  watch: boolean;
  ignoreInitial: boolean;
}
