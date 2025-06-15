import { Configuration } from "webpack";
import { ConfigBuild } from "./types";
declare const build: (params: ConfigBuild) => Configuration;
export { build };
