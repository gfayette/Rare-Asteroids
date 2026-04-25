import { Texture } from '../Texture'

export default class ScreenFragment extends Texture {
    vx = 0
    vy = 0
    vr = 0

    elapsedTime
    lifespan

    // shader data
    effectData1 = [0, 0, 0, 0]
    effectData2 = [0, 0, 0, 0]
    effectData3 = [0, 0, 0, 0]
    effectData4 = [0, 0, 0, 0]

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)

        this.lifespan = -1
        this.elapsedTime = 0
        this.textureId = 'frameBuffer'
        this.shaderOp = 4200
    }

    tick(dt) {
        this.elapsedTime += dt
        this.xPos += this.vx * dt
        this.yPos += this.vy * dt
        this.rotation += this.vr * dt


        if (this.yPos > 1.1 || this.yPos < -0.1) {
            this.vy *= -1
        }

        if (this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.vx *= -1
        }

        if (this.lifespan !== -1 && this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
            return
        }

        let effectData = this.game.specialEffect.getEffectArgs()
        this.effectData1 = effectData[0]
        this.effectData2 = effectData[1]
        this.effectData3 = effectData[2]
        this.effectData4 = effectData[3]
    }
}