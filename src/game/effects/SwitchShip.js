export default class SwitchShip {

    game
    running = false
    stage

    duration1 = 1.2
    elapsedTime = 0
    elapsedTime2 = 0

    startComplete = 0

    markedForRemoval = false

    mag = 0.007

    xPx
    yPx

    constructor(g) {
        this.game = g
        this.reset()
        this.start()
    }

    start() {
        this.game.controlsLocked = true
        this.game.stopMoveShip()
        this.game.asteroidAdder = null
        this.game.mainShip.projectileAdders = []
        this.stage = 0
        this.game.mainShip.vy = 0
        this.game.mainShip.isSwitching = true
    }

    stop() {
        this.game.mainShip.vy = 0
        this.markedForRemoval = true
        this.game.messageQueue = []
        this.game.mainShip.isSwitching = false
        this.game.stateManager.loadAsteroids()
        this.game.stateManager.loadEffect()
        this.game.stateManager.loadProjectiles()
        this.game.stateManager.addShipText()
        this.game.controlsLocked = false
    }

    reset() {
        this.xPx = this.game.mainShip.xPos * this.game.pxRatio
        this.yPx = (1 - this.game.mainShip.yPos) * this.game.pxRatio
    }

    click(x, y) {

    }

    tick(dt) {
        if (this.stage === 0) {
            this.elapsedTime += dt
            let complete = this.elapsedTime / this.duration1
            let r = this.game.aspect > 1 ? this.game.aspect : 1
            this.startComplete = complete

            this.game.asteroids.forEach(a => {
                let xDist = a.xPos - this.game.mainShip.xPos
                let yDist = a.yPos - this.game.mainShip.yPos
                let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                if (hy < complete) {
                    let angle = Math.atan2(xDist, yDist)
                    a.explodeWarp(angle)
                }
            })

            this.game.projectiles.forEach(p => {
                let xDist = p.xPos - this.game.mainShip.xPos
                let yDist = p.yPos - this.game.mainShip.yPos
                let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                if (hy < complete) {
                    let angle = Math.atan2(xDist, yDist)
                    p.explodeWarp(angle)
                }
            })

            if (complete > 1.4 * r) {
                this.game.asteroids.forEach(a => {
                    a.explodeWarp(null)
                })
                this.game.projectiles.forEach(p => {
                    p.explodeWarp(null)
                })
                this.stage = 1
            }
        } else if (this.stage === 1) {
            this.game.mainShip.vy -= 0.48 * dt * this.game.vScale
            if (this.game.mainShip.yPos < -0.4) {
                let speed = this.game.mainShip.speed
                let warp = this.game.mainShip.warp
                this.game.stateManager.loadMainShip()
                this.game.effectBar.fillColor[3] = 0
                this.game.mainShip.isSwitching = true
                this.game.mainShip.speed = speed
                this.game.mainShip.warp = warp
                this.game.mainShip.yPos = 1.4
                this.game.mainShip.add = false
                this.stage = 2
            }
        } else if (this.stage === 2) {
            this.game.mainShip.vy = (0.799 - this.game.mainShip.yPos) * 1.6
            if (this.game.mainShip.yPos <= 0.8) {
                this.stage = 3
            }
        } else {
            this.game.mainShip.vy *= 0.92
            if (this.game.mainShip.vy > -0.0001) {
                this.stop()
            }
        }
    }

    tickAfter(dt) {

    }

    getEffectArgs() {
        let cPx = this.startComplete * this.game.pxRatio
        let width = 0.7 * this.game.pxRatio
        let args = [[this.xPx, this.yPx, cPx, width], [this.mag, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0]]
        return args
    }
}