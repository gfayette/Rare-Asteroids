import { Texture } from '../Texture'
import { AddMissileExhaust, AddExhaustModel } from '../state/AddExhaust'
import ColorFade from '../effects/ColorFade'

export default class Missile extends Texture {
    v = 0
    vx0 = Math.random() - 0.5
    vy0 = 0.8
    vx = 0
    vy = 0

    x
    y
    radius
    damage

    elapsedTime
    exhaustAdders = []

    // shader data
    colorMask = [0, 0, 0, -1]
    texColor = [1, 0.9, 0.8, 1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.shaderOp = 2000

        let model = new AddExhaustModel()
        model.interval = 0.003
        model.xOff = 0.0
        model.yOff = 0.12
        model.vx = 0.0
        model.vy = 3.2
        model.width = 0.4
        model.height = 1.2
        model.texId = 'exhaust'
        model.lifespan = 0.28
        model.colorFade = new ColorFade([2.4, 1.7, 1.4, 0.2], [0.8, 0.24, 0.12, 0.3])
        let adder = new AddMissileExhaust(this.game, this, model)
        this.exhaustAdders.push(adder)
    }

    tick(dt) {
        this.elapsedTime += dt
        this.v += 6 * dt

        let xd = this.xPos - this.x
        let yd = this.yPos - this.y
        let hd = Math.sqrt(xd * xd + yd * yd)
        let dv = this.v * dt

        if (hd < dv) {
            this.markedForRemoval = true
        } else {
            this.rotation = -Math.atan2(xd, yd)
            this.vx = this.vx0 + Math.sin(this.rotation) * this.v
            this.vy = this.vy0 - Math.cos(this.rotation) * this.v

            this.yPos += (this.game.vScroll + this.vy) * dt
            this.xPos += this.vx * dt
            //this.y += this.game.vScroll * dt
        }

        if (this.xPos > this.game.width + 1 || this.xPos < -1 || this.yPos > 2 || this.yPos < -1) {
            this.markedForRemoval = true
        }
    }

    tickAfter(dt) {
        this.exhaustAdders.forEach(e => {
            e.tick(dt)
        })
    }

    click(x, y) {
        this.x = x
        this.y = y
    }

} 