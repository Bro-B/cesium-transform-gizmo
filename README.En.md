# Cesium Transform Gizmo

<p align="center">
  <a href="./README.md">简体中文</a> | <a href="./README.En.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

**Cesium Transform Gizmo** is a high-performance, interactive transformation controller designed for CesiumJS. It provides an intuitive user interface for manipulating 3D models (Model) and 3D Tilesets, supporting translation, rotation, and scaling capabilities, similar to the operation experience of mainstream 3D modeling software.

---

## Table of Contents

- [✨ Features](#features)
- [🚀 Live Demo](#live-demo)
- [📦 Installation](#installation)
- [🏃 Quick Start](#quick-start)
- [📖 Usage Guide](#usage-guide)
- [⚙️ API Reference](#api-reference)
- [❓ FAQ](#faq)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## ✨ Features

- **Multi-mode Support**: Provides three core transformation modes: Translate, Rotate, and Scale.
- **Intuitive Interaction Design**:
  - **Translate**: Supports precise movement along X, Y, Z axes and planes.
  - **Rotate**: Features a fan-shaped rotation design with intelligent 90-degree quadrant snapping, always facing the camera for smooth operation.
  - **Scale**: Supports scaling along axes and uniform scaling.
- **High Performance**: Optimized based on geometry reuse and efficient ray-casting algorithms, ensuring high frame rates even in massive data scenarios.
- **Highly Customizable**: Supports customizing the TransformGizmo's appearance (color, size, etc.) to match your application style.
- **TypeScript Support**: Written entirely in TypeScript, providing complete type definition files (.d.ts) for a friendly development experience.

### Preview

<p align="center">
  <img src="https://picture.cyanfish.site/gizmo-%E5%B9%B3%E7%A7%BB.gif" width="80%" alt="Translate Mode" />
  <br />
  <b>Translate Mode</b>
</p>

<p align="center">
  <img src="https://picture.cyanfish.site/gizmo-%E6%97%8B%E8%BD%AC.gif" width="80%" alt="Rotate Mode" />
  <br />
  <b>Rotate Mode</b>
</p>

<p align="center">
  <img src="https://picture.cyanfish.site/gizmo-%E7%BC%A9%E6%94%BE.gif" width="80%" alt="Scale Mode" />
  <br />
  <b>Scale Mode</b>
</p>

---

## 🚀 Live Demo

👉 [Click to View Live Demo](https://demo.cyanfish.site/cesium/transform-enu)

---

## 📦 Installation

Please ensure that `cesium` is installed in your environment (recommended version ≥ 1.100.0).

### Using npm or yarn

```bash
# npm
npm install cesium-transform-gizmo

# yarn
yarn add cesium-transform-gizmo

# pnpm
pnpm add cesium-transform-gizmo
```

---

## 🏃 Quick Start

The following example demonstrates how to initialize the TransformGizmo and bind it to a glTF model.

### 1. Import Dependencies

```typescript
import * as Cesium from 'cesium';
import {TransformGizmo} from 'cesium-transform-gizmo';
```

### 2. Initialize Viewer and Model

```typescript
const viewer = new Cesium.Viewer('cesiumContainer');

// Load a sample model
const position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0);
const heading = Cesium.Math.toRadians(135);
const pitch = 0;
const roll = 0;
const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

// Load a sample model using Entity API (the Gizmo example below will use Primitive)
const entity = viewer.entities.add({
  position: position,
  orientation: orientation,
  model: {
    uri: 'path/to/model.gltf'
  }
});
```

### 3. Create TransformGizmo and Bind

```typescript
// Wait for the model to load before binding
// Note: TransformGizmo operates directly on the underlying Primitive object
const model = await Cesium.Model.fromGltf({ url: 'path/to/model.gltf' });
viewer.scene.primitives.add(model);

const gizmo = new TransformGizmo({
  viewer: viewer,
  object: model, // Initial object to bind (can be omitted and bound later via bindObject)
  mode: 'translate', // Initial mode
  onUpdate: (state) => {
    console.log('Transformation state updated:', state);
  }
});
```

---

## 📖 Usage Guide

### Switch Transformation Modes

TransformGizmo supports dynamic switching of operation modes by modifying the `mode` property:

```typescript
gizmo.mode = 'translate'; // Translate
gizmo.mode = 'rotate';    // Rotate
gizmo.mode = 'scale';     // Scale
```

### Dynamic Binding/Unbinding

You can switch the target object controlled by TransformGizmo at runtime, supporting `Cesium.Model` and `Cesium.Cesium3DTileset`.

```typescript
// Bind a new Tileset
gizmo.bindObject(tileset);

// Unbind current object (TransformGizmo will be hidden)
gizmo.bindObject();
```

### Interactive Picking and Binding

Combine with Cesium's event handler to automatically bind TransformGizmo when clicking on objects in the scene:

```typescript
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

handler.setInputAction((event) => {
  const picked = viewer.scene.pick(event.position);
  
  // Check if the picked object is a valid Primitive
  if (Cesium.defined(picked) && 
     (picked.primitive instanceof Cesium.Model || picked.primitive instanceof Cesium.Cesium3DTileset)) {
    gizmo.bindObject(picked.primitive);
  } else {
    // Click on empty space to unbind
    gizmo.bindObject(null);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

---

## ⚙️ API Reference

### `TransformGizmo` Class

#### Constructor `new TransformGizmo(options)`

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `viewer` | `Cesium.Viewer` | ✅ | - | Cesium Viewer instance. |
| `object` | `Cesium.Model` \| `Cesium.Cesium3DTileset` | ❌ | `null` | The initial target object to bind. |
| `mode` | `'translate'` \| `'rotate'` \| `'scale'` | ❌ | `'translate'` | Initial transformation mode. |
| `axisWidth` | `number` | ❌ | `5` | Axis line width (in pixels). |

#### Properties

- **`mode`**: `'translate'` \| `'rotate'` \| `'scale'`  
  Get or set the current transformation mode.

- **`onUpdate`**: `(state: TransformState) => void`  
  Callback function triggered when the user drags the TransformGizmo causing the object state to change. Angles in `TransformState.rotation` are in degrees.

#### Methods

- **`bindObject(object: Cesium.Model | Cesium.Cesium3DTileset | null)`**  
  Bind a new object. Pass `null` or `undefined` to unbind the current object.

- **`detach()`**  
  Unbind the current object and hide the TransformGizmo (equivalent to `bindObject(null)`).

- **`getTransformState()`**  
  Get the transformation parameters of the currently bound object. Returns `TransformState`, or `null` if not bound.

- **`destroy()`**  
  Destroy the TransformGizmo instance and release all related resources (event listeners, Primitives, etc.).

### Interface Definitions

#### `TransformState`

```typescript
interface TransformState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    heading: number; // Yaw (degrees)
    pitch: number;   // Pitch (degrees)
    roll: number;    // Roll (degrees)
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}
```

---

## ❓ FAQ

**Q: Does it support Cesium Entity?**  
A: TransformGizmo core operates on the underlying `Primitive`. For `Entity`, you need to get its internally referenced `Model` or `Primitive` object to bind. Usually, you can access it via the private property `entity.model._primitive` (not recommended as the API may change), or it is recommended to use the `Primitive` method to load the model directly.

**Q: Why is TransformGizmo not visible after binding?**  
A: Please check: 1. Whether the bound object has finished loading (ready); 2. Whether the camera position can see the object; 3. Whether the object's coordinates are correct.

**Q: Does it support multi-selection operations?**  
A: The current version only supports single object binding operations.

---

## 🤝 Contributing

We welcome community contributions! If you find a bug or have a feature suggestion:

1. **Submit an Issue**: Please describe the problem reproduction steps or feature scenario in detail.
2. **Submit a PR**:
   - Fork this repository.
   - Create your feature branch (`git checkout -b feature/AmazingFeature`).
   - Commit your changes (`git commit -m 'Add some AmazingFeature'`).
   - Push to the branch (`git push origin feature/AmazingFeature`).
   - Open a Pull Request.

---

## 📄 License

This project is open sourced under the [Apache-2.0](./LICENSE) license.
