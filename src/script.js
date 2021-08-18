import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentShader from './shader/fragment-shader.glsl'
import vertexShader from './shader/vertex-shader.glsl'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x23395d)

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new THREE.TextGeometry('Leanne Werner', {
    font: font,
    size: 0.6,
    height: 0.03,
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
 * Particles
 */
const parameters = {}
parameters.count = 150

const line = new MeshLine()

const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3

  const x = (i / (parameters.count - 1) - 0.5) * 3
  const y = Math.sin(i / 10.5) * 0.5

  positions[i3] = x
  positions[i3 + 1] = y
  positions[i3 + 2] = -1
}

//line.setAttribute('position', new THREE.BufferAttribute(positions, 3))

/**
 * Mesh Line Material
 */
const resolution = new THREE.Vector2(canvas.width, canvas.height)

line.setPoints(positions)
const material = new MeshLineMaterial({
  color: '#b94371',
  resolution,
  sizeAttenuation: 0,
  lineWidth: 2.0
})

const meshLine = new THREE.Mesh(line, material)
scene.add(meshLine)

meshLine.raycast = MeshLineRaycast;

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
let mouse = new THREE.Vector3(0,0, 1);

function handleMouseMove (event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
  mouse.z = 1;

   var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
   vector.unproject( camera );
   var dir = vector.sub( camera.position ).normalize();
   var distance = - camera.position.z / dir.z;
   var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
   
   mouse = pos;

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
camera.position.z = 3
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

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    const prev = (i - 1) * 3

    if (i3 === 0) {
      positions[0] = mouse.x
      positions[1] = mouse.y
      positions[2] = mouse.z

    //   console.log({mouse})
    //   console.log(positions[0])
    } else {
      const tempVec3 = new THREE.Vector3(
        positions[i3],
        positions[i3 + 1],
        positions[i3 + 2]
      )
      const tempPrevVec3 = new THREE.Vector3(
        positions[prev],
        positions[prev + 1],
        positions[prev + 2]
      )

      const tempLerp = tempVec3.lerp(tempPrevVec3, 0.9)      
      
      positions[i3] = tempLerp.x
      positions[i3 + 1] = tempLerp.y
      positions[i3 + 2] = mouse.z
    }
  }


  //line.attributes.position.needsUpdate = true
  line.setPoints(positions)

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
