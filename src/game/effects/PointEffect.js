export default class PointEffect {
    game

    xPos
    yPos

    r0
    radius

    warpMag
    pushMag
    warpMagnitude
    pushMagnitude

    xPx
    yPx

    currR
    currRPx
    currMagnitude

    elapsedTime = -1
    duration
    completed

    damage
    currDamage

    constructor(g, radius, wm, pm, duration) {
        this.game = g
        this.r0 = radius
        this.warpMag = wm
        this.pushMag = pm
        this.duration = duration

        this.damage = 2200

        this.reset()
    }

    reset() {
        this.radius = this.r0 * this.game.vScale
        this.warpMagnitude = this.warpMag * this.game.vScale
        this.elapsedTime = -1
    }

    start() {
        this.elapsedTime = 0

        this.game.sortedObjects.forEach(o => {
            o.wasPushed = false
        })

        this.game.textStrings.forEach(t => {
            t.wasPushed = false
        })

        this.tick(0)
    }

    click(x, y) {
        this.xPos = x
        this.yPos = y
    }

    tick(dt) {
        if (this.elapsedTime === -1) {
            return
        }

        this.elapsedTime += dt
        this.completed = this.elapsedTime / this.duration
        let cn1 = 1 - this.completed
        this.currDamage = cn1 * this.damage
        this.pushMagnitude = this.pushMag * cn1 * this.game.vScale

        this.yPos += this.game.vScroll * dt

        this.xPx = this.xPos * this.game.pxRatio
        this.yPx = (1 - this.yPos) * this.game.pxRatio


        if (this.completed > 1) {
            this.elapsedTime = -1
            return
        }

        //radius
        let rc = Math.cos(this.completed * 1.57079 - 1.53079)
        rc = Math.sqrt(rc)
        this.currR = rc * this.radius
        this.currRPx = this.currR * this.game.pxRatio

        //magnitude
        this.currMagnitude = (Math.cos(this.completed * 6.28318 - 2.0944) + 0.5) * this.warpMagnitude
    }

    tickAfter() {
        if (this.elapsedTime === -1) {
            return
        }

        this.game.sortedObjects.forEach(d => {
            d.collidePoint(this)
        })

        this.game.textStrings.forEach(t => {
            t.collidePoint(this)
        })

        this.game.projectiles.forEach(p => {
            p.collidePoint(this)
        })

        this.game.projectileDebris.forEach(p => {
            p.collidePoint(this)
        })
    }

    getEffectArgs() {
        if (this.elapsedTime === -1) {
            return [[-1, 0, 0, 0], [], []]
        }
        else {
            return [[this.xPx, this.yPx, this.currRPx, this.currMagnitude], [0, 0, 0, 0], [0, 0, 0, 0]]
        }
    }
}