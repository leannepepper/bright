import * as THREE from 'three'
import { colors } from './colorPicker.js'
import { uniform } from 'three/tsl'

export const GRID_SIZE = 40.0
export const isTouchDevice = matchMedia('(pointer: coarse)').matches
export const gridColsUniform = uniform(40)

export function buildDataTexture (aspect) {
  const cols = Math.ceil(GRID_SIZE * aspect)
  gridColsUniform.value = cols

  const data = new Uint8Array(cols * GRID_SIZE * 4)
  const tex = new THREE.DataTexture(data, cols, GRID_SIZE, THREE.RGBAFormat)
  //   tex.wrapS = tex.wrapT = THREE.RepeatWrapping
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

export const flowers = [
  {
    index: 5296,
    color: colors.green
  },
  {
    index: 5296,
    color: colors.green
  },
  {
    index: 5300,
    color: colors.green
  },
  {
    index: 5456,
    color: colors.green
  },
  {
    index: 5616,
    color: colors.green
  },
  {
    index: 5780,
    color: colors.green
  },
  {
    index: 5784,
    color: colors.green
  },
  {
    index: 5788,
    color: colors.green
  },
  {
    index: 5792,
    color: colors.green
  },
  {
    index: 5632,
    color: colors.green
  },
  {
    index: 5476,
    color: colors.green
  },
  {
    index: 5312,
    color: colors.green
  },
  {
    index: 5152,
    color: colors.green
  },
  {
    index: 4988,
    color: colors.green
  },
  {
    index: 4828,
    color: colors.green
  },
  {
    index: 4664,
    color: colors.green
  },
  {
    index: 4504,
    color: colors.green
  },
  {
    index: 4500,
    color: colors.green
  },
  {
    index: 4496,
    color: colors.green
  },
  {
    index: 4332,
    color: colors.green
  },
  {
    index: 4172,
    color: colors.green
  },
  {
    index: 4012,
    color: colors.green
  },
  {
    index: 3856,
    color: colors.green
  },
  {
    index: 3696,
    color: colors.green
  },
  {
    index: 3540,
    color: colors.green
  },
  {
    index: 3380,
    color: colors.green
  },
  {
    index: 3384,
    color: colors.green
  },
  {
    index: 3224,
    color: colors.green
  },
  {
    index: 3548,
    color: colors.green
  },
  {
    index: 3552,
    color: colors.green
  },
  {
    index: 3556,
    color: colors.green
  },
  {
    index: 3560,
    color: colors.green
  },
  {
    index: 3720,
    color: colors.green
  },
  {
    index: 3884,
    color: colors.green
  },
  {
    index: 4044,
    color: colors.green
  },
  {
    index: 4204,
    color: colors.green
  },
  {
    index: 4360,
    color: colors.green
  },
  {
    index: 4356,
    color: colors.green
  },
  {
    index: 4196,
    color: colors.green
  },
  {
    index: 3060,
    color: colors.green
  },
  {
    index: 1324,
    color: colors.green
  },
  {
    index: 1328,
    color: colors.green
  },
  {
    index: 1492,
    color: colors.green
  },
  {
    index: 1488,
    color: colors.green
  },
  {
    index: 1336,
    color: colors.green
  },
  {
    index: 1340,
    color: colors.green
  },
  {
    index: 1500,
    color: colors.green
  },
  {
    index: 1828,
    color: colors.green
  },
  {
    index: 1992,
    color: colors.green
  },
  {
    index: 1672,
    color: colors.green
  },
  {
    index: 1504,
    color: colors.green
  },
  {
    index: 1668,
    color: colors.green
  },
  {
    index: 1512,
    color: colors.green
  },
  {
    index: 1356,
    color: colors.green
  },
  {
    index: 1360,
    color: colors.green
  },
  {
    index: 1364,
    color: colors.green
  },
  {
    index: 1368,
    color: colors.green
  },
  {
    index: 1372,
    color: colors.green
  },
  {
    index: 1532,
    color: colors.green
  },
  {
    index: 1696,
    color: colors.green
  },
  {
    index: 1856,
    color: colors.green
  },
  {
    index: 1860,
    color: colors.green
  },
  {
    index: 1864,
    color: colors.green
  },
  {
    index: 1708,
    color: colors.green
  },
  {
    index: 1544,
    color: colors.green
  },
  {
    index: 1540,
    color: colors.green
  },
  {
    index: 3124,
    color: colors.green
  },
  {
    index: 3288,
    color: colors.green
  },
  {
    index: 3292,
    color: colors.green
  },
  {
    index: 3464,
    color: colors.green
  },
  {
    index: 3628,
    color: colors.green
  },
  {
    index: 3788,
    color: colors.green
  },
  {
    index: 3952,
    color: colors.green
  },
  {
    index: 4112,
    color: colors.green
  },
  {
    index: 4276,
    color: colors.green
  },
  {
    index: 4280,
    color: colors.green
  },
  {
    index: 4284,
    color: colors.green
  },
  {
    index: 4288,
    color: colors.green
  },
  {
    index: 4448,
    color: colors.green
  },
  {
    index: 4612,
    color: colors.green
  },
  {
    index: 4772,
    color: colors.green
  },
  {
    index: 4936,
    color: colors.green
  },
  {
    index: 1480,
    color: colors.green
  },
  {
    index: 2152,
    color: colors.green
  },
  {
    index: 2316,
    color: colors.green
  },
  {
    index: 2476,
    color: colors.green
  },
  {
    index: 2964,
    color: colors.green
  },
  {
    index: 2800,
    color: colors.green
  },
  {
    index: 2640,
    color: colors.green
  },
  {
    index: 2900,
    color: colors.green
  },
  {
    index: 3060,
    color: colors.orange
  },
  {
    index: 2900,
    color: colors.orange
  },
  {
    index: 2904,
    color: colors.orange
  },
  {
    index: 2736,
    color: colors.orange
  },
  {
    index: 2740,
    color: colors.orange
  },
  {
    index: 2744,
    color: colors.orange
  },
  {
    index: 2580,
    color: colors.orange
  },
  {
    index: 2584,
    color: colors.orange
  },
  {
    index: 2420,
    color: colors.orange
  },
  {
    index: 2424,
    color: colors.orange
  },
  {
    index: 3064,
    color: colors.orange
  },
  {
    index: 2908,
    color: colors.orange
  },
  {
    index: 2748,
    color: colors.orange
  },
  {
    index: 2588,
    color: colors.orange
  },
  {
    index: 2752,
    color: colors.orange
  },
  {
    index: 2756,
    color: colors.orange
  },
  {
    index: 2760,
    color: colors.orange
  },
  {
    index: 2604,
    color: colors.orange
  },
  {
    index: 2592,
    color: colors.orange
  },
  {
    index: 2596,
    color: colors.orange
  },
  {
    index: 2600,
    color: colors.orange
  },
  {
    index: 2428,
    color: colors.orange
  },
  {
    index: 2432,
    color: colors.orange
  },
  {
    index: 2436,
    color: colors.orange
  },
  {
    index: 2440,
    color: colors.orange
  },
  {
    index: 2272,
    color: colors.orange
  },
  {
    index: 2276,
    color: colors.orange
  },
  {
    index: 2280,
    color: colors.orange
  },
  {
    index: 2264,
    color: colors.red
  },
  {
    index: 2268,
    color: colors.red
  },
  {
    index: 2100,
    color: colors.red
  },
  {
    index: 2104,
    color: colors.red
  },
  {
    index: 2108,
    color: colors.red
  },
  {
    index: 1944,
    color: colors.red
  },
  {
    index: 1948,
    color: colors.red
  },
  {
    index: 2112,
    color: colors.red
  },
  {
    index: 2112,
    color: colors.orange
  },
  {
    index: 1952,
    color: colors.orange
  },
  {
    index: 2116,
    color: colors.orange
  },
  {
    index: 1956,
    color: colors.orange
  },
  {
    index: 1792,
    color: colors.orange
  },
  {
    index: 2120,
    color: colors.orange
  },
  {
    index: 1960,
    color: colors.orange
  },
  {
    index: 1796,
    color: colors.orange
  },
  {
    index: 1636,
    color: colors.orange
  },
  {
    index: 1964,
    color: colors.orange
  },
  {
    index: 1800,
    color: colors.orange
  },
  {
    index: 1640,
    color: colors.orange
  },
  {
    index: 1804,
    color: colors.orange
  },
  {
    index: 1644,
    color: colors.orange
  },
  {
    index: 1784,
    color: colors.orange
  },
  {
    index: 1788,
    color: colors.orange
  },
  {
    index: 1624,
    color: colors.orange
  },
  {
    index: 1628,
    color: colors.orange
  },
  {
    index: 1632,
    color: colors.orange
  },
  {
    index: 1460,
    color: colors.orange
  },
  {
    index: 1464,
    color: colors.orange
  },
  {
    index: 1468,
    color: colors.orange
  },
  {
    index: 1472,
    color: colors.orange
  },
  {
    index: 1304,
    color: colors.orange
  },
  {
    index: 1308,
    color: colors.orange
  },
  {
    index: 1312,
    color: colors.orange
  },
  {
    index: 1144,
    color: colors.orange
  },
  {
    index: 1148,
    color: colors.orange
  },
  {
    index: 1780,
    color: colors.orange
  },
  {
    index: 1940,
    color: colors.orange
  },
  {
    index: 1620,
    color: colors.orange
  },
  {
    index: 1776,
    color: colors.orange
  },
  {
    index: 1936,
    color: colors.orange
  },
  {
    index: 1932,
    color: colors.orange
  },
  {
    index: 1772,
    color: colors.orange
  },
  {
    index: 1616,
    color: colors.orange
  },
  {
    index: 1456,
    color: colors.orange
  },
  {
    index: 1452,
    color: colors.orange
  },
  {
    index: 1612,
    color: colors.orange
  },
  {
    index: 1772,
    color: colors.orange
  },
  {
    index: 1768,
    color: colors.orange
  },
  {
    index: 1608,
    color: colors.orange
  },
  {
    index: 1448,
    color: colors.orange
  },
  {
    index: 2096,
    color: colors.orange
  },
  {
    index: 2260,
    color: colors.orange
  },
  {
    index: 2092,
    color: colors.orange
  },
  {
    index: 2256,
    color: colors.orange
  },
  {
    index: 2416,
    color: colors.orange
  },
  {
    index: 2576,
    color: colors.orange
  },
  {
    index: 2412,
    color: colors.orange
  },
  {
    index: 2252,
    color: colors.orange
  },
  {
    index: 2088,
    color: colors.orange
  },
  {
    index: 2248,
    color: colors.orange
  },
  {
    index: 2408,
    color: colors.orange
  },
  {
    index: 2572,
    color: colors.orange
  },
  {
    index: 2568,
    color: colors.orange
  },
  {
    index: 2404,
    color: colors.orange
  },
  {
    index: 4828,
    color: colors.yellow
  },
  {
    index: 4984,
    color: colors.pink
  },
  {
    index: 4988,
    color: colors.pink
  },
  {
    index: 4824,
    color: colors.pink
  },
  {
    index: 4832,
    color: colors.pink
  },
  {
    index: 4664,
    color: colors.pink
  },
  {
    index: 4668,
    color: colors.pink
  },
  {
    index: 4252,
    color: colors.cyan
  },
  {
    index: 4256,
    color: colors.cyan
  },
  {
    index: 4088,
    color: colors.cyan
  },
  {
    index: 4092,
    color: colors.cyan
  },
  {
    index: 4096,
    color: colors.cyan
  },
  {
    index: 4084,
    color: colors.cyan
  },
  {
    index: 4248,
    color: colors.cyan
  },
  {
    index: 4408,
    color: colors.cyan
  },
  {
    index: 4412,
    color: colors.cyan
  },
  {
    index: 3928,
    color: colors.cyan
  },
  {
    index: 3932,
    color: colors.cyan
  },
  {
    index: 3936,
    color: colors.cyan
  },
  {
    index: 3768,
    color: colors.cyan
  },
  {
    index: 3776,
    color: colors.pink
  },
  {
    index: 3780,
    color: colors.pink
  },
  {
    index: 3784,
    color: colors.pink
  },
  {
    index: 3620,
    color: colors.pink
  },
  {
    index: 3624,
    color: colors.pink
  },
  {
    index: 3628,
    color: colors.pink
  },
  {
    index: 3460,
    color: colors.pink
  },
  {
    index: 3464,
    color: colors.pink
  },
  {
    index: 3936,
    color: colors.pink
  },
  {
    index: 3772,
    color: colors.cyan
  },
  {
    index: 3936,
    color: colors.cyan
  },
  {
    index: 3940,
    color: colors.cyan
  },
  {
    index: 3940,
    color: colors.pink
  },
  {
    index: 3944,
    color: colors.pink
  },
  {
    index: 3948,
    color: colors.pink
  },
  {
    index: 3788,
    color: colors.pink
  },
  {
    index: 3616,
    color: colors.pink
  },
  {
    index: 3456,
    color: colors.pink
  },
  {
    index: 3612,
    color: colors.yellow
  },
  {
    index: 3608,
    color: colors.yellow
  },
  {
    index: 3444,
    color: colors.yellow
  },
  {
    index: 3448,
    color: colors.yellow
  },
  {
    index: 3452,
    color: colors.yellow
  },
  {
    index: 3288,
    color: colors.yellow
  },
  {
    index: 3292,
    color: colors.yellow
  },
  {
    index: 3296,
    color: colors.cyan
  },
  {
    index: 3132,
    color: colors.cyan
  },
  {
    index: 3300,
    color: colors.cyan
  },
  {
    index: 3136,
    color: colors.cyan
  },
  {
    index: 2976,
    color: colors.cyan
  },
  {
    index: 3304,
    color: colors.cyan
  },
  {
    index: 3140,
    color: colors.cyan
  },
  {
    index: 2980,
    color: colors.cyan
  },
  {
    index: 2816,
    color: colors.cyan
  },
  {
    index: 3144,
    color: colors.cyan
  },
  {
    index: 2984,
    color: colors.cyan
  },
  {
    index: 2820,
    color: colors.cyan
  },
  {
    index: 2988,
    color: colors.cyan
  },
  {
    index: 2824,
    color: colors.cyan
  },
  {
    index: 3128,
    color: colors.pink
  },
  {
    index: 3124,
    color: colors.pink
  },
  {
    index: 2964,
    color: colors.pink
  },
  {
    index: 2968,
    color: colors.pink
  },
  {
    index: 2972,
    color: colors.pink
  },
  {
    index: 2812,
    color: colors.pink
  },
  {
    index: 2808,
    color: colors.pink
  },
  {
    index: 2804,
    color: colors.pink
  },
  {
    index: 2800,
    color: colors.pink
  },
  {
    index: 2644,
    color: colors.pink
  },
  {
    index: 2648,
    color: colors.pink
  },
  {
    index: 2652,
    color: colors.pink
  },
  {
    index: 2488,
    color: colors.pink
  },
  {
    index: 2484,
    color: colors.pink
  },
  {
    index: 3284,
    color: colors.cyan
  },
  {
    index: 3440,
    color: colors.cyan
  },
  {
    index: 3436,
    color: colors.cyan
  },
  {
    index: 3280,
    color: colors.cyan
  },
  {
    index: 3120,
    color: colors.cyan
  },
  {
    index: 2960,
    color: colors.cyan
  },
  {
    index: 3116,
    color: colors.cyan
  },
  {
    index: 3276,
    color: colors.cyan
  },
  {
    index: 3432,
    color: colors.cyan
  },
  {
    index: 2956,
    color: colors.cyan
  },
  {
    index: 3112,
    color: colors.cyan
  },
  {
    index: 3272,
    color: colors.cyan
  },
  {
    index: 3108,
    color: colors.cyan
  },
  {
    index: 2952,
    color: colors.cyan
  },
  {
    index: 3604,
    color: colors.pink
  },
  {
    index: 3764,
    color: colors.pink
  },
  {
    index: 3600,
    color: colors.pink
  },
  {
    index: 3760,
    color: colors.pink
  },
  {
    index: 3924,
    color: colors.pink
  },
  {
    index: 4080,
    color: colors.pink
  },
  {
    index: 3920,
    color: colors.pink
  },
  {
    index: 3760,
    color: colors.pink
  },
  {
    index: 3756,
    color: colors.pink
  },
  {
    index: 3596,
    color: colors.pink
  },
  {
    index: 3752,
    color: colors.pink
  },
  {
    index: 3916,
    color: colors.pink
  },
  {
    index: 4076,
    color: colors.pink
  },
  {
    index: 3912,
    color: colors.pink
  },
  {
    index: 4072,
    color: colors.pink
  },
  {
    index: 4984,
    color: colors.orange
  },
  {
    index: 4988,
    color: colors.orange
  },
  {
    index: 4832,
    color: colors.orange
  },
  {
    index: 4824,
    color: colors.orange
  },
  {
    index: 4664,
    color: colors.orange
  },
  {
    index: 4668,
    color: colors.orange
  },
  {
    index: 4608,
    color: colors.orange
  },
  {
    index: 4612,
    color: colors.orange
  },
  {
    index: 4444,
    color: colors.orange
  },
  {
    index: 4452,
    color: colors.orange
  },
  {
    index: 4288,
    color: colors.orange
  },
  {
    index: 4292,
    color: colors.orange
  },
  {
    index: 4448,
    color: colors.yellow
  },
  {
    index: 4448,
    color: colors.yellow
  },
  {
    index: 4984,
    color: colors.pink
  },
  {
    index: 4988,
    color: colors.pink
  },
  {
    index: 4824,
    color: colors.pink
  },
  {
    index: 4668,
    color: colors.pink
  },
  {
    index: 4984,
    color: colors.orange
  },
  {
    index: 4984,
    color: colors.pink
  },
  {
    index: 4664,
    color: colors.pink
  },
  {
    index: 4668,
    color: colors.pink
  },
  {
    index: 4832,
    color: colors.pink
  }
]
