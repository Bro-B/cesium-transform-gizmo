# Cesium Transform Gizmo

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/cesium-transform-gizmo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square" alt="typescript" />
</p>

> A high-performance, interactive transformation controller (Gizmo) for CesiumJS. 
Support Translation, Rotation (with quadrant snapping), and Scaling for Models and 3D Tilesets.

![Demo GIF](put_your_gif_link_here.gif)

## Features
- 🚀 **Performance**: Optimized geometry reusing and raycasting.
- 📐 **Modes**: Translate, Rotate (Sector-based), Scale.
- 🎯 **Snapping**: Smart rotation snapping to 90-degree increments.
- 🎨 **Customizable**: Fully customizable colors and sizes.
- 📦 **TypeScript**: Written in TS with full type definitions.

## Installation

```bash
npm install cesium-transform-gizmo
# Make sure you have cesium installed
npm install cesium
```

## Usage

```ts
import * as Cesium from 'cesium';
import { TransformHelper } from 'cesium-transform-gizmo';

const viewer = new Cesium.Viewer('cesiumContainer');
const tileset = await Cesium.Cesium3DTileset.fromUrl('...');

viewer.scene.primitives.add(tileset);

// Initialize the Gizmo
const gizmo = new TransformHelper({
  viewer: viewer,
  object: tileset, // Can be a Model or Tileset
  mode: 'translate', // 'translate' | 'rotate' | 'scale'
  onUpdate: (state) => {
    console.log('New Position:', state.position);
    console.log('New Rotation:', state.rotation);
  }
});

// Switch Modes
gizmo.mode = 'rotate';
```

## License
Apache 2.0