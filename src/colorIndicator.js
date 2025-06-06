import * as THREE from 'three'

const circleSize = 0.05
const backgroundCircleSize = 0.07
const segments = 32

export const colorIndicator = new THREE.Group()
const geometry = new THREE.CircleGeometry(circleSize, segments)
const backgroundGeometry = new THREE.CircleGeometry(
  backgroundCircleSize,
  segments
)
const material = new THREE.MeshBasicMaterial({
  color: 'deeppink'
})
const backgroundMaterial = new THREE.MeshBasicMaterial({
  color: 0x2f2f3f
})

const colorMesh = new THREE.Mesh(geometry, material)
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
backgroundMesh.position.z = 0.0
colorMesh.position.z = 0.001

colorIndicator.add(backgroundMesh)
colorIndicator.add(colorMesh)
colorIndicator.name = 'ColorIndicator'
colorIndicator.position.set(0.5, -0.5, 0.001)

export function updateColorIndicatorPosition (camera) {
  if (!camera || !colorIndicator) return
  const margin = 0.1
  const camRight = camera.right
  const camBottom = camera.bottom

  colorIndicator.position.x = camRight - circleSize - margin
  colorIndicator.position.y = camBottom + circleSize + margin
}
