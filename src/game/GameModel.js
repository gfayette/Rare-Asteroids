import ScreenFragment from './models/ScreenFragment.js'
import StateManager from './state/StateManager.js'
import Collisions from './Collisions.js'
import ScoreKeeper from './ScoreKeeper.js'
import { Texture } from './Texture.js'
import { EffectBar, ShieldBar } from './models/Bar.js'
import ColorFade from './effects/ColorFade.js'

export default class GameModel {

	/*
	Game uses a grid with height 1 (y axis), starting from 0 at the top.
	Width is aspect (x axis), starting from 0 on the left.

	All rendered game objects inherit from the Texture class. 
	This class has methods to convert the game object into data for webgl.
	Game object positions are centered on the texture.

	Vertex shaders use a grid with the origin centered on the canvas.

	Fragment shaders use fragment coordinates which are in buffer pixels starting from the edge of the texture.
	Buffer pixels are screen pixels multiplied by devicePixelRatio ( > 1 for high dpi screens)
	Texture mapping uses a grid with x and y in the range 0-1.
	*/

	/*
	To increase performance:
	1)  Render triangles with data texture - Done
	2)  Hardcode explosions
	3)  Better collision detection - Done
	4)  Reduce texture size (reduce program weight)
	5)  Special cases for square objects
	6)  Threading/Workers - Marginal performance gain
	7)  Object pools
	8)  Sort projectiles, reduce draw calls - Done
	*/

	gameTimeWarp = 1
	menuTimeWarp = 1
	menuTimeWarpTarget = 1
	elapsedTime = 0
	lastTimestamp = 0

	zoom = 1.6
	vScaleHeight = 350
	vScale = 1
	msgScale = 1
	vScroll = 0
	controlsLocked = false
	menuOpen = false

	width = 1
	wPx = 50
	widthPx = 100
	height = 1
	hPx = 50
	heightPx = 100
	aspect = 1
	pxRatio = 1

	mainShip = null
	drones = []
	shields = []

	sortedObjects = []
	objectsBlend = []
	projectiles = []
	exhaust = []
	missiles = []
	asteroids = []
	rareAsteroids = []
	projectileDebris = []
	backgrounds = []
	backgroundImages = []
	particles1 = []
	particles0 = []
	textBgs = []
	textStrings = []
	scaleTextStrings = []
	screenFragments = []

	sequences = []
	lights = []

	messageQueue = []
	currentMessage = null

	bgAdder = null
	asteroidAdder = null

	stateManager
	gameState
	scoreKeeper

	specialEffect

	shieldBar
	effectBar

	/*
	X - 0.5 = data
	X - 1.5 = bind during draw
	2.5 = asteroid
	3.5 = rare asteroid
	4.5 = asteroid impact
	5.5 = asteroid explosion
	6.5 = ricochet
	7.5 = text
	*/
	activeTextures = [
		'a00',
		'a00',
		'ai00',
		'ae00',
		'ricochet',
		'tektur36'
	]

	// [[x, y, radius, i], [r, g, b, i2]]
	// ship, e1, e2, a1, a2
	light = [
		[[0, 0, 300, 4.0], [0.8, 0.6, 1, 0.5]],
		[[0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0]],
		0 // effect light for text only
	]


	renderData = {
		'texIndices': [{}, {}],
		'stats': [0, 0],
		'activeTextures': [0, this.activeTextures],
		'light': this.light,
	}

	constructor() {
		this.screenFragments = [new ScreenFragment(this.width, this.height, this.width / 2, this.height / 2, 0, null, this)]
		this.stateManager = new StateManager(this)
		this.scoreKeeper = new ScoreKeeper(this)

		this.shieldBar = new ShieldBar(this, new ColorFade([0, 0, 0, 0], [0, 0, 0, 0]))
		this.effectBar = new EffectBar(this, new ColorFade([0, 0, 0, 0], [0, 0, 0, 0]))
	}

