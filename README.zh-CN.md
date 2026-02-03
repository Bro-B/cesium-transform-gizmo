# Cesium Transform Gizmo (模型变换手柄)

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

> 专为 CesiumJS 打造的高性能可视化模型变换控制器（Gizmo）。支持对 Model 和 3D Tileset 进行平移、旋转和缩放操作。

![Demo](./screenshots/demo.gif)

## ✨ 特性

* **三轴操作**: 标准的 XYZ 轴向平移、旋转和缩放控制。
* **扇形旋转**: 采用类似 UE/Unity 的扇形旋转手柄，操作更直观。
* **智能吸附**: 旋转时支持象限自动吸附，对齐更精准。
* **坐标系切换**: 支持局部坐标系（Local）与世界坐标系（Global）切换（需自行封装逻辑）。
* **高性能**: 优化的几何体复用与射线检测算法，在大场景下依然流畅。
* **TypeScript**: 包含完整的类型定义文件 (.d.ts)。

## 📦 安装

```bash
npm install cesium-transform-gizmo
# 请确保你的项目中已安装 cesium
npm install cesium
```

🔨 使用说明
```TypeScript
import * as Cesium from 'cesium';
import { TransformHelper } from 'cesium-transform-gizmo';

// 1. 初始化 Viewer
const viewer = new Cesium.Viewer('cesiumContainer');

// 2. 加载模型或 3D Tiles
const tileset = await Cesium.Cesium3DTileset.fromUrl('...');
viewer.scene.primitives.add(tileset);

// 3. 初始化 Gizmo 工具
const gizmo = new TransformHelper({
  viewer: viewer,
  object: tileset, // 绑定对象，支持 Model 或 Cesium3DTileset
  mode: 'translate', // 初始模式: 'translate' | 'rotate' | 'scale'
  axisWidth: 5, // 轴线宽度
  onUpdate: (state) => {
    // 变换时的回调，返回当前的位置、旋转、缩放信息
    console.log('当前位置:', state.position);
    console.log('当前旋转:', state.rotation);
  }
});

// 4. 动态切换模式
document.getElementById('rotateBtn').onclick = () => {
  gizmo.mode = 'rotate';
};
```

⚙️ 配置参数
参数名类型默认值说明viewerCesium.Viewer-Cesium 视图对象实例。objectModel | Tileset-需要操作的目标模型对象。modestring'translate'初始操作模式，可选值：translate (平移), rotate (旋转), scale (缩放)。axisWidthnumber5坐标轴线的显示宽度。onUpdatefunction-状态更新回调，参数包含变换后的 position/rotation/scale。

🤝 贡献指南
欢迎提交 Issue 或 Pull Request！如果您有重大的功能修改建议，请先提 Issue 进行讨论。

📄 开源协议