import './style.css'
import * as THREE from 'three'
import fragmentShader from './shader/fragment-shader.glsl'
import vertexShader from './shader/vertex-shader.glsl'
import { MeshLine, MeshLineMaterial } from 'meshline'
import aboutMe from './about'

/**
 * UI
 */

// State
const state = {
  isMouseTrailLine: false
}

// Buttons
const btn1 = document.querySelector('#mouseLineTrail')
const btn2 = document.querySelector('#mouseCircleTrail')
const toggleDiv = document.querySelector('#mask')

function toggleActivity () {
  toggleDiv.style.right = 'auto'

  if (state.isMouseTrailLine) {
    toggleDiv.style.animation = 'revealLeft 0.2s forwards'
  } else {
    toggleDiv.style.right = '21px'
    toggleDiv.style.animation = 'revealRight 0.2s forwards'
  }
}

function changeMouseTrail () {
  state.isMouseTrailLine === true
    ? (state.isMouseTrailLine = false)
    : (state.isMouseTrailLine = true)

  btn1.disabled = state.isMouseTrailLine ? true : false
  btn2.disabled = !state.isMouseTrailLine ? true : false

  toggleActivity()
  setMouseTrail()
}

btn1.addEventListener('click', changeMouseTrail)
btn2.addEventListener('click', changeMouseTrail)

btn1.disabled = state.isMouseTrailLine ? true : false
btn2.disabled = !state.isMouseTrailLine ? true : false

toggleActivity()

const canvas = document.querySelector('canvas.webgl')
const mouseTrailContainer = document.querySelector('.mouse-trail-container')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x558786)

/**
 * Positions
 */
const parameters = {}
parameters.count = 150
parameters.radius = 5
parameters.insideColor = '#9F2B68'
parameters.outsideColor = '#BF40BF'

export function setPosition (positionArray, count) {
  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const x = (i / (count - 1) - 0.5) * 3
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
const colors = ['#00E400', '#FF80FF']
let lines = []
let material = null
let geometry = null
let meshLine = null
let points = null

function setMouseTrail () {
  lines = []

  //Remove existing mouse trail
  for (let i = 0; i < scene.children.length; i++) {
    if (
      (scene.children[i].geometry &&
        scene.children[i].geometry.type === 'MeshLine') ||
      scene.children[i].type === 'Points'
    ) {
      if (material !== null) {
        material.dispose()
      }
      if (geometry !== null) {
        geometry.dispose()
      }
      scene.remove(scene.children[i])
      i--
    }
  }

  if (state.isMouseTrailLine) {
    //Rainbow Lines

    const sizes = [7, 4]
    for (let i = 0; i < colors.length; i++) {
      geometry = new MeshLine()
      const positions = setPosition(
        new Float32Array(parameters.count * 3),
        parameters.count
      )
      geometry.setPoints(positions)

      material = new MeshLineMaterial({
        color: colors[i],
        resolution,
        sizeAttenuation: 0,
        lineWidth: sizes[i]
      })
      meshLine = new THREE.Mesh(geometry, material)
      lines.push({ line: geometry, positions: positions })

      scene.add(meshLine)
    }
  } else {
    // Particles

    geometry = new THREE.BufferGeometry()
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count)

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3

      const radius = Math.random() * parameters.radius

      const colorInside = new THREE.Color(parameters.insideColor)
      const colorOutside = new THREE.Color(parameters.outsideColor)
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b

      scales[i] = Math.random()
    }

    material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        u_size: { value: 1000 },
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2() }
      }
    })

    const positions = setPosition(
      new Float32Array(parameters.count * 3),
      parameters.count
    )
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1))

    lines.push({ line: geometry, positions: positions })
    points = new THREE.Points(geometry, material)

    scene.add(points)
  }
}

setMouseTrail()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Mouse Move
let mouse = new THREE.Vector3(0, 0, 1)

function handleMouseMove (event) {
  mouse.x = ((event.clientX + window.pageXOffset) / sizes.width) * 2 - 1
  mouse.y = -((event.clientY + window.pageYOffset) / sizes.height) * 2 + 1
  mouse.z = 1

  if (material.type === 'ShaderMaterial') {
    material.uniforms.u_mouse.value.x = event.clientX * 0.001
    material.uniforms.u_mouse.value.y = event.clientY * 0.001
  }

  // convert screen coordinates to threejs world position
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
  vector.unproject(camera)
  var dir = vector.sub(camera.position).normalize()
  var distance = -camera.position.z / dir.z
  var pos = camera.position.clone().add(dir.multiplyScalar(distance))

  mouse = pos
}

mouseTrailContainer.addEventListener('mousemove', handleMouseMove)

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.z = 5
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {
  lines.forEach(function (line) {
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      const prev = (i - 1) * 3

      if (i3 === 0) {
        line.positions[0] = mouse.x
        line.positions[1] = mouse.y
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

    const elapsedTime = clock.getElapsedTime()

    if (line.line.setPoints) {
      line.line.setPoints(line.positions, p => 1 - p)
    } else {
      line.line.attributes.position.needsUpdate = true
      material.uniforms.u_time.value = elapsedTime
    }
  })

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
aboutMe()
