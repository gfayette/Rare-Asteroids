import { Texture } from '../Texture'

export default class MainShip extends Texture {
    vx = 0
    vy = 0

    rTarget = 0
    rTargetMax = Math.PI / 2
    rAccel
    vxMult

    speed = 0
    sTarget = 0
    warp = 1
    inWarp = false

    gotoPosition = -1
    shieldRadius
    shieldDiameter
    shieldMask

    shieldTex

    projectileAdders = []
    exhaustAdders = []
    warpExhaustAdders = []

    shipNum

    w0
    h0

    isSwitching = false

    elapsed = 0
    hitTimer = -1
    hitTime = 2
    hitCompleted = 1

    borderColorFade

    // shader data
    colorMask = [0, 0, 0, -1]
    borderAuraColor = [0, 0, 0, 0]
    shieldArgs = [0, 0.04, 0, 0] // [gap, aura width, aura angle, aura alpha]
    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)

        this.shaderOp = 3000

        this.w0 = w
        this.h0 = h
        this.setWarp(1)
        this.setAccel(1)
        this.resize()
    }

    resize() {
        this.width = this.w0 * this.game.vScale
        this.height = this.h0 * this.game.vScale
        this.shieldRadius = this.width * 0.62
        this.shieldDiameter = this.shieldRadius * 2

        if (this.shieldTex != null) {
            this.shieldTex.width = this.shieldDiameter * 1.3
            this.shieldTex.height = this.shieldDiameter * 1.3
        }

        this.exhaustAdders.forEach(e => {
            e.scaleModel()
        })

        this.warpExhaustAdders.forEach(e => {
            e.scaleModel()
        })

        this.projectileAdders.forEach(p => {
            p.scaleModel()
        })

        this.projectileAdders.forEach(a => {
            a.reset()
        })

        this.game.setLightRadius(0.16, 0)
    }

    reset() {
        this.rTarget = 0
        this.resize()
    }

    setAccel(accel) {
        this.rAccel = 10 / (accel / 2 + 2)
        this.vxMult = accel
    }

    setWarp(warp) {
        this.warp = warp
        this.exhaustAdders.forEach(e => {
            e.warp = warp
        })
    }

    setShieldHp(hp) {
        this.shieldTex.setShieldHp(hp)
    }

    add = false
    tick(dt) {
        this.elapsed += dt
        let v = this.speed * this.warp * this.game.vScale
        this.game.vScroll = v * Math.cos(this.rotation)

        this.vx = v * Math.sin(this.rotation) * this.vxMult
        this.xPos += this.vx * dt
        this.yPos += this.vy * dt

        if (this.xPos > this.game.width + 0.1) {
            this.xPos = -0.1
            this.add = false
        } else if (this.xPos < -0.1) {
            this.xPos = this.game.width + 0.1
            this.add = false
        }

        this.shieldTex.xPos = this.xPos
        this.shieldTex.yPos = this.yPos
        this.shieldTex.rotation = this.rotation
    }

    tickAfter(dt) {
        if (this.gotoPosition !== -1) {
            let diff = this.gotoPosition - this.xPos
            if (Math.abs(diff) < 0.004 && Math.abs(this.vx) < 0.012) {
                this.rTarget = 0
                this.shipPosition = -1
            } else {
                diff -= this.vx * 0.25
                diff *= 4
                if (diff > 0) {
                    this.rTarget = diff > this.rTargetMax ? this.rTargetMax : diff
                } else {
                    this.rTarget = diff < -this.rTargetMax ? -this.rTargetMax : diff
                }
            }
        }

        let diff = this.rTarget - this.rotation
        while (diff > Math.PI) {
            diff -= 2 * Math.PI
        }
        while (diff < -Math.PI) {
            diff += 2 * Math.PI
        }
        let rd = this.rAccel * diff * dt
        this.rotation += rd

        if (this.speed !== this.sTarget) {
            diff = (this.sTarget - this.speed) * this.game.vScale
            let m = 0.002
            if (diff > 0) {
                this.speed += diff > m ? m : diff
            } else {
                this.speed += diff < -m ? -m : diff
            }
        }

        if (this.warp === 1) {
            this.exhaustAdders.forEach(e => {
                e.tick(dt)
            })
        } else {
            this.warpExhaustAdders.forEach(e => {
                e.tick(dt)
            })
        }

        this.projectileAdders.forEach(p => {
            p.tick(dt, this.add)
        })
        this.add = true

        this.game.moveLight(this.xPos, this.yPos, 0)
        this.handleShield(dt)
    }

    handleShield(dt) {
        if (this.hitTimer !== -1) {
            this.hitTimer += dt
            this.hitCompleted = this.hitTimer / this.hitTime
            let c = this.hitCompleted
            if (c > 1) {
                this.hitTimer = -1
                this.hitCompleted = 1
                this.shieldArgs[0] = 0
                this.shieldArgs[1] = 0.04
            } else {
                let c2 = 1 - c
                this.shieldArgs[0] = 0.04 * c2
                this.shieldArgs[1] = 0.04 + 0.04 * c2
                this.shieldArgs[2] = this.hitAngle + this.rotation
                this.shieldArgs[3] = c2
            }
            this.setShieldColor()
        }
    }

    setShieldColor() {
        this.borderColorFade.setColor(this.hitCompleted, this.borderAuraColor)
        this.game.setLightColor(this.borderAuraColor, 0)
    }

    initShieldColor() {
        this.borderAuraColor = this.borderColorFade.getColor(this.hitCompleted)
        this.game.setLightColor(this.borderAuraColor, 0)
    }

    hitAngle
    hit(x, y, mass) {
        let xDist = x - this.xPos
        let yDist = y - this.yPos
        this.hitAngle = Math.atan2(yDist, xDist) - this.rotation + Math.PI

        this.shieldArgs[0] = 0.02
        this.shieldArgs[1] = 0.08
        this.hitTimer = 0
        this.hitCompleted = 0
        this.shieldTex.hit(x, y, mass)
        this.borderColorFade.setColor(this.hitCompleted, this.borderAuraColor)
        this.game.setLightColor(this.borderAuraColor, 0)
    }

    hitDebris(x, y) {
        if (this.hitCompleted > 0.2) {
            this.hit(x, y, 0)
        }
    }
}