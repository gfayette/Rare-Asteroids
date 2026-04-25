import Text from "./Text"

export default class ScaleText extends Text {
    align = 'x'

    centerText() {
        let lineNum = 0
        let x = (this.game.width - this.lineWidths[lineNum]) / 2
        let stringWidth = 0

        for (var i = 0; i < this.string.length; ++i) {
            if (this.string[i] === '\n') {
                ++lineNum
                x = (this.game.width - this.lineWidths[lineNum]) / 2
                stringWidth = 0
                continue
            }

            let l = this.letters[i - lineNum]
            l.xPos = x + stringWidth + l.width / 2
            stringWidth += l.width
        }
    }


    reset() {
        let temp = this.string
        this.letters = []
        this.string = ''
        this.lineWidths = []
        this.lineNum = 0
        this.addText(temp)
    }

    addText(string) {
        super.addText(string)
        if (this.align === 'center') {
            this.centerText()
        }
    }

    getHXY() {
        let a = this.game.aspect < 1 ? this.game.aspect : 1
        return [this.h0 * a, this.x0 * this.game.aspect, this.y0]
    }


    tick(dt) {

    }
}