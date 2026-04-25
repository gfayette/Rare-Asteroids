import ColorFade from "../../effects/ColorFade"
import Text from "./Text"

export default class ScoreText extends Text {

    elapsedTime = 0
    lifespan = 1.2
    vy = 0
    vx = 0
    vr = 0

    colorFadeIn = new ColorFade([1, 1, 1, 0], [0.5, 1, 0.8, 1])
    colorFadeOut = new ColorFade([0.5, 1, 0.8, 1], [1, 1, 1, 0])

    i0 = 0.3
    i1 = 0.7

    i2l = 1 - this.i1

    static = false

    constructor(g, h, x, y) {
        super(g, h, x, y)
        this.texColor = this.colorFadeIn.getColor(0)
        this.texColorG = this.colorFadeIn.getColor(0)
    }

    setColorFades(fadeIn, fadeOut) {
        this.colorFadeIn = fadeIn
        this.colorFadeOut = fadeOut
        this.texColor = this.colorFadeIn.getColor(0)
        this.texColorG = this.colorFadeIn.getColor(0)
    }

    tick(dt) {
        this.elapsedTime += dt
        let complete = this.elapsedTime / this.lifespan

        if (complete < this.i0) {
            let c = this.elapsedTime / this.i0
            this.colorFadeIn.setColor(c, this.texColor)
            this.colorFadeIn.setColor(c, this.texColorG)
        } else if (complete < this.i1) {
            this.colorFadeIn.setColor(1, this.texColor)
            this.colorFadeIn.setColor(1, this.texColorG)
        } else if (complete <= 1) {
            let c = (complete - this.i1) / this.i2l
            this.colorFadeOut.setColor(c, this.texColor)
            this.colorFadeOut.setColor(c, this.texColorG)
        } else {
            this.markedForRemoval = true
            this.texColor[3] = 0
            this.texColorG[3] = 0
        }

        if (!this.static) {
            let dx = this.vx * dt
            let dy = (this.game.vScroll + this.vy) * dt
            let dr = this.vr * dt

            this.letters.forEach(e => {
                e.move(dx, dy, dr)
            })
        }

    }

    addText(text) {
        super.addText(text)

        let x = this.x0 - this.lineWidths[0] / 2
        let stringWidth = 0

        for (var i = 0; i < this.string.length; ++i) {
            let l = this.letters[i]
            l.xPos = x + stringWidth + l.width / 2
            stringWidth += l.width
        }
    }

    collideMissile(angle, m) {
        m *= 0.1
        this.vx += Math.sin(angle) * m
        this.vy += Math.cos(angle) * m
    }
}