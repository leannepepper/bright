import * as THREE from 'three'
import { uniform } from 'three/tsl'

export const GRID_SIZE = 40.0
export const gridColsUniform = uniform(40)
export const colors = {
  orange: '#ff3901',
  cyan: '#0fffff',
  green: '#5cb000',
  pink: '#ff8a85',
  yellow: '#fefc2e',
  red: '#ff9200'
}
export const templateNames = {
  empty: 'empty',
  flower: 'flower'
}

export function buildDataTexture (aspect) {
  const cols = Math.ceil(GRID_SIZE * aspect)
  gridColsUniform.value = cols

  const data = new Uint8Array(cols * GRID_SIZE * 4)
  const tex = new THREE.DataTexture(data, cols, GRID_SIZE, THREE.RGBAFormat)
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
}

export let selectedTexture = buildDataTexture(
  window.innerWidth / window.innerHeight
)

export function updateSelectedTexture (aspect) {
  const cols = Math.ceil(GRID_SIZE * aspect)

  gridColsUniform.value = cols
  selectedTexture.image.data = new Uint8Array(cols * GRID_SIZE * 4)
  selectedTexture.image.width = cols
  selectedTexture.image.height = GRID_SIZE

  // force a new texture on the GPU, not a great solution, this will clear the texture.
  selectedTexture.dispose()
  selectedTexture.needsUpdate = true
}

export const flowerTemplateData = [
  [25, 14],
  [25, 16],
  [24, 18],
  [24, 20],
  [24, 22],
  [23, 24],
  [23, 26],
  [23, 27],
  [23, 29],
  [24, 31],
  [25, 32],
  [26, 34],
  [27, 34],
  [28, 35],
  [29, 35],
  [30, 36],
  [31, 35],
  [32, 35],
  [32, 34],
  [33, 33],
  [33, 32],
  [33, 31],
  [33, 30],
  [33, 29],
  [32, 29],
  [32, 28],
  [31, 28],
  [30, 28],
  [29, 28],
  [27, 28],
  [26, 29],
  [25, 29],
  [24, 30],
  [23, 31],
  [22, 32],
  [22, 33],
  [21, 33],
  [21, 34],
  [20, 36],
  [19, 36],
  [18, 38],
  [17, 38],
  [17, 39],
  [16, 40],
  [16, 41]
]
