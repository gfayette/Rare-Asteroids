import { EffectBar } from "../models/Bar"
import ColorFade from "./ColorFade"


export default class Warp {

    elapsedTime = 0
    elapsedTime2 = 0
    max
    bgColor
    StarColorFade
    game

    stage = 1
    duration1 = 1.2
    duration2

    startComplete = 0

    mag0 = 0.007
    mag

    xPx
    yPx

    markedForRemoval = false

    constructor(d, m, bg, starFade, g) {
        this.duration2 = d
        this.mag = this.mag0
        this.max = m
        this.bgColor = bg
        this.starColorFade = starFade
        this.game = g
        let effectFillFade = new ColorFade([0, 0, 0, 0], [0, 0, 0, 0])
        this.game.effectBar = new EffectBar(this.game, effectFillFade)
        this.reset()
        this.start()
    }

    start() {
        this.game.stopMoveShip()
        this.game.asteroidAdder = null
        this.game.mainShip.projectileAdders = []
        this.game.mainShip.inWarp = true
        this.game.controlsLocked = true
    }

    stop() {
        this.game.messageQueue = []
        this.game.mainShip.inWarp = false
        this.game.mainShip.setWarp(1)
        this.game.stateManager.loadAsteroids()
        this.game.stateManager.loadEffect()
        this.game.stateManager.loadProjectiles()
        this.game.stateManager.addLevelText()
        this.game.controlsLocked = false
    }

    reset() {
        this.xPx = this.game.mainShip.xPos * this.game.pxRatio
        this.yPx = (1 - this.game.mainShip.yPos) * this.game.pxRatio
    }

    click(x, y) {

    }

    tick(dt) {
        if (this.elapsedTime === -1) {
            return
        }

        this.elapsedTime += dt
        let complete
        let r
        switch (this.stage) {
            case (1):

                complete = this.elapsedTime / this.duration1
                r = this.game.aspect > 1 ? this.game.aspect : 1
                this.startComplete = complete

                this.game.asteroids.forEach(a => {
                    let xDist = a.xPos - this.game.mainShip.xPos
                    let yDist = a.yPos - this.game.mainShip.yPos
                    let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                    if (hy < complete) {
                        let angle = Math.atan2(xDist, yDist)
                        a.explodeWarp(angle)
                    }
                })

                this.game.projectiles.forEach(p => {
                    let xDist = p.xPos - this.game.mainShip.xPos
                    let yDist = p.yPos - this.game.mainShip.yPos
                    let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                    if (hy < complete) {
                        let angle = Math.atan2(xDist, yDist)
                        p.explodeWarp(angle)
                    }
                })

                if (complete > 1.4 * r) {
                    this.game.asteroids.forEach(a => {
                        a.explodeWarp(null)
                    })
                    this.game.projectiles.forEach(p => {
                        p.explodeWarp(null)
                    })
                    this.stage = 2
                    this.game.messageQueue = []
                    this.game.bgAdder.startFade(this.bgColor, this.starColorFade, this.duration2)
                }
                break
            case (2):
                this.elapsedTime2 += dt
                complete = this.elapsedTime2 / this.duration2

                if (this.mag !== 0) {
                    this.mag = this.mag0 * (1 - complete * 10)
                    if (this.mag < 0) {
                        this.mag = 0
                    }
                }

                let w = this.max * (Math.cos(complete * 2 * Math.PI + Math.PI) + 1) / 2 + 1
                this.game.mainShip.setWarp(w)
                if (complete > 1) {
                    this.stop()
                }
                break
            default:
                break
        }
    }

    tickAfter(dt) {

    }

    getEffectArgs() {
        let cPx = this.startComplete * this.game.pxRatio
        let width = 0.7 * this.game.pxRatio
        let args = [[this.xPx, this.yPx, cPx, width], [this.mag, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0]]
        return args
    }

}