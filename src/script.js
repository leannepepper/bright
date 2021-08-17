import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentShader from './shader/fragment-shader.glsl'
import vertexShader from './shader/vertex-shader.glsl'

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

 fontLoader.load(
     '/fonts/helvetiker_regular.typeface.json',
     (font) =>
     {
         const textGeometry = new THREE.TextGeometry(
             'Leanne Werner',
             {
                font: font,
                size: 0.6,
                height: 0.03,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 15
             }
         )
         const color = new THREE.Color('#add8e6');
         textGeometry.center()
         const titleTextGeometry = new THREE.TextGeometry(
            'creative coder',
            {
               font: font,
               size: 0.3,
               height: 0.02,
               curveSegments: 12,
               bevelEnabled: true,
               bevelThickness: 0.03,
               bevelSize: 0.002,
               bevelOffset: 0,
               bevelSegments: 15
            }
        )
        titleTextGeometry.center();
        titleTextGeometry.translate(
           - (0 - 0.002) * 0.5, // Subtract bevel size
           - (1.5 - 0.002) * 0.5, // Subtract bevel size
           - (0) * 0.5  // Subtract bevel thickness
        )
         const textMaterial = new THREE.MeshBasicMaterial({ color: color })
         const nameText = new THREE.Mesh(textGeometry, textMaterial)
         const titleText = new THREE.Mesh(titleTextGeometry, textMaterial)
         scene.add(nameText)
         scene.add(titleText)
     }
 )

/**
 * Particles
 */
const parameters = {}
parameters.count = 150
parameters.size = 5.1
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.58
parameters.randomnessPower = 3
parameters.insideColor = '#b94371'
parameters.outsideColor = '#5006aa'



const geometry = new THREE.BufferGeometry()

const positions = new Float32Array(parameters.count * 3)
const next = new Float32Array(parameters.count * 3)
const prev = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)
const scales = new Float32Array(parameters.count)

for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    const prevPosition = (i - 1) * 3
    const nextPosition = (i + 1) * 3

  
    const x = (i / (parameters.count - 1) - 0.5) * 3;
    const y = Math.sin(i / 10.5) * 0.5;
    
    const prevX = ((i -1) / (parameters.count - 1) - 0.5) * 3;
    const prevY = Math.sin((i -1) / 10.5) * 0.5;
    
    const nextX = ((i + 1) / (parameters.count - 1) - 0.5) * 3;
    const nextY = Math.sin((i + 1) / 10.5) * 0.5;
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = 1

    next[nextPosition] = prevX;
    next[nextPosition + 1] = prevY;
    next[nextPosition + 2] = 1

    prev[prevPosition] = nextX;
    prev[prevPosition + 1] = nextY;
    prev[prevPosition + 2] = 1

   const radius = Math.random() * parameters.radius


   const colorInside = new THREE.Color(parameters.insideColor)
   const colorOutside = new THREE.Color(parameters.outsideColor)
   const mixedColor = colorInside.clone()
   mixedColor.lerp(colorOutside, radius / parameters.radius)

  colors[i3] = mixedColor.r
  colors[i3 + 1] = mixedColor.g
  colors[i3 + 2] = mixedColor.b

  // Scale
  scales[i] = 20;//Math.random()
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
geometry.setAttribute('next', new THREE.BufferAttribute(next, 3))
geometry.setAttribute('prev', new THREE.BufferAttribute(prev, 3))
geometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1))

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  uniforms: {
    u_size: { value: 5 },
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector3() },
    u_resolution: { value: new THREE.Vector2() }
  }
})



/**
 * Points
 */
const points = new THREE.Line(geometry, material)
scene.add(points)


/**
 * Mouse Move
 */
 function handleMouseMove(event) {
    material.uniforms.u_mouse.value.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    material.uniforms.u_mouse.value.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    material.uniforms.u_mouse.value.z = 1;
  }
  
  window.addEventListener("mousemove", handleMouseMove);

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
  material.uniforms.u_resolution.value.x = renderer.domElement.width;
  material.uniforms.u_resolution.value.y = renderer.domElement.height;
})

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
//camera.position.x = 3
//camera.position.y = 3
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

material.uniforms.u_resolution.value.x = renderer.domElement.width;
material.uniforms.u_resolution.value.y = renderer.domElement.height;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Update material
  material.uniforms.u_time.value = elapsedTime
  
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const prev = (i - 1) * 3

        if(i3 === 0){ 
            positions[0] = material.uniforms.u_mouse.value.x;
            positions[1] = material.uniforms.u_mouse.value.y;
            positions[2] = material.uniforms.u_mouse.value.z;
        } 
        else {
            const tempVec3 = new THREE.Vector3( positions[i3],  positions[i3 + 1],  positions[i3 + 2])
            const tempPrevVec3 = new THREE.Vector3( positions[prev],  positions[prev + 1],  positions[prev + 2])
            const tempLerp = tempVec3.lerp(tempPrevVec3, 0.9);
            
            positions[i3] = tempLerp.x;
            positions[i3 + 1] = tempLerp.y;
            positions[i3 + 2] = tempLerp.z;
        }
        
    }
geometry.attributes.position.needsUpdate = true;


  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
