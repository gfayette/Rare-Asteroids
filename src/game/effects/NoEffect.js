import ColorFade from "./ColorFade"
import { EffectBar } from "../models/Bar"

export default class NoEffect {

    constructor(g) {
        this.game = g
        let effectFillFade = new ColorFade([0, 0, 0, 0], [0, 0, 0, 0])
        this.game.effectBar = new EffectBar(this.game, effectFillFade)
        this.reset()
    }

    reset() {

    }

    click(x, y) {

    }

    tick(dt) {
        this.game.effectBar.setPercent(0)
    }

    tickAfter(dt) {

    }

    getEffectArgs() {
        // [x, y, r, active]
        return [[0, 0, 0, -1], [], [], [0, 0, 0, 0]]
    }
}