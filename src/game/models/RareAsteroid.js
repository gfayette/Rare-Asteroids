import { Texture } from "../Texture"
import Asteroid from "./Asteroid"

export default class RareAsteroid extends Asteroid {
    lightNum
    color

    angle = 0
    vAngle = 1.6

    setLight(lightNum, radius, i, i2, colorFade) {
        this.lightNum = lightNum
        this.color = colorFade.getColor(0)
        this.colorMask = this.color

        let light = new AsteroidLight(lightNum, radius, i, i2, this, this.game)
        light.colorFade = colorFade
        light.color = this.color
        this.game.lights.push(light)
    }

    setAura() {
        let aura = new Aura(this.width * 8, this.height * 8, this.xPos, this.yPos, this.zPos - 0.1, 'particle', this.game)
        aura.asteroid = this
        aura.set(this.color)
        this.game.particles0.push(aura)
    }

    setOrbiters(num) {
        let inc = Math.PI * 2 / num
        for (let i = 0; i < num; ++i) {
            let orbiter = new Orbiter(this.width, this.height, 0, 0, this.zPos, 'particle', this.game)
            orbiter.asteroid = this
            orbiter.set(inc * i, this.color)
            this.game.particles0.push(orbiter)
        }

        for (let i = 0; i < num; ++i) {
            let orbiter = new Orbiter(this.width, this.height, 0, 0, this.zPos, 'particle', this.game)
            orbiter.asteroid = this
            orbiter.vr *= -1
            orbiter.set(inc * i, this.color)
            this.game.particles0.push(orbiter)
        }
    }
}

class AsteroidLight {
    lightNum
    radius0
    intensity0
    intensity20
    colorFade
    color
    asteroid

    xPos = 0.5
    yPos = 0.5

    vx = 0
    vy = 0

    game

    colorFade
    color

    angle = 0
    vAngle = 1.6
    complete = 1
    elapsedTime = 0
    duration = 1

    markedForRemoval = false

    constructor(lightNum, radius, i, i2, asteroid, g) {
        this.lightNum = lightNum
        this.radius0 = radius * g.heightPx
        this.intensity0 = i
        this.intensity20 = i2
        this.asteroid = asteroid
        this.game = g
    }

    tick(dt) {
        if (this.asteroid.markedForRemoval) {
            this.elapsedTime += dt
            this.complete = 1 - (this.elapsedTime / this.duration)
            if (this.complete < 0) {
                this.complete = 0
                this.markedForRemoval = true
                this.off()
            }
        }

        this.angle += this.vAngle * dt
        let c = (Math.cos(this.angle) + 1) / 2
        this.colorFade.setColor(c, this.color)
        this.setLight(this.color)
    }

    setLight(color) {
        this.game.light[this.lightNum][0][0] = this.asteroid.xPos * 2 - this.game.aspect
        this.game.light[this.lightNum][0][1] = this.asteroid.yPos * -2 + 1
        this.game.light[this.lightNum][0][2] = this.radius0
        this.game.light[this.lightNum][0][3] = this.intensity0 * this.complete

        this.game.light[this.lightNum][1] = color.slice()
        this.game.light[this.lightNum][1][3] = this.intensity20
    }

    off() {
        this.game.light[this.lightNum][0][3] = 0
        this.game.light[this.lightNum][1][3] = 0
    }

}

class Orbiter extends Texture {
    asteroid
    angle = 0
    radius = 0.05
    vr = 4


    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.shaderOp = 1000
    }

    set(angle, color) {
        this.angle = angle
        this.texColor = color
    }

    tick(dt) {
        if (this.asteroid.markedForRemoval) {
            this.markedForRemoval = true
            return
        }

        this.angle += this.vr * dt
        this.xPos = this.asteroid.xPos + this.radius * Math.cos(this.angle)
        this.yPos = this.asteroid.yPos + this.radius * Math.sin(this.angle)
    }

    collideShip(ship, xDist, yDist, r, r2) {

    }

    collideMissile(angle, m) {

    }
}

class Aura extends Texture {
    asteroid

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.shaderOp = 1000
    }

    set(color) {
        this.texColor = color
    }

    tick(dt) {
        if (this.asteroid.markedForRemoval) {
            this.markedForRemoval = true
            this.texColor = [0, 0, 0, 0]
            return
        }

        this.xPos = this.asteroid.xPos
        this.yPos = this.asteroid.yPos
    }

    collideShip(ship, xDist, yDist, r, r2) {

    }

    collideMissile(angle, m) {

    }
}