# Cesium Transform Gizmo

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

> A high-performance, interactive transformation controller (Gizmo) for CesiumJS. 
> It provides an intuitive UI for manipulating 3D objects (Models and 3D Tilesets) with support for Translation, Rotation, and Scaling.

**(Note: The demo GIF is currently missing. You can replace `put_your_gif_link_here.gif` with a link to your demo GIF.)**
![Demo GIF](put_your_gif_link_here.gif)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✨ **Multiple Modes**: Supports translation, rotation, and scaling.
- 🎯 **Intuitive Controls**:
    - **Translate**: Move objects along the X, Y, Z axes.
    - **Rotate**: Sector-based rotation for intuitive control, with smart snapping to 90-degree increments.
    - **Scale**: Uniformly scale objects.
- 🚀 **High Performance**: Optimized with geometry reusing and efficient raycasting, ensuring smooth operation even in complex scenes.
- 🎨 **Customizable**: Easily customize the appearance of the gizmo, including colors and sizes.
- 🌐 **Coordinate Systems**: Supports both local and world coordinate systems (requires custom logic).
- 📦 **TypeScript**: Written in TypeScript with full type definitions for a better development experience.

## Installation

```bash
npm install cesium-transform-gizmo
# Make sure you have CesiumJS installed in your project
npm install cesium
```

## Usage

```ts
import * as Cesium from 'cesium';
import { Gizmo } from 'cesium-transform-gizmo';

// 1. Initialize the Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer');

// 2. Load a model or 3D tileset
const tileset = await Cesium.Cesium3DTileset.fromUrl('path/to/your/tileset.json');
viewer.scene.primitives.add(tileset);

// 3. Initialize the Gizmo
const gizmo = new Gizmo({
  viewer: viewer,
  object: tileset, // The object to be transformed (Model or Cesium3DTileset)
  mode: 'translate', // Initial mode: 'translate' | 'rotate' | 'scale'
});

// 4. Listen for updates
gizmo.on('update', (state) => {
  console.log('New Position:', state.position);
  console.log('New Rotation:', state.rotation);
  console.log('New Scale:', state.scale);
});

// 5. Dynamically switch modes
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

## API Reference

### `Gizmo(options)`

Creates a new `Gizmo` instance.

**Options:**

-   `viewer` **(Cesium.Viewer)**: The Cesium viewer instance.
-   `object?` **(Cesium.Model | Cesium.Cesium3DTileset)**: Optional. The object to be transformed. If not provided during initialization, you can bind an object later using `bindObject()`.
-   `mode?` **(string)**: Optional. The initial transformation mode. Can be `'translate'`, `'rotate'`, or `'scale'`. Default is `'translate'`.
-   `axisWidth?` **(number)**: Optional. The width of the gizmo's axes. Default is `5`.

### Properties

-   `mode` **(string)**: The current transformation mode. Can be set to `'translate'`, `'rotate'`, or `'scale'`.
-   `enabled` **(boolean)**: Controls the visibility and interactivity of the gizmo. Set to `false` to hide and disable.

### Methods

-   `on(event: 'update', callback: (state: TransformState | null) => void)`: Registers a callback function to listen for transformation events.
    -   `event` **(string)**: The event to listen for. Currently, only `'update'` is supported, which is triggered after each transformation step.
    -   `callback` **(function)**: A function to be called when the event is triggered. The callback receives a `state` object of type `TransformState`.
-   `bindObject(object?: Cesium.Model | Cesium.Cesium3DTileset)`: Binds a new object to the gizmo, or detaches the current object if `undefined` or `null` is passed. This allows for switching the object being transformed.
-   `detach()`: Detaches the currently bound object from the gizmo and hides the gizmo.
-   `getTransformState(): TransformState | null`: Returns the current transformation state (position, rotation, scale) of the bound object. Returns `null` if no object is bound.
-   `destroy()`: Cleans up all resources associated with the gizmo, including event handlers and primitives. Call this method when the gizmo is no longer needed.

### Interfaces

#### `TransformState`

The interface for the object returned by the `on('update')` event and `getTransformState()` method.

```typescript
interface TransformState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    heading: number; // Rotation around the Z-axis (Yaw) in degrees
    pitch: number;    // Rotation around the Y-axis (Pitch) in degrees
    roll: number;     // Rotation around the X-axis (Roll) in degrees
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}


## Live Demo

To see the gizmo in action, you can run the example provided in this repository.

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/cesium-transform-gizmo.git
    cd cesium-transform-gizmo
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the example:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173`.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or pull request, please feel free to open an issue or submit a PR. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the Apache 2.0 License.
