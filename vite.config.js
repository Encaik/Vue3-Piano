import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "docs",
  },
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  resolve: {
   alias: {
     "@": path.resolve(__dirname, "src"),
   },
 },
});
