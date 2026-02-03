import * as Cesium from "cesium"
import { Gizmo } from "../src/index"
import "./index.scss"

declare global {
  interface Window {
    CESIUM_BASE_URL: string
  }
}
type Point3D = {
  x: number
  y: number
  z: number
}
type RotateState = {
  heading: number
  pitch: number
  roll: number
}

window.CESIUM_BASE_URL = "/Cesium"
let gizmo: Gizmo | undefined
const transformData: {
  position: Point3D | undefined
  rotation: RotateState | undefined
  scale: Point3D | undefined
} = {
  position: undefined,
  rotation: undefined,
  scale: undefined,
}

// 1. 初始化 Viewer (Viewer 是 Cesium 的核心组件)
const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: new Cesium.ImageryLayer(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
      maximumLevel: 17,
    })
  ),
  terrainProvider: undefined, // 默认不加载地形，避免无Token报错
  animation: false, // 隐藏左下角动画仪表盘
  timeline: false, // 隐藏底部时间轴
  baseLayerPicker: false, // 保留底图切换器
  geocoder: true, // 保留搜索框
  homeButton: false, // 保留Home按钮
  infoBox: false, // 保留信息框
  selectionIndicator: false, // 保留选择指示器
})

//加载3dtiles
Cesium.Cesium3DTileset.fromUrl("/public/building/tileset.json").then(
  (tileset) => {
    viewer.scene.primitives.add(tileset)
    viewer.flyTo(tileset)
    gizmo = new Gizmo({
      viewer,
      onUpdate: updateState,
    })
    gizmo.bindObject(tileset)
  }
)

//监听鼠标点击事件
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
  const res = viewer?.scene.pick(e.position)
  if (res && res.primitive instanceof Cesium.Cesium3DTileset) {
    gizmo?.bindObject(res.primitive)
  } else {
    gizmo?.bindObject()
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 新增：状态更新函数
function updateState() {
  if (gizmo) {
    const state = gizmo.getTransformState()
    if (state) {
      // 更新响应式对象，Vue 会自动刷新界面
      transformData.position = state.position
      transformData.rotation = state.rotation
      transformData.scale = state.scale
    }
  }
}

//todo: GUI交互及数据渲染逻辑
const active = "btn-t"
document.querySelector("#btn-t")?.addEventListener("click", () => {
  console.log("切换到平移")
  gizmo && (gizmo.mode = "translate")
})
document.querySelector("#btn-r")?.addEventListener("click", () => {
  console.log("切换到旋转")
  gizmo && (gizmo.mode = "rotate")
})
document.querySelector("#btn-s")?.addEventListener("click", () => {
  console.log("切换到缩放",gizmo)
  gizmo && (gizmo.mode = "scale")
})
