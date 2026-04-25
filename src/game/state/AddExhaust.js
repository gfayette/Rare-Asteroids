import Exhaust from '../models/Exhaust.js'
import ColorFade from '../effects/ColorFade.js'


class AddExhaustModel {

    interval

    xOff
    yOff
    vx
    vy

    lifespan

    colorFade
    colorFade2

    width
    height
    texId
}

class AddExhaust {

    clock = 0

    name
    game
    texture

    model
    scaledModel

    sxo = []
    syo = []

    w = []
    h = []

    svx = []
    svy = []

    variationNum = 3
    vi = 0
    viu = 0
    vTime = 0.016
    vElapsed = 0

    warp = 1

    constructor(g, t, eModel) {
        this.name = "exhaust"
        this.game = g
        this.texture = t

        this.model = eModel

        let m = 1.6
        let colorFrom = this.model.colorFade.getColor(0)
        colorFrom[0] *= m
        colorFrom[1] *= m
        colorFrom[2] *= m
        let colorTo = this.model.colorFade.getColor(1)
        colorTo[0] *= m
        colorTo[1] *= m
        colorTo[2] *= m
        this.model.colorFade2 = new ColorFade(colorFrom, colorTo)

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
        sModel.vy *= t.height
        this.scaledModel = sModel

        this.setAll()
    }

    setAll() {
        this.setOffsets()
        this.setDimensions()
        this.setVelocities()
    }

    setOffsets() {
        for (let i = 0; i < this.variationNum; ++i) {
            this.setOffset(i)
        }
    }

    setDimensions() {
        for (let i = 0; i < this.variationNum; ++i) {
            this.setDimension(i)
        }
    }

    setVelocities() {
        for (let i = 0; i < this.variationNum; ++i) {
            this.setVelocity(i)
        }
    }

    oi = 0
    setOffset(i) {
        this.oi = ++this.oi % 2
        let v = 0.08
        let v0 = 1 + v / 4
        let v1 = 1 - v / 4
        if (this.oi === 0) {
            this.sxo[i] = this.scaledModel.xOff * (Math.random() * -v + v0)
            this.syo[i] = this.scaledModel.yOff * (Math.random() * -v + v0)
        } else {
            this.sxo[i] = this.scaledModel.xOff * (Math.random() * v + v1)
            this.syo[i] = this.scaledModel.yOff * (Math.random() * v + v1)
        }
    }

    di = 0
    setDimension(i) {
        this.di = ++this.di % 2
        let v = 0.4
        let v0 = 1 + v / 4
        let v1 = 1 - v / 4
        let m = (this.warp - 1) * 0.02 + 1
        if (this.di === 0) {
            this.w[i] = this.scaledModel.width * (Math.random() * -v + v0) * m
            this.h[i] = this.scaledModel.height * (Math.random() * -v + v0) * m
        } else {
            this.w[i] = this.scaledModel.width * (Math.random() * v + v1) * m
            this.h[i] = this.scaledModel.height * (Math.random() * v + v1) * m
        }
    }

    vei = 0
    setVelocity(i) {
        this.vei = ++this.vei % 2
        let v = 0.24
        let v0 = 1 + v / 4
        let v1 = 1 - v / 4
        let m = (this.warp - 1) * 0.04 + 1
        if (this.vei === 0) {
            this.svx[i] = this.scaledModel.vx * (Math.random() * -v + v0) * m
            this.svy[i] = this.scaledModel.vy * (Math.random() * -v + v0) * m
        } else {
            this.svx[i] = this.scaledModel.vx * (Math.random() * v + v1) * m
            this.svy[i] = this.scaledModel.vy * (Math.random() * v + v1) * m
        }
    }

