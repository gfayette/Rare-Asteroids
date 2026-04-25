import { Texture } from '../Texture'
import ColorFade from '../effects/ColorFade'

export default class Particle extends Texture {
    vx
    vy
    v

    elapsedTime
    lifespan
    duration0
    duration1

    stage = 0

    w0
    h0

    colorFade1
    colorFade2

    // shader data
    texColor = [1, 1, 1, 1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.w0 = w
        this.h0 = h

        this.duration0 = 0.8
        this.duration1 = 1.8
        this.lifespan = 10
        this.elapsedTime = 0

        this.shaderOp = 1000

        this.colorFade1 = new ColorFade([1, 1, 1, 1], [1, 1, 1, 1])
        this.colorFade2 = new ColorFade([1, 1, 1, 1], [1, 1, 1, 1])
        this.texColor = this.colorFade1.getColor(0)
    }


    tick(dt) {
        this.elapsedTime += dt
        let v = 0
        let complete = 0

        switch (this.stage) {
            case 0:
                complete = this.elapsedTime / this.duration0
                if (complete > 1) {
                    this.stage = 1
                    complete = 1
                    this.elapsedTime = 0
                    this.texColor = this.colorFade2.getColor(0, this.texColor)
                } else {
                    this.colorFade1.setColor(complete, this.texColor)
                }

                v = complete * 0.08
                let ratio = (1 - complete) * dt
                this.xPos += this.vx * ratio
                this.yPos += this.vy * ratio
                let s = (1.6 * Math.sin(complete * Math.PI) + 1) * this.w0
                this.width = s
                this.height = s
                break
            case 1:
                complete = this.elapsedTime / this.duration1
                v = this.elapsedTime * 0.8 + 0.08
                this.colorFade2.setColor(complete, this.texColor)
                if (this.elapsedTime > this.duration1) {
                    this.stage = 2
                    this.colorFade2.setColor(1, this.texColor)
                }
                break
            case 2:
                let t2 = this.elapsedTime - this.duration0
                v = t2 * 0.8 + 0.08
                break
            default:
                return
        }

        v *= this.game.vScale

        let xd = this.game.mainShip.xPos - this.xPos
        let yd = this.game.mainShip.yPos - this.yPos
        let hd = Math.sqrt(xd * xd + yd * yd)
        let dv = v * dt

        if (dv < hd) {
            let m = dv / hd
            this.xPos += xd * m
            this.yPos += yd * m + this.game.vScroll * dt
        } else {
            this.markedForRemoval = true
        }



        if (this.elapsedTime > this.lifespan || this.yPos > 1.2) {
            this.markedForRemoval = true
        }
    }
}