	// w and h in buffer pixels
	resize(wpx, hpx, w, h) {
		let newAspect = w / h
		let aspectDiff = newAspect / this.aspect
		this.aspect = newAspect
		this.widthPx = w
		this.heightPx = h
		this.width = this.aspect
		this.height = 1
		this.pxRatio = h
		this.wPx = wpx
		this.hPx = hpx

		if (this.screenFragments.length === 1) {
			this.screenFragments = [new ScreenFragment(this.width, this.height, this.width / 2, this.height / 2, 0, null, this)]
		}

		if (this.aspect < 1) {
			this.vScale = this.aspect
		} else {
			this.vScale = 1
		}
		let vs = this.vScaleHeight / (hpx > 800 ? 800 : hpx)
		if (vs < this.vScale) {
			this.vScale = vs
		}
		this.msgScale = window.innerWidth > 800 ? this.vScale * 2.5 : this.vScale * 3.2
		this.vScale *= this.zoom

		if (this.mainShip != null) {
			this.mainShip.xPos *= aspectDiff
			this.mainShip.resize()
		}
		if (this.bgAdder != null) {
			this.bgAdder.resize()
		}
		if (this.asteroidAdder != null) {
			this.asteroidAdder.resize()
		}

		this.resizeBars()
		this.reset()
	}

	resizeBars() {
		this.shieldBar.resize()
		this.effectBar.resize()
	}

	reset(setAsteroids = false) {
		for (let i = 1; i < 5; ++i) {
			this.setLightIntensity(0, 0, i)
		}
		this.projectileDebris = []
		this.projectiles = []
		this.missiles = []
		this.exhaust = []
		this.particles1 = []
		this.particles0 = []
		this.textStrings = []
		this.lights = []
		this.scoreKeeper.reset()
		this.lastTimestamp = performance.now()
		this.scaleTextStrings.forEach(t => {
			t.reset()
		})
		this.messageQueue = []
		if (this.mainShip != null) {
			this.mainShip.reset()
		}
		if (this.bgAdder != null) {
			this.bgAdder.reset()
		}
		if (this.asteroidAdder != null) {
			this.asteroidAdder.reset(setAsteroids)
		}
		this.specialEffect.reset()
		this.aggregateTextures()
	}

	setState(state) {
		this.gameState = state
		this.stateManager.autoUpgrade = state.autoUpgrade
		this.stateManager.autoUnlock = state.autoUnlock
		this.stateManager.addGameState()
		this.gameTimeWarp = state.timeWarp
		this.controlsLocked = false
		if (state.type === "title") {
			this.menuOpen = true
		}
		this.applyZoom(state.zoom)
	}

	setActiveTexture(index, texId) {
		this.renderData['activeTextures'][0] = (this.renderData['activeTextures'][0] + 1) % 16
		this.renderData['activeTextures'][1][index] = texId
	}

	moveLight(x, y, light) {
		this.light[light][0][0] = x * 2 - this.aspect
		this.light[light][0][1] = y * -2 + 1
	}

	setLightRadius(r, light) {
		this.light[light][0][2] = r * this.heightPx
	}

	setLightColor(color, light) {
		this.light[light][1][0] = color[0]
		this.light[light][1][1] = color[1]
		this.light[light][1][2] = color[2]
	}

	setLightIntensity(i0, i1, light) {
		if (i0 > -0.5) {
			this.light[light][0][3] = i0
		}

		if (i1 > -0.5) {
			this.light[light][1][3] = i1
		}
	}

	setLightForText(use) {
		this.light[5] = use
	}

	moveShip(position) {
		if ((position < this.aspect * 0.1 || position > this.aspect * 0.9) && this.mainShip.warp === 1) {
			this.mainShip.rTarget = position > this.aspect / 2 ? this.mainShip.rTargetMax : -this.mainShip.rTargetMax
			this.mainShip.gotoPosition = -1
		} else {
			this.mainShip.gotoPosition = position
		}
	}

