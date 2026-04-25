import { Texture } from '../Texture'
import Exploder from '../effects/Exploder.js'
import Particle from './Particle.js'
import Explosion from './Explosion'
import ScoreText from './text/ScoreText'
import ScoreKeeper from '../ScoreKeeper'

export default class Asteroid extends Texture {
    vx
    vy
    vr

    hp
    mass
    points

    layer
    addedOnTick

    debrisMask
    explosionMask

    particleFade1
    particleFade2

    scoreFadeIn
    scoreFadeOut

    impactTex = 4.5
    explodeTex = 5.5
    ricochetTex = 6.5

    // shader data
    colorMask = [0, 0, 0, -1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.activeTex = 2.5
        this.lightType = 70
        this.shaderOp = 1100
    }

    tick(dt) {
        this.xPos += this.vx * dt
        this.yPos += (this.vy + this.game.vScroll) * dt
        this.rotation += this.vr * dt

        if (this.yPos > 1.55 || this.yPos < -0.5 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
        }
    }

    explodeProjectile() {
        this.markedForRemoval = true
        Exploder.explodeTexture(this, 2, 3, 0.12, 0.8, this.debrisMask, this.game.sortedObjects, this.game)
        this.addParticles(2)
        this.addExplosions(3)
        this.addPoints()
    }

    explodeWarp(angle) {
        this.markedForRemoval = true
        let debris = []
        Exploder.explodeTexture(this, 2, 3, 0.07, 0.8, this.debrisMask, debris, this.game)
        if (angle != null) {
            debris.forEach(d => {
                let m = 0.4
                d.vx += Math.sin(angle) * m
                d.vy += Math.cos(angle) * m
            })
        }
        this.game.sortedObjects.push(...debris)
        this.addExplosions(3, angle, 1.6)
    }

    explodeShield() {
        this.markedForRemoval = true
        Exploder.explodeTexture(this, 2, 3, 0.07, 0.8, this.debrisMask, this.game.sortedObjects, this.game)
    }

    explodeMissile(angle, m) {
        this.markedForRemoval = true
        Exploder.explodeTexture(this, 2, 3, 0.12, 0.8, this.debrisMask, this.game.sortedObjects, this.game)
        this.addParticles(2, angle, m * 2)
        this.addExplosions(3, angle, m * 1.4)
        this.addPoints(angle, m * 0.28)
    }

    addPoints(angle = null, m = null) {
        let t = new ScoreText(this.game, this.height * 0.62, this.xPos, this.yPos - this.height / 3)
        t.setColorFades(this.scoreFadeIn, this.scoreFadeOut)
        t.addText(ScoreKeeper.formatNum(this.points))

        t.vx = this.vx * 0.7
        t.vy = this.vy * 0.7

        if (angle !== null) {
            angle += Math.random() - 0.5
            let r = Math.random()
            let v = (0.4 + r * 0.2) * this.game.vScale
            if (m != null) {
                v *= m
            }
            t.vx = v * Math.sin(angle)
            t.vy = v * Math.cos(angle)
        }

        this.game.textStrings.push(t)
    }

    addParticle(angle, m) {
        let s = this.width
        let p = new Particle(s, s, this.xPos, this.yPos, 0, 'particle', this.game)
        p.colorFade1 = this.particleFade1
        p.colorFade2 = this.particleFade2
        let v = (0.36 + Math.abs(this.vr) * 0.024) * this.game.vScale
        if (m != null) {
            v *= m
        }
        p.vx = v * Math.sin(angle) + this.vx
        p.vy = v * Math.cos(angle) + this.vy
        if (this.zPos < -0.95) {
            this.game.particles0.push(p)
        } else {
            this.game.particles1.push(p)
        }
    }

    addParticles(num, angle, m = null) {
        for (let i = 0; i < num; ++i) {
            let ar = null
            if (angle == null) {
                ar = Math.PI * 2 * Math.random()
            } else {
                ar = angle + Math.random() - 0.5
            }
            this.addParticle(ar, m)
        }
    }

    addExplosion(angle, m) {
        let e = new Explosion(1 * this.width, 1 * this.width, this.xPos, this.yPos, this.zPos - 0.004, null, this.game)
        e.activeTex = this.explodeTex
        e.colorMask = this.explosionMask.slice()
        e.lifespan = 0.4
        let r = Math.random()
        let v = (0.4 + r * 0.2) * this.game.vScale
        if (m != null) {
            v *= m
        }
        e.rotation = -angle + Math.PI
        e.vx = v * Math.sin(angle) + this.vx
        e.vy = v * Math.cos(angle) + this.vy
        this.game.sortedObjects.push(e)
    }

    addExplosions(num, angle, m = null) {
        if (angle == null) {
            let pi2 = 2 * Math.PI
            let inc = pi2 / num
            let incw = inc * 1.2
            let offset = 0
            for (let i = 0; i < num; ++i) {
                let ar = incw * Math.random() + offset
                offset += inc
                this.addExplosion(ar, m)
            }
        } else {
            for (let i = 0; i < num; ++i) {
                let ar = angle + Math.random() - 0.5
                this.addExplosion(ar, m)
            }
        }
    }

