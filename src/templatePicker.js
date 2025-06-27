import * as THREE from 'three'
import { templateNames } from './constants.js'

export const templatePicker = new THREE.Group()
templatePicker.name = 'TemplatePicker'

function createShape (bgWidth, bgHeight) {
  // 1. Background: Rounded rectangle shape
  const shape = new THREE.Shape()
  const radius = 0.1
  // Draw rectangle (width=bgWidth, height=bgHeight) with corners of radius
  shape.moveTo(-bgWidth / 2 + radius, bgHeight / 2)
  shape.lineTo(bgWidth / 2 - radius, bgHeight / 2)
  shape.quadraticCurveTo(
    bgWidth / 2,
    bgHeight / 2,
    bgWidth / 2,
    bgHeight / 2 - radius
  )
  shape.lineTo(bgWidth / 2, -bgHeight / 2 + radius)
  shape.quadraticCurveTo(
    bgWidth / 2,
    -bgHeight / 2,
    bgWidth / 2 - radius,
    -bgHeight / 2
  )
  shape.lineTo(-bgWidth / 2 + radius, -bgHeight / 2)
  shape.quadraticCurveTo(
    -bgWidth / 2,
    -bgHeight / 2,
    -bgWidth / 2,
    -bgHeight / 2 + radius
  )
  shape.lineTo(-bgWidth / 2, bgHeight / 2 - radius)
  shape.quadraticCurveTo(
    -bgWidth / 2,
    bgHeight / 2,
    -bgWidth / 2 + radius,
    bgHeight / 2
  )
  const bgGeom = new THREE.ShapeGeometry(shape)
  return bgGeom
}

function createTemplateButton (name, colorFn) {
  const group = new THREE.Group()

  const bgGeom = createShape(0.4, 0.4)
  const bgMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.8
  })
  const bgMesh = new THREE.Mesh(bgGeom, bgMat)
  bgMesh.name = name
  group.add(bgMesh)

  const sphereRadius = 0.02
  const gap = 0.02
  const R = 2
  const cellWidth = sphereRadius * 2 + gap
  const cellHeight = (cellWidth * Math.sqrt(3)) / 2

  for (let q = -R; q <= R; q++) {
    for (let r = -R; r <= R; r++) {
      const s = -q - r
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) > R) continue

      const x = (q + r / 2) * cellWidth
      const y = -r * cellHeight

      const geom = new THREE.SphereGeometry(sphereRadius, 16, 16)
      const colorHex = colorFn(q, r)
      const mat = new THREE.MeshBasicMaterial({ color: colorHex })
      const sphere = new THREE.Mesh(geom, mat)
      sphere.name = `${name}-sphere`

      sphere.position.set(x, y, 0)
      group.add(sphere)
    }
  }

  return group
}

// Pattern functions
const emptyColorFn = () => 0x3e3e3e
const flowerColorFn = (q, r) => {
  const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r))
  if (dist === 0) return 0xffffff
  if (dist === 1) return 0xaeaeae
  return 0x3e3e3e
}

const emptyTemplateBtn = createTemplateButton(templateNames.empty, emptyColorFn)
const flowerTemplateBtn = createTemplateButton(
  templateNames.flower,
  flowerColorFn
)

flowerTemplateBtn.position.y = -0.5

const backgroundElement = new THREE.Mesh(
  createShape(0.5, 1.0),
  new THREE.MeshBasicMaterial({
    color: '#2F2F3E'
  })
)
backgroundElement.position.z = 0.0
backgroundElement.position.y = -0.25

templatePicker.add(backgroundElement, emptyTemplateBtn, flowerTemplateBtn)
templatePicker.scale.set(0.5, 0.5, 1.0)

export function updateTemplatePickerPosition (camera) {
  if (!camera || !templatePicker) return
  const margin = 0.2
  const camRight = camera.right
  const camTop = camera.top

  templatePicker.position.x = camRight - margin
  templatePicker.position.y = camTop - margin
}
