import TitleText from "../../models/text/TitleText"

export default class Intro {
    game
    elapsedTime = 0
    startWait = 1
    step = 0

    constructor(g) {
        this.game = g
    }

    tick(dt) {
        if (this.step === -1) {
            return
        }

        this.elapsedTime += dt
        if (this.step === 0) {
            if (this.elapsedTime > this.startWait) {
                this.step = 1
            }
        } else if (this.step === 1) {
            this.game.setLightForText(true)
            let t = new TitleText(this.game, 0.128, 0.0, 0.25, 1, 2)
            t.align = 'center'
            t.addText("Rare\nAsteroids")
            t.reset()
            this.game.scaleTextStrings.push(t)

            this.step = -1
            this.elapsedTime = 0
        }

    }
}