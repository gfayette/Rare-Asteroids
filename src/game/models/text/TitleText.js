import ScaleText from "./ScaleText"
import ColorFade from "../../effects/ColorFade"

export default class TitleText extends ScaleText {
    light0
    light1

    elapsedTime = 0
    fadeTime = 3

    colorFade = new ColorFade([0.0, 0.1, 0.1, 0.4], [0.6, 0.6, 0.6, 1])
    colorFadeG = new ColorFade([0.44, 0.44, 0.44, 1], [0.44, 0.44, 0.44, 0])

    lightCenterX = 0
    lightCenterY = 0
    lightAx = 0
    lightAy = 0

    letterOffsets = []

    markedForRemoval = false

    constructor(g, h, x, y, l0, l1) {
        super(g, h, x, y)
        this.lightType = 80
        this.light0 = l0
        this.light1 = l1
        this.reset()
    }

    setLight() {
        let x0 = Math.cos(-this.elapsedTime) * this.lightAx + this.lightCenterX
        let y0 = Math.sin(-this.elapsedTime) * this.lightAy + this.lightCenterY
        let x1 = Math.cos(2 * this.elapsedTime) * this.lightAx + this.lightCenterX
        let y1 = Math.sin(2 * this.elapsedTime) * this.lightAy + this.lightCenterY
        this.game.moveLight(x0, y0, this.light0)
        this.game.moveLight(x1, y1, this.light1)
    }

    addText(t) {
        super.addText(t)
        this.letterOffsets = []
        for (let i = 0; i < this.letters.length; ++i) {
            this.letterOffsets.push(0.7 * i / this.letters.length)
            this.letters[i].texColor = this.colorFade.getColor(0)
            this.letters[i].texColorG = this.colorFadeG.getColor(0)
        }
    }

    reset() {
        super.reset()
        let n = this.lineWidths.length
        let maxWidth = 0
        for (let i = 0; i < n; ++i) {
            if (this.lineWidths[i] > maxWidth) {
                maxWidth = this.lineWidths[i]
            }
        }
        let [h, x, y] = this.getHXY()
        if (this.align === 'center') {
            this.lightCenterX = this.game.width * 0.5
        } else {
            this.lightCenterX = maxWidth / 2 + x
        }
        this.lightCenterY = y + h * (n - 1) * 0.5

        this.lightAx = maxWidth * 0.8
        this.lightAy = (n - 1) * h * 0.8

        this.game.setLightRadius(0.2, this.light0)
        this.game.setLightIntensity(2.0, 0, this.light0)
        this.game.setLightColor([0.8, 0.2, 1], this.light0)

        this.game.setLightRadius(0.2, this.light1)
        this.game.setLightIntensity(2.0, 0, this.light1)
        this.game.setLightColor([0, 1, 1], this.light1)
    }

    tick(dt) {
        this.elapsedTime += dt
        this.setLight()

        let t = 0.6 * (this.elapsedTime - this.fadeTime)
        for (let i = 0; i < this.letters.length; ++i) {

            let cos = Math.cos(t - this.letterOffsets[i])
            let c = 1 - (cos + 1) / 2

            this.colorFade.setColor(c, this.letters[i].texColor)
            this.colorFadeG.setColor(c, this.letters[i].texColorG)
        }

        if (this.elapsedTime < this.fadeTime) {
            let c = this.elapsedTime / this.fadeTime
            for (let i = 0; i < this.letters.length; ++i) {
                this.letters[i].texColor[3] *= c
                this.letters[i].texColorG[3] *= c
            }

        }
    }
}
