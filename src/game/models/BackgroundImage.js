import { Texture } from "../Texture"

export default class BackgroundImage extends Texture {
    dist = 1
    switchLevel = false
    offScreen = false

    // shader data
    colorMask = [0, 0, 0, -1]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.shaderOp = 1100
    }

    tick(dt) {
        this.yPos += this.game.vScroll / this.dist * dt
        let d = this.game.aspect > 1 ? this.game.aspect : 1

        if (this.yPos > 1.5 * d) {
            if (this.switchLevel) {
                this.offScreen = true
            } else {
                this.yPos -= 2 * d
            }
        }
    }
}