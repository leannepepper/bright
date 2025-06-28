import * as THREE from 'three'
import { pass, mrt, emissive, output } from 'three/tsl'
import { PostProcessing, WebGPURenderer } from 'three/webgpu'
import { colorPicker } from './colorPicker.js'
import {
  colors,
  flowerTemplateData,
  gridColsUniform,
  GRID_SIZE,
  selectedTexture,
  templateNames,
  updateSelectedTexture
} from './constants.js'
import { LightBrightMesh } from './lightBright.js'
import {
  colorIndicator,
  circleSize,
  updateColorIndicatorColor,
  updateColorIndicatorPosition
} from './colorIndicator.js'
import {
  templatePicker,
  updateTemplatePickerPosition
} from './templatePicker.js'
import { bloom } from 'three/tsl/bloom'
import LZString from 'lz-string'

// helper aliases for cleaner call sites
const compress = LZString.compressToEncodedURIComponent.bind(LZString)
const decompress = LZString.decompressFromEncodedURIComponent.bind(LZString)

// --- URL sync constants (declared early to avoid TDZ) ---
const SYNC_PARAM = 's'
let syncTimeout = null

let isDragging = false
let allSelected = new Map()
let hoveredSwatch = null
let hoveredTemplate = null
let isMobile = window.innerWidth < 1000
let isColorIndicatorHovered = false

let camera, scene, renderer
let postProcessing

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
window.selectedColor = colors.orange

init()

function init () {
  const aspect = window.innerWidth / window.innerHeight

  renderer = new WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(render)

  document.body.appendChild(renderer.domElement)

  camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, -1, 1)
  camera.position.set(0, 0, 1)
  camera.updateProjectionMatrix()

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)
  scene.add(LightBrightMesh)
  scene.add(colorPicker)
  scene.add(colorIndicator)
  //scene.add(templatePicker)

  postProcessing = new PostProcessing(renderer)

  const scenePass = pass(scene, camera)
  scenePass.setMRT(mrt({ output, emissive }))

  const colorBuffer = scenePass.getTextureNode('output')
  const emissiveBuffer = scenePass.getTextureNode('emissive')

  const bloomStrength = 0.5
  const bloomThreshold = 0.0
  const bloomRadius = 0.1

  const bloomPass = bloom(
    emissiveBuffer,
    bloomStrength,
    bloomThreshold,
    bloomRadius
  )

  postProcessing.outputNode = colorBuffer.add(bloomPass)

  LightBrightMesh.scale.set(aspect, 1, 1)
  updateColorIndicatorPosition(camera)
  updateTemplatePickerPosition(camera)

  // Load any saved state from URL
  loadStateFromUrl()
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
  updateTemplatePickerPosition(camera)

  isMobile = window.innerWidth < 1000

  if (isMobile) {
    templatePicker.visible = false
  } else if (!isMobile && !templatePicker.visible) {
    templatePicker.visible = true
  }
}

function render () {
  postProcessing.render()
}

function updateColor (index, color, row, col, skipSync = false) {
  const data = selectedTexture.image.data
  const convertedColor = new THREE.Color(color)
  const isRemove = color === '#ffffff'

  data[index + 0] = convertedColor.r * 255
  data[index + 1] = convertedColor.g * 255
  data[index + 2] = convertedColor.b * 255
  data[index + 3] = isRemove ? 0 : 255

  selectedTexture.needsUpdate = true

  if (!isRemove) {
    allSelected.set(index, { row, col, color })
  } else if (isRemove) {
    allSelected.delete(index)
  }

  if (!skipSync) {
    scheduleSync()
  }
}

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
    col = ((col % cols) + cols) % cols

    const index = 4 * (col + row * cols)

    updateColor(index, window.selectedColor, row, col)
  }
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
      window.selectedColor = colorName
      updateColorIndicatorColor(colorName)
      hideColorPicker()
    }
  }
}

