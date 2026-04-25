import { Texture } from "../Texture"
import ColorFade from "../effects/ColorFade"

export default class Star extends Texture {
    dist = 1
    vr = 0

    colorFade = null

    // shader data
    texColor = [1, 1, 1, 1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)

        this.shaderOp = 1000
    }

    tick(dt) {
        this.yPos += this.game.vScroll / this.dist * dt
        this.rotation += this.vr * dt

        if (this.yPos > 1.1 || this.yPos < -0.1) {
            this.markedForRemoval = true
        }
    }


    startFade(color) {
        this.colorFade = new ColorFade(this.texColor, color)
    }

    setFade(complete) {
        if (this.colorFade != null) {
            this.colorFade.setColor(complete, this.texColor)
        }
    }
}