	stopMoveShip = () => {
		if (this.gotoPosition !== -1) {
			this.mainShip.rTarget = 0
			this.mainShip.gotoPosition = -1
		}
	}

	setTimeWarp(m) {
		this.menuTimeWarp = m
		this.menuTimeWarpTarget = m
	}

	setTimeWarpTarget(m) {
		this.menuTimeWarpTarget = m
	}

	setMenuOpen(menuOpen) {
		this.menuOpen = menuOpen
	}

	getSettings() {
		return [this.gameState.zoom, this.gameState.timeWarp, this.gameState.difficulty, this.gameState.pace, this.gameState.autoUpgrade, this.gameState.autoUnlock]
	}

	setBaseTimeWarp(w) {
		this.gameState.timeWarp = w
		this.gameTimeWarp = w
	}

	setDifficulty(difficulty) {
		this.gameState.difficulty = difficulty
	}

	setZoom(zoom) {
		this.gameState.zoom = zoom
		this.setZoomTimer(zoom)
	}

	setPace(pace) {
		this.gameState.pace = pace
	}

	setAutoUpgrade(auto) {
		this.gameState.autoUpgrade = auto
		this.stateManager.autoUpgrade = auto
	}

	setAutoUnlock(auto) {
		this.gameState.autoUnlock = auto
		this.stateManager.autoUnlock = auto
	}

	intervalId = null
	setZoomTimer(v) {
		clearInterval(this.intervalId)
		this.intervalId = setInterval(() => {
			clearInterval(this.intervalId)
			this.applyZoom(v)
		}, 100)
	}

	applyZoom(v) {
		this.zoom = v
		let wpx = window.innerWidth
		let hpx = window.innerHeight
		let devicePixelRatio = window.devicePixelRatio || 1
		let wb = wpx * devicePixelRatio
		let hb = hpx * devicePixelRatio
		this.resize(wpx, hpx, wb, hb)
	}


	// x and y in game grid coords
	handleMouse(x, y, action) {
		if (this.controlsLocked) {
			return
		}

		if (action === 'd') {
			if (y < 0.7) {
				this.specialEffect.click(x, y)
			} else {
				this.moveShip(x)
			}

		} else if (action === 'u') {
			this.stopMoveShip()
		} else if (action === 'm') {
			if (y < 0.7) {
				this.stopMoveShip()
			} else {
				this.moveShip(x)
			}
		}
	}

	// h without device pixel ratio
	handleTouch(e, h) {
		if (this.controlsLocked) {
			return
		}

		if (e.type === 'touchstart') {
			let touch = e.changedTouches[0]
			let x = touch.pageX / h
			let y = touch.pageY / h
			if (y < 0.7) {

			} else {
				this.moveShip(x)
			}
		} else if (e.type === 'touchend') {
			if (e.touches.length === 0) {
				this.stopMoveShip()
			} else {
				let foundMoveTouch = false
				for (let i = 0; i < e.touches.length; ++i) {
					let touch = e.touches[i]
					let x = touch.pageX / h
					let y = touch.pageY / h
					if (y > 0.7) {
						this.moveShip(x)
						foundMoveTouch = true
						break
					}
				}
				if (!foundMoveTouch) {
					this.stopMoveShip()
				}
			}
		} else if (e.type === 'touchmove') {
			let touch = e.changedTouches[0]
			let x = touch.pageX / h
			let y = touch.pageY / h
			if (y > 0.7) {
				this.moveShip(x)
			}
		}
	}

	getRenderData() {
		return this.renderData
	}

	startGame = () => {
		this.lastTimestamp = performance.now()
		this.lastFpsTime = performance.now()
		this.lastTickFinished = performance.now()
	}

	maxDiffT = 0

