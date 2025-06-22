import { globSync } from "glob";
import child_process from "node:child_process";
import { mkdirSync } from "node:fs";
import os from "node:os";
import { rimrafSync } from "rimraf";
import { type Plugin } from "vite";

export interface ProtocPluginConfig {
  sources: string | string[];
  includes: string | string[];
  basedir: string;
  protobuf: string;
  zod: string;
}

export default function (config: ProtocPluginConfig): Plugin {
  return {
    name: "vite-protobuf-plugin",
    buildStart(_options) {
      const includes = Array.isArray(config.includes)
        ? config.includes.join(" -I")
        : ` -I ${config.includes}`;

      const sources = Array.isArray(config.sources)
        ? config.sources.map((p) => globSync(p, { nodir: true }).join(" ")).join(" ")
        : globSync(config.sources).join(" ");

      const protobuf = `${config.basedir}/${config.protobuf}`;

      rimrafSync(protobuf);
      mkdirSync(protobuf, { recursive: true });

      const isWindows = os.platform() === "win32";
      const ext = isWindows ? ".cmd" : ""; // Добавляем расширение cmd для Windows

      const protoc =
        `protoc${ext} --plugin=./node_modules/.bin/protoc-gen-ts_proto${ext}` +
        " --ts_proto_opt=onlyTypes=true" +
        " --ts_proto_opt=outputServices=false" +
        " --ts_proto_opt=esModuleInterop=true" +
        ` --ts_proto_out=${protobuf} ` +
        ` ${includes} ${sources}`;

      console.debug("Proto compile command: " + protoc);
      child_process.execSync(protoc);

      const schema = `${config.basedir}/${config.zod}`;

      rimrafSync(schema);
      mkdirSync(schema, { recursive: true });

      globSync(`${protobuf}/**/*.ts`, { nodir: true }).forEach((src) => {
        const dst = src.replace(config.protobuf, config.zod);
        // child_process.execSync(`ts-to-zod ${src} ${dst} --inferredTypes=${typ}`);
        child_process.execSync(`ts-to-zod ${src} ${dst}`);
      });
    },
  };
}
