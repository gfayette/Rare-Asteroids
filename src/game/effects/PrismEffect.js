import ColorFade from "./ColorFade"
import { EffectBar } from "../models/Bar"
import Collisions from "../Collisions"

export default class PrismEffect {

    game

    step = -1

    coolDown = 1
    coolDownTimer = 0

    xTarget
    yTarget
    xTargetPx
    yTargetPx

    width0 = 0.1
    wm0 = 1

    startComplete = 0
    startDuration = 1.4

    blastComplete = 0
    blastDuration = 1

    xShipPx
    yShipPx

    damage = 1000
    angle = 0


    lightNum = 1
    lightFadeTime = 0.5
    prismLight = new ColorFade([0, 0.16, 1, 0], [0, 0.08, 0.5, 0])

    constructor(g) {
        this.game = g
        let effectFillFade = new ColorFade([0.75, 0.75, 0.75, 1], [1, 1, 1, 0.3])
        this.game.effectBar = new EffectBar(this.game, effectFillFade)
        this.reset()
    }

    reset() {
        this.xShipPx = this.game.mainShip.xPos * this.game.pxRatio
        this.yShipPx = (1 - this.game.mainShip.yPos) * this.game.pxRatio
        this.xTargetPx = this.xTarget * this.game.pxRatio
        this.yTargetPx = (1 - this.yTarget) * this.game.pxRatio
        this.step = -1
        this.width0 = this.game.mainShip.height * this.wm0

        this.game.setLightIntensity(0, 0, this.lightNum)
    }

    click(x, y) {
        if (this.coolDownTimer === -1) {
            this.elapsedTime = 0
            this.coolDownTimer = 0
            this.step = 0
            this.xTarget = x
            this.yTarget = y
            this.xTargetPx = x * this.game.pxRatio
            this.yTargetPx = (1 - y) * this.game.pxRatio
            this.startComplete = 0

            this.game.setLightColor(this.prismLight.getColor(0), this.lightNum)
            this.game.setLightIntensity(0, 0, this.lightNum)
            this.game.setLightRadius(0.7, this.lightNum)


            let a = this.game.aspect > 1 ? this.game.aspect : 1
            this.startDuration = 0.5 * a
        }
    }

    x21
    y21
    den
    tick(dt) {
        if (this.coolDownTimer !== -1) {
            this.coolDownTimer += dt
            let c = this.coolDownTimer / this.coolDown
            if (c > 1) {
                c = 1
                this.coolDownTimer = -1
            }
            this.game.effectBar.setPercent(c)
        }

        if (this.step === -1) {
            return
        }

        this.elapsedTime += dt

        if (this.step === 0) {
            this.xShipPx = this.game.mainShip.xPos * this.game.pxRatio
            this.yShipPx = (1 - this.game.mainShip.yPos) * this.game.pxRatio
            this.startComplete = this.elapsedTime / this.startDuration //

            this.game.setLightIntensity(2.6 * this.startComplete, 0 * this.startComplete, this.lightNum)
            this.game.moveLight(this.game.mainShip.xPos, this.game.mainShip.yPos, this.lightNum)
            //this.game.setLightColor(this.prismLight.getColor(this.startComplete), this.lightNum)

            if (this.elapsedTime - this.startDuration > 0.125) {
                this.game.setLightIntensity(0, 0, this.lightNum)
                this.game.setLightRadius(0, this.lightNum)
                this.startComplete = 1.1
                this.step = 1
            }
        } else if (this.step === 1) {
            let x1 = this.game.mainShip.xPos
            let y1 = this.game.mainShip.yPos
            let x2 = this.xTarget
            let y2 = this.yTarget

            this.x21 = x2 - x1
            this.y21 = y2 - y1
            this.den = Math.sqrt(this.x21 * this.x21 + this.y21 * this.y21)
            this.angle = Math.atan2(this.x21, this.y21)

            Collisions.handlePrismCollision(this.game.asteroids, this, this.game.vScale)
            Collisions.handlePrismCollision(this.game.sortedObjects, this, this.game.vScale)
            Collisions.handlePrismCollision(this.game.textStrings, this, this.game.vScale)
            //Collisions.handlePrismCollision(this.game.projectiles, this, this.game.vScale)
            Collisions.handlePrismCollision(this.game.projectileDebris, this, this.game.vScale)

            this.elapsedTime = 0
            this.step = 2
        } else if (this.step === 2) {
            this.blastComplete = this.elapsedTime / this.blastDuration
            if (this.blastComplete > 1) {
                this.step = -1
            }
        }
    }

    tickAfter(dt) {

    }

    getEffectArgs() {
        if (this.step === 0) {
            let r = this.game.aspect > 1 ? this.game.aspect : 1
            let width = this.game.pxRatio * (1 - this.startComplete * 0.7) * this.game.vScale

            let rPx = 1.41 * this.game.pxRatio * (r ** 1.23) * (1 - this.startComplete) + width //////
            
            let warpMag = 0.02 / r
            let lightIntensity = 0.24

            return [[this.xShipPx, this.yShipPx, rPx, width], [warpMag, lightIntensity, 0, 0], [], [2, 0, 0, 0]]
        } else if (this.step === 2) {
            let m = Math.cos(this.blastComplete * Math.PI)
            let width = this.game.pxRatio * this.width0 * m * this.game.vScale

            return [[this.xShipPx, this.yShipPx, this.xTargetPx, this.yTargetPx], [m, width, 0, 0], [], [3, 0, 0, 0]]
        } else {
            return [[], [], [], [-1, 0, 0, 0]]
        }

    }
}