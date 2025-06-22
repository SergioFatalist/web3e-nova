import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import layouts from "vite-plugin-vue-layouts";
import vitePluginApiSchema from "./vite-plugin-api-schema";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginApiSchema({
      basedir: "./src/generated",
      includes: "../proto",
      sources: "../proto/**/*.proto",
      protobuf: "protobuf",
      zod: "schema",
    }),
    vue({
      template: { transformAssetUrls },
    }),
    layouts(),
    quasar({
      sassVariables: "@/assets/variables.scss",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    manifest: true,
  },
});