    addRicochet(projectile, hy, a) {
        let e = new Explosion(0.2 * projectile.width, 1.6 * projectile.width, projectile.xPos, projectile.yPos, this.zPos + 0.001, null, this.game)
        e.activeTex = this.ricochetTex
        e.texColor = projectile.ricochetMask0.slice()
        e.lifespan = 0.4
        let ar = a + Math.random() - 0.5
        e.rotation = -ar
        e.vx = hy * Math.sin(ar) + this.vx
        e.vy = hy * Math.cos(ar) + this.vy
        this.game.sortedObjects.push(e)

        e = new Explosion(0.24 * projectile.width, 0.8 * projectile.width, projectile.xPos, projectile.yPos, this.zPos + 0.001, null, this.game)
        e.activeTex = this.ricochetTex
        e.texColor = projectile.ricochetMask1.slice()
        e.lifespan = 0.4
        ar = a + Math.random() - 0.5
        e.rotation = -ar
        hy *= 0.5
        e.vx = hy * Math.sin(ar) + this.vx
        e.vy = hy * Math.cos(ar) + this.vy
        this.game.sortedObjects.push(e)

        let arr = Exploder.makeDebris(projectile, 2, 2, 1, projectile.debrisMask, this.game)
        arr.forEach(d => {
            let m = a + Math.random() - 0.5
            d.vr = (10 * Math.random() - 0.5)
            d.vx = hy * Math.sin(m) + this.vx
            d.vy = hy * Math.cos(m) + this.vy
            this.game.projectileDebris.push(d)
        })
    }

    addAsteroidRicochet(xPos, yPos, vx, vy, angle, width) {
        let e = new Explosion(0.12 * width, width, xPos, yPos, this.zPos + 0.001, null, this.game)
        e.activeTex = this.ricochetTex
        e.texColor = [1, 1, 1, 1]
        e.lifespan = 0.4

        let a = angle + Math.PI / 2 + Math.random() - 0.5
        e.rotation = -a
        e.vx = 0.2 * Math.sin(a) + vx
        e.vy = 0.2 * Math.cos(a) + vy
        this.game.sortedObjects.push(e)


        e = new Explosion(0.12 * width, width, xPos, yPos, this.zPos + 0.001, null, this.game)
        e.activeTex = this.ricochetTex
        e.texColor = [1, 1, 1, 1]
        e.lifespan = 0.4

        a = angle - Math.PI / 2 + Math.random() - 0.5
        e.rotation = -a
        e.vx = 0.2 * Math.sin(a) + vx
        e.vy = 0.2 * Math.cos(a) + vy
        this.game.sortedObjects.push(e)

    }

    collideProjectile(p) {
        if (this.markedForRemoval || p.markedForRemoval) {
            return
        }

        let mr = p.mass / (this.mass + p.mass)
        if (mr > 0.4) {
            mr = 0.4
        }
        let r = this.width / 2
        let vx = p.vx - this.vx
        let vy = p.vy - this.vy
        let hyv = Math.sqrt(vy * vy + vx * vx)
        let d = (vy * (p.xPos - this.xPos) - vx * (p.yPos - this.yPos)) / hyv / r

        let vs = this.vr * r
        let vh = d > 0 ? hyv : -hyv
        let dv = Math.abs(vh - vs) / r
        if ((vh > 0 && vs > vh) || (vh < 0 && vs < vh)) {
            dv *= -1
        }

        let vrd = mr * (d * dv)
        let vs1 = (this.vr + vrd) * r
        if (vh > 0) {
            if (vs1 > vh) {
                this.vr = vh / r
            } else if (vs > vh && vs1 < vh) {
                this.vr = vh / r
            } else {
                this.vr += vrd
            }
        } else {
            if (vs1 < vh) {
                this.vr = vh / r
            } else if (vs < vh && vs1 > vh) {
                this.vr = vh / r
            } else {
                this.vr += vrd
            }
        }

        let a0 = Math.atan(vx / vy)
        let a = a0 - Math.PI * d
        let a2 = a0 - Math.PI * d * 0.25

        if (vy >= 0) {
            a -= Math.PI
            a2 -= Math.PI
        }

        let ad = Math.abs(d)
        let ad1 = 1 - ad
        let dvx = mr * ad1 * vx
        let dvy = mr * ad1 * vy
        let hydv = Math.sqrt(dvx * dvx + dvy * dvy)

        this.vx -= hydv * Math.sin(a2)
        this.vy -= hydv * Math.cos(a2)

        let hyvp = Math.sqrt(p.vy * p.vy + p.vx * p.vx)
        let m = ad1 * hyv + ad * hyvp

        this.addRicochet(p, 0.42 * m, a)
        Exploder.impactProjectile(p, this, p.impactMask, this.game)

        let newHp = this.hp - p.hp
        if (newHp > 0) {
            this.hp = newHp
            this.game.scoreKeeper.addDamage(p.hp)
        } else {
            this.explodeProjectile()
            this.game.scoreKeeper.addScore(this.points)
            this.game.scoreKeeper.addDamage(this.hp)
        }
        p.markedForRemoval = true
    }


    wasHitByMissileExplosion = false
    collideMissile(angle, m, damage) {
        if (this.markedForRemoval || this.wasHitByMissileExplosion) {
            return
        }
        this.wasHitByMissileExplosion = true

        let newHp = this.hp - damage
        if (newHp > 0) {
            this.hp = newHp
            this.game.scoreKeeper.addDamage(damage)
        } else {
            this.game.scoreKeeper.addScore(this.points)
            this.game.scoreKeeper.addDamage(this.hp)
            this.explodeMissile(angle, m)
        }
    }

    collideShip(ship, xDist, yDist, r, r2) {
        if (this.markedForRemoval) {
            return
        }
        this.game.mainShip.hit(this.xPos, this.yPos, this.mass)
        this.explodeShield()
    }
}