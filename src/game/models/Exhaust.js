import { Texture } from "../Texture"

export default class Exhaust extends Texture {
    vx
    vy
    elapsedTime = 0
    lifespan = 0

    // shader data
    texColor = [1, 1, 1, 1]
    colorMask = [0, 0, 0, -1]

    colorFade
    
    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.shaderOp = 1000
    }

    start() {
        this.texColor = this.colorFade.getColor(0)
        this.texColor[3] = 0
    }

    tick(dt) {
        this.elapsedTime += dt
        this.xPos += this.vx * dt
        this.yPos += (this.vy + this.game.vScroll) * dt

        if (this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
            return
        }

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
        }

        let ratio = this.elapsedTime / this.lifespan
        this.colorFade.setColor(ratio, this.texColor)
        if (ratio > 0.6) {
            let c = 1 - (ratio - 0.6) / 0.4
            this.texColor[3] *= c
        }

        if (ratio <= 0.3) {
            let c = ratio / 0.3
            this.texColor[3] *= c
        }
    }
}