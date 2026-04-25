import Asteroid from '../models/Asteroid.js'
import RareAsteroid from '../models/RareAsteroid.js'

class AddAsteroidModel {
    textureMap

    colorFade
    debrisFade
    explosionFade
    rareColorFade

    particleFade1
    particleFade2

    scoreFadeIn
    scoreFadeOut

    index

    num
    width
    varRatio
    vxVar
    vy
    vyVar
    vrMin
    vrVar
    texId
    level

    numLayers = 1
}

export default class AddAsteroid {

    name
    game
    dist = 0
    rDist = 0
    aDist = 1
    raDist = 100
    numLayers
    nlm1

    model
    scaledModel

    constructor(g, aModel) {
        this.name = "asteroid"
        this.game = g
        this.model = aModel
        this.numLayers = this.model.numLayers
        this.nlm1 = this.numLayers === 1 ? 1 : this.numLayers - 1
        this.scaleModel()
    }

    scaleModel() {
        let sModel = JSON.parse(JSON.stringify(this.model))
        let m = this.game.vScale

        sModel.num /= (m * m)
        sModel.width *= m
        sModel.vxVar *= m
        sModel.vy *= m
        sModel.vyVar *= m

        this.scaledModel = sModel
        this.setDist()
    }

    resize() {
        this.scaleModel()
    }

    add(y) {
        let sVar = (1 - Math.random() * this.model.varRatio)
        let w = this.scaledModel.width * sVar
        let h = w
        let x = Math.random() * this.game.width
        let r = Math.random()
        let a = new Asteroid(w, h, x, y, -1 + r * 0.1, null, this.game)
        a.activeTex = r < 0.5 ? 2.5 : 3.5
        a.layer = Math.floor(r * this.numLayers)
        a.addedOnTick = this.game.ticks
        let c = a.layer / this.nlm1
        a.colorMask = this.model.colorFade.getColor(c)
        a.debrisMask = this.model.debrisFade.getColor(c)
        a.explosionMask = this.model.explosionFade.getColor(c)
        a.particleFade1 = this.model.particleFade1
        a.particleFade2 = this.model.particleFade2
        a.scoreFadeIn = this.model.scoreFadeIn
        a.scoreFadeOut = this.model.scoreFadeOut
        a.points = this.model.points * sVar * this.game.gameState.pace
        a.hp = this.model.hp * sVar
        a.mass = this.model.mass * sVar
        a.vx = this.scaledModel.vxVar * (Math.random() - 0.5)
        a.vy = this.scaledModel.vy + this.scaledModel.vyVar * (Math.random() - 0.5)
        a.vr = Math.random() > 0.5 ? this.model.vrMin + Math.random() * this.model.vrVar : -this.model.vrMin - Math.random() * this.model.vrVar
        this.game.asteroids.push(a)
        this.game.sortedObjects.push(a)
        this.game.scoreKeeper.addAsteroidHp(a.hp)
    }


    addRare(y, light) {
        let w = this.scaledModel.width * 1.2
        let h = w
        let x = this.game.width * (Math.random() * 0.5 + 0.25)
        let r = Math.random()
        let a = new RareAsteroid(w, h, x, y, -1 + r * 0.1, null, this.game)
        a.setLight(light, 0.2, 6, 0, this.model.rareColorFade)
        a.setAura()
        a.activeTex = r < 0.5 ? 2.5 : 3.5
        a.layer = Math.floor(r * this.numLayers)
        a.addedOnTick = this.game.ticks
        let c = a.layer / this.nlm1
        a.debrisMask = this.model.debrisFade.getColor(c)
        a.explosionMask = this.model.explosionFade.getColor(c)
        a.particleFade1 = this.model.particleFade1
        a.particleFade2 = this.model.particleFade2
        a.scoreFadeIn = this.model.scoreFadeIn
        a.scoreFadeOut = this.model.scoreFadeOut
        a.points = this.model.points * 20 * this.game.gameState.pace
        a.hp = this.model.hp * (1.67 + this.model.num / 15)
        a.mass = this.model.mass * 5
        a.vx = this.scaledModel.vxVar * (Math.random() - 0.5)
        a.vy = this.scaledModel.vy + this.scaledModel.vyVar * (Math.random() - 0.5)
        a.vr = Math.random() > 0.5 ? this.model.vrMin + Math.random() * this.model.vrVar : -this.model.vrMin - Math.random() * this.model.vrVar
        this.game.asteroids.push(a)
        this.game.sortedObjects.push(a)
        this.game.scoreKeeper.addAsteroidHp(a.hp)
        this.game.rareAsteroids.push(a)
    }


    tick(dt) {
        let d = dt * (this.game.vScroll + this.scaledModel.vy)
        this.dist += d
        this.rDist += d
        if (this.dist > this.aDist * 10) {
            this.resetAddDist()
        }

        while (this.dist > this.aDist) {
            this.dist -= this.aDist
            this.add(-0.4)
        }

        if (this.rDist > this.raDist) {
            this.rDist = 0

            let rareLight = this.checkRareAvailable()
            if (rareLight > 0) {
                this.addRare(-0.5, rareLight)
            }
        }

    }

    checkRareAvailable() {
        if (this.game.rareAsteroids.length === 2) {
            return -1
        } else if (this.game.rareAsteroids.length === 1 && this.game.lights.length === 1) {
            return this.game.rareAsteroids[0].lightNum === 3 ? 4 : 3
        } else if (this.game.lights.length === 0) {
            return 3
        }
    }

    addAsteroidsBack(num) {
        this.dist += this.aDist * num
    }

    resetAddDist() {
        this.dist = 0
        this.rDist = 0
    }

    setDist() {
        this.aDist = 1.15 / (this.scaledModel.num * this.game.aspect)
        this.raDist = this.aDist * 50
    }

    reset(set) {
        this.game.asteroids = []
        this.game.rareAsteroids = []
        this.game.sortedObjects = []
        this.dist = 0
        this.setDist()
        if (!set) {
            return
        }

        while (this.game.asteroids.length < Math.ceil(this.scaledModel.num * this.game.aspect)) {
            let y = (Math.random() * 1.15 - 0.05)
            this.add(y)
        }
    }
}

export { AddAsteroidModel, AddAsteroid }