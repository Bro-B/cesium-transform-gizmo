import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  // 开发服务器配置 (npm run dev)
  root: "./example", // 告诉 Vite 开发服务器根目录在 example
  publicDir: "public", // 静态资源目录
  build: {
    outDir: "./dist",
    emptyOutDir: true, // 每次构建清空 dist
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CesiumTransformGizmo",
      fileName: (format) => `cesium-transform-gizmo.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["cesium"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          cesium: "Cesium",
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts"], // 只为 src 生成类型，忽略 example
    }),
  ], // 用于生成类型定义文件
})
