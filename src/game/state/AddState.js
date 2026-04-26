import { AddBackground, AddBackgroundModel } from './AddBackground.js'
import { AddProjectile, AddProjectileModel } from './AddProjectile.js'
import { AddExhaust, AddExhaustModel } from './AddExhaust.js'
import { AddAsteroid, AddAsteroidModel } from './AddAsteroid.js'
import MainShip from '../models/MainShip.js'
import Shield from '../models/Shield.js'
import MissileEffect from '../effects/MissileEffect.js'
import ColorFade from '../effects/ColorFade.js'
import TitleText from '../models/text/TitleText.js'
import NoEffect from '../effects/NoEffect.js'
import { ShieldBar } from '../models/Bar.js'
import PrismEffect from '../effects/PrismEffect.js'


export default class AddState {

    game
    stats

    constructor(g, stats) {
        this.game = g
        this.stats = stats
    }

    addGameState() {
        this.game.missiles = []
        this.game.shields = []
        this.game.scaleTextStrings = []
        this.game.messageQueue = []
        this.game.textBgs = []
        this.game.currentMessage = null

        this.loadBackground()
        this.loadAsteroids()
        this.loadMainShip()
        this.loadProjectiles()
        this.loadEffect()
        this.loadMisc()
        this.game.aggregateTextures()

    }

    setAsteroidModel(index) {
        let e = this.game.asteroidAdder
        if (e != null && e.model.index === index && e.model.level === this.game.gameState.level) {
            let props = this.stats.getProps('asteroid', index)
            e.model.num = props[0]
            e.model.points = props[2]
            e.model.hp = props[3]
            e.model.mass = props[4]
            e.dist = 0
            e.scaleModel()
        }
    }

    setShipModel() {
        if (this.game.mainShip.shipNum === this.game.gameState.ship) {
            let props = this.stats.getProps('ship', this.game.gameState.ship)
            let sTarget = this.game.mainShip.sTarget
            this.game.mainShip.sTarget = props[0]
            this.game.mainShip.setAccel(props[1])
            this.game.mainShip.setShieldHp(props[2])

            if (sTarget !== props[0]) {
                this.loadExhaust()
            }

        }
    }

    setExhaustModels() {
        this.game.mainShip.exhaustAdders.forEach(e => {
            e.scaleModel()
        })
    }

    setProjectileModel(pNum) {
        if (this.game.mainShip.shipNum === this.game.gameState.ship) {
            this.game.mainShip.projectileAdders.forEach(e => {
                if (e.model.index === pNum) {
                    let props = this.stats.getProps('projectile', pNum)
                    let model = this.game.gameState.projectiles[this.game.gameState.ship][pNum]
                    e.model.hp = props[0]
                    e.model.interval = props[1]
                    e.model.vx = props[2][0]
                    e.model.vy = props[2][1]
                    e.model.mass = props[3]
                    if (e.model.useAccelModel) {
                        e.model.targets = props[7]
                        e.model.accelerations = props[8]
                        e.model.durations = props[9]
                    }
                    e.model.active = model.active
                    e.scaleModel()
                }
            })
        }
    }

    setEffectModel() {
        if (this.game.mainShip.shipNum === this.game.gameState.ship) {
            let props = this.stats.getProps('charged', this.game.gameState.ship)
            switch (this.game.gameState.ship) {
                case 0:
                    this.game.specialEffect.missileDamage = props[0]
                    this.game.specialEffect.setMissileRadius(props[1])
                    this.game.specialEffect.coolDown = props[2]
                    break
                case 1:
                    this.game.specialEffect.damage = props[0]
                    this.game.specialEffect.wm0 = props[1]
                    this.game.specialEffect.coolDown = props[2]
                    break
                default:
                    break
            }
        }
    }

    loadMisc() {
        if (this.game.gameState.type === "title") {
            let titleText = new TitleText(this.game, 0.16, 0, 0.2, 1, 2)
            this.game.setLightForText(true)
            titleText.align = 'center'
            titleText.addText('Rare\nAsteroids')
            this.game.scaleTextStrings.push(titleText)
        } else if (this.game.gameState.type === "game") {
            this.game.setLightForText(false)
            //level
        }
    }

