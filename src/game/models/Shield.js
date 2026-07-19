import ColorFade from '../effects/ColorFade'
import { Texture } from '../Texture'
import ScoreText from './text/ScoreText'

export default class Shield extends Texture {
    elapsed = 0
    hitTimer = -1
    hitTime = 1

    shieldHp
    currHp = 1
    shieldPercent = 0
    hpRegTime = 4
    hitCompleted = 1

    shieldColorFade
    auraColorFade

    // shader data
    texColor = [0, 0, 0, 0]
    shieldAuraColor = [0, 0, 0, 0]
    shieldArgs = [0, 0.02, 0, 0] // [gap, aura width, aura angle, aura alpha]
    impactArgs = [0, 0, 0, 0] // [angle0, angle1, width, alpha]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.shaderOp = 4000
    }


    tick(dt) {
        this.elapsed += dt
        if (this.hitTimer !== -1) {
            this.hitTimer += dt
            this.hitCompleted = this.hitTimer / this.hitTime
            let c = this.hitCompleted
            if (c > 1) {
                this.hitTimer = -1
                this.hitCompleted = 1

                this.shieldArgs = [0, 0.02, 0, 0]
                this.impactArgs0 = [0, 0, 0, 0]

            } else {
                let c2 = 1 - c
                this.shieldArgs[0] = 0.0 * c2
                this.shieldArgs[1] = 0.02 + 0.02 * c2
                this.shieldArgs[2] = this.elapsed * 3

                let v = 10 * c2 * c2
                this.impactArgs[0] += dt * v
                this.impactArgs[1] -= dt * v
                this.impactArgs[2] = c2 * 0.72
                this.impactArgs[3] = c2
            }
            this.setShieldColor()
        }

        if (this.currHp < this.shieldHp) {
            this.currHp += this.shieldHp * dt / this.hpRegTime
            if (this.currHp > this.shieldHp) {
                this.currHp = this.shieldHp
            }
            this.shieldPercent = this.currHp / this.shieldHp
            this.game.shieldBar.setPercent(this.shieldPercent)
        }
    }

    initShieldColor() {
        this.texColor = this.shieldColorFade.getColor(this.hitCompleted)
        this.shieldAuraColor = this.auraColorFade.getColor(this.hitCompleted)
    }

    setShieldColor() {
        this.shieldColorFade.setColor(this.hitCompleted, this.texColor)
        this.auraColorFade.setColor(this.hitCompleted, this.shieldAuraColor)
    }

    setShieldHp(hp) {
        this.shieldHp = hp
        if (this.currHp > this.shieldHp) {
            this.currHp = this.shieldHp
        }
        this.shieldPercent = this.currHp / this.shieldHp
        this.game.shieldBar.setPercent(this.shieldPercent)
    }

    lastL = null
    hit(x, y, mass) {
        this.currHp -= mass
        if (this.currHp <= 0) {
            this.currHp = 0
            this.game.scoreKeeper.reset()
            if (this.game.gameState.score.points != 0) {
                this.game.gameState.score.points = 0
                if (this.lastL == null || this.lastL.markedForRemoval) {
                    let t = new ScoreText(this.game, 0.08, this.game.aspect / 2, 0.44)
                    let c1 = new ColorFade([1, 1, 1, 0], [1, 0.39, 0.39, 0.87])
                    let c2 = new ColorFade([1, 0.39, 0.39, 0.87], [1, 1, 1, 0])
                    t.setColorFades(c1, c2)
                    t.addText("Whoops!")
                    t.static = true
                    this.game.textStrings.push(t)
                    this.lastL = t
                }
            }
        }

        this.hitTimer = 0
        this.hitCompleted = 0
        this.shieldColorFade.setColor(this.hitCompleted, this.texColor)
        this.auraColorFade.setColor(this.hitCompleted, this.shieldAuraColor)

        this.shieldArgs[0] = 0.02
        this.shieldArgs[1] = 0.04
        this.shieldArgs[3] = 1

        let xDist = x - this.xPos
        let yDist = y - this.yPos
        let angle = Math.atan2(yDist, xDist)
        this.impactArgs = [angle, angle, 1, 1]
    }
}


