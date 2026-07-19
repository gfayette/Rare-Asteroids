import { Texture } from '../Texture'

class Bar extends Texture {

    h0 = 0
    h1 = 0
    hDiff = 0
    percent = 0

    borderColorFade
    fillColorFade
    offset

    // shader data
    fillColor = [1, 1, 1, 1]
    borderColor = [1, 1, 1, 1]
    barArgs = [0, 0, 0, 0]

    constructor(g, fillFade, offset) {
        super(0, 0, 0, 0, 0, 's0', g)

        this.activeTex = 2.5
        this.shaderOp = 3100

        this.fillColorFade = fillFade
        this.fillColor = this.fillColorFade.getColor(this.percent)

        this.offset = offset
    }

    resize() {
        if (this.game.aspect > 1.2) {
            let sw = 0.014
            this.h0 = 1 - sw
            this.h1 = sw
            this.hDiff = this.h1 - this.h0
            this.width = sw * this.game.vScale * 1.38
            this.xPos = this.game.aspect - this.offset * this.game.vScale * 1.38
        } else {
            let sw = 0.014 * (this.game.aspect > 1 ? 1 : this.game.aspect)
            this.h0 = this.game.aspect - sw
            this.h1 = sw
            this.hDiff = this.h1 - this.h0

            let mult = 1
            if (this.game.wPx > this.game.hPx) {
                if (this.game.wPx > 500) {
                    mult *= 500 / this.game.wPx
                }
            } else {
                if (this.game.hPx > 500) {
                    mult *= 500 / this.game.hPx
                }
            }

            if (this.game.wPx < 500) {
                mult *= this.game.wPx / 500
            }

            mult *= 2

            this.height = 0.014 * mult
            this.yPos = this.offset * mult
        }

        this.setPercent(this.percent)
    }

    setPercent(p) {
        let diffA = p * this.hDiff

        if (this.game.aspect > 1.2) {
            this.yPos = this.h0 + diffA / 2
            this.height = Math.abs(diffA)
        } else {
            this.xPos = this.h1 - diffA / 2
            this.width = Math.abs(diffA)
        }

        this.percent = p
        this.fillColorFade.setColor(this.percent, this.fillColor)
    }
}

class ShieldBar extends Bar {
    constructor(g, fillFade) {
        super(g, fillFade, 0.014)
    }
}

class EffectBar extends Bar {
    constructor(g, fillFade) {
        super(g, fillFade, 0.03)
    }
}

export { Bar, ShieldBar, EffectBar }