    loadEffect() {
        this.game.setLightIntensity(0, 0, 1)
        this.game.setLightIntensity(0, 0, 2)
        if (!this.game.gameState.chargedWeapons[this.game.gameState.ship].unlocked) {
            this.game.specialEffect = new NoEffect(this.game)
        } else {
            switch (this.game.gameState.ship) {
                case 0:
                    this.game.specialEffect = new MissileEffect(this.game)
                    break
                case 1:
                    this.game.specialEffect = new PrismEffect(this.game)
                    break
                default:
                    return
            }
            this.setEffectModel()
        }
        this.game.resizeBars()
    }

    loadBackground() {
        this.game.backgrounds = []
        this.game.bgAdder = null
        switch (this.game.gameState.level) {
            case 0:
                switch (this.game.gameState.activeAsteroids[this.game.gameState.level]) {
                    case 0:
                        this.addBackground(0, 0)
                        break
                    case 1:
                        this.addBackground(0, 1)
                        break
                    case 2:
                        this.addBackground(0, 2)
                        break
                    case 3:
                        this.addBackground(0, 3)
                        break
                    default:
                        return
                }
                break
            case 1:
                switch (this.game.gameState.activeAsteroids[this.game.gameState.level]) {
                    case 0:
                        this.addBackground(1, 0)
                        break
                    case 1:
                        this.addBackground(1, 1)
                        break
                    default:
                        return
                }
                break
            default:
                return
        }
    }

    loadAsteroids() {
        this.game.asteroidAdder = null
        this.game.asteroids = []
        this.game.rareAsteroids = []
        this.game.sortedObjects = []
        switch (this.game.gameState.level) {
            case 0:
                switch (this.game.gameState.activeAsteroids[this.game.gameState.level]) {
                    case 0:
                        this.addAsteroids00()
                        break
                    case 1:
                        this.addAsteroids01()
                        break
                    case 2:
                        this.addAsteroids02()
                        break
                    case 3:
                        this.addAsteroids03()
                        break
                    default:
                        return
                }
                break
            case 1:
                switch (this.game.gameState.activeAsteroids[this.game.gameState.level]) {
                    case 0:
                        this.addAsteroids10()
                        break
                    case 1:
                        this.addAsteroids11()
                        break
                    default:
                        return
                }
                break
            default:
                return
        }
    }

    loadMainShip() {
        if (this.game.mainShip != null) {
            this.game.mainShip.shieldTex.markedForRemoval = true
        }

        switch (this.game.gameState.ship) {
            case 0:
                this.addMainShips0()
                break
            case 1:
                this.addMainShips1()
                break
            default:
                return
        }

        this.game.resizeBars()
    }

    loadExhaust() {
        let ship = this.game.mainShip
        ship.exhaustAdders = []
        switch (this.game.gameState.ship) {
            case 0:
                this.addExhaust00()
                this.setExhaustModels()
                break
            case 1:
                this.addExhaust01()
                this.setExhaustModels()
                break
            default:
                return
        }
    }

    loadProjectiles() {
        let ship = this.game.mainShip
        let models = this.game.gameState.projectiles[this.game.gameState.ship]
        ship.projectileAdders = []
        switch (this.game.gameState.ship) {
            case 0:
                if (models[0].unlocked) {
                    this.addProjectile00()
                }
                if (models[1].unlocked) {
                    this.addProjectile01()
                }
                if (models[2].unlocked) {
                    this.addProjectile02()
                }
                break
            case 1:
                if (models[0].unlocked) {
                    this.addProjectile10()
                }
                if (models[1].unlocked) {
                    this.addProjectile11()
                }
                break
            default:
                return
        }
    }

    loadNewProjectile(pNum) {
        switch (this.game.gameState.ship) {
            case 0:
                switch (pNum) {
                    case 0:
                        this.addProjectile00()
                        break
                    case 1:
                        this.addProjectile01()
                        break
                    case 2:
                        this.addProjectile02()
                        break
                    default:
                        return
                }
                break
            case 1:
                switch (pNum) {
                    case 0:
                        this.addProjectile10()
                        break
                    case 1:
                        this.addProjectile11()
                        break
                    default:
                        return
                }
                break
            default:
                return
        }
    }