	dt = 0
	ap = []
	ticks = 0
	lastScore = -1
	beforeDraw() {
		if (this.ticks % 100 === 0) {
			this.maxDiffT = 0
		}

		let newTime = performance.now()
		let diff = (newTime - this.lastTimestamp) / 1000
		this.lastTimestamp = newTime
		if (diff > 0.1) {
			diff = 0.1
		}

		if (this.menuTimeWarpTarget !== this.menuTimeWarp) {
			let warpDiff = (this.menuTimeWarpTarget - this.menuTimeWarp)
			if (Math.abs(warpDiff) < diff) {
				this.menuTimeWarp = this.menuTimeWarpTarget
			} else if (warpDiff > 0) {
				this.menuTimeWarp += diff
			} else {
				this.menuTimeWarp -= diff
			}
		}

		++this.ticks
		this.dt = diff * this.gameTimeWarp * this.menuTimeWarp
		this.elapsedTime += this.dt
		this.tickBefore(this.dt)
		this.aggregateTextures()
	}


	afterDraw() {
		this.lastScore = this.gameState.score.points
		this.tickAfter(this.dt)

		this.ap = Collisions.projectileCollisions(this.asteroids, this.projectiles, this.width)

		let r = this.mainShip.shieldRadius * 1.6
		if (this.mainShip.yPos < 0.64) {
			Collisions.shipCollisions(this.asteroids, this.mainShip, r)
			Collisions.shipCollisions(this.projectiles, this.mainShip, r)
		} else {
			Collisions.shipCollisions(this.ap[0], this.mainShip, r)
			Collisions.shipCollisions(this.ap[1], this.mainShip, r)
		}
		Collisions.shipCollisions(this.sortedObjects, this.mainShip, r)
		Collisions.shipCollisions(this.projectileDebris, this.mainShip, r)

		if (this.asteroidAdder != null) {
			let addBack = Collisions.asteroidCollisions(this.ap[2], 1, this.ticks)
			if (addBack > 2) {
				this.asteroidAdder.resetAddDist()
			} else {
				this.asteroidAdder.addAsteroidsBack(addBack)
			}
		} else {
			Collisions.asteroidCollisions(this.ap[2], 1, this.ticks)
		}

		if (this.ticks % 10 === 0) {
			this.addMessageFromQueue()
		}
		this.checkRemoval()
	}

	addMessageFromQueue() {
		if (this.messageQueue.length != 0 && (this.currentMessage == null || this.currentMessage.markedForRemoval) && !this.mainShip.inWarp && !this.mainShip.isSwitching) {
			let newMessage = this.messageQueue.shift()
			this.scaleTextStrings.push(newMessage)
			this.currentMessage = newMessage
		}
	}

	tickBefore(dt) {
		if (this.mainShip != null) {
			this.mainShip.tick(dt)
		}

		let lists = [
			this.sortedObjects,
			this.objectsBlend,
			this.screenFragments,
			this.projectiles,
			this.exhaust,
			this.missiles,
			this.projectileDebris,
			this.backgrounds,
			this.backgroundImages,
			this.textStrings,
			this.scaleTextStrings,
			this.particles1,
			this.particles0,
			this.shields,
		]

		lists.forEach(list => {
			list.forEach(e => {
				e.tick(dt)
			})
		})

		this.specialEffect.tick(dt)
	}

	tickAfter(dt) {
		if (this.bgAdder != null) {
			this.bgAdder.tick(dt)
		}
		if (this.asteroidAdder != null) {
			this.asteroidAdder.tick(dt)
		}

		let lists = [
			this.sequences,
			this.lights
		]

		lists.forEach(list => {
			list.forEach(e => {
				e.tick(dt)
			})
		})

		this.scoreKeeper.tick(dt)
		this.mainShip.tickAfter(dt)
		this.specialEffect.tickAfter(dt)
	}

	numRemoved = 0
	getNewList(list) {
		let temp = []
		list.forEach(e => {
			if (!e.markedForRemoval) {
				temp.push(e)
			} else {
				++this.numRemoved
			}
		})
		return temp
	}

