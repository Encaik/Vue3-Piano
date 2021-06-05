import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
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
});