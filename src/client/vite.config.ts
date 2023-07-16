import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'node:path'

export default defineConfig({
  base: "/__email-preview__/",

  resolve: {
    alias: {
      "@/": __dirname,
    },
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["vite-hot-client"],
  },

  build: {
    target: "esnext",
    outDir: resolve(__dirname, "../../dist/client"),
    minify: false, // 'esbuild',
    emptyOutDir: true,
  },
});