	checkRemoval() {
		this.numRemoved = 0
		this.screenFragments = this.getNewList(this.screenFragments)
		this.projectiles = this.getNewList(this.projectiles)
		this.exhaust = this.getNewList(this.exhaust)
		this.missiles = this.getNewList(this.missiles)
		this.asteroids = this.getNewList(this.asteroids)
		this.rareAsteroids = this.getNewList(this.rareAsteroids)
		this.sortedObjects = this.getNewList(this.sortedObjects)
		this.objectsBlend = this.getNewList(this.objectsBlend)
		this.projectileDebris = this.getNewList(this.projectileDebris)
		this.backgrounds = this.getNewList(this.backgrounds)
		this.textStrings = this.getNewList(this.textStrings)
		this.scaleTextStrings = this.getNewList(this.scaleTextStrings)
		this.particles1 = this.getNewList(this.particles1)
		this.particles0 = this.getNewList(this.particles0)
		this.textBgs = this.getNewList(this.textBgs)
		this.shields = this.getNewList(this.shields)
		this.sequences = this.getNewList(this.sequences)
		this.lights = this.getNewList(this.lights)
	}

	getTextureDict(lists) {
		let objDict = {}
		let texDict = {}
		lists.forEach(l => {
			l.forEach(e => {
				if (objDict[e.textureId] === undefined) {
					objDict[e.textureId] = []
				}
				objDict[e.textureId].push(e)
			})
		})

		for (let texId in objDict) {
			let objects = objDict[texId]
			this.setTextureIndices(texDict, texId, objects)
		}

		return texDict
	}

	setTextureIndices(dict, key, list, flip = false) {
		let start = Texture.texIndex
		list.forEach(e => {
			e.setRenderData(flip)
		})

		dict[key] = [start, list.length]
	}

	setTextIndices(dict, key, lists) {
		let length = 0
		let start = Texture.texIndex
		lists.forEach(l => {
			l.forEach(string => {
				length += string.letters.length
				string.setRenderData(false)
			})
		})
		dict[key] = [start, length]
	}

	aggregateTextures() {
		Texture.texIndex = 0
		Texture.vIndex = 0
		Texture.dtIndex = 0

		let t = performance.now()
		let sortedObjects = this.sortedObjects.sort((a, b) => a.zPos - b.zPos)

		let diffT = performance.now() - t
		if (diffT > this.maxDiffT) {
			this.maxDiffT = diffT
		}

		let textureIndices = {}

		this.setTextureIndices(textureIndices, 'screenFrags', this.screenFragments, true)
		this.setTextureIndices(textureIndices, 'bgImages', this.backgroundImages)
		this.setTextureIndices(textureIndices, 'bg', this.backgrounds)
		this.setTextureIndices(textureIndices, 'particles0', this.particles0)
		this.setTextureIndices(textureIndices, 'sorted', sortedObjects)
		this.setTextureIndices(textureIndices, 'blend', this.objectsBlend)
		this.setTextureIndices(textureIndices, 'particles1', this.particles1)
		this.setTextureIndices(textureIndices, 'textBgs', this.textBgs)
		this.setTextureIndices(textureIndices, 'exhaust', this.exhaust)
		this.setTextureIndices(textureIndices, 'missiles', this.missiles)
		this.setTextureIndices(textureIndices, 'ships', [this.mainShip, ...this.shields])

		if (this.menuOpen) {
			this.setTextureIndices(textureIndices, 'bars', [])
		} else {
			this.setTextureIndices(textureIndices, 'bars', [this.shieldBar, this.effectBar])
		}
		this.setTextIndices(textureIndices, 'text', [this.textStrings])
		this.setTextIndices(textureIndices, 'msgText', [this.scaleTextStrings])

		let projectileIndices = this.getTextureDict([this.projectiles, this.projectileDebris])

		this.renderData['texIndices'] = [textureIndices, projectileIndices]
		this.renderData['stats'] = [Texture.texIndex, this.numRemoved, this.maxDiffT]
	}
}