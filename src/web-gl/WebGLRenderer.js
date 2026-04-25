import WebGLUtils from './WebGLUtils'
import PerformanceStats from './PerformanceStats'
import { Texture } from '../game/Texture'

export default class WebGLRenderer {
  /*
    Renderer uses 8 active textures for asteroids, explosions impacts, and particles
    All other textures are bound as they are drawn: bg, stars, projectiles, ship, exhaust
    Single vertex attribute for texture data index
    
  */

  utils = new WebGLUtils()
  webgl // context
  locations // uniform and attribute locations

  buffers // gpu buffers
  textures // image textures
  updateTxIds = 0

  static numLoadedTextures = 0
  static numTextures = 0
  static shadersLoaded = false

  game

  constructor(game) {
    this.game = game
  }

  numRemoved = 0
  numTotal = 0
  maxGameDiff = 0
  maxTickTimeR = 0
  maxTickTimeBD = 0
  maxTickTimeAD = 0
  maxTickGap = 0
  maxTickCombined = 0
  maxGpuTick = 0
  maxTimeBetweenDraws = 0
  fpsIndex = 0
  slowToggleCounter = 0
  lastFpsTick = 0
  setFps() {
    let newFpsTime = performance.now()
    let dt = newFpsTime - PerformanceStats.lastFpsTime
    PerformanceStats.lastFpsTime = newFpsTime

    let ticksDiff = this.ticks - this.lastFpsTick
    this.lastFpsTick = this.ticks

    let rps = (this.numRemoved / dt * 1000).toFixed(1)
    let fps = ticksDiff / dt * 1000
    let heapLimit = null
    let heapSize = null
    let heapUsed = null

    try {
      heapLimit = (window.performance.memory.jsHeapSizeLimit / 1000000).toFixed(1)
      heapSize = (window.performance.memory.totalJSHeapSize / 1000000).toFixed(1)
      heapUsed = (window.performance.memory.usedJSHeapSize / 1000000).toFixed(1)
    } catch { }

    PerformanceStats.renderFps = fps.toFixed(1)
    PerformanceStats.maxRenderTick = this.maxTickTimeR.toFixed(1)
    PerformanceStats.maxTimeBetweenDraws = this.maxTimeBetweenDraws.toFixed(1)
    PerformanceStats.maxRenderGap = this.maxTickGap.toFixed(1)
    PerformanceStats.maxGameBeforeTick = this.maxTickTimeBD.toFixed(1)
    PerformanceStats.maxGameAfterTick = this.maxTickTimeAD.toFixed(1)
    PerformanceStats.maxCombined = this.maxTickCombined.toFixed(1)
    let gl = this.webgl
    let ext = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    if (ext) {
      PerformanceStats.maxGpuTick = this.maxGpuTick.toFixed(1)
    } else {
      PerformanceStats.maxGpuTick = null
    }

    PerformanceStats.fpsLoop[this.fpsIndex] = fps
    PerformanceStats.frameLoop[this.fpsIndex] = this.maxTickGap
    this.fpsIndex = (++this.fpsIndex) % 4

    PerformanceStats.totalObjects = this.numTotal
    PerformanceStats.removedPerSec = rps
    PerformanceStats.heapLimit = heapLimit
    PerformanceStats.heapSize = heapSize
    PerformanceStats.heapUsed = heapUsed

    this.numRemoved = 0
    this.maxTickTimeR = 0
    this.maxTickTimeBD = 0
    this.maxTickTimeAD = 0
    this.maxTickGap = 0
    this.maxTickCombined = 0
    this.maxGpuTick = 0
    this.maxTimeBetweenDraws = 0

    let sum = 0
    PerformanceStats.fpsLoop.forEach(e => {
      sum += e
    })
    let slow = sum / 4 < 55

    sum = 0
    PerformanceStats.frameLoop.forEach(e => {
      sum += e
    })
    let skips = sum / 4 > 32
    let s = slow || skips

    if (PerformanceStats.slow == s) {
      this.slowToggleCounter = 0
    } else {
      ++this.slowToggleCounter
      if (this.slowToggleCounter > 4) {
        this.slowToggleCounter = 0
        PerformanceStats.slow = s
      }
    }
  }

