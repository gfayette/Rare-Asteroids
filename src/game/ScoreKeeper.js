
class ScoreData {
    points
    pointsSec
    maxPointsSec
    asteroidHpSec
    damageSec
    dps
}

export default class ScoreKeeper {

    pointsSec = 0
    maxPointsSec = 0
    asteroidHpSec = 0
    damageSec = 0

    pointsRing
    maxPointsRing
    asteroidHpRing
    damageRing

    pi = 0
    mpi = 0
    hpi = 0
    di = 0

    addP = 0
    maxPs = 0
    addHp = 0
    addD = 0

    elapsedTime = 0

    game

    constructor(g) {
        this.game = g
    }


    setPoints() {
        this.pointsRing[this.pi] = this.addP / this.elapsedTime
        this.pi = ++this.pi % this.pointsRing.length
        this.addP = 0

        let total = 0
        this.pointsRing.forEach(a => {
            total += a
        })

        let ps = total / this.pointsRing.length
        if (ps > this.maxPs) {
            this.maxPs = ps
            if (ps > this.maxPointsSec) {
                this.maxPointsSec = ps
                this.game.gameState.score.pd = ps
            }
        }

        if (this.pi === 0) {
            this.setMaxPoints()
        }

        this.pointsSec = ps
    }

    setMaxPoints() {
        this.maxPointsRing[this.mpi] = this.maxPs
        this.mpi = ++this.mpi % this.maxPointsRing.length

        let max = 0
        this.maxPointsRing.forEach(a => {
            if (a > max) {
                max = a
            }
        })
        this.maxPs = 0
        this.maxPointsSec = max
        this.game.gameState.score.pd = max
    }

    setAsteroidHp() {
        this.asteroidHpRing[this.hpi] = this.addHp / this.elapsedTime
        this.hpi = ++this.hpi % this.asteroidHpRing.length
        this.addHp = 0

        let total = 0
        this.asteroidHpRing.forEach(a => {
            total += a
        })
        this.asteroidHpSec = total / this.asteroidHpRing.length
    }

    setDamage() {
        this.damageRing[this.di] = this.addD / this.elapsedTime
        this.di = ++this.di % this.damageRing.length
        this.addD = 0

        let total = 0
        this.damageRing.forEach(a => {
            total += a
        })
        this.damageSec = total / this.pointsRing.length
    }

    getDps() {
        let dps = 0
        this.game.mainShip.projectileAdders.forEach((a) => {
            if (a.model.active) {
                dps += a.model.hp / a.model.interval
            }
        })
        return dps
    }

    reset() {
        this.pointsSec = 0
        this.maxPointsSec = 0
        this.asteroidHpSec = 0
        this.damageSec = 0

        this.pointsRing = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]
        this.maxPointsRing = [
            0, 0, 0, 0,
        ]
        this.asteroidHpRing = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]
        this.damageRing = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]

        this.addP = 0
        this.maxPs = 0
        this.addHp = 0
        this.addD = 0

        this.elapsedTime = 0
    }

    tick(dt) {
        this.elapsedTime += dt
        if (this.elapsedTime >= 0.1) {
            this.setPoints()
            this.setAsteroidHp()
            this.setDamage()
            this.elapsedTime = 0
        }
    }

    addScore(score) {
        this.addP += score
        this.game.gameState.score.points += score
    }

    addAsteroidHp(hp) {
        this.addHp += hp
    }

    addDamage(damage) {
        this.addD += damage
    }

    getScoreData() {
        let sd = new ScoreData()
        sd.points = ScoreKeeper.formatNum(this.game.gameState.score.points)
        sd.pointsSec = ScoreKeeper.formatNum(this.pointsSec)
        sd.maxPointsSec = ScoreKeeper.formatNum(this.game.gameState.score.pd)
        sd.asteroidHpSec = ScoreKeeper.formatNum(this.asteroidHpSec)
        sd.damageSec = ScoreKeeper.formatNum(this.damageSec)
        sd.dps = ScoreKeeper.formatNum(this.getDps())
        return sd
    }

    static formatNum(num) {
        let [base, exponent] = num.toExponential().split('e')
        let k = Math.floor(exponent / 3)

        if (k < 0) {
            return num.toFixed(1)
        } else if (k < 1) {
            if (exponent === 0) {
                return num.toFixed(1)
            } else {
                return num.toFixed(0)
            }
        } else if (k <= 6) {
            let nl = {
                1: 'k',
                2: 'm',
                3: 'b',
                4: 't',
                5: 'qd',
                6: 'qt',
            }
            let m = Math.pow(10, exponent - k * 3)
            let n = (m * base).toFixed(k * 3 + 2 - exponent)
            return n + nl[k]
        } else {
            return parseFloat(base).toFixed(1) + 'e' + parseFloat(exponent).toLocaleString()
        }


    }
}