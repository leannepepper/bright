import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentShader from './shader/fragment-shader.glsl'
import vertexShader from './shader/vertex-shader.glsl'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'

//State
const state = {
  isMouseTrailLine: true
}

//Buttons
const btn1 = document.querySelector('#mouseLineTrail')
const btn2 = document.querySelector('#mouseCircleTrail')
const toggleDiv = document.querySelector('#mask')

function toggleActivity(){
     toggleDiv.style.right = 'auto';
    
    if(state.isMouseTrailLine) {
        toggleDiv.style.animation = "revealLeft 0.2s forwards";
    } else {        
        toggleDiv.style.right = '41px';
        toggleDiv.style.animation = "revealRight 0.2s forwards";
    }
    
    
}

function changeMouseTrail () {
  state.isMouseTrailLine === true
    ? (state.isMouseTrailLine = false)
    : (state.isMouseTrailLine = true)
  
  btn1.disabled = state.isMouseTrailLine ? true : false
  btn2.disabled = !state.isMouseTrailLine ? true : false

  toggleActivity()
}

btn1.addEventListener('click', changeMouseTrail)
btn2.addEventListener('click', changeMouseTrail)

btn1.disabled = state.isMouseTrailLine ? true : false
btn2.disabled = !state.isMouseTrailLine ? true : false

toggleActivity()

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

//Helper
function random (a, b) {
  const alpha = Math.random()
  return a * (1.0 - alpha) + b * alpha
}

// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color(0xFF69B4)

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new THREE.TextGeometry('Leanne Werner', {
    font: font,
    size: 0.6,
    height: 0.07,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 15
  })
  const color = new THREE.Color('#add8e6')
  textGeometry.center()
  const titleTextGeometry = new THREE.TextGeometry('creative coder', {
    font: font,
    size: 0.3,
    height: 0.02,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.002,
    bevelOffset: 0,
    bevelSegments: 15
  })
  titleTextGeometry.center()
  titleTextGeometry.translate(
    -(0 - 0.002) * 0.5, // Subtract bevel size
    -(1.5 - 0.002) * 0.5, // Subtract bevel size
    -0 * 0.5 // Subtract bevel thickness
  )
  const textMaterial = new THREE.MeshBasicMaterial({ color: color })
  const nameText = new THREE.Mesh(textGeometry, textMaterial)
  const titleText = new THREE.Mesh(titleTextGeometry, textMaterial)
  scene.add(nameText)
  scene.add(titleText)
})

/**
 * Positions
 */
const parameters = {}
parameters.count = 150

function setPosition (positionArray) {
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const x = (i / (parameters.count - 1) - 0.5) * 3
    const y = Math.sin(i / 10.5) * 0.5

    positionArray[i3] = x
    positionArray[i3 + 1] = y
    positionArray[i3 + 2] = -1
  }
  return positionArray
}

/**
 * Mesh Line Material
 */
const resolution = new THREE.Vector2(canvas.width, canvas.height)
const lines = []

const colors = ['#17993a', '#2c92d1', '#ed4224', '#dd02f5', '#0a02f5']

for (let i = 0; i < colors.length; i++) {
  const alpha = Math.abs(random(-1, 1) * 0.02)
  const offset = new THREE.Vector3(
    Math.abs(random(-1, 1) * 0.2),
    Math.abs(random(-1, 1) * 0.2),
    Math.abs(random(-1, 1) * 0.2)
  )
  const line = new MeshLine()
  const positions = setPosition(new Float32Array(parameters.count * 3))
  line.setPoints(positions)

  const material = new MeshLineMaterial({
    color: colors[i],
    resolution,
    sizeAttenuation: 0,
    lineWidth: Math.floor(Math.random() * 10)
  })
  const meshLine = new THREE.Mesh(line, material)
  lines.push({ line: line, positions: positions, mouseOffSet: offset })

  scene.add(meshLine)
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  //Update uniforms
  //   material.uniforms.u_resolution.value.x = renderer.domElement.width
  //   material.uniforms.u_resolution.value.y = renderer.domElement.height
})

/**
 * Mouse Move
 */
let mouse = new THREE.Vector3(0, 0, 1)

function handleMouseMove (event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
  mouse.z = 1

  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
  vector.unproject(camera)
  var dir = vector.sub(camera.position).normalize()
  var distance = -camera.position.z / dir.z
  var pos = camera.position.clone().add(dir.multiplyScalar(distance))

  mouse = pos
}

window.addEventListener('mousemove', handleMouseMove)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.z = 5
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Update
  //material.uniforms.u_time.value = elapsedTime
  lines.forEach(function (line) {
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      const prev = (i - 1) * 3

      if (i3 === 0) {
        line.positions[0] = mouse.x + line.mouseOffSet.x
        line.positions[1] = mouse.y + line.mouseOffSet.y
        line.positions[2] = mouse.z
      } else {
        const tempVec3 = new THREE.Vector3(
          line.positions[i3],
          line.positions[i3 + 1],
          line.positions[i3 + 2]
        )
        const tempPrevVec3 = new THREE.Vector3(
          line.positions[prev],
          line.positions[prev + 1],
          line.positions[prev + 2]
        )

        const tempLerp = tempVec3.lerp(tempPrevVec3, 0.9)

        line.positions[i3] = tempLerp.x
        line.positions[i3 + 1] = tempLerp.y
        line.positions[i3 + 2] = mouse.z
      }
    }

    //line.attributes.position.needsUpdate = true
    line.line.setPoints(line.positions, p => 1 - p)
  })
  // Render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
