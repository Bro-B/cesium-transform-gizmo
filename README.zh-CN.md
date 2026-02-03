# Cesium Transform Gizmo (模型变换交互式工具)

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

> 一款专为 CesiumJS 打造的高性能、交互式模型变换控制器（Gizmo）。它为操作三维物体（模型和 3D Tileset）提供了一套直观的用户界面，支持平移、旋转和缩放功能。

![](https://picture.cyanfish.site/gizmo-%E5%B9%B3%E7%A7%BB.gif)

![](https://picture.cyanfish.site/gizmo-%E6%97%8B%E8%BD%AC.gif)

![](https://picture.cyanfish.site/gizmo-%E7%BC%A9%E6%94%BE.gif)

## 目录

- [✨ 特性](#-特性)
- [📦 安装](#-安装)
- [🔨 使用说明](#-使用说明)
- [⚙️ API 参考](#️-api-参考)
- [🚀 在线演示](#-在线演示)
- [🤝 贡献指南](#-贡献指南)
- [📄 开源协议](#-开源协议)

## ✨ 特性

- **多种模式**: 支持平移、旋转和缩放三种操作模式。
- **直观操控**:
    - **平移**: 沿 X、Y、Z 轴移动物体。
    - **旋转**: 采用扇形旋转设计，操控更直观，并支持 90 度象限智能吸附，始终面向操作者。
    - **缩放**: 沿X、Y、Z轴缩放或均匀缩放物体。
- **高性能**: 通过几何体复用和高效的射线检测进行了优化，确保在复杂场景下依然流畅运行。
- **高可定制性**: 可轻松自定义 Gizmo 的外观，包括颜色和尺寸。
- **TypeScript 支持**: 使用 TypeScript 编写，并提供完整的类型定义，带来更好的开发体验。

## 📦 安装

```bash
# 请确保您的项目中已安装 CesiumJS
npm install cesium
npm install cesium-transform-gizmo
```

## 🔨 使用说明

```ts
import * as Cesium from 'cesium';
import { Gizmo } from 'cesium-transform-gizmo';

// 1. 初始化 Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer');

// 2. 加载模型或 3D Tileset
const tileset = await Cesium.Cesium3DTileset.fromUrl('path/to/your/tileset.json');
viewer.scene.primitives.add(tileset);

// 3. 初始化 Gizmo
const gizmo = new Gizmo({
  viewer: viewer,
  object: tileset, // 需要变换的对象 (Model 或 Cesium3DTileset)
  mode: 'translate', // 初始模式: 'translate' | 'rotate' | 'scale'
});

// 4. 监听变换事件
gizmo.on('update', (state) => {
  console.log('最新位置:', state.position);
  console.log('最新旋转:', state.rotation);
  console.log('最新缩放:', state.scale);
});

// 5. 动态切换模式
document.getElementById('translateBtn').onclick = () => {
  gizmo.mode = 'translate';
};
document.getElementById('rotateBtn').onclick = () => {
  gizmo.mode = 'rotate';
};
document.getElementById('scaleBtn').onclick = () => {
  gizmo.mode = 'scale';
};
```

## ⚙️ API 参考

### `Gizmo(options)`

创建一个新的 `Gizmo` 实例。

**`options` (参数):**

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `viewer` | **Cesium.Viewer** | Cesium Viewer 实例。 |
| `object?` | **Cesium.Model \| Cesium.Cesium3DTileset** | 可选。需要进行变换的目标对象。如果未在初始化时提供，可以稍后使用 `bindObject()` 方法绑定。 |
| `mode?` | **string** | 可选。初始变换模式，可选值为 `'translate'`, `'rotate'`, `'scale'`。默认为 `'translate'`。 |
| `axisWidth?`| **number** | 可选。Gizmo 坐标轴的宽度。默认为 `5`。 |

### 属性

-   `mode` **(string)**: 当前的变换模式。可以设置为 `'translate'`, `'rotate'`, 或 `'scale'`。
-   `enabled` **(boolean)**: 控制 Gizmo 的可见性和交互性。设置为 `false` 可隐藏和禁用。

### 方法

-   `on(event: 'update', callback: (state: TransformState | null) => void)`: 注册一个回调函数来监听变换事件。
    -   `event` **(string)**: 要监听的事件。目前仅支持 `'update'`，在每次变换步骤后触发。
    -   `callback` **(function)**: 事件触发时调用的回调函数。回调函数会接收一个 `state` 对象，其类型为 `TransformState`。
-   `bindObject(object?: Cesium.Model | Cesium.Cesium3DTileset)`: 绑定一个新的对象到 Gizmo，如果传入 `undefined` 或 `null`，则解绑当前对象。这允许切换正在变换的对象。
-   `detach()`: 解绑当前对象并隐藏 Gizmo。
-   `getTransformState(): TransformState | null`: 返回当前绑定对象的变换状态（位置、旋转、缩放）。如果没有对象被绑定，则返回 `null`。
-   `destroy()`: 清理与 Gizmo 相关的所有资源，包括事件处理器和图元。当不再需要 Gizmo 时调用此方法。

### 接口

#### `TransformState`

`on('update')` 事件和 `getTransformState()` 方法返回的对象的接口。

```typescript
interface TransformState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    heading: number; // 绕 Z 轴旋转 (偏航角) - 单位：度
    pitch: number;   // 绕 Y 轴旋转 (俯仰角) - 单位：度
    roll: number;    // 绕 X 轴旋转 (翻滚角) - 单位：度
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}


## 🚀 在线演示

要查看 Gizmo 的实际效果，您可以运行本仓库中提供的示例。

1.  克隆仓库：
    ```bash
    git clone https://github.com/your-username/cesium-transform-gizmo.git
    cd cesium-transform-gizmo
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  运行示例：
    ```bash
    npm run dev
    ```
4.  在浏览器中打开 `http://localhost:5173`。

## 🤝 贡献指南

欢迎各种形式的贡献！如果您有功能建议、Bug 报告或代码提交，请随时创建 Issue 或提交 PR。对于重大的功能变更，请先创建 Issue 进行讨论。

## 📄 开源协议

本项目基于 Apache 2.0 协议开源。
