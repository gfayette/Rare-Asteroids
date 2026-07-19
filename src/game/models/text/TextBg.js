import { Texture } from '../../Texture.js'

export class TextBg extends Texture {


    // shader data
    texColor = [1, 1, 1, 1]
    texColorG = [1, 1, 1, 1]
    bgColor = [0.0231, 0.0231, 0.0231, 0.931]
    texCoords = [0, 0, 0, 3]

    text

    constructor(w, h, x, y, z, g) {
        super(w, h, x, y, z, null, g)
        this.shaderOp = 4100
        this.activeTex = 6.5
    }

    move(dx, dy, dr) {
        this.xPos += dx
        this.yPos += dy
        this.rotation += dr
    }

    resize(w, h, x, y) {
        this.width = w
        this.height = h
        this.xPos = x
        this.yPos = y
    }
}