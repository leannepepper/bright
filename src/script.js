import * as THREE from 'three'
import { pass } from 'three/tsl'
import { PostProcessing, WebGPURenderer } from 'three/webgpu'
import { colorPicker, colors } from './colorPicker.js'
import {
  aspectUniform,
  flowers,
  GRID_SIZE,
  selectedTexture
} from './constants.js'
import { LightBrightMesh } from './lightBright.js'

let isDragging = false
let holdingRemove = false
let holdingCommand = false
let allSelected = []
let longPressTimer = null
const LONG_PRESS_MS = 400

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

  scene.add(LightBrightMesh)
  scene.add(colorPicker)

  // Post Processing
  postProcessing = new PostProcessing(renderer)
  const scenePass = pass(scene, camera)
  const scenePassColor = scenePass.getTextureNode()

  let combinedPass = scenePassColor
  // combinedPass = lightingPass(combinedPass, 0.8)

  postProcessing.outputNode = combinedPass

  // draw image
  for (const flower of flowers) {
    updateColor(flower.index, new THREE.Color(flower.color))
  }

  LightBrightMesh.scale.set(aspect, 1, 1)
  aspectUniform.value = aspect
}

function onWindowResize () {
  const aspect = window.innerWidth / window.innerHeight
  camera.left = -aspect
  camera.right = aspect
  camera.top = 1
  camera.bottom = -1
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  LightBrightMesh.scale.set(aspect, 1, 1)
  aspectUniform.value = aspect
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

    const stX = uv.x * GRID_SIZE * aspectUniform.value
    const stY = uv.y * GRID_SIZE
    const s = Math.sqrt(3) / 2 // TODO: Fix index bug

    let row = Math.floor(stY / s)
    const parity = row % 2
    let col = Math.floor(stX - parity * 0.5)
    col = ((col % GRID_SIZE) + GRID_SIZE) % GRID_SIZE

    const index = 4 * (col + row * GRID_SIZE)
    console.log('index', index)

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
    }
  }
}

function onPointerDown (event) {
  isDragging = true
  updateMousePosition(event)

  const colorP = scene.getObjectByName('colorPicker')
  if (colorP && colorP.visible) {
    changeSelectColor()
    return
  }

  if (event.pointerType === 'touch') {
    longPressTimer = setTimeout(() => {
      showColorPickerAt(pointer)
    }, LONG_PRESS_MS)
  } else {
    changeSelectColor() // desktop behaviour
  }
}

function onPointerMove (event) {
  updateMousePosition(event)
  if (
    longPressTimer &&
    (Math.abs(event.movementX) > 5 || Math.abs(event.movementY) > 5)
  ) {
    clearTimeout(longPressTimer) // cancel long-press if they start dragging
    longPressTimer = null
    isDragging = true // now act like draw mode
  }

  if (isDragging) {
    toggleLight()
  }
}

function onPointerUp () {
  clearTimeout(longPressTimer)
  longPressTimer = null
  isDragging = false
  hideColorPicker()
}

function onKeyDown (event) {
  if (event.key === 'Meta') {
    holdingCommand = true

    const colorP = scene.getObjectByName('colorPicker')
    if (colorP) {
      colorP.visible = true
    }
  }
}

function onKeyUp (event) {
  holdingCommand = false
  const colorP = scene.getObjectByName('colorPicker')
  if (colorP) {
    colorP.visible = false
  }
}

let hoveredSwatch = null

function onMouseMove (event) {
  updateMousePosition(event)
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
  if (colorP) {
    colorP.position.set(pointer.x, pointer.y, 0.1)
    colorP.visible = true
  }
}

function hideColorPicker () {
  const colorP = scene.getObjectByName('colorPicker')
  if (colorP) {
    colorP.visible = false
  }
}

window.addEventListener('pointerdown', onPointerDown)
window.addEventListener('pointermove', onPointerMove)
window.addEventListener('mousemove', onMouseMove)
window.addEventListener('pointerup', onPointerUp)
window.addEventListener('keydown', onKeyDown)
window.addEventListener('resize', onWindowResize)
window.addEventListener('keyup', onKeyUp)