    addAsteroid(model) {
        this.game.asteroidAdder = new AddAsteroid(this.game, model)
    }

    addMainShip(ship) {
        let props = this.stats.getProps('ship', this.game.gameState.ship)
        ship.speed = props[0]
        ship.resize()
        this.game.mainShip = ship
    }

    addExhaust(model, texture) {
        texture.exhaustAdders.push(new AddExhaust(this.game, texture, model))
    }

    addWarpExhaust(model, texture) {
        texture.warpExhaustAdders.push(new AddExhaust(this.game, texture, model))
    }

    addProjectile(model, texture) {
        texture.projectileAdders.push(new AddProjectile(this.game, texture, model))
    }

    getBgColors(level, active) {
        switch (level) {
            case 0:
                switch (active) {
                    case 0:
                        return [[0.26, 0.6, 0.96, 0.16], new ColorFade([0.8, 0.94, 1.0, 1.9], [0.5, 0.97, 0.99, 1.9])]
                    case 1:
                        return [[1.36, 0.6, 0.96, 0.16], new ColorFade([0.99, 0.9, 0.8, 1.9], [0.94, .86, 0.8, 1.9])]
                    case 2:
                        return [[0.36, 1.38, 0.96, 0.16], new ColorFade([0.5, 1.14, 1.0, 1.9], [0.7, 0.94, 1.0, 1.9])]
                    case 3:
                        return [[0.08, 0.79, 1.36, 0.16], new ColorFade([0.5, 0.8, 1, 1.9], [0.8, 0.92, 1, 1.9])]
                    default:
                        return
                }
            case 1:
                switch (active) {
                    case 0:
                        return [[0.26, 0.6, 0.96, 0.16], new ColorFade([0.9, 0.94, 1.0, 1.9], [0.9, 0.94, 1.0, 1.9])]
                    case 1:
                        return [[0.26, 0.6, 0.96, 0.16], new ColorFade([0.9, 0.94, 1.0, 1.9], [0.9, 0.94, 1.0, 1.9])]
                    default:
                        return
                }
            default:
                return
        }
    }

    addBackground(level, active) {
        let model = new AddBackgroundModel()
        model.zMin = 6
        model.zMax = 24
        model.zBg = 32
        model.size = 0.1
        model.num = 360
        model.bgTexId0 = 'bg0a'
        model.bgTexId1 = 'bg0b'
        model.bgAspect = 1
        model.texId = 'bg'
        let [bg, star] = this.getBgColors(level, active)
        model.bgColorMask = bg
        model.starColorFade = star
        this.game.bgAdder = new AddBackground(this.game, model)
    }