function hoverAndPlaceColorPicker () {
  raycaster.setFromCamera(pointer, camera)

  if (colorPicker.visible) {
    const intersects = raycaster.intersectObject(colorPicker, true)
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

  if (hoveredSwatch) {
    hoveredSwatch.scale.set(1, 1, 1)
    hoveredSwatch = null
  }

  const intersects = raycaster.intersectObject(LightBrightMesh)

  if (intersects.length > 0 && colorPicker) {
    const point = intersects[0].point
    colorPicker.position.set(point.x, point.y, 0.1)
  }
}

function hoverTemplates () {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects([templatePicker], true)

  const emptyTemplateSelected = intersects.find(
    obj => obj.object.name === templateNames.empty
  )
  const flowerTemplateSelected = intersects.find(
    obj => obj.object.name === templateNames.flower
  )

  if (emptyTemplateSelected) {
    hoveredTemplate = emptyTemplateSelected
    emptyTemplateSelected.object.scale.set(1.1, 1.1, 1.1)
    return
  }

  if (flowerTemplateSelected) {
    hoveredTemplate = flowerTemplateSelected
    flowerTemplateSelected.object.scale.set(1.1, 1.1, 1.1)
    return
  }

  if (hoveredTemplate) {
    hoveredTemplate.object.scale.set(1, 1, 1)
    hoveredTemplate = null
  }
}

function maybeSelectTemplateOption () {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects([templatePicker], true)
  hoveredTemplate = null
  if (intersects.length === 0) return

  const emptyTemplateSelected = intersects.find(
    obj => obj.object.name === templateNames.empty
  )
  const flowerTemplateSelected = intersects.find(
    obj => obj.object.name === templateNames.flower
  )

  if (emptyTemplateSelected) {
    allSelected.clear()
    updateSelectedTexture(window.innerWidth / window.innerHeight)
    scheduleSync()
    return
  }

  if (flowerTemplateSelected) {
    allSelected.clear()
    applyTemplate(flowerTemplateData, '#656565')
    return
  }
}

function hoverColorIndicator () {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObject(colorIndicator, true)

  if (intersects.length > 0) {
    if (!isColorIndicatorHovered) {
      colorIndicator.scale.set(1.1, 1.1, 1.1)
      isColorIndicatorHovered = true
    }
  } else if (isColorIndicatorHovered) {
    colorIndicator.scale.set(1.0, 1.0, 1.0)
    isColorIndicatorHovered = false
  }
}

/**
 * Event Handlers
 */

function onPointerDown (event) {
  event.preventDefault()
  isDragging = false
  updateMousePosition(event)
  raycaster.setFromCamera(pointer, camera)

  const pickerVisible = colorPicker.visible

  if (raycastFirstHit([colorIndicator])) {
    showColorPickerAt(getColorPickerPosition())
    return
  }

  if (raycastFirstHit([templatePicker])) {
    maybeSelectTemplateOption()
    return
  }

  if (pickerVisible && raycastFirstHit([colorPicker])) {
    changeSelectColor()
    return
  }

  if (pickerVisible) {
    hideColorPicker()
    return
  }

  isDragging = true
  changeSelectColor()
}

function onPointerMove (event) {
  event.preventDefault()
  updateMousePosition(event)

  if (isDragging) {
    toggleLight()
  }

  hoverColorIndicator()
  hoverAndPlaceColorPicker()
  hoverTemplates()
}

function onPointerUp (event) {
  event.preventDefault()
  isDragging = false
}

function onKeyDown (event) {
  if (event.key === 'Meta') {
    showColorPickerAt(pointer)
  }
}

function onKeyUp () {
  hideColorPicker()
}

/**
 * Helpers
 */

function showColorPickerAt (pointer) {
  const worldX = pointer.x * camera.right
  const worldY = pointer.y
  colorPicker.scale.set(2.0, 2.0, 1.0)
  colorPicker.position.set(worldX, worldY, 0.1)

  colorPicker.visible = true
}

function hideColorPicker () {
  if (colorPicker) {
    colorPicker.visible = false
  }
}

const raycastFirstHit = objects => {
  const hits = raycaster.intersectObjects(objects, true)
  return hits.length ? hits[0] : null
}

// Color Picker position when opened by the color indicator
const getColorPickerPosition = () => {
  const margin = 0.3
  return new THREE.Vector2(
    (camera.right - circleSize - margin) / camera.right,
    camera.bottom + circleSize + margin
  )
}

function applyTemplate (templateCoords, templateColor) {
  updateSelectedTexture(window.innerWidth / window.innerHeight)
  const cols = gridColsUniform.value

  templateCoords.forEach(([row, col]) => {
    const index = 4 * (col + row * cols)
    updateColor(index, templateColor, row, col)
  })
}

function updateMousePosition (event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

/**
 * URL Sync Helpers
 */

function scheduleSync () {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(syncUrl, 300)
}

function syncUrl () {
  const stateArray = [...allSelected.values()].map(({ row, col, color }) => [
    row,
    col,
    color
  ])

  if (stateArray.length === 0) {
    // Clear param if no state
    const newUrl = `${window.location.pathname}`
    window.history.replaceState(null, '', newUrl)
    return
  }

  const compressed = compress(JSON.stringify(stateArray))
  const newUrl = `${window.location.pathname}?${SYNC_PARAM}=${compressed}`
  window.history.replaceState(null, '', newUrl)
}

function loadStateFromUrl () {
  const params = new URLSearchParams(window.location.search)
  const compressed = params.get(SYNC_PARAM)
  if (!compressed) return

  const jsonStr = decompress(compressed)
  if (!jsonStr) return

  try {
    const stateArray = JSON.parse(jsonStr)
    const aspect = window.innerWidth / window.innerHeight
    updateSelectedTexture(aspect) // ensure fresh texture with correct dimensions
    allSelected.clear()

    stateArray.forEach(([row, col, color]) => {
      const cols = gridColsUniform.value
      const index = 4 * (col + row * cols)
      updateColor(index, color, row, col, true) // skip sync while loading
    })
  } catch (e) {
    console.error('Failed to parse canvas state from URL', e)
  }
}

window.addEventListener('resize', onWindowResize)
window.addEventListener('pointerdown', onPointerDown)
window.addEventListener('pointermove', onPointerMove)
window.addEventListener('pointerup', onPointerUp)
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
