import { Texture } from '../Texture'

export default class Explosion extends Texture {
    vx
    vy
    vr
    elapsedTime
    lifespan

    w0
    h0
    a0 = 1

    at = null
    atx = null
    aty = null
    atr = null

    // shader data
    colorMask = [1, 1, 1, 1]
    texColor = [0, 0, 0, -1]

    constructor(w, h, x, y, z, texId, g) {
        super(0, 0, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.lifespan = 0.3
        this.elapsedTime = 0

        this.w0 = w
        this.h0 = h

        this.shaderOp = 2000
    }

    tick(dt) {
        this.elapsedTime += dt
        if (this.at == null) {
            this.xPos += this.vx * dt
            this.yPos += (this.vy + this.game.vScroll) * dt
        } else {
            if (!this.at.markedForRemoval) {
                this.xPos = this.at.xPos + this.atx
                this.yPos = this.at.yPos + this.aty

                let rotation = this.atr - this.at.rotation
                let s = Math.sin(rotation)
                let c = Math.cos(rotation)
                let x = c * (this.xPos - this.at.xPos) + s * (this.yPos - this.at.yPos) + this.at.xPos
                let y = -1.0 * s * (this.xPos - this.at.xPos) + c * (this.yPos - this.at.yPos) + this.at.yPos
                this.xPos = x
                this.yPos = y

            } else {
                this.xPos += this.at.vx * dt
                this.yPos += (this.at.vy + this.game.vScroll) * dt
            }
        }

        this.rotation += this.vr * dt


        if (this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
        }

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
        }

        let p = this.elapsedTime / this.lifespan
        let c0 = 0.2
        let c1 = 0.4
        if (p < c0) {
            let a = p / c0
            this.colorMask[3] = a * this.a0
            this.width = a * this.w0
            this.height = a * this.h0
        } else if (p > c1) {
            let a = 1 - (p - c1) / 0.6
            this.colorMask[3] = a * this.a0
        }
    }

    collideShip(ship, xDist, yDist, r, r2) {
        let mult = (r / r2)
        this.xPos = ship.xPos + xDist * mult
        this.yPos = ship.yPos + yDist * mult
        this.vx += mult * xDist / 2
        this.vy += mult * yDist / 2
        this.game.mainShip.hitDebris(this.xPos, this.yPos)
    }

    collideMissile(angle, m) {
        m *= 0.5
        this.vx += Math.sin(angle) * m
        this.vy += Math.cos(angle) * m
        this.rotation = Math.atan2(this.vx, -this.vy)
    }
}