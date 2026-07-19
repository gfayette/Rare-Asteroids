import { Texture } from '../Texture'

export default class Debris extends Texture {
    vx
    vy
    vr

    elapsedTime
    lifespan

    w0
    h0

    // shader data
    colorMask = [0, 0, 0, -1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.w0 = w
        this.h0 = h

        this.lifespan = 0
        this.elapsedTime = 0

        this.shaderOp = 1100
    }

    tick(dt) {
        this.elapsedTime += dt
        this.xPos += this.vx * dt
        this.yPos += (this.vy + this.game.vScroll) * dt
        this.rotation += this.vr * dt

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
            return
        }

        if (this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
            this.colorMask[3] = 0
        } else {
            let ratio = this.elapsedTime / this.lifespan
            if (ratio > 0.5) {
                let a = 2 - 2 * ratio
                this.colorMask[3] = a
                this.width = this.w0 * a
                this.height = this.h0 * a
            }
        }
    }

    collideShip(ship, xDist, yDist, r, r2) {
        let mult = (r / r2)
        this.xPos = ship.xPos + xDist * mult
        this.yPos = ship.yPos + yDist * mult
        mult *= this.game.mainShip.warp * 0.12
        this.vx += mult * xDist / 2
        this.vy += mult * yDist / 2
        this.colorMask = this.game.mainShip.shieldMask.slice()
        this.game.mainShip.hitDebris(this.xPos, this.yPos)
        let ratio = this.elapsedTime / this.lifespan
        if (ratio > 0.5) {
            let a = 1 - (ratio - 0.5) * 2
            this.colorMask[3] = a
        }
    }

    collideMissile(angle, m) {
        m *= 0.46
        this.vx += Math.sin(angle) * m
        this.vy += Math.cos(angle) * m
    }
}