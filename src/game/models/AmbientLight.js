

export default class AmbientLight {
    lightNum
    dist
    radius
    intensity
    intensity2
    color

    xPos = 0.5
    yPos = 0.5

    vx = 0
    vy = 0

    game

    //resize()
    //combine with light in game

    constructor(n, d, r, i, i2, c, g) {
        this.lightNum = n
        this.dist = d
        this.radius = r
        this.intensity = i
        this.intensity2 = i2
        this.color = c.slice()
        this.game = g
    }

    setLight() {
        this.game.light[this.lightNum][0][0] = this.xPos * 2 - this.game.aspect
        this.game.light[this.lightNum][0][1] = this.yPos * -2 + 1
        this.game.light[this.lightNum][0][2] = this.radius * this.game.heightPx
        this.game.light[this.lightNum][0][3] = this.intensity

        this.game.light[this.lightNum][1] = this.color
        this.game.light[this.lightNum][1][3] = this.intensity2
    }

    tick(dt) {
        this.yPos += this.game.vScroll / this.dist * dt
        if (this.yPos > 2) {
            this.yPos = -1
            this.xPos = Math.random() * (this.game.width + 0.4) - 0.2
        }

        this.setLight()
    }
}