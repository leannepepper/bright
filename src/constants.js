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
  if (selectedTexture.image.width === cols) {
    return
  }

  gridColsUniform.value = cols
  selectedTexture.image.data = new Uint8Array(cols * GRID_SIZE * 4)
  selectedTexture.image.width = cols
  selectedTexture.image.height = GRID_SIZE

  // force a new texture on the GPU, not a great solution, this will clear the texture.
  selectedTexture.dispose()
  selectedTexture.needsUpdate = true
}
