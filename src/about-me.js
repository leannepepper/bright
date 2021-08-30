import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shader/about-vertex.glsl'
import fragmentShader from './shader/about-fragment.glsl'
import { setPosition } from './script'

const aboutMeCanvas = document.querySelector('canvas.about-shader')

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(2, 2)

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  uniforms: {
    u_size: { value: 1000 },
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2() },
    u_resolution: { value: new THREE.Vector2() },
    color1: { value: new THREE.Vector3(0.99, 1.0, 0.71) },
    color2: { value: new THREE.Vector3(1.0, 0.87, 0.23) }
  }
})

const positions = setPosition(new Float32Array(100 * 2))
geometry.setAttribute('a_position', new THREE.BufferAttribute(positions, 2))

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
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
  material.uniforms.u_resolution.value.x = renderer.domElement.width
  material.uniforms.u_resolution.value.y = renderer.domElement.height
})

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.z = 5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: aboutMeCanvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

material.uniforms.u_resolution.value.x = renderer.domElement.width
material.uniforms.u_resolution.value.y = renderer.domElement.height

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  material.uniforms.u_time.value = elapsedTime

  // Render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

export default function () {
  console.log('Hello world')
}