    addAsteroids00() {
        let model = new AddAsteroidModel()
        model.width = 0.1
        model.varRatio = 0.5
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 1.0
        model.index = 0
        model.level = 0
        model.numLayers = 1
        model.colorFade = new ColorFade([0.8, 0.8, 0.8, 1], [0.8, 1.2, 1.1, 1])
        model.rareColorFade = new ColorFade([0.6, 0.99, 0.99, 1], [0.7, 0.87, 0.99, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.particleFade1 = new ColorFade([0.84, 0.8, 1, 1], [0.5, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([0.5, 0.9, 1, 1], [0.5, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([0.8, 0.9, 1, 0], [0.8, 0.9, 0.98, 1])
        model.scoreFadeOut = new ColorFade([0.8, 0.9, 0.98, 1], [0.2, 0.6, 1, 0])
        this.game.setActiveTexture(0, 'a00')
        this.game.setActiveTexture(1, 'a01')
        this.game.setActiveTexture(2, 'ai00')
        this.game.setActiveTexture(3, 'ae00')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addAsteroids01() {
        let model = new AddAsteroidModel()
        model.width = 0.11
        model.varRatio = 0.62
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 3.0
        model.index = 1
        model.level = 0
        model.numLayers = 1
        model.colorFade = new ColorFade([1, 1, 1, 1], [1, 1.2, 1, 1])
        model.rareColorFade = new ColorFade([1, 0.6, 0.5, 1], [1, 0.9, 0.8, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([0.7, 0.2, 0.1, 0.6], [1.8, 1.2, 1, 1])
        model.particleFade1 = new ColorFade([0.84, 0.2, 0, 1], [1, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([1, 0.9, 1, 1], [0.5, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([1, 1, 1, 0], [1.5, 1, 0.8, 1])
        model.scoreFadeOut = new ColorFade([1.5, 1, 0.8, 1], [1, 0, 0, 0])
        this.game.setActiveTexture(0, 'a10')
        this.game.setActiveTexture(1, 'a11')
        this.game.setActiveTexture(2, 'ai01')
        this.game.setActiveTexture(3, 'ae01')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addAsteroids02() {
        let model = new AddAsteroidModel()
        model.width = 0.1
        model.varRatio = 0.5
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 1.0
        model.index = 2
        model.level = 0
        model.numLayers = 1
        model.colorFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.rareColorFade = new ColorFade([0.6, 0.7, 0.8, 0.7], [0.6, 0.7, 0.8, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([0.7, 1, 0.8, 1], [0.8, 1.2, 1.1, 1])
        model.particleFade1 = new ColorFade([0.7, 0.6, 1, 1], [0.9, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([0.9, 0.9, 1, 1], [0.7, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([0.8, 0.5, 1, 0], [0.58, 0.96, 0.99, 1])
        model.scoreFadeOut = new ColorFade([0.58, 0.96, 0.99, 1], [0.8, 0.7, 1, 0])
        this.game.setActiveTexture(0, 'a20')
        this.game.setActiveTexture(1, 'a21')
        this.game.setActiveTexture(2, 'ai02')
        this.game.setActiveTexture(3, 'ae02')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addAsteroids03() {
        let model = new AddAsteroidModel()
        model.width = 0.11
        model.varRatio = 0.62
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 1.0
        model.index = 3
        model.level = 0
        model.numLayers = 1
        model.colorFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.rareColorFade = new ColorFade([0.8, 0.3, 0.7, 1], [0.6, 0.5, 0.8, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([0.7, 0.2, 1, 1], [0.4, 0.1, 1.1, 1])
        model.particleFade1 = new ColorFade([0.84, 0.8, 1, 1], [0.5, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([0.5, 0.9, 1, 1], [0.5, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([1, 1, 1, 0], [0.5, 0.8, 1, 1])
        model.scoreFadeOut = new ColorFade([0.5, 0.8, 1, 1], [1, 1, 1, 0])
        this.game.setActiveTexture(0, 'a30')
        this.game.setActiveTexture(1, 'a31')
        this.game.setActiveTexture(2, 'ai03')
        this.game.setActiveTexture(3, 'ae03')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addAsteroids10() {
        let model = new AddAsteroidModel()
        model.width = 0.04
        model.varRatio = 0.5
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 1.0
        model.index = 0
        model.level = 1
        model.numLayers = 3
        model.colorFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.particleFade1 = new ColorFade([0.84, 0.8, 1, 1], [0.5, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([0.5, 0.9, 1, 1], [0.5, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([1, 1, 1, 0], [0.5, 1, 0.8, 1])
        model.scoreFadeOut = new ColorFade([0.5, 1, 0.8, 1], [1, 1, 1, 0])
        this.game.setActiveTexture(0, 'a10')
        this.game.setActiveTexture(2, 'ai10')
        this.game.setActiveTexture(3, 'ae10')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addAsteroids11() {
        let model = new AddAsteroidModel()
        model.width = 0.04
        model.varRatio = 0.5
        model.vxVar = 0.07
        model.vy = -0.0
        model.vyVar = 0.2
        model.vrMin = 0.5
        model.vrVar = 1.0
        model.index = 1
        model.level = 1
        model.numLayers = 3
        model.colorFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.debrisFade = new ColorFade([1.6, 1.6, 1.7, 1], [1.2, 1.7, 1.4, 1])
        model.explosionFade = new ColorFade([1, 1, 1, 1], [0.8, 1.2, 1.1, 1])
        model.particleFade1 = new ColorFade([0.84, 0.8, 1, 1], [0.5, 0.9, 1, 1])
        model.particleFade2 = new ColorFade([0.5, 0.9, 1, 1], [0.5, 0.7, 1, 1])
        model.scoreFadeIn = new ColorFade([1, 1, 1, 0], [0.5, 1, 0.8, 1])
        model.scoreFadeOut = new ColorFade([0.5, 1, 0.8, 1], [1, 1, 1, 0])
        this.game.setActiveTexture(0, 'a11')
        this.game.setActiveTexture(2, 'ai11')
        this.game.setActiveTexture(3, 'ae11')
        this.addAsteroid(model)
        this.setAsteroidModel(model.index)
    }

    addMainShips0() {
        let m = new MainShip(0.12, 0.12, 0.5 * this.game.width, 0.8, 1, 's0', this.game)
        m.shipNum = 0
        m.shieldMask = [1.6, 0.8, 0.7, 1]
        m.borderColorFade = new ColorFade([0.8, 0.3, 0.1, 0.5], [0.1, 0.5, 0.8, 0.4])
        m.initShieldColor()

        let s = new Shield(m.shieldDiameter, m.shieldDiameter, m.xPos, m.yPos, m.zPos, 'sh', this.game)
        s.shieldColorFade = new ColorFade([0.8, 0.3, 0.1, 1], [0.1, 0.5, 0.8, 0])
        s.auraColorFade = new ColorFade([0.8, 0.3, 0.1, 1], [0.1, 0.5, 0.8, 0])
        s.initShieldColor()
        this.game.shields.push(s)

        let shieldFillFade = new ColorFade([0.75, 0.75, 0.75, 1], [1, 1, 1, 0.3])
        this.game.shieldBar = new ShieldBar(this.game, shieldFillFade)

        m.shieldTex = s
        this.addMainShip(m)
        this.setShipModel()
    }

    addMainShips1() {
        let m = new MainShip(0.12, 0.12, 0.5 * this.game.width, 0.8, 1, 's1', this.game)
        m.shipNum = 1
        m.shieldMask = [1.4, 1, 1, 1.4]
        m.borderColorFade = new ColorFade([0.98, 0.38, 0.99, 0.5], [0.28, 0.38, 0.99, 0.4])
        m.initShieldColor()

        let s = new Shield(m.shieldDiameter, m.shieldDiameter, m.xPos, m.yPos, m.zPos, 'sh', this.game)
        s.shieldColorFade = new ColorFade([0.58, 0.68, 0.99, 1], [0.58, 0.68, 0.99, 0])
        s.auraColorFade = new ColorFade([0.58, 0.68, 0.99, 0.7], [0.58, 0.68, 0.99, 0])
        s.initShieldColor()
        this.game.shields.push(s)

        let shieldFillFade = new ColorFade([0.75, 0.75, 0.75, 1], [1, 1, 1, 0.3])
        this.game.shieldBar = new ShieldBar(this.game, shieldFillFade)

        m.shieldTex = s
        this.addMainShip(m)
        this.setShipModel()
    }

    addExhaust00() {
        let model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = -0.12
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.16
        model.height = 0.42
        model.texId = 'exhaust'
        model.lifespan = 0.24
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        this.addExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.12
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.16
        model.height = 0.42
        model.texId = 'exhaust'
        model.lifespan = 0.24
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        this.addExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.0
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 5.2
        model.width = 0.32
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.07
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.2
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = -0.07
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.2
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)
    }

    addExhaust01() {
        let model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = -0.096
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.16
        model.height = 0.42
        model.texId = 'exhaust'
        model.lifespan = 0.24
        model.colorFade = new ColorFade([1.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.912, 0.3])
        this.addExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.096
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.16
        model.height = 0.42
        model.texId = 'exhaust'
        model.lifespan = 0.24
        model.colorFade = new ColorFade([1.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.912, 0.3])
        this.addExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.0
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 5.2
        model.width = 0.32
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([1.2, 0.9, 2.4, 0.2], [0.34, 0.14, 1.12, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = 0.07
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.2
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([1.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.912, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)

        model = new AddExhaustModel()
        model.interval = 0.01
        model.xOff = -0.07
        model.yOff = 0.16
        model.vx = 0.0
        model.vy = 2.9
        model.width = 0.2
        model.height = 0.64
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([1.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.912, 0.3])
        this.addWarpExhaust(model, this.game.mainShip)
    }

    addProjectile00() {
        let model = new AddProjectileModel()
        model.xOff = 0.05
        model.yOff = 0.2
        model.useAccelModel = true
        model.width = 0.2
        model.height = 0.2
        model.texId = 'p00'
        model.index = 0
        model.colorMask = [0.972, 0.472, 0.231, 1]
        model.debrisMask = [0.996, 0.498, 0.317, 1]
        model.impactMask = [0.996, 0.498, 0.317, 1]
        model.ricochetMask0 = [0.925, 0.835, 0.722, 1]
        model.ricochetMask1 = [0.925, 0.631, 0.36, 1]
        this.addProjectile(model, this.game.mainShip)

        model = new AddProjectileModel()
        model.xOff = -0.05
        model.yOff = 0.2
        model.useAccelModel = true
        model.vxDir = -1
        model.width = 0.2
        model.height = 0.2
        model.texId = 'p00'
        model.index = 0
        model.colorMask = [0.972, 0.472, 0.231, 1]
        model.debrisMask = [0.996, 0.498, 0.317, 1]
        model.impactMask = [0.996, 0.498, 0.317, 1]
        model.ricochetMask0 = [0.925, 0.835, 0.722, 1]
        model.ricochetMask1 = [0.925, 0.631, 0.36, 1]
        this.addProjectile(model, this.game.mainShip)
        this.setProjectileModel(0)
    }

    addProjectile01() {
        let model = new AddProjectileModel()
        model.xOff = 0.0
        model.yOff = -0.18
        model.useAccelModel = true
        model.width = 0.12
        model.height = 0.18
        model.texId = 'p01'
        model.index = 1
        model.colorMask = [0.925, 0.631, 0.36, 1]
        model.debrisMask = [0.925, 0.835, 0.722, 1]
        model.impactMask = [0.925, 0.835, 0.722, 1]
        model.ricochetMask0 = [1, 1, 1, 1]
        model.ricochetMask1 = [0.965, 0.731, 0.56, 1]
        this.addProjectile(model, this.game.mainShip)

        model = new AddProjectileModel()
        model.xOff = -0.0
        model.yOff = -0.18
        model.useAccelModel = true
        model.vxDir = -1
        model.width = 0.12
        model.height = 0.18
        model.texId = 'p01'
        model.index = 1
        model.colorMask = [0.925, 0.631, 0.36, 1]
        model.debrisMask = [0.925, 0.835, 0.722, 1]
        model.impactMask = [0.925, 0.835, 0.722, 1]
        model.ricochetMask0 = [1, 1, 1, 1]
        model.ricochetMask1 = [0.965, 0.731, 0.56, 1]
        this.addProjectile(model, this.game.mainShip)
        this.setProjectileModel(1)
    }

    addProjectile02() {
        let model = new AddProjectileModel()
        model.xOff = 0.1
        model.yOff = 0.02
        model.useAccelModel = true
        model.width = 0.12
        model.height = 0.18
        model.texId = 'p02'
        model.index = 2
        model.colorMask = [0.9, 0.71, 0.46, 1]
        model.debrisMask = [0.935, 0.885, 0.822, 1]
        model.impactMask = [0.935, 0.885, 0.822, 1]
        model.ricochetMask0 = [1, 1, 1, 1]
        model.ricochetMask1 = [0.965, 0.78, 0.66, 1]
        this.addProjectile(model, this.game.mainShip)

        model = new AddProjectileModel()
        model.xOff = -0.1
        model.yOff = 0.02
        model.useAccelModel = true
        model.vxDir = -1
        model.width = 0.12
        model.height = 0.18
        model.texId = 'p02'
        model.index = 2
        model.colorMask = [0.9, 0.71, 0.46, 1]
        model.debrisMask = [0.935, 0.885, 0.822, 1]
        model.impactMask = [0.935, 0.885, 0.822, 1]
        model.ricochetMask0 = [1, 1, 1, 1]
        model.ricochetMask1 = [0.965, 0.78, 0.66, 1]
        this.addProjectile(model, this.game.mainShip)
        this.setProjectileModel(2)
    }

    addProjectile10() {
        let model = new AddProjectileModel()
        model.xOff = 0.14
        model.yOff = 0.16
        model.useAccelModel = true
        model.useMulticolor = true
        model.colorFade = new ColorFade([0.99, 0.99, 0.99, 1], [0.499, 0.4, 0.99, 1])
        model.adderTM = 0.3
        model.projectileTM = 16
        model.width = 0.24
        model.height = 0.24
        model.texId = 'p10'
        model.index = 0
        model.colorMask = [0.99, 0.99, 0.99, 1]
        model.debrisMask = [0.99, 0.99, 0.99, 1]
        model.impactMask = [1.1, 1.6, 1.6, 1.0]
        model.ricochetMask0 = [1.1, 1.6, 1.6, 1.0]
        model.ricochetMask1 = [0.499, 0.4, 0.99, 1]
        this.addProjectile(model, this.game.mainShip)

        model = new AddProjectileModel()
        model.xOff = -0.14
        model.yOff = 0.16
        model.useAccelModel = true
        model.useMulticolor = true
        model.colorFade = new ColorFade([0.99, 0.99, 0.99, 1], [0.499, 0.4, 0.99, 1])
        model.adderTM = 0.3
        model.projectileTM = 16
        model.adderT0 = 0.5
        model.vxDir = -1
        model.width = 0.24
        model.height = 0.24
        model.texId = 'p10'
        model.index = 0
        model.colorMask = [0.99, 0.99, 0.99, 1]
        model.debrisMask = [0.99, 0.99, 0.99, 1]
        model.impactMask = [1.1, 1.6, 1.6, 1.0]
        model.ricochetMask0 = [1.4, 1.6, 1.6, 1.0]
        model.ricochetMask1 = [0.499, 0.4, 0.99, 1]
        this.addProjectile(model, this.game.mainShip)
        this.setProjectileModel(0)
    }

    addProjectile11() {
        let model = new AddProjectileModel()
        model.xOff = 0.16
        model.yOff = 0.1
        model.useAccelModel = true
        model.useMulticolor = true
        model.colorFade = new ColorFade([0.99, 0.99, 0.99, 1], [0.499, 0.4, 0.99, 1])
        model.adderTM = 0.3
        model.adderT0 = 0.2
        model.projectileTM = 16
        model.width = 0.24
        model.height = 0.24
        model.texId = 'p11'
        model.index = 1
        model.debrisMask = [1, 1, 1, 1]
        model.impactMask = [1.1, 1, 1.6, 1.0]
        model.ricochetMask0 = [0.499, 0.4, 0.99, 1]
        model.ricochetMask1 = [1.1, 1, 1.1, 1.0]
        this.addProjectile(model, this.game.mainShip)

        model = new AddProjectileModel()
        model.xOff = -0.16
        model.yOff = 0.1
        model.useAccelModel = true
        model.useMulticolor = true
        model.colorFade = new ColorFade([0.99, 0.99, 0.99, 1], [0.499, 0.4, 0.99, 1])
        model.adderTM = 0.3
        model.adderT0 = 0.7
        model.projectileTM = 16
        model.vxDir = -1
        model.width = 0.24
        model.height = 0.24
        model.texId = 'p11'
        model.index = 1
        model.debrisMask = [1, 1, 1, 1]
        model.impactMask = [1.1, 1, 1.6, 1.0]
        model.ricochetMask0 = [0.499, 0.4, 0.99, 1]
        model.ricochetMask1 = [1.1, 1, 1.1, 1.0]
        this.addProjectile(model, this.game.mainShip)
        this.setProjectileModel(1)
    }

}