  vText = null
  fText = null
  loadProgram() {
    if (this.vText != null && this.fText != null) {
      let gl = this.webgl

      // shaders
      let program = this.utils.initShaders(gl, this.vText, this.fText)
      gl.useProgram(program)

      // attributes and uniforms
      this.locations = {
        attribLocations: {
          index: gl.getAttribLocation(program, 'vIndex'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
          samplerLoc: gl.getUniformLocation(program, 'uSampler'),
          screen: gl.getUniformLocation(program, 'screen'), // screen dimensions
          sLight0: gl.getUniformLocation(program, 'sLight0'), // ship light
          sLight1: gl.getUniformLocation(program, 'sLight1'),
          eLight00: gl.getUniformLocation(program, 'eLight00'), // effect lights
          eLight01: gl.getUniformLocation(program, 'eLight01'),
          eLight10: gl.getUniformLocation(program, 'eLight10'),
          eLight11: gl.getUniformLocation(program, 'eLight11'),
          aLight00: gl.getUniformLocation(program, 'aLight00'), // ambient lights
          aLight01: gl.getUniformLocation(program, 'aLight01'),
          aLight10: gl.getUniformLocation(program, 'aLight10'),
          aLight11: gl.getUniformLocation(program, 'aLight11'),
          textEffectLight: gl.getUniformLocation(program, 'textEffectLight'), // effect light only applies to text

          shipArgs: gl.getUniformLocation(program, 'shipArgs'),
          shieldArgs: gl.getUniformLocation(program, 'shieldArgs'),
          impactArgs: gl.getUniformLocation(program, 'impactArgs'),
        },
      }

      gl.uniform1iv(this.locations.uniformLocations.samplerLoc, [0, 1, 2, 3, 4, 5, 6, 7])

      WebGLRenderer.shadersLoaded = true
    }
  }

  setupGL() {
    let canvas = document.getElementById('gl-canvas')
    canvas.style.transform = 'translateZ(0)'
    this.webgl = this.utils.setupWebGL(canvas)
    let gl = this.webgl
    if (!gl) {
      return false
    }

    fetch('shaders/vertex.glsl')
      .then((res) => res.text())
      .then((text) => {
        this.vText = text
        this.loadProgram()
      })
      .catch((e) => console.error(e))

    fetch('shaders/fragment.glsl')
      .then((res) => res.text())
      .then((text) => {
        this.fText = text
        this.loadProgram()
      })
      .catch((e) => console.error(e))

    // gl Parameters
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.disable(gl.CULL_FACE)

    // textures and buffers
    this.buffers = {
      vertexBuffer: gl.createBuffer(),
      frameBuffer: gl.createFramebuffer(),
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer)

    this.loadTextures()
    WebGLRenderer.textureMap['data'] = [this.webgl.createTexture(), null]
    return true
  }

  setLightUniforms(light) {
    let gl = this.webgl
    let locs = this.locations
    gl.uniform4fv(locs.uniformLocations.sLight0, light[0][0])
    gl.uniform4fv(locs.uniformLocations.sLight1, light[0][1])
    gl.uniform4fv(locs.uniformLocations.eLight00, light[1][0])
    gl.uniform4fv(locs.uniformLocations.eLight01, light[1][1])
    gl.uniform4fv(locs.uniformLocations.eLight10, light[2][0])
    gl.uniform4fv(locs.uniformLocations.eLight11, light[2][1])
    gl.uniform4fv(locs.uniformLocations.aLight00, light[3][0])
    gl.uniform4fv(locs.uniformLocations.aLight01, light[3][1])
    gl.uniform4fv(locs.uniformLocations.aLight10, light[4][0])
    gl.uniform4fv(locs.uniformLocations.aLight11, light[4][1])
    gl.uniform1f(locs.uniformLocations.textEffectLight, light[5])

  }

  checkActiveTextures([update, activeIds]) {
    if (update !== this.updateTxIds) {
      let gl = this.webgl
      activeIds.forEach((id, index) => {
        gl.activeTexture(gl.TEXTURE2 + index)
        gl.bindTexture(gl.TEXTURE_2D, WebGLRenderer.textureMap[id][0])
      })
      gl.activeTexture(gl.TEXTURE1)
      this.updateTxIds = update
    }
  }

  setDataTexture(texData = null) {
    let gl = this.webgl
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, WebGLRenderer.textureMap['data'][0])

    const level = 0
    const internalFormat = gl.RGBA32F
    const width = 512
    const height = 128
    const border = 0
    const format = gl.RGBA
    const type = gl.FLOAT

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
      format, type, texData)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.activeTexture(gl.TEXTURE1)
  }

  startRender = () => {
    PerformanceStats.lastFpsTime = performance.now()
    PerformanceStats.lastTickFinished = performance.now()
    this.game.startGame()
    this.drawLoop()
    this.fpsLoop()
  }
  fpsLoop = () => {
    this.setFps()
    setTimeout(this.fpsLoop, 1000)
  }

  loop = (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16)
    }
  ).bind(window)

  ticks = 0
  lastDraw = performance.now()
  drawLoop = () => {
    this.loop(this.drawLoop)
    ++this.ticks

    let tBD = performance.now()
    this.game.beforeDraw()
    let tD = performance.now()
    let diffBD = tD - tBD

    let newDraw = performance.now()
    let diffTD = newDraw - this.lastDraw
    this.lastDraw = newDraw

    let query = this.startGpuQuery()
    this.drawScene()
    this.endGpuQuery(query)
    let tAD = performance.now()
    let diffR = tAD - tD

    this.game.afterDraw()
    let tA = performance.now()
    let diffAD = tA - tAD

    let diffTotal = tA - tBD

    let now = performance.now()
    let gapDiff = now - PerformanceStats.lastTickFinished
    PerformanceStats.lastTickFinished = now

    if (gapDiff > this.maxTickGap) {
      this.maxTickGap = gapDiff
    }
    if (diffBD > this.maxTickTimeBD) {
      this.maxTickTimeBD = diffBD
    }
    if (diffR > this.maxTickTimeR) {
      this.maxTickTimeR = diffR
    }
    if (diffAD > this.maxTickTimeAD) {
      this.maxTickTimeAD = diffAD
    }
    if (diffTD > this.maxTimeBetweenDraws) {
      this.maxTimeBetweenDraws = diffTD
    }
    if (diffTotal > this.maxTickCombined) {
      this.maxTickCombined = diffTotal
    }

  }

  startGpuQuery() {
    let gl = this.webgl
    let ext = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    if (ext) {
      let query = gl.createQuery()
      gl.beginQuery(ext.TIME_ELAPSED_EXT, query)
      return query
    }
  }

  endGpuQuery(query) {
    let gl = this.webgl
    let ext = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    if (ext) {
      gl.endQuery(ext.TIME_ELAPSED_EXT)
      setTimeout(() => this.checkQuery(query, 0), 50)
    }
  }

  checkQuery(query, num) {
    let gl = this.webgl
    let ext = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    if (ext) {
      if (query) {
        let available = gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)
        let disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT)
        if (available && !disjoint) {
          let timeElapsed = gl.getQueryParameter(query, gl.QUERY_RESULT)
          let gpuTick = timeElapsed / 1000000
          if (gpuTick > this.maxGpuTick) {
            this.maxGpuTick = gpuTick
          }
        }

        if (available || disjoint) {
          gl.deleteQuery(query)
        } else {
          if (num < 3) {
            ++num
            setTimeout(() => this.checkQuery(query, num), 50)
          } else {
            console.log("Gpu query timed out")
          }
        }
      }
    }
  }

  clearCanvas(r, g, b, a) {
    let gl = this.webgl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clearColor(r, g, b, a)
  }

  drawCalls
  drawTexActive(tdi) {
    ++this.drawCalls
    this.webgl.drawArrays(this.webgl.TRIANGLES, 6 * tdi[0], 6 * tdi[1])
  }

  drawTexBindFirst(tdi) {
    if (tdi[1] > 0) {
      let tex = WebGLRenderer.textureMap[Texture.textureIds[tdi[0]]]
      ++this.drawCalls
      this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex[0])
      this.webgl.drawArrays(this.webgl.TRIANGLES, 6 * tdi[0], 6 * tdi[1])
    }
  }

  drawTexBindAll(tdi) {
    let max = tdi[0] + tdi[1]
    for (let i = tdi[0]; i < max; ++i) {
      let tex = WebGLRenderer.textureMap[Texture.textureIds[i]]
      ++this.drawCalls
      this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex[0])
      this.webgl.drawArrays(this.webgl.TRIANGLES, 6 * i, 6)
    }
  }

  drawScene() {
    this.drawCalls = 0
    let gl = this.webgl
    let locs = this.locations
    let renderData = this.game.getRenderData()

    let [numTotal, numRemoved, maxDiff] = renderData['stats']
    this.numRemoved += numRemoved
    this.numTotal = numTotal
    this.maxGameDiff = maxDiff

    if (numTotal > 10000) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      this.clearCanvas(0, 0, 0, 1)
      return
    }

    this.setDataTexture(Texture.texData)
    this.checkActiveTextures(renderData['activeTextures'])
    this.setLightUniforms(renderData['light'])

    // setup vertex attribute
    gl.bufferData(gl.ARRAY_BUFFER, Texture.vertexData, gl.STATIC_DRAW)
    gl.vertexAttribPointer(locs.attribLocations.index, 1, gl.FLOAT, false, 4, 0)
    gl.enableVertexAttribArray(locs.attribLocations.index)

    let [texDataIndices, projectileIndices] = renderData['texIndices']

    // draw textures to frame buffer texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers.frameBuffer)
    this.clearCanvas(0, 0, 0, 1)

    // bgImages
    this.drawTexBindAll(texDataIndices['bgImages'])

    // stars
    this.drawTexBindFirst(texDataIndices['bg'])

    // particles0, blend
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    this.drawTexBindFirst(texDataIndices['particles0'])
    this.drawTexActive(texDataIndices['blend'])
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // sorted
    this.drawTexActive(texDataIndices['sorted'])

    // projectiles
    for (let key in projectileIndices) {
      this.drawTexBindFirst(projectileIndices[key])
    }

    // particles1
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    this.drawTexBindFirst(texDataIndices['particles1'])
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // text
    this.drawTexActive(texDataIndices['text'])
    this.drawTexActive(texDataIndices['textBgs'])
    this.drawTexActive(texDataIndices['msgText'])

    // draw frame buffer to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    this.clearCanvas(0, 0, 0, 1)

    // screen frags
    this.drawTexBindFirst(texDataIndices['screenFrags'])

    // exhaust
    this.drawTexBindFirst(texDataIndices['exhaust'])

    // missile
    this.drawTexBindAll(texDataIndices['missiles'])

    // ship
    this.drawTexBindAll(texDataIndices['ships'])

    // bars
    this.drawTexActive(texDataIndices['bars'])
  }

  setupProjection(wpx, hpx, wb, hb) {
    let gl = this.webgl
    let locs = this.locations

    gl.canvas.style.width = wpx + "px"
    gl.canvas.style.height = hpx + "px"
    gl.canvas.width = wb
    gl.canvas.height = hb

    // update screen uniform
    gl.uniform4fv(locs.uniformLocations.screen, [wb, hb, wb / hb, 0])
    // update frame buffer texture
    this.createFramebufferTexture(wb, hb)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers.frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, WebGLRenderer.textureMap['frameBuffer'][0], 0)
    // set viewport
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }

  static textureMap
  setTextureMapValue(key, path) {
    WebGLRenderer.textureMap[key] = [this.getTexture(path), path]
  }

  setTextureMapValueUi(key, path) {
    WebGLRenderer.textureMap[key] = [null, path]
  }

  loadTextures() {
    WebGLRenderer.textureMap = {}

    // ship
    this.setTextureMapValue('s0', '/textures/ships/so.png')
    this.setTextureMapValue('s1', '/textures/ships/sw.png')

    // projectile
    this.setTextureMapValue('p00', '/textures/projectiles/p1.png')
    this.setTextureMapValue('p01', '/textures/projectiles/p1.png')
    this.setTextureMapValue('p02', '/textures/projectiles/p1.png')

    this.setTextureMapValue('p10', '/textures/projectiles/p0.png')
    this.setTextureMapValue('p11', '/textures/projectiles/p0.png')

    // missile
    this.setTextureMapValue('m0', '/textures/missiles/m0.png')

    // ui
    this.setTextureMapValueUi('pi00', '/textures/ui/g00.png')
    this.setTextureMapValueUi('pi01', '/textures/ui/g01.png')
    this.setTextureMapValueUi('pi02', '/textures/ui/g02.png')

    this.setTextureMapValueUi('pi10', '/textures/ui/g10.png')
    this.setTextureMapValueUi('pi11', '/textures/ui/g11.png')

    this.setTextureMapValueUi('cw0', '/textures/ui/e00.png')
    this.setTextureMapValueUi('cw1', '/textures/ui/e10.png')

    // bg
    this.setTextureMapValue('bg0a', '/textures/bg/0a.jpg')
    this.setTextureMapValue('bg0b', '/textures/bg/0b.jpg')

    // asteroid
    this.setTextureMapValue('a00', '/textures/asteroids/aw0.png')
    this.setTextureMapValue('a01', '/textures/asteroids/aw1.png')
    this.setTextureMapValue('a10', '/textures/asteroids/ao0.png')
    this.setTextureMapValue('a11', '/textures/asteroids/ao1.png')

    this.setTextureMapValue('a20', '/textures/asteroids/ag0.png')
    this.setTextureMapValue('a21', '/textures/asteroids/ag1.png')
    this.setTextureMapValue('a30', '/textures/asteroids/ap0.png')
    this.setTextureMapValue('a31', '/textures/asteroids/ap1.png')

    // asteroid impact
    this.setTextureMapValue('ai00', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai01', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai02', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai03', '/textures/explosions/explosion0.png')

    this.setTextureMapValue('ai10', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai11', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai12', '/textures/explosions/explosion0.png')
    this.setTextureMapValue('ai13', '/textures/explosions/explosion0.png')

    // asteroid explosion
    this.setTextureMapValue('ae00', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae01', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae02', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae03', '/textures/explosions/debris0.png')

    this.setTextureMapValue('ae10', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae11', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae12', '/textures/explosions/debris0.png')
    this.setTextureMapValue('ae13', '/textures/explosions/debris0.png')

    // text
    this.setTextureMapValue('tektur36', '/textures/text/tektur36.png')

    // effects
    this.setTextureMapValue('exhaust', '/textures/effects/dot1.png')
    this.setTextureMapValue('ricochet', '/textures/effects/r03.png')
    this.setTextureMapValue('particle', '/textures/effects/r1.png')
    this.setTextureMapValue('bg', '/textures/effects/r1.png')
    this.setTextureMapValue('sh', '/textures/effects/circle3.png')
  }

  createFramebufferTexture(wb, hb) {
    let gl = this.webgl
    let frameTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, frameTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wb, hb, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    WebGLRenderer.textureMap['frameBuffer'] = [frameTexture, null]
  }

  getTexture(imageSource) {
    ++WebGLRenderer.numTextures
    let gl = this.webgl
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]))

    const image = new Image()
    image.src = imageSource
    image.addEventListener('load', function () {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      if ((image.width & (image.width - 1)) === 0 && (image.height & (image.height - 1) === 0)) {
        gl.generateMipmap(gl.TEXTURE_2D)
      }
      else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      }
      ++WebGLRenderer.numLoadedTextures
    })
    return texture
  }

  disposeTextures() {
    this.textureMap.forEach(t => {
      this.webgl.deleteTexture(t[0])
    })
  }
}
