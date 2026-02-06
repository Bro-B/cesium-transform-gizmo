import * as Cesium from "cesium"
import { TransformGizmo } from "../src/index"
import "./index.scss"

declare global {
  interface Window {
    CESIUM_BASE_URL: string
    gizmo: TransformGizmo
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

let gizmo: TransformGizmo | undefined
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
  selectionIndicator: false, // 保留选择指示器,
  scene3DOnly: true, //只支持3d模式
})

viewer.resolutionScale = window.devicePixelRatio //高分辨率适配
viewer.scene.globe.depthTestAgainstTerrain = true // 开启深度测试

//加载3dtiles
Cesium.Cesium3DTileset.fromUrl("/building/tileset.json").then(
  (tileset) => {
    viewer.scene.primitives.add(tileset)
    viewer.flyTo(tileset)
    gizmo = new TransformGizmo({
      viewer,
      onUpdate: updateState,
    })
    gizmo.bindObject(tileset)
    window.gizmo = gizmo

    // 加载glb模型
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
    const position = Cesium.Cartesian3.fromRadians(
      cartographic.longitude + 0.00005,
      cartographic.latitude,
      cartographic.height
    )
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)

    Cesium.Model.fromGltfAsync({
      url: "/wind_turbine.glb",
      modelMatrix: modelMatrix,
      scale: 0.05,
    }).then((model) => {
      viewer.scene.primitives.add(model)
    })
  }
)


//鼠标点击时拾取模型或3DTileset，绑定到Gizmo进行操作
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
  const res = viewer?.scene.pick(e.position)
  if (
    res &&
    (res.primitive instanceof Cesium.Cesium3DTileset || res.primitive instanceof Cesium.Model)
  ) {
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

      // 2. 渲染数据到 HTML (新增逻辑)
      // 辅助函数：安全设置文本内容
      const setContent = (id: string, value: number) => {
        const el = document.getElementById(id)
        // 这里可以直接转字符串，因为 TransformGizmo 内部已经做过 toFixed 处理
        if (el) el.textContent = String(value)
      }

      // --- 位置 (Position) ---
      setContent("pos-x", state.position.x)
      setContent("pos-y", state.position.y)
      setContent("pos-z", state.position.z)

      // --- 旋转 (Rotation) ---
      // 注意映射关系：Heading->Z轴, Pitch->Y轴, Roll->X轴
      setContent("rotate-z", state.rotation.heading)
      setContent("rotate-y", state.rotation.pitch)
      setContent("rotate-x", state.rotation.roll)

      // --- 缩放 (Scale) ---
      setContent("scale-x", state.scale.x)
      setContent("scale-y", state.scale.y)
      setContent("scale-z", state.scale.z)
    }
  }
}

//GUI交互及数据渲染逻辑
// 1. 获取所有模式按钮
const modeBtns = document.querySelectorAll<HTMLElement>(".btn-group .button")

// 2. 统一绑定点击事件
modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // A. 视觉更新：排他性切换 .active
    modeBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    // B. 业务逻辑：获取 HTML 上的 label 属性直接作为 mode 使用
    // label 对应: 'translate' | 'rotate' | 'scale'
    const mode = btn.getAttribute("label") as "translate" | "rotate" | "scale"

    if (gizmo && mode) {
      console.log(`切换模式: ${mode}`)
      gizmo.mode = mode
    }
  })
})