    tick(dt) {

        this.vElapsed += dt
        if (this.vElapsed > this.vTime) {
            this.vElapsed = 0
            this.viu = ++this.viu % this.variationNum
            this.setOffset(this.viu)
            this.setDimension(this.viu)
            this.setVelocity(this.viu)
        }

        if (dt > 0.2) {
            dt = 0.2
        }

        this.clock += dt
        while (this.clock > this.model.interval) {
            this.clock -= this.model.interval

            let c = Math.cos(this.texture.rotation)
            let s = Math.sin(this.texture.rotation)

            let x = c * this.sxo[this.vi] - s * this.syo[this.vi]
            let y = c * this.syo[this.vi] + s * this.sxo[this.vi]
            let vx = c * this.svx[this.vi] - s * this.svy[this.vi]
            let vy = c * this.svy[this.vi] + s * this.svx[this.vi]

            let e = new Exhaust(this.w[this.vi], this.h[this.vi], this.texture.xPos + x, this.texture.yPos + y, this.texture.zPos - 0.01, this.scaledModel.texId, this.game)
            let e2 = new Exhaust(this.w[this.vi] * 0.2, this.h[this.vi] * 0.8, this.texture.xPos + x, this.texture.yPos + y, this.texture.zPos - 0.012, this.scaledModel.texId, this.game)

            e.vy = vy - this.game.vScroll + this.texture.vy * 0.8
            e.vx = vx + this.texture.vx
            e.rotation = Math.atan2(vx, -vy)
            e.lifespan = this.scaledModel.lifespan * (Math.random() * 0.12 + 0.88)
            e.colorFade = this.model.colorFade
            e.start()
            this.game.exhaust.push(e)

            e2.vy = 1.6 * vy - this.game.vScroll + this.texture.vy * 0.8
            e2.vx = 1.8 * vx + this.texture.vx
            e2.rotation = e.rotation
            e2.lifespan = e.lifespan
            e2.colorFade = this.model.colorFade2
            e.start()
            this.game.exhaust.push(e2)

            this.vi = ++this.vi % this.variationNum
        }
    }
}

class AddMissileExhaust extends AddExhaust {

    // interpolate
    lastTx
    lastTy

    tick(dt) {
        let tx = this.texture.xPos
        let ty = this.texture.yPos

        this.vElapsed += dt
        if (this.vElapsed > this.vTime) {
            this.vElapsed = 0
            this.viu = ++this.viu % this.variationNum
            this.setOffset(this.viu)
            this.setDimension(this.viu)
            this.setVelocity(this.viu)
        }

        this.clock += dt
        while (this.clock > this.model.interval) {
            let ratio = this.clock / dt

            let c = Math.cos(this.texture.rotation)
            let s = Math.sin(this.texture.rotation)

            let x = c * this.sxo[this.vi] - s * this.syo[this.vi] + tx + (this.lastTx - tx) * ratio
            let y = c * this.syo[this.vi] + s * this.sxo[this.vi] + ty + (this.lastTy - ty) * ratio
            let vx = c * this.svx[this.vi] - s * this.svy[this.vi]
            let vy = c * this.svy[this.vi] + s * this.svx[this.vi]

            let e = new Exhaust(this.w[this.vi], this.h[this.vi], x, y, this.texture.zPos - 0.01, this.scaledModel.texId, this.game)
            let e2 = new Exhaust(this.w[this.vi] * 0.2, this.h[this.vi] * 0.8, tx, ty, this.texture.zPos - 0.012, this.scaledModel.texId, this.game)

            e.vy = vy - this.game.vScroll
            e.vx = vx
            e.rotation = Math.atan2(vx, -vy)
            e.lifespan = this.scaledModel.lifespan * (Math.random() * 0.12 + 0.88)
            e.colorFade = this.model.colorFade
            e.start()
            e.tick(this.clock)
            this.game.exhaust.push(e)

            e2.vy = 1.6 * vy - this.game.vScroll
            e2.vx = 1.8 * vx
            e2.rotation = e.rotation
            e2.lifespan = e.lifespan
            e2.colorFade = this.model.colorFade2
            e.start()
            e2.tick(this.clock)
            this.game.exhaust.push(e2)

            this.vi = ++this.vi % this.variationNum
            this.clock -= this.model.interval
        }

        this.lastTx = tx
        this.lastTy = ty
    }
}

export { AddExhaustModel, AddExhaust, AddMissileExhaust }