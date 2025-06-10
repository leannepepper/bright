import * as THREE from 'three'
import { pass } from 'three/tsl'
import { PostProcessing, WebGPURenderer } from 'three/webgpu'
import { colorPicker, colors } from './colorPicker.js'
import {
  gridColsUniform,
  flowers,
  GRID_SIZE,
  selectedTexture,
  updateSelectedTexture
} from './constants.js'
import { LightBrightMesh } from './lightBright.js'
import {
  colorIndicator,
  updateColorIndicatorPosition,
  circleSize,
  updateColorIndicatorColor
} from './colorIndicator.js'

let isDragging = false
let holdingRemove = false
let holdingCommand = false
let allSelected = []

let camera, scene, renderer
let postProcessing

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let selectedColor = colors.orange

init()

function init () {
  renderer = new WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(render)
  document.body.appendChild(renderer.domElement)

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)

  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, -1, 1)
  camera.position.set(0, 0, 1)
  camera.updateProjectionMatrix()

  scene.add(LightBrightMesh)
  scene.add(colorPicker)
  scene.add(colorIndicator)

  // Post Processing
  postProcessing = new PostProcessing(renderer)
  const scenePass = pass(scene, camera)
  const scenePassColor = scenePass.getTextureNode()

  let combinedPass = scenePassColor
  // combinedPass = lightingPass(combinedPass, 0.8)

  postProcessing.outputNode = combinedPass

  // draw image
  // for (const flower of flowers) {
  //   updateColor(flower.index, new THREE.Color(flower.color))
  // }

  LightBrightMesh.scale.set(aspect, 1, 1)
  updateColorIndicatorPosition(camera)
}

function onWindowResize () {
  const aspect = window.innerWidth / window.innerHeight
  camera.left = -aspect
  camera.right = aspect
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  LightBrightMesh.scale.set(aspect, 1, 1)

  // rebuild the data texture with new width
  updateSelectedTexture(aspect)
  updateColorIndicatorPosition(camera)
}

function render (time) {
  postProcessing.render()
}

// Toggle light via raycasting
function toggleLight () {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects([LightBrightMesh])

  if (intersects.length > 0) {
    const uv = intersects[0].uv
    const cols = gridColsUniform.value

    const stX = uv.x * cols
    const stY = uv.y * GRID_SIZE

    let row = Math.floor(stY)
    const parity = row % 2
    let col = Math.floor(stX - parity * 0.5)
    col = ((col % cols) + cols) % cols // wrap horizontally

    const index = 4 * (col + row * cols)

    updateColor(index, selectedColor)
  }
}

// update color
function updateColor (index, color) {
  const data = selectedTexture.image.data
  const convertedColor = new THREE.Color(color)

  data[index + 0] = convertedColor.r * 255
  data[index + 1] = convertedColor.g * 255
  data[index + 2] = convertedColor.b * 255
  data[index + 3] = holdingRemove ? 0 : 255

  selectedTexture.needsUpdate = true

  if (!holdingRemove) {
    const selectedHex = convertedColor.getHexString()

    const selectedKey = Object.entries(colors).find(
      ([key, value]) => value.replace('#', '') === selectedHex
    )?.[0]

    allSelected.push({ index, color: selectedKey })
  } else if (holdingRemove) {
    allSelected = allSelected.filter(({ index: i }) => i !== index)
  }
}

// Update mouse position for raycasting
function updateMousePosition (event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function changeSelectColor () {
  raycaster.setFromCamera(pointer, camera)
  if (!colorPicker.visible) {
    toggleLight()
    return
  }
  const intersects = raycaster.intersectObjects([colorPicker])

  if (intersects.length > 0 && colorPicker?.visible) {
    const colorName = intersects[0].object.userData.color
    if (colorName) {
      selectedColor = colorName
      if (intersects[0].object.name === 'remove') {
        holdingRemove = true
      } else {
        holdingRemove = false
      }
      updateColorIndicatorColor(colorName)
    }
  }
}

function onPointerDown (event) {
  event.preventDefault()
  isDragging = true
  updateMousePosition(event)
  raycaster.setFromCamera(pointer, camera)

  const colorP = scene.getObjectByName('colorPicker')

  // 1) If you tapped the indicator → open (or re-open) the picker and bail out.
  const hitIndicator = raycaster.intersectObject(colorIndicator, true)

  if (hitIndicator.length > 0) {
    const margin = 0.3
    const worldX = camera.right - circleSize - margin
    const worldY = camera.bottom + circleSize + margin
    const ndc = new THREE.Vector2(worldX / camera.right, worldY)

    showColorPickerAt(ndc)

    return
  }

  // 2) If picker is visible & you tapped on the picker mesh itself → select that swatch.
  if (colorP.visible) {
    const hitPicker = raycaster.intersectObject(colorP, true)
    if (hitPicker.length > 0) {
      changeSelectColor() // this reads the hit & updates selectedColor
      return
    }

    // 3) If picker is visible and you tapped *anywhere else* → close it.
    hideColorPicker()
    return
  }

  // 4) Otherwise (picker was closed & you didn’t hit the indicator) → paint
  changeSelectColor()
}

function onPointerMove (event) {
  event.preventDefault()
  updateMousePosition(event)

  if (isDragging) {
    toggleLight()
  }

  hoverAndPlaceColorPicker(event)
}

function onPointerUp (event) {
  event.preventDefault()
  isDragging = false
}

function onKeyDown (event) {
  event.preventDefault()

  if (event.key === 'Meta') {
    holdingCommand = true
    showColorPickerAt(pointer)
  }
}

function onKeyUp (event) {
  event.preventDefault()
  holdingCommand = false
  hideColorPicker()
}

let hoveredSwatch = null

function hoverAndPlaceColorPicker (event) {
  raycaster.setFromCamera(pointer, camera)

  const colorP = scene.getObjectByName('colorPicker')
  if (colorP.visible) {
    const intersects = raycaster.intersectObject(colorP, true)
    const swatch =
      intersects?.[0] && intersects?.[0].object.name
        ? intersects[0].object
        : null

    if (swatch !== hoveredSwatch) {
      if (hoveredSwatch) {
        hoveredSwatch.scale.set(1, 1, 1)
        hoveredSwatch = null
      }
      if (swatch) {
        swatch.scale.set(1.2, 1.2, 1.2)
        hoveredSwatch = swatch
      }
    }
    return
  }

  // If color picker isn't visible, reset the hovered swatch
  if (hoveredSwatch) {
    hoveredSwatch.scale.set(1, 1, 1)
    hoveredSwatch = null
  }

  const intersects = raycaster.intersectObject(LightBrightMesh)
  const colorPicker = scene.getObjectByName('colorPicker')

  if (intersects.length > 0 && colorPicker) {
    const point = intersects[0].point
    colorPicker.position.set(point.x, point.y, 0.1)
  }
}

function showColorPickerAt (pointer) {
  const colorP = scene.getObjectByName('colorPicker')
  const worldX = pointer.x * camera.right
  const worldY = pointer.y
  colorP.scale.set(2.0, 2.0, 1.0)
  colorP.position.set(worldX, worldY, 0.1)

  colorP.visible = true
}

function hideColorPicker () {
  const colorP = scene.getObjectByName('colorPicker')
  if (colorP) {
    colorP.visible = false
  }
}

window.addEventListener('resize', onWindowResize)
window.addEventListener('pointerdown', onPointerDown)
window.addEventListener('pointermove', onPointerMove)
window.addEventListener('pointerup', onPointerUp)
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
