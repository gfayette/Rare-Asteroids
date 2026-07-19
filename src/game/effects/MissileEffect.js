
import Missile from "../models/Missile"
import ColorFade from "./ColorFade"
import { EffectBar } from "../models/Bar"
import Collisions from "../Collisions"
import Explosion from "../models/Explosion"

export default class MissileEffect {

    game
    missile
    missileExplosion

    step = -1

    coolDown = 1.4
    coolDownTimer = 0

    light0 = 1
    lightFadeTime = 0.5

    elapsedTime
    duration = 1.4

    missileLight = new ColorFade([0.96, 0.16, 0.1, 0], [1, 1, 1, 0])
    missileDamage = 400
    missileRadius0 = 0.16
    missileRadius

    constructor(g) {
        this.game = g
        let effectFillFade = new ColorFade([0.75, 0.75, 0.75, 1], [1, 1, 1, 0.3])
        this.game.effectBar = new EffectBar(this.game, effectFillFade)
        this.reset()
    }

    reset() {
        this.game.setLightIntensity(0, 0, this.light0)
        this.step = -1
        this.missileRadius = this.missileRadius0 * this.game.vScale
    }

    setMissileRadius(radius) {
        this.missileRadius0 = radius
        this.missileRadius = this.missileRadius0 * this.game.vScale
    }

    click(x, y) {
        if (this.coolDownTimer === -1) {
            this.game.setLightColor(this.missileLight.getColor(0), this.light0)
            this.game.setLightIntensity(0, 0, this.light0)
            this.game.setLightRadius(0.12, this.light0)
            this.elapsedTime = 0
            this.coolDownTimer = 0
            let w = this.game.mainShip.width * 0.5
            this.missile = new Missile(w, w, this.game.mainShip.xPos, this.game.mainShip.yPos, 0, 'm0', this.game)
            this.missile.damage = this.missileDamage
            this.missile.radius = this.missileRadius
            this.missile.click(x, y)
            this.game.missiles.push(this.missile)
            this.step = 0
        }
    }

    addExplosion(x, y, w, h, angle, m, color) {
        let e = new Explosion(w, h, x, y, 0, null, this.game)
        e.activeTex = 6.5
        e.texColor = color
        e.lifespan = 0.4

        e.rotation = -angle
        e.vx = m * Math.sin(angle)
        e.vy = m * Math.cos(angle)
        this.game.objectsBlend.push(e)
    }

    addExplosions(x, y, r, num) {
        let inc = Math.PI * 2 / num
        let m0 = 0.7 * this.game.vScale
        let m1 = 0.5 * this.game.vScale
        for (let i = 0; i < num; ++i) {
            let angle = i * inc
            let angle2 = angle + 0.5 * inc
            let w = 0.1 * r
            let h = 0.5 * r
            this.addExplosion(x, y, w, h, angle, m0, [0.8, 0.8, 0.8, 1])
            this.addExplosion(x, y, w, h, angle2, m1, [0.9, 0.9, 0.9, 1])
        }
    }

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
            let c = this.elapsedTime / this.lightFadeTime
            if (c > 1) {
                c = 1
            }

            this.game.setLightIntensity(10 * c, 0.5, this.light0)
            this.game.moveLight(this.missile.xPos, this.missile.yPos, this.light0)


            if (this.missile.markedForRemoval) {
                this.step = 1
                this.game.setLightRadius(0.24, this.light0)
                this.elapsedTime = 0
                this.missileExplosion = new MissileExplosion(this.missile.x, this.missile.y, this.missile.radius, this.game)
            }
        } else if (this.step === 2) {
            let c = this.elapsedTime / this.duration

            if (c > 1) {
                this.step = -1
                this.game.setLightIntensity(0, 0, this.light0)
                this.game.setLightRadius(0, this.light0)
                this.game.moveLight(this.missileExplosion.x, this.missileExplosion.y, this.light0)
                return
            }

            let c1 = 1 - c
            this.game.setLightColor(this.missileLight.getColor(c), this.light0)
            this.game.setLightIntensity(16 * c1, 0.5, this.light0)
        }
    }

    tickAfter(dt) {
        if (this.step === 0) {
            this.missile.tickAfter(dt)
        } else if (this.step === 1) {
            this.missileExplosion.tickAfter(dt)
            this.game.asteroids.forEach(a => {
                a.wasHitByMissileExplosion = false
            })
            Collisions.handleMissileExplodeCollision(this.game.asteroids, this.missile, this.game.vScale)
            Collisions.handleMissileExplodeCollision(this.game.sortedObjects, this.missile, this.game.vScale)
            Collisions.handleMissileExplodeCollision(this.game.textStrings, this.missile, this.game.vScale)
            Collisions.handleMissileExplodeCollision(this.game.projectiles, this.missile, this.game.vScale)
            Collisions.handleMissileExplodeCollision(this.game.projectileDebris, this.missile, this.game.vScale)
            this.addExplosions(this.missile.x, this.missile.y, this.missile.radius, 7)
            this.step = 2
        } else if (this.step === 2) {
            this.missileExplosion.tickAfter(dt)
        }
    }

    getEffectArgs() {
        // [x, y, r, active]
        if (this.step !== 2) {
            return [[], [], [], [-1, 0, 0, 0]]
        } else {
            return [[this.missileExplosion.xPx, this.missileExplosion.yPx, this.missileExplosion.rPx, 0], [this.missileExplosion.c, this.missileExplosion.c1, 0, 0], [], [0, 0, 0, 0]]
        }
    }
}

class MissileExplosion {
    x
    y
    r

    xPx
    yPx
    rPx

    c
    c1

    duration = 0.7
    elapsedTime = 0

    constructor(x, y, r, g) {
        this.x = x
        this.y = y
        this.r = r
        this.game = g
    }

    tickAfter(dt) {
        this.y += this.game.vScroll * dt

        this.xPx = this.x * this.game.pxRatio
        this.yPx = (1 - this.y) * this.game.pxRatio
        this.rPx = this.r * this.game.pxRatio

        if (this.c === 1) {
            return
        } else if (this.elapsedTime > this.duration) {
            this.c = 1
            this.c1 = 0
        } else {
            this.elapsedTime += dt
            this.c = this.elapsedTime / this.duration
            this.c1 = 1 - this.c
        }
    }
}