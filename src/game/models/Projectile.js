import { Texture } from '../Texture'
import Exploder from '../effects/Exploder'

class Projectile extends Texture {
    vx
    vy
    vr

    rTarget = null

    hp
    mass

    debrisMask
    impactMask
    ricochetMask0
    ricochetMask1

    out = false

    // shader data
    colorMask = [0, 0, 0, -1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.hp = 10
        this.mass = 1
        this.explodeSize = 1

        this.shaderOp = 1100
    }

    finishTick(dt) {
        if (this.xPos > this.game.width + 0.1 || this.xPos < -0.1 || this.yPos > 1.4 || this.yPos < -0.4) {
            this.markedForRemoval = true
        }

        if (this.rTarget != null && this.rotation != this.rTarget) {
            let diff = this.rTarget - this.rotation
            while (diff > Math.PI) {
                diff -= 2 * Math.PI
            }
            while (diff < -Math.PI) {
                diff += 2 * Math.PI
            }
            this.rotation += 10 * diff * dt
        }

        if (!this.out) {
            let x = this.xPos - this.game.mainShip.xPos
            let y = this.yPos - this.game.mainShip.yPos
            if (Math.sqrt(x * x + y * y) > this.game.mainShip.shieldRadius + this.width / 2) {
                this.out = true
            }
        }
    }

    tick(dt) {
        this.xPos += this.vx * dt
        this.yPos += (this.vy + this.game.vScroll) * dt

        this.finishTick(dt)
    }

    explode() {
        this.markedForRemoval = true
        Exploder.explodeTexture(this, 2, 2, 0.2 * this.game.vScale, 0.8, this.debrisMask, this.game.projectileDebris, this.game)
    }

    explodeWarp(angle) {
        this.markedForRemoval = true
        let debris = []
        Exploder.explodeTexture(this, 2, 2, 0.2 * this.game.vScale, 0.8, this.debrisMask, debris, this.game)
        if (angle != null) {
            debris.forEach(d => {
                let m = 0.4
                d.vx += Math.sin(angle) * m
                d.vy += Math.cos(angle) * m
            })
        }
        this.game.projectileDebris.push(...debris)
    }

    collideShip(ship, xD, yD, r, r2) {
        if (this.markedForRemoval) {
            return
        }

        if (this.out) {
            this.explode()
            this.game.mainShip.hit(this.xPos, this.yPos, 0)
        }
    }

    collideMissile(angle, m) {
        /*
        m *= 0.1
        this.vx += Math.sin(angle) * m
        this.vy += Math.cos(angle) * m
        this.rotation = Math.atan2(this.vx, -this.vy)
        */
        this.explode()
    }


}

class ProjectileAccel extends Projectile {
    ax = 0
    ay = 0

    ctx = 0
    cty = 0

    vxRel = 0
    vyRel = 0

    vxTarget = 0
    vyTarget = 0

    targets = []
    accelerations = []
    durations = []
    targetIndex = 0

    elapsedTime = 0
    completeTime = 0.5
    stage = 0


    init() {
        this.setAccel()
    }


    setAccel() {
        if (this.targetIndex >= this.targets.length) {
            return false
        } else {
            this.vxTarget = this.targets[this.targetIndex][0]
            this.vyTarget = this.targets[this.targetIndex][1]
            let vxDiff = this.vxTarget - this.vx
            let vyDiff = this.vyTarget - this.vy

            let xm = Math.abs(vxDiff)
            let ym = Math.abs(vyDiff)
            let hm = Math.sqrt(xm * xm + ym * ym)

            let normal = hm / this.game.vScale
            this.ax = this.accelerations[this.targetIndex] * vxDiff * normal
            this.ay = this.accelerations[this.targetIndex] * vyDiff * normal

            let ctx = 0
            let cty = 0

            if (this.ax != 0) {
                this.ctx = (this.vxTarget - this.vx) / this.ax
                ctx = this.ctx * this.durations[this.targetIndex];
            }

            if (this.ay != 0) {
                this.cty = (this.vyTarget - this.vy) / this.ay
                cty = this.cty * this.durations[this.targetIndex];
            }

            this.completeTime = ctx > cty ? ctx : cty

            ++this.targetIndex
            return true
        }
    }

    accel(dt) {
        if (this.vx !== this.vxTarget) {
            if (this.elapsedTime >= this.ctx) {
                let dt2 = (this.vxTarget - this.vx) / this.ax;
                let dtDiff = dt - dt2;

                this.xPos += this.vx * dt2 + 0.5 * this.ax * dt2 * dt2;
                this.vx = this.vxTarget;
                this.ax = 0;
                this.xPos += this.vx * dtDiff;
            } else {
                this.xPos += this.vx * dt + 0.5 * this.ax * dt * dt;
            }
        } else {
            this.xPos += this.vx * dt;
        }

        if (this.vy !== this.vyTarget) {
            if (this.elapsedTime >= this.cty) {
                let dt2 = (this.vyTarget - this.vy) / this.ay;
                let dtDiff = dt - dt2;

                this.yPos += this.vy * dt2 + 0.5 * this.ay * dt2 * dt2;
                this.vy = this.vyTarget;
                this.ay = 0;
                this.yPos += this.vy * dtDiff;
            } else {
                this.yPos += this.vy * dt + 0.5 * this.ay * dt * dt;
            }
        } else {
            this.yPos += this.vy * dt;
        }

        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
    }

    tick(dt) {
        if (this.stage === 0) {
            this.elapsedTime += dt;
            this.accel(dt)
            if (this.elapsedTime > this.completeTime) {
                let diff = this.elapsedTime - this.completeTime

                this.xPos -= this.vx * diff;
                this.yPos -= this.vy * diff;

                let more = this.setAccel()

                this.xPos += this.vx * diff + 0.5 * this.ax * diff * diff;
                this.yPos += this.vy * diff + 0.5 * this.ay * diff * diff;

                this.vx += this.ax * diff;
                this.vy += this.ay * diff;

                this.elapsedTime = diff
                
                if (!more) {
                    this.stage = 1
                }
            }
            this.rotation = Math.atan2(this.vx - this.vxRel, -(this.vy - this.vyRel));
        } else {
            this.xPos += this.vx * dt
            this.yPos += this.vy * dt
        }

        this.yPos += this.game.vScroll * dt
        this.finishTick(dt);
    }
}

class ProjectileMultiAccel extends ProjectileAccel {

    colorTimer = 0
    colorFade

    tm = 0

    setColorFade(colorFade, t0 = 0, tm = 0) {
        this.colorFade = colorFade
        this.tm = tm
        this.colorTimer += t0 * 2 * Math.PI
        this.colorMask = this.colorFade.getColor((1 + Math.cos(this.colorTimer)) * 0.5)
    }

    tick(dt) {
        this.colorTimer += dt * this.tm
        this.colorFade.setColor((1 + Math.cos(this.colorTimer)) * 0.5, this.colorMask)

        super.tick(dt)
    }
}

export { Projectile, ProjectileAccel, ProjectileMultiAccel }