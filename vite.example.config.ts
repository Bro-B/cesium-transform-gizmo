import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: "./example",
  publicDir: "./public",
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    outDir: "./example/dist",
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
