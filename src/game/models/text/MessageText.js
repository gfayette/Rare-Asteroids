import ScaleText from "./ScaleText"
import { TextBg } from "./TextBg"

export default class MessageText extends ScaleText {
    elapsedTime = 0

    fadeDuration = 2
    fade1Start = 8
    duration = 10

    colorFade
    colorFadeG
    bgColorFade

    letterOffsets = []
    lettersByLine = []
    letterOffsetsByLine = []

    static = true
    y

    constructor(g, h, x, y) {
        super(g, h * g.msgScale, x, y)
        this.spacing = 1.0
        this.y = y
        this.shaderOp = 4100
    }

    setColorFades(colors) {
        this.colorFade = colors[0]
        this.colorFadeG = colors[1]
        this.bgColorFade = colors[2]
    }

    addText(t) {
        super.addText(t)
        this.lettersByLine = []
        this.lettersByLine[0] = []
        let line = 0
        for (let i = 0; i < t.length; ++i) {
            if (t[i] === '\n') {
                ++line
                this.lettersByLine[line] = []
                continue
            }
            this.lettersByLine[line].push(this.letters[i - line])
        }

        this.letterOffsetsByLine = []
        for (let i = 0; i < this.lettersByLine.length; ++i) {
            let offsetsForLine = []
            this.letterOffsetsByLine[i] = offsetsForLine
            for (let j = 0; j < this.lettersByLine[i].length; ++j) {
                offsetsForLine.push(j / this.lettersByLine[i].length * 0.8)
                let letter = this.lettersByLine[i][j]
                letter.texColor = this.colorFade.getColor(0)
                letter.texColorG = this.colorFadeG.getColor(0)
                letter.bgColor = this.bgColorFade.getColor(0)
                letter.texCoords = [letter.yt1, letter.yt2, letter.yt2 - letter.yt1, 0]
                if (letter.l == '{') {
                    letter.texCoords[3] = 1
                } else if (letter.l == '}') {
                    letter.texCoords[3] = 2
                }
            }
        }
    }

    getHXY() {
        let [h, x, y] = super.getHXY()
        return [h, x, this.y]
    }

    setDuration(d, fadePercent) {
        this.duration = d
        this.fadeDuration = d * fadePercent
        this.fade1Start = (1 - fadePercent) * d
    }

    tick(dt) {
        this.elapsedTime += dt
        let complete = this.elapsedTime / this.duration

        if (complete >= 1.2) {
            this.markedForRemoval = true
        } else {

            for (let i = 0; i < this.lettersByLine.length; ++i) {
                for (let j = 0; j < this.lettersByLine[i].length; ++j) {
                    let xl = complete * 10 - (this.letterOffsetsByLine[i][j])
                    let color = this.lettersByLine[i][j].texColor
                    let colorG = this.lettersByLine[i][j].texColorG
                    let bgColor = this.lettersByLine[i][j].bgColor

                    if (xl < 0) {
                        color[3] = 0
                        colorG[3] = 0
                        bgColor[3] = 0
                    } else if (xl < 2) {
                        let x = xl * 0.5
                        this.colorFade.setColor(x, color)
                        this.colorFadeG.setColor(x, colorG)
                        this.bgColorFade.setColor(x, bgColor)
                        if (xl < 1) {
                            color[3] = xl
                            colorG[3] = xl
                            bgColor[3] = xl
                        } else {
                            color[3] = 1
                            colorG[3] = 1
                            bgColor[3] = 1
                        }
                    } else if (xl < 5) {
                        this.colorFade.setColor(1, color)
                        this.colorFadeG.setColor(1, colorG)
                        this.bgColorFade.setColor(1, bgColor)
                        color[3] = 1
                        colorG[3] = 1
                        bgColor[3] = 1
                    } else if (xl < 7) {
                        let x = 3.5 - xl * 0.5
                        this.colorFade.setColor(x, color)
                        this.colorFadeG.setColor(x, colorG)
                        this.bgColorFade.setColor(x, bgColor)
                        if (xl >= 6) {
                            let x2 = 7 - xl
                            color[3] = x2
                            colorG[3] = x2
                            bgColor[3] = x2
                        }
                    } else {
                        color[3] = 0
                        colorG[3] = 0
                        bgColor[3] = 0
                    }
                }
            }
        }

        if (!this.static) {
            let dy = this.game.vScroll * dt * 0.3
            this.y += dy
            this.letters.forEach(e => {
                e.move(0, dy, 0)
            })
        }
    }

    addBgText() {
        let [h, x, y] = this.getHXY()

        let width = 0
        this.lineWidths.forEach(line => {
            if (line > width) {
                width = line
            }
        })
        let height = h + this.lineNum * h * this.spacing
        let bgY = this.y + this.lineNum / 2 * h * this.spacing
        let border = Math.min(width, height) * 0.2

        let rh0 = (height + border) / (height + 2 * border)
        let rh1 = (border) / (height + 2 * border)

        let rw0 = (width + border) / (width + 2 * border)
        let rw1 = (border) / (width + 2 * border)

        height += border * 2
        width += border * 2


        if (this.bgText == null) {
            this.bgText = new TextBg(width, height, x, bgY, 0, this.game)
            this.bgText.texColor = [rh0, rh1, rw0, rw1]
        } else {
            this.bgText.resize(width, height, x, bgY)
        }

    }
}