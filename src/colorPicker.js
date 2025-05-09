import * as THREE from 'three'

export const colors = {
  orange: '#ff3901',
  cyan: '#0fffff',
  green: '#5cb000',
  pink: '#ff8a85',
  yellow: '#fefc2e',
  red: '#ff9200'
}

export const colorPicker = new THREE.Group()
colorPicker.name = 'colorPicker'
colorPicker.visible = false

const circleCount = Object.keys(colors).length
const circleRadius = 0.06
const circleSize = 0.02
const segments = 32
const hexRadius = 0.07
const cornerRadius = 0.03

// ---------- Create a "Rounded Hex" Shape ----------
function createRoundedHexShape (outerRadius, cornerRadius) {
  const shape = new THREE.Shape()

  for (let i = 0; i < 6; i++) {
    const angleDeg = i * 60
    const angle = THREE.MathUtils.degToRad(angleDeg)

    const cx = Math.cos(angle) * outerRadius
    const cy = Math.sin(angle) * outerRadius

    const startAngle = angle - THREE.MathUtils.degToRad(30)
    const endAngle = angle + THREE.MathUtils.degToRad(30)

    const startX = cx + Math.cos(startAngle) * cornerRadius
    const startY = cy + Math.sin(startAngle) * cornerRadius

    if (i === 0) {
      shape.moveTo(startX, startY)
    } else {
      shape.lineTo(startX, startY)
    }

    shape.absarc(cx, cy, cornerRadius, startAngle, endAngle, false)
  }

  shape.closePath()
  return shape
}

// ---------- Add the Solid Hex Background ----------
const hexShape = createRoundedHexShape(hexRadius, cornerRadius)
const hexGeom = new THREE.ShapeGeometry(hexShape)
const hexMat = new THREE.MeshBasicMaterial({
  color: 0x2f2f3f,
  side: THREE.DoubleSide
})
const hexMesh = new THREE.Mesh(hexGeom, hexMat)
hexMesh.position.z = -0.01
colorPicker.add(hexMesh)

// --- Create Outer Circles in a Ring ---
const colorKeys = Object.keys(colors)
for (let i = 0; i < circleCount; i++) {
  const colorKey = colorKeys[i]
  const colorValue = colors[colorKey]

  const angle = (i / circleCount) * Math.PI * 2.0
  const x = Math.cos(angle) * circleRadius
  const y = Math.sin(angle) * circleRadius

  const geometry = new THREE.CircleGeometry(circleSize, segments)
  const material = new THREE.MeshBasicMaterial({
    color: colorValue,
    side: THREE.DoubleSide
  })

  const circleMesh = new THREE.Mesh(geometry, material)
  circleMesh.position.set(x, y, 0.001)
  circleMesh.userData.color = colorValue
  circleMesh.name = colorValue.toString(16)

  hexMesh.add(circleMesh)
}

// --- Create Center Circle (for slash or “no color”) ---
const centerGeometry = new THREE.CircleGeometry(circleSize, segments)
const centerMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
const centerCircle = new THREE.Mesh(centerGeometry, centerMaterial)
centerCircle.position.set(0, 0, 0.001)
centerCircle.userData.color = '#ffffff'
centerCircle.name = 'remove'

const slashGeometry = new THREE.PlaneGeometry(
  circleSize * 1.9,
  circleSize * 0.2
)
const slashMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red slash
const slash = new THREE.Mesh(slashGeometry, slashMaterial)
slash.rotation.z = Math.PI * 0.25
centerCircle.add(slash)

hexMesh.add(centerCircle)
