import * as THREE from 'three'
import { colors } from './colorPicker.js'

export const circleSize = 0.04
const backgroundCircleSize = 0.06
const segments = 32

export const colorIndicator = new THREE.Group()
const geometry = new THREE.CircleGeometry(circleSize, segments)
const backgroundGeometry = new THREE.CircleGeometry(
  backgroundCircleSize,
  segments
)
const material = new THREE.MeshBasicMaterial({
  color: colors.orange
})
const backgroundMaterial = new THREE.MeshBasicMaterial({
  color: 0x2f2f3f
})

const colorMesh = new THREE.Mesh(geometry, material)
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
backgroundMesh.position.z = 0.0
colorMesh.position.z = 0.001

const slashGeometry = new THREE.PlaneGeometry(
  circleSize * 1.9,
  circleSize * 0.2
)
const slashMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const slash = new THREE.Mesh(slashGeometry, slashMaterial)
slash.name = 'slash'
slash.position.z = 0.002
slash.rotation.z = Math.PI * 0.25
slash.visible = false // Initially hidden

colorIndicator.add(backgroundMesh)
colorIndicator.add(colorMesh)
colorIndicator.add(slash)
colorIndicator.name = 'ColorIndicator'
colorIndicator.position.set(0.5, -0.5, 0.0)

export function updateColorIndicatorPosition (camera) {
  if (!camera || !colorIndicator) return
  const margin = 0.1
  const camRight = camera.right
  const camBottom = camera.bottom

  colorIndicator.position.x = camRight - circleSize - margin
  colorIndicator.position.y = camBottom + circleSize + margin
}

export function updateColorIndicatorColor (color) {
  if (!colorIndicator || !colorIndicator.children[1]) return

  const swatch = colorIndicator.getObjectByName('slash')

  if (color === '#ffffff') {
    if (swatch) {
      swatch.visible = true
      colorIndicator.children[1].material.color.set(color)
      return
    }
  }

  swatch.visible = false
  colorIndicator.children[1].material.color.set(color)
}
