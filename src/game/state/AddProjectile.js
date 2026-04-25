import { Projectile, ProjectileAccel, ProjectileMultiAccel } from '../models/Projectile.js'

class AddProjectileModel {
    interval

    xOff
    yOff
    vx
    vy
    targets = []
    accelerations = []
    durations = []

    colorMask = [0, 0, 0, -1]
    debrisMask = [1, 0, 0, 1]
    impactMask = [1.1, 1, 1.6, 1.0]
    ricochetMask0 = [1.1, 1, 1.6, 1.0]
    ricochetMask1 = [1.1, 1, 1.6, 1.0]

    vxDir = 1

    width
    height
    texId

    hp
    mass

    index
    active = false
    useAccelModel = false
    useMulticolor = false

    colorFade
    adderTM = 1
    adderT0 = 0
    projectileTM = 0
}


class AddProjectile {
    clock = 0
    colorClock = 0

    name
    game
    texture

    model
    scaledModel

    constructor(g, t, pModel) {
        this.name = "projectile"
        this.game = g
        this.texture = t

        this.lastTvx = this.texture.vx
        this.lastTvy = this.texture.vy

        this.model = pModel
        this.scaleModel()
    }

    scaleModel() {
        let sModel = JSON.parse(JSON.stringify(this.model))
        let t = this.texture
        sModel.xOff *= t.width
        sModel.yOff *= t.height
        sModel.width *= t.width
        sModel.height *= t.height
        sModel.vx *= t.width
        sModel.vx *= sModel.vxDir
        sModel.vy *= t.height

        sModel.targets.forEach(element => {
            element[0] *= t.width
            element[0] *= sModel.vxDir
            element[1] *= t.height
        });

        this.scaledModel = sModel
    }

    // interpolate
    lastTvx
    lastTvy
    lastTx
    lastTy
    lastVs
    lastRot

    reset() {
        this.lastTvx = this.texture.vx
        this.lastTvy = this.texture.vy
        this.lastTx = this.texture.xPos
        this.lastTy = this.texture.yPos
        this.lastVs = this.game.vScroll
        this.lastRot = this.texture.rotation
    }

    tick(dt, add = true) {
        let tvx = this.texture.vx
        let tvy = this.texture.vy
        let tx = this.texture.xPos
        let ty = this.texture.yPos
        let vs = this.game.vScroll
        let rot = this.texture.rotation

        if (this.model.active) {
            this.clock += dt
            this.colorClock += dt
        } else {
            return
        }

        while (this.clock > this.model.interval) {
            this.clock -= this.model.interval
            if (add) {
                let ratio = this.clock / dt

                let r = rot + (this.lastRot - rot) * ratio
                let c = Math.cos(r)
                let s = Math.sin(r)

                let x = this.scaledModel.xOff * c - this.scaledModel.yOff * s + tx + (this.lastTx - tx) * ratio
                let y = this.scaledModel.yOff * c + this.scaledModel.xOff * s + ty + (this.lastTy - ty) * ratio
                let vx = this.scaledModel.vx * c - this.scaledModel.vy * s
                let vy = this.scaledModel.vy * c + this.scaledModel.vx * s

                let vxRel = tvx + (this.lastTvx - tvx) * ratio
                let vyRel = tvy + (this.lastTvy - tvy) * ratio - (vs + (this.lastVs - vs) * ratio)

                let p
                if (this.model.useAccelModel) {
                    if (this.model.useMulticolor) {
                        p = new ProjectileMultiAccel(this.scaledModel.width, this.scaledModel.height, x, y, this.texture.zPos - 0.01, this.model.texId, this.game)
                    } else {
                        p = new ProjectileAccel(this.scaledModel.width, this.scaledModel.height, x, y, this.texture.zPos - 0.01, this.model.texId, this.game)
                    }

                    p.accelerations = this.scaledModel.accelerations
                    p.vxRel = vxRel
                    p.vyRel = vyRel

                    let targets = []
                    this.scaledModel.targets.forEach(t => {
                        let vxt = t[0] * c - t[1] * s + vxRel
                        let vyt = t[1] * c + t[0] * s + vyRel
                        targets.push([vxt, vyt])
                    })
                    p.targets = targets

                    p.vx = vx + vxRel
                    p.vy = vy + vyRel

                    p.durations = this.scaledModel.durations
                    p.init()
                } else {
                    p = new Projectile(this.scaledModel.width, this.scaledModel.height, x, y, this.texture.zPos - 0.01, this.model.texId, this.game)
                    p.vx = vx + vxRel
                    p.vy = vy + vyRel
                }

                p.rotation = Math.atan2(vx, -vy)

                p.hp = this.model.hp
                p.mass = this.model.mass

                p.colorMask = this.model.colorMask.slice()
                p.debrisMask = this.model.debrisMask.slice()
                p.impactMask = this.model.impactMask.slice()
                p.ricochetMask0 = this.model.ricochetMask0.slice()
                p.ricochetMask1 = this.model.ricochetMask1.slice()

                if (this.model.useMulticolor) {
                    let hm = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
                    p.setColorFade(this.model.colorFade, this.colorClock * this.model.adderTM + this.model.adderT0, this.model.projectileTM * hm)
                }

                p.tick(this.clock)
                this.game.projectiles.push(p)
                this.game.ap[1].push(p)
            }
        }

        this.lastTvx = tvx
        this.lastTvy = tvy
        this.lastTx = tx
        this.lastTy = ty
        this.lastVs = vs
        this.lastRot = rot
    }
}

export { AddProjectileModel, AddProjectile }