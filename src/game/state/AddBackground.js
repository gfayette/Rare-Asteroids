import Star from '../models/Star.js'
import BackgroundImage from '../models/BackgroundImage.js'
import ColorFade from '../effects/ColorFade.js'

class AddBackgroundModel {
    zMin
    zMax
    zBg
    size
    num
    bgTexId0
    bgTexId1
    bgAspect
    bgColorMask
    starColorFade
    texId
}

class AddBackground {
    name
    game

    model
    scaledModel

    fadeTimer = -1
    fadeTime = 1

    bgColorFade
    previousStarColorFade

    fadeComplete = 0

    constructor(g, bgModel) {
        this.name = "background"
        this.game = g
        this.model = bgModel
        this.scaleModel()
        this.reset()
    }

    scaleModel() {
        let sModel = JSON.parse(JSON.stringify(this.model))
        let m = this.game.vScale

        sModel.num /= m * m
        sModel.size *= m

        this.scaledModel = sModel
    }

    resize() {
        this.scaleModel()
    }


    tick(dt) {
        while (this.game.backgrounds.length < Math.ceil(this.scaledModel.num * this.game.aspect)) {
            this.addTick()
        }

        if (this.fadeTimer !== -1) {
            this.fadeTimer += dt
            this.fadeComplete = this.fadeTimer / this.fadeTime
            if (this.fadeComplete > 1) {
                this.fadeComplete = 1
                this.fadeTimer = -1
            }

            this.bgColorFade.setColor(this.fadeComplete, this.model.bgColorMask)

            this.game.backgroundImages.forEach(bg => {
                this.bgColorFade.setColor(this.fadeComplete, bg.colorMask)
            })

            this.game.backgrounds.forEach(star => {
                star.setFade(this.fadeComplete)
            })
        }
    }

    startFade(bgColor, starColorFade, time) {
        this.bgColorFade = new ColorFade(this.model.bgColorMask, bgColor)
        this.previousStarColorFade = this.model.starColorFade
        this.model.starColorFade = starColorFade
        this.model.bgColorMask = this.bgColorFade.getColor(0)

        this.game.backgrounds.forEach(star => {
            star.startFade(this.model.starColorFade.getColor(Math.random()))
        })

        this.fadeTime = time
        this.fadeTimer = 0
    }

    reset() {
        this.game.backgrounds = []
        let wh = this.game.width > this.game.height ? this.game.width : this.game.height
        let d = this.game.aspect > 1 ? this.game.aspect : 1
        let bg0 = new BackgroundImage(wh, wh / this.model.bgAspect, this.game.width / 2, 0.5 - d, -10, this.model.bgTexId0, this.game)
        let bg1 = new BackgroundImage(wh, wh / this.model.bgAspect, this.game.width / 2, 0.5, -10, this.model.bgTexId1, this.game)
        bg0.colorMask = this.model.bgColorMask.slice()
        bg1.colorMask = this.model.bgColorMask.slice()
        bg0.dist = this.model.zBg
        bg1.dist = this.model.zBg
        this.game.backgroundImages = [bg0, bg1]

        while (this.game.backgrounds.length < Math.ceil(this.scaledModel.num * this.game.aspect)) {
            this.addReset()
        }
    }

    addTick() {
        let x = Math.random()
        let z = Math.random()

        let minCutoff = this.model.zMin / this.model.zMax
        if (x < minCutoff) {
            this.addStar(true, z)
        } else {
            let cutLen = 1 - minCutoff
            let xCutoff = (x - minCutoff) / cutLen
            if (z > xCutoff) {
                this.addStar(true, z)
            }
        }
    }

    addReset() {
        let x = Math.random()
        let y = Math.random()
        let z = Math.random()

        let minCutoff = this.model.zMin / this.model.zMax
        if (x < minCutoff && y < minCutoff) {
            this.addStar(false, z)
        } else {
            let cutLen = 1 - minCutoff
            let xCutoff = (x - minCutoff) / cutLen
            let yCutoff = (y - minCutoff) / cutLen
            if (z > xCutoff && z > yCutoff) {
                this.addStar(false, z)
            }
        }
    }

    addStar(top, z) {
        let x = Math.random() * this.game.width
        let y = top ? -0.1 : Math.random() * 1.2 - 0.1
        let zDist = this.model.zMin + z * (this.model.zMax - this.model.zMin)
        let w = this.scaledModel.size / zDist
        let star = new Star(w, w, x, y, -2 - z, this.model.texId, this.game)
        star.dist = zDist
        star.rotation = Math.random() * 6.28

        if (this.fadeTimer !== -1) {
            star.texColor = this.previousStarColorFade.getColor(Math.random())
            star.startFade(this.model.starColorFade.getColor(Math.random()))
            star.setFade(this.fadeComplete)
        } else {
            star.texColor = this.model.starColorFade.getColor(Math.random())
        }
        
        this.game.backgrounds.push(star)
    }
}

export { AddBackgroundModel, AddBackground }
