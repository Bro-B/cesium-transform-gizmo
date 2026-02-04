# Cesium Transform Gizmo

<p align="center">
  <a href="./README.md">简体中文</a> | <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

**Cesium Transform Gizmo** 是一款专为 CesiumJS 打造的高性能、交互式模型变换控制器。它为操作 3D 模型（Model）和 3D Tileset 提供了直观的用户界面，支持平移、旋转和缩放功能，类似于主流 3D 建模软件的操作体验。

---

## 目录

- [✨ 特性](#-特性)
- [🚀 在线演示](#-在线演示)
- [📦 安装](#-安装)
- [🏃 快速开始](#-快速开始)
- [📖 使用指南](#-使用指南)
- [⚙️ API 参考](#️-api-参考)
- [❓ 常见问题](#-常见问题)
- [🤝 贡献指南](#-贡献指南)
- [📄 开源协议](#-开源协议)

---

## ✨ 特性

- **多模式支持**：提供平移（Translate）、旋转（Rotate）和缩放（Scale）三种核心变换模式。
- **直观交互设计**：
  - **平移**：支持沿 X、Y、Z 轴及平面的精准移动。
  - **旋转**：采用扇形旋转设计，支持 90 度象限智能吸附，始终面向相机，操作流畅。
  - **缩放**：支持沿轴向缩放及整体均匀缩放。
- **高性能优化**：基于几何体复用与高效射线检测算法，确保在海量数据场景下依然保持高帧率运行。
- **高度可定制**：支持自定义 Gizmo 的外观（颜色、尺寸等）以匹配应用风格。
- **TypeScript 开发**：完全使用 TypeScript 编写，提供完整的类型定义文件（.d.ts），开发体验友好。

### 效果预览

| 平移模式 | 旋转模式 | 缩放模式 |
| :---: | :---: | :---: |
| ![](https://picture.cyanfish.site/gizmo-%E5%B9%B3%E7%A7%BB.gif) | ![](https://picture.cyanfish.site/gizmo-%E6%97%8B%E8%BD%AC.gif) | ![](https://picture.cyanfish.site/gizmo-%E7%BC%A9%E6%94%BE.gif) |

---

## 🚀 在线演示

👉 [点击查看 Live Demo](https://demo.cyanfish.site/cesium/transform-enu)

---

## 📦 安装

请确保您的运行环境中已安装 `cesium`（建议版本 ≥ 1.100.0）。

### 使用 npm 或 yarn

```bash
# npm
npm install cesium-transform-gizmo

# yarn
yarn add cesium-transform-gizmo

# pnpm
pnpm add cesium-transform-gizmo
```

---

## 🏃 快速开始

以下示例展示了如何初始化 Gizmo 并绑定到一个 GLTF 模型上。

### 1. 引入依赖

```typescript
import * as Cesium from 'cesium';
import Gizmo from 'cesium-transform-gizmo';
```

### 2. 初始化 Viewer 与模型

```typescript
const viewer = new Cesium.Viewer('cesiumContainer');

// 加载一个示例模型
const position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0);
const heading = Cesium.Math.toRadians(135);
const pitch = 0;
const roll = 0;
const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

// 使用 Entity API 加载（后续需获取其 Primitive）
const entity = viewer.entities.add({
  position: position,
  orientation: orientation,
  model: {
    uri: 'path/to/model.gltf'
  }
});
```

### 3. 创建 Gizmo 并绑定

```typescript
// 等待模型加载完成后进行绑定
// 注意：Gizmo 直接操作底层 Primitive 对象
const model = await Cesium.Model.fromGltf({ url: 'path/to/model.gltf' });
viewer.scene.primitives.add(model);

const gizmo = new Gizmo({
  viewer: viewer,
  object: model, // 初始绑定的对象(可先不传，后续通过bindObject方法绑定)
  mode: 'translate', // 初始模式
  onUpdate: (state) => {
    console.log('变换状态更新:', state);
  }
});
```

---

## 📖 使用指南

### 切换变换模式

Gizmo 支持通过修改 `mode` 属性动态切换操作模式：

```typescript
gizmo.mode = 'translate'; // 平移
gizmo.mode = 'rotate';    // 旋转
gizmo.mode = 'scale';     // 缩放
```

### 动态绑定/解绑对象

您可以在运行时切换 Gizmo 控制的目标对象，支持 `Cesium.Model` 和 `Cesium.Cesium3DTileset`。

```typescript
// 绑定新的 Tileset
gizmo.bindObject(tileset);

// 解绑当前对象（Gizmo 将隐藏）
gizmo.bindObject();
```

### 交互式拾取绑定

结合 Cesium 的事件处理器，实现点击场景物体自动绑定 Gizmo：

```typescript
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

handler.setInputAction((event) => {
  const picked = viewer.scene.pick(event.position);
  
  // 检查拾取对象是否为有效的 Primitive
  if (Cesium.defined(picked) && 
     (picked.primitive instanceof Cesium.Model || picked.primitive instanceof Cesium.Cesium3DTileset)) {
    gizmo.bindObject(picked.primitive);
  } else {
    // 点击空白处取消绑定
    gizmo.bindObject(null);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

---

## ⚙️ API 参考

### `Gizmo` 类

#### 构造函数 `new Gizmo(options)`

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :---: | :---: | :--- |
| `viewer` | `Cesium.Viewer` | ✅ | - | Cesium Viewer 实例。 |
| `object` | `Cesium.Model` \| `Cesium.Cesium3DTileset` | ❌ | `null` | 初始绑定的目标对象。 |
| `mode` | `'translate'` \| `'rotate'` \| `'scale'` | ❌ | `'translate'` | 初始变换模式。 |
| `axisWidth` | `number` | ❌ | `5` | 坐标轴线宽（像素）。 |

#### 属性

- **`mode`**: `string`  
  获取或设置当前的变换模式。

- **`onUpdate`**: `(state: TransformState) => void`  
  变换回调函数，当用户拖动 Gizmo 导致对象状态改变时触发。

#### 方法

- **`bindObject(object: Cesium.Model | Cesium.Cesium3DTileset | null)`**  
  绑定一个新的对象。传入 `null` 或 `undefined` 可解绑当前对象。

- **`detach()`**  
  解绑当前对象并隐藏 Gizmo（等同于 `bindObject(null)`）。

- **`getTransformState()`**  
  获取当前绑定对象的变换参数。返回类型为 `TransformState`，若未绑定则返回 `null`。

- **`destroy()`**  
  销毁 Gizmo 实例，释放所有相关资源（事件监听、Primitive 等）。

### 接口定义

#### `TransformState`

```typescript
interface TransformState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    heading: number; // 偏航角（度）
    pitch: number;   // 俯仰角（度）
    roll: number;    // 翻滚角（度）
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}
```

---

## ❓ 常见问题

**Q: 支持操作 Cesium Entity 吗？**  
A: Gizmo 核心操作的是底层的 `Primitive`。对于 `Entity`，您需要获取其内部引用的 `Model` 或 `Primitive` 对象进行绑定。通常可以通过访问私有属性 `entity.model._primitive` 获取（不推荐，因 API 可能变动），或建议直接使用 `Primitive` 方式加载模型。

**Q: 为什么 Gizmo 绑定后不可见？**  
A: 请检查：1. 绑定的对象是否已加载完成（ready）；2. 相机位置是否能看到该对象；3. 对象的坐标是否正确。

**Q: 支持多选操作吗？**  
A: 目前版本仅支持单对象绑定操作。

---

## 🤝 贡献指南

我们非常欢迎社区贡献！如果您发现 Bug 或有新功能建议：

1. **提交 Issue**：请详细描述问题复现步骤或功能场景。
2. **提交 PR**：
   - Fork 本仓库。
   - 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)。
   - 提交更改 (`git commit -m 'Add some AmazingFeature'`)。
   - 推送到分支 (`git push origin feature/AmazingFeature`)。
   - 发起 Pull Request。

---

## 📄 开源协议

本项目基于 [Apache-2.0](./LICENSE) 协议开源。
