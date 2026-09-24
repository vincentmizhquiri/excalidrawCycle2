import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3002,
    open: true,
  },
  publicDir: "public",
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
      treeShaking: true,
    },
  },
});
