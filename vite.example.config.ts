import { defineConfig } from "vite"
import { resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = resolve(fileURLToPath(import.meta.url), "..")

export default defineConfig({
  root: resolve(__dirname, "./example"),
  publicDir: resolve(__dirname, "./example/public"),
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "src": resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: resolve(__dirname, "./example/dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["cesium"],
      output: {
        globals: {
          cesium: "Cesium",
        },
      },
    },
  },
})
