import AddState from './AddState.js'
import ModelStats from './ModelStats.js'
import SwitchShip from '../effects/SwitchShip.js'
import Warp from '../effects/Warp.js'
import WebGLRenderer from '../../web-gl/WebGLRenderer.js'
import ScoreKeeper from '../ScoreKeeper.js'
import MessageText from '../models/text/MessageText.js'
import ColorFade from '../effects/ColorFade.js'

class ElapsedModel {
    showElapsed = false
    tDiff = 0
    pps = 0
    diff = 0
    score = 0
    oldScore = 0
    timeAway = ""
}

class UpgradeModel {
    currentLevel = 0
    selectedLevel = 0
    maxLevel = 0
    upgradeCost = 0
    points = 0
    canAffordUpgrade = false
    name = ""
}

class ShipModel {
    unlocked = false
    unlockCost = 0
    canAffordUnlock = false
    selected = false
    velocity = 0
    accel = 0
    shieldHp = 0
    name = ''
    description = ''
    imagePath = ''
    agilityUpgrade = new UpgradeModel()
    shieldUpgrade = new UpgradeModel()
    inWarp = false
    isSwitching = false
}

class ProjectileModel {
    unlocked = false
    unlockCost = 0
    canAffordUnlock = false
    active = false
    damage = 0
    interval = 0
    velocity = 0
    mass = 0
    name = ''
    description = ''
    imagePath = ''
    damageUpgrade = new UpgradeModel()
    intervalUpgrade = new UpgradeModel()
    velocityUpgrade = new UpgradeModel()
    inWarp = false
    isSwitching = false
}

class ChargedModel {
    unlocked = false
    unlockCost = 0
    canAffordUnlock = false
    damage = 0
    interval = 0
    name = ''
    description = ''
    imagePath = ''
    damageUpgrade = new UpgradeModel()
    intervalUpgrade = new UpgradeModel()
    inWarp = false
    isSwitching = false
}

class AsteroidModel {
    unlocked = false
    unlockCost = 0
    canAffordUnlock = false
    selected = false
    number = 0
    points = 0
    name = ''
    description = ''
    imagePath = ''
    numberUpgrade = new UpgradeModel()
    pointsUpgrade = new UpgradeModel()
    inWarp = false
    isSwitching = false
}


export default class StateManager {

    game
    stats
    addState

    autoUpgrade
    autoUnlock

    completeSequence = false

    constructor(g) {
        this.game = g
        this.stats = new ModelStats(g)
        this.addState = new AddState(g, this.stats)
    }

    addGameState() {
        this.addState.addGameState()
        for (let i = 1; i < 5; ++i) {
            this.game.setLightIntensity(0, 0, i)
        }
    }

    unlockLevel(index) {
        let model = this.game.gameState.levels[index]
        if (!model.unlocked) {
            model.unlocked = true
        }
    }

    selectLevel(index) {
        if (this.game.mainShip.warp === 1) {

        }
    }

    // Ships
    setShipModel() {
        this.addState.setShipModel()
    }

    loadMainShip() {
        this.addState.loadMainShip()
    }


    getShipData() {
        let shipData = []
        this.game.gameState.ships.forEach((ship, index) => {
            let model = new ShipModel()
            let costs = this.stats.getCosts('ship', index)
            let props = this.stats.getProps('ship', index)
            let points = this.game.gameState.score.points

            model.unlocked = ship.unlocked
            model.unlockCost = ScoreKeeper.formatNum(costs[0])
            model.canAffordUnlock = points >= costs[0]
            model.selected = index === this.game.gameState.ship
            model.velocity = ScoreKeeper.formatNum(props[0])
            model.accel = ScoreKeeper.formatNum(props[1])
            model.shieldHp = ScoreKeeper.formatNum(props[2])
            model.name = props[3]
            model.description = props[4]
            model.imagePath = WebGLRenderer.textureMap['s' + index][1]

            model.agilityUpgrade.currentLevel = ship.accelLC
            model.agilityUpgrade.selectedLevel = ship.accelLS
            model.agilityUpgrade.maxLevel = ship.accelLM
            model.agilityUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[2])
            model.agilityUpgrade.canAffordUpgrade = points >= costs[2]
            model.agilityUpgrade.name = "Agility"

            model.shieldUpgrade.currentLevel = ship.shieldLC
            model.shieldUpgrade.selectedLevel = ship.shieldLS
            model.shieldUpgrade.maxLevel = ship.shieldLM
            model.shieldUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[3])
            model.shieldUpgrade.canAffordUpgrade = points >= costs[3]
            model.shieldUpgrade.name = "Shield"

            model.isSwitching = this.game.mainShip == null ? false : this.game.mainShip.isSwitching
            model.inWarp = this.game.mainShip == null ? false : this.game.mainShip.inWarp

            shipData.push(model)
        })
        return shipData
    }

    getShipImageUrl() {
        return WebGLRenderer.textureMap['s' + this.game.gameState.ship][1]
    }

    selectShip(index) {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp || this.completeSequence) {
            return
        }

        if (this.game.gameState.ships[index].unlocked) {
            this.game.gameState.ship = index
            this.game.setLightIntensity(0, 0, 1)
            this.game.setLightIntensity(0, 0, 2)
            this.game.specialEffect = new SwitchShip(this.game)
        }
    }

    unlockShip(index) {
        let model = this.game.gameState.ships[index]
        let costs = this.stats.getCosts('ship', index)
        if (!model.unlocked && costs[0] <= this.game.gameState.score.points) {
            model.unlocked = true
            this.game.gameState.score.points -= costs[0]
            return index
        } else {
            return -1
        }
    }

    upgradeShipAgility(index, auto = false) {
        let model = this.game.gameState.ships[index]
        let costs = this.stats.getCosts('ship', index)
        if (model.accelLC < model.accelLM && costs[2] <= this.game.gameState.score.points) {
            model.accelLC++
            model.accelLS = model.accelLC
            this.game.gameState.score.points -= costs[2]
            this.addState.setShipModel()
            if (auto) {
                let props = this.stats.getProps('ship', index)
                this.addUpgradeText(props[3], 'Agility', 'L' + model.accelLC)
            }
            return true
        }
    }

    setShipAgility(index, level) {
        let model = this.game.gameState.ships[index]
        if (level <= model.accelLC && level >= 0) {
            model.accelLS = level
            this.addState.setShipModel()
        }
    }

    upgradeShieldHp(index, auto = false) {
        let model = this.game.gameState.ships[index]
        let costs = this.stats.getCosts('ship', index)
        if (model.shieldLC < model.shieldLM && costs[3] <= this.game.gameState.score.points) {
            model.shieldLC++
            model.shieldLS = model.shieldLC
            this.game.gameState.score.points -= costs[3]
            this.addState.setShipModel()
            if (auto) {
                let props = this.stats.getProps('ship', index)
                this.addUpgradeText(props[3], 'Shield', 'L' + model.shieldLC)
            }
            return true
        }
    }

    setShieldHp(index, level) {
        let model = this.game.gameState.ships[index]
        if (level <= model.shieldLC && level >= 0) {
            model.shieldLS = level
            this.addState.setShipModel()
        }
    }



    // Asteroids
    getAsteroidData() {
        let asteroidData = []
        this.game.gameState.asteroids[this.game.gameState.level].forEach((asteroid, index) => {
            let model = new AsteroidModel()
            let costs = this.stats.getCosts('asteroid', index)
            let props = this.stats.getProps('asteroid', index)
            let points = this.game.gameState.score.points

            model.unlocked = asteroid.unlocked
            model.unlockCost = ScoreKeeper.formatNum(costs[0])
            model.canAffordUnlock = points >= costs[0]
            model.selected = index === this.game.gameState.activeAsteroids[this.game.gameState.level]
            model.number = ScoreKeeper.formatNum(props[0])
            model.points = ScoreKeeper.formatNum(props[2])
            model.name = props[5]
            model.description = props[6]
            model.imagePath = WebGLRenderer.textureMap['a' + index + '0'][1]

            model.numberUpgrade.currentLevel = asteroid.numLC
            model.numberUpgrade.selectedLevel = asteroid.numLS
            model.numberUpgrade.maxLevel = asteroid.numLM
            model.numberUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[1])
            model.numberUpgrade.canAffordUpgrade = points >= costs[1]
            model.numberUpgrade.name = "Frequency"

            model.pointsUpgrade.currentLevel = asteroid.pointsLC
            model.pointsUpgrade.selectedLevel = asteroid.pointsLS
            model.pointsUpgrade.maxLevel = asteroid.pointsLM
            model.pointsUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[2])
            model.pointsUpgrade.canAffordUpgrade = points >= costs[2]
            model.pointsUpgrade.name = "Points"

            model.isSwitching = this.game.mainShip == null ? false : this.game.mainShip.isSwitching
            model.inWarp = this.game.mainShip == null ? false : this.game.mainShip.inWarp

            asteroidData.push(model)
        })
        return asteroidData
    }

    getAsteroidImageUrl() {
        return WebGLRenderer.textureMap['a' + this.game.gameState.activeAsteroids[this.game.gameState.level] + '0'][1]
    }

    loadAsteroids() {
        this.addState.loadAsteroids()
    }

    unlockAsteroid(index) {
        let model = this.game.gameState.asteroids[this.game.gameState.level][index]
        let costs = this.stats.getCosts('asteroid', index)
        if (!model.unlocked && costs[0] <= this.game.gameState.score.points) {
            model.unlocked = true
            this.game.gameState.score.points -= costs[0]
            return index
        } else {
            return -1
        }
    }

    selectAsteroid(index) {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp || this.completeSequence) {
            return false
        }

        if (index === this.game.gameState.activeAsteroids[this.game.gameState.level]) {
            return false
        }

        if (this.game.gameState.asteroids[this.game.gameState.level][index].unlocked) {
            this.game.gameState.activeAsteroids[this.game.gameState.level] = index
            let [bgColor, starColorFade] = this.addState.getBgColors(this.game.gameState.level, this.game.gameState.activeAsteroids[this.game.gameState.level])
            this.game.setLightIntensity(0, 0, 1)
            this.game.setLightIntensity(0, 0, 2)
            this.game.specialEffect = new Warp(10, 50, bgColor, starColorFade, this.game)
            return true
        }
        return false
    }

    upgradeAsteroidNumber(index, auto = false) {
        let model = this.game.gameState.asteroids[this.game.gameState.level][index]
        let costs = this.stats.getCosts('asteroid', index)
        if (model.numLC < model.numLM && costs[1] <= this.game.gameState.score.points) {
            model.numLC++
            model.numLS = model.numLC
            this.game.gameState.score.points -= costs[1]
            this.addState.setAsteroidModel(index)
            if (auto) {
                let props = this.stats.getProps('asteroid', index)
                this.addUpgradeText(props[5] + ' Asteroid', 'Frequency', 'L' + model.numLC, false)
            }
            return true
        }
    }

    setAsteroidNumber(index, level) {
        let model = this.game.gameState.asteroids[this.game.gameState.level][index]
        if (level <= model.numLC && level >= 0) {
            model.numLS = level
            this.addState.setAsteroidModel(index)
        }
    }

    upgradeAsteroidPoints(index, auto = false) {
        let model = this.game.gameState.asteroids[this.game.gameState.level][index]
        let costs = this.stats.getCosts('asteroid', index)
        if (model.pointsLC < model.pointsLM && costs[2] <= this.game.gameState.score.points) {
            model.pointsLC++
            model.pointsLS = model.pointsLC
            this.game.gameState.score.points -= costs[2]
            this.addState.setAsteroidModel(index)
            if (auto) {
                let props = this.stats.getProps('asteroid', index)
                this.addUpgradeText(props[5] + ' Asteroid', 'Points', 'L' + model.pointsLC, false)
            }
            return true
        }
    }

    setAsteroidPoints(index, level) {
        let model = this.game.gameState.asteroids[this.game.gameState.level][index]
        if (level <= model.pointsLC && level >= 0) {
            model.pointsLS = level
            this.addState.setAsteroidModel(index)
        }
    }


    // Projectile
    loadProjectiles() {
        this.addState.loadProjectiles()
    }

    getProjectileData() {
        let projectileData = []
        this.game.gameState.projectiles[this.game.gameState.ship].forEach((projectile, index) => {
            let model = new ProjectileModel()
            let costs = this.stats.getCosts('projectile', index)
            let props = this.stats.getProps('projectile', index)
            let points = this.game.gameState.score.points

            model.unlocked = projectile.unlocked
            model.unlockCost = ScoreKeeper.formatNum(costs[0])
            model.canAffordUnlock = points >= costs[0]
            model.active = projectile.active
            model.damage = ScoreKeeper.formatNum(props[0])
            model.interval = ScoreKeeper.formatNum(props[1])
            model.velocity = [ScoreKeeper.formatNum(props[2][0]), ScoreKeeper.formatNum(props[2][1])]
            model.mass = ScoreKeeper.formatNum(props[3])
            model.description = props[4]
            model.name = props[5]
            model.imagePath = WebGLRenderer.textureMap['pi' + this.game.gameState.ship + index][1]

            model.damageUpgrade.currentLevel = projectile.damageLC
            model.damageUpgrade.selectedLevel = projectile.damageLS
            model.damageUpgrade.maxLevel = projectile.damageLM
            model.damageUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[1])
            model.damageUpgrade.canAffordUpgrade = points >= costs[1]
            model.damageUpgrade.name = "Damage"

            model.intervalUpgrade.currentLevel = projectile.intervalLC
            model.intervalUpgrade.selectedLevel = projectile.intervalLS
            model.intervalUpgrade.maxLevel = projectile.intervalLM
            model.intervalUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[2])
            model.intervalUpgrade.canAffordUpgrade = points >= costs[2]
            model.intervalUpgrade.name = "Cooldown"

            model.velocityUpgrade.currentLevel = projectile.velocityLC
            model.velocityUpgrade.selectedLevel = projectile.velocityLS
            model.velocityUpgrade.maxLevel = projectile.velocityLM
            model.velocityUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[3])
            model.velocityUpgrade.canAffordUpgrade = points >= costs[3]
            model.velocityUpgrade.name = "Velocity"

            model.isSwitching = this.game.mainShip == null ? false : this.game.mainShip.isSwitching
            model.inWarp = this.game.mainShip == null ? false : this.game.mainShip.inWarp

            projectileData.push(model)
        })
        return projectileData
    }

    getProjectileImageUrl() {
        return WebGLRenderer.textureMap['pi' + this.game.gameState.ship + '0'][1]
    }


    unlockProjectile(index) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        let costs = this.stats.getCosts('projectile', index)
        if (!model.unlocked && costs[0] <= this.game.gameState.score.points) {
            model.unlocked = true
            this.game.gameState.score.points -= costs[0]
            this.addState.loadNewProjectile(index)
            if (this.autoUnlock) {
                this.activateProjectile(index, true)
                let props = this.stats.getProps('projectile', index)
                this.addUnlockText(props[5])
            }
        }
    }

    activateProjectile(index, active) {
        this.game.gameState.projectiles[this.game.gameState.ship][index].active = active
        this.addState.setProjectileModel(index)
    }

    upgradeProjectileDamage(index, auto = false) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        let costs = this.stats.getCosts('projectile', index)
        if (model.damageLC < model.damageLM && costs[1] <= this.game.gameState.score.points) {
            model.damageLC++
            model.damageLS = model.damageLC
            this.game.gameState.score.points -= costs[1]
            this.addState.setProjectileModel(index)
            if (auto) {
                let props = this.stats.getProps('projectile', index)
                this.addUpgradeText(props[5], 'Damage', 'L' + model.damageLC)
            }
            return true
        }
    }

    setProjectileDamage(index, level) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        if (level <= model.damageLC && level >= 0) {
            model.damageLS = level
            this.addState.setProjectileModel(index)
        }
    }

    upgradeProjectileInterval(index, auto = false) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        let costs = this.stats.getCosts('projectile', index)
        if (model.intervalLC < model.intervalLM && costs[2] <= this.game.gameState.score.points) {
            model.intervalLC++
            model.intervalLS = model.intervalLC
            this.game.gameState.score.points -= costs[2]
            this.addState.setProjectileModel(index)
            if (auto) {
                let props = this.stats.getProps('projectile', index)
                this.addUpgradeText(props[5], 'Cooldown', 'L' + model.intervalLC)
            }
            return true
        }
    }

    setProjectileInterval(index, level) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        if (level <= model.intervalLC && level >= 0) {
            model.intervalLS = level
            this.addState.setProjectileModel(index)
        }
    }

    upgradeProjectileVelocity(index, auto = false) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        let costs = this.stats.getCosts('projectile', index)
        if (model.velocityLC < model.velocityLM && costs[3] <= this.game.gameState.score.points) {
            model.velocityLC++
            model.velocityLS = model.velocityLC
            this.game.gameState.score.points -= costs[3]
            this.addState.setProjectileModel(index)
            if (auto) {
                let props = this.stats.getProps('projectile', index)
                this.addUpgradeText(props[5], 'Velocity', 'L' + model.velocityLC)
            }
            return true
        }
    }

    setProjectileVelocity(index, level) {
        let model = this.game.gameState.projectiles[this.game.gameState.ship][index]
        if (level <= model.velocityLC && level >= 0) {
            model.velocityLS = level
            this.addState.setProjectileModel(index)
        }
    }

    // Effect
    loadEffect() {
        this.addState.loadEffect()
    }

    getChargedData() {
        let chargedWeapon = this.game.gameState.chargedWeapons[this.game.gameState.ship]

        let model = new ChargedModel()
        let costs = this.stats.getCosts('charged', this.game.gameState.ship)
        let props = this.stats.getProps('charged', this.game.gameState.ship)
        let points = this.game.gameState.score.points

        model.unlocked = chargedWeapon.unlocked
        model.unlockCost = ScoreKeeper.formatNum(costs[0])
        model.canAffordUnlock = points >= costs[0]
        model.damage = ScoreKeeper.formatNum(props[0])
        model.interval = ScoreKeeper.formatNum(props[2])
        model.description = props[3]
        model.name = props[4]

        model.imagePath = WebGLRenderer.textureMap['cw' + this.game.gameState.ship][1]

        model.damageUpgrade.currentLevel = chargedWeapon.damageLC
        model.damageUpgrade.selectedLevel = chargedWeapon.damageLS
        model.damageUpgrade.maxLevel = chargedWeapon.damageLM
        model.damageUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[1])
        model.damageUpgrade.canAffordUpgrade = points >= costs[1]
        model.damageUpgrade.name = "Damage"

        model.intervalUpgrade.currentLevel = chargedWeapon.intervalLC
        model.intervalUpgrade.selectedLevel = chargedWeapon.intervalLS
        model.intervalUpgrade.maxLevel = chargedWeapon.intervalLM
        model.intervalUpgrade.upgradeCost = ScoreKeeper.formatNum(costs[2])
        model.intervalUpgrade.canAffordUpgrade = points >= costs[2]
        model.intervalUpgrade.name = "Recharge"

        model.isSwitching = this.game.mainShip == null ? false : this.game.mainShip.isSwitching
        model.inWarp = this.game.mainShip == null ? false : this.game.mainShip.inWarp

        return model
    }

    getChargedImageUrl() {
        return WebGLRenderer.textureMap['cw' + this.game.gameState.ship][1]
    }

    unlockCharged() {
        let model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
        let costs = this.stats.getCosts('charged', this.game.gameState.ship)
        if (!model.unlocked && costs[0] <= this.game.gameState.score.points) {
            model.unlocked = true
            this.game.gameState.score.points -= costs[0]
            this.addState.loadEffect()
            if (this.autoUnlock) {
                let props = this.stats.getProps('charged', this.game.gameState.ship)
                this.addUnlockText(props[4])
            }
        }
    }

    upgradeChargedDamage(auto = false) {
        let model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
        let costs = this.stats.getCosts('charged', this.game.gameState.ship)
        if (model.damageLC < model.damageLM && costs[1] <= this.game.gameState.score.points) {
            model.damageLC++
            model.damageLS = model.damageLC
            this.game.gameState.score.points -= costs[1]
            this.addState.setEffectModel()
            if (auto) {
                let props = this.stats.getProps('charged', this.game.gameState.ship)
                this.addUpgradeText(props[4], 'Damage', 'L' + model.damageLC)
            }
            return true
        }
    }

    setChargedDamage(level) {
        let model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
        if (level <= model.damageLC && level >= 0) {
            model.damageLS = level
            this.addState.setEffectModel()
        }
    }

    upgradeChargedInterval(auto = false) {
        let model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
        let costs = this.stats.getCosts('charged', this.game.gameState.ship)
        if (model.intervalLC < model.intervalLM && costs[2] <= this.game.gameState.score.points) {
            model.intervalLC++
            model.intervalLS = model.intervalLC
            this.game.gameState.score.points -= costs[2]
            this.addState.setEffectModel()
            if (auto) {
                let props = this.stats.getProps('charged', this.game.gameState.ship)
                this.addUpgradeText(props[4], 'Recharge', 'L' + model.intervalLC)
            }
            return true
        }
    }

    setChargedInterval(level) {
        let model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
        if (level <= model.intervalLC && level >= 0) {
            model.intervalLS = level
            this.addState.setEffectModel()
        }
    }


    // Upgrade available
    getShipUpgrade() {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp) {
            return false
        }

        if (this.autoUpgrade) {
            this.upgradeShipAgility(this.game.gameState.ship, this.autoUpgrade)
            this.upgradeShieldHp(this.game.gameState.ship, this.autoUpgrade)
        }

        if (this.autoUnlock) {
            this.game.gameState.ships.forEach((_, index) => {
                let s = this.unlockShip(index)
                if (s != -1) {
                    this.selectShip(s)
                }
            })
        }

        if (this.autoUnlock && this.autoUpgrade) {
            return false
        } else {
            return this.game.gameState.ships.some((ship, index) => {
                let costs = this.stats.getCosts('ship', index)
                let points = this.game.gameState.score.points
                if (!ship.unlocked) {
                    if (this.autoUnlock) {
                        return false
                    } else {
                        return points >= costs[0]
                    }
                } else {
                    if (this.autoUpgrade) {
                        return false
                    } else {
                        if (index === this.game.gameState.ship) {
                            return (ship.accelLC != ship.accelLM && points >= costs[2]) ||
                                (ship.shieldLC != ship.shieldLM && points >= costs[3])
                        } else {
                            return false
                        }
                    }
                }
            })
        }
    }

    getAsteroidUpgrade() {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp) {
            return false
        }

        if (this.autoUpgrade) {
            this.upgradeAsteroidPoints(this.game.gameState.activeAsteroids[this.game.gameState.level], this.autoUpgrade)
            this.upgradeAsteroidNumber(this.game.gameState.activeAsteroids[this.game.gameState.level], this.autoUpgrade)
        }

        if (this.autoUnlock) {
            this.game.gameState.asteroids[this.game.gameState.level].forEach((_, index) => {
                let a = this.unlockAsteroid(index)
                if (a != -1) {
                    this.selectAsteroid(a)
                }
            })
        }

        if (this.autoUnlock && this.autoUpgrade) {
            return false
        } else {
            return this.game.gameState.asteroids[this.game.gameState.level].some((asteroid, index) => {
                let costs = this.stats.getCosts('asteroid', index)
                let points = this.game.gameState.score.points
                if (!asteroid.unlocked) {
                    if (this.autoUnlock) {
                        return false
                    } else {
                        return points >= costs[0]
                    }
                } else {
                    if (this.autoUpgrade) {
                        return false
                    } else {
                        if (index === this.game.gameState.activeAsteroids[this.game.gameState.level]) {
                            return (asteroid.numLC != asteroid.numLM && points >= costs[1]) ||
                                (asteroid.pointsLC != asteroid.pointsLM && points >= costs[2])

                        } else {
                            return false
                        }
                    }
                }
            })
        }
    }

    getProjectileUpgrade() {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp) {
            return false
        }

        if (this.autoUnlock) {
            this.game.gameState.projectiles[this.game.gameState.ship].forEach((_, index) => {
                this.unlockProjectile(index, true)
            })
        }

        if (this.autoUpgrade) {
            this.game.gameState.projectiles[this.game.gameState.ship].forEach((projectile, index) => {
                if (projectile.unlocked && projectile.active) {
                    this.upgradeProjectileDamage(index, this.autoUpgrade)
                    this.upgradeProjectileInterval(index, this.autoUpgrade)
                    this.upgradeProjectileVelocity(index, this.autoUpgrade)
                }
            })
        }

        if (this.autoUnlock && this.autoUpgrade) {
            return false
        } else {
            return this.game.gameState.projectiles[this.game.gameState.ship].some((projectile, index) => {
                let costs = this.stats.getCosts('projectile', index)
                let points = this.game.gameState.score.points
                if (!projectile.unlocked) {
                    if (this.autoUnlock) {
                        return false
                    } else {
                        return points >= costs[0]
                    }
                } else {
                    if (this.autoUpgrade) {
                        return false
                    } else {
                        if (projectile.active) {
                            return (projectile.damageLC != projectile.damageLM && points >= costs[1]) ||
                                (projectile.intervalLC != projectile.intervalLM && points >= costs[2]) ||
                                (projectile.velocityLC != projectile.velocityLM && points >= costs[3])
                        } else {
                            return false
                        }
                    }
                }
            })
        }
    }

    getChargedUpgrade() {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp) {
            return false
        }

        if (this.autoUnlock) {
            this.unlockCharged(true)
        }

        if (this.autoUpgrade) {
            let chargedWeapon = this.game.gameState.chargedWeapons[this.game.gameState.ship]
            if (chargedWeapon.unlocked) {
                this.upgradeChargedInterval(this.autoUpgrade)
                this.upgradeChargedDamage(this.autoUpgrade)
            }
        }

        if (this.autoUnlock && this.autoUpgrade) {
            return false
        } else {
            let chargedWeapon = this.game.gameState.chargedWeapons[this.game.gameState.ship]
            let costs = this.stats.getCosts('charged', this.game.gameState.ship)
            let points = this.game.gameState.score.points
            if (!chargedWeapon.unlocked) {
                if (this.autoUnlock) {
                    return false
                } else {
                    return points >= costs[0]
                }
            } else {
                if (this.autoUpgrade) {
                    return false
                } else {
                    return (chargedWeapon.damageLC !== chargedWeapon.damageLM && points >= costs[1]) ||
                        (chargedWeapon.intervalLC !== chargedWeapon.intervalLM && points >= costs[2])
                }
            }
        }
    }


    checkEndGame() {
        if (this.game.mainShip.isSwitching || this.game.mainShip.inWarp) {
            return
        }

        if (this.game.gameState.score.points > 2e30 && !this.game.gameState.completed) {
            if (this.game.messageQueue.length == 0 && (this.game.currentMessage == null || this.game.currentMessage.markedForRemoval)) {
                this.game.gameState.completed = true
                this.completeSequence = true
                this.game.controlsLocked = true
                this.game.asteroidAdder = null
                this.game.mainShip.projectileAdders = []
                this.game.asteroids.forEach(a => {
                    a.explodeProjectile()
                })
                this.game.projectiles.forEach(p => {
                    p.explode()
                })
                this.addEndGameText()
                setTimeout(() => this.resume(), 9000)
            }
        }
    }

    resume() {
        this.loadAsteroids()
        this.loadProjectiles()
        this.completeSequence = false
        this.game.controlsLocked = false
    }

    addEndGameText() {
        let m = new MessageText(this.game, 0.072, 0.5, 0.36)
        m.align = 'center'
        m.setColorFades(this.getAsteroidUpgradeTextColors())
        m.addText('{Congratulations!}')
        m.setDuration(4, 0.4)
        this.game.messageQueue.push(m)

        m = new MessageText(this.game, 0.072, 0.5, 0.36)
        m.align = 'center'
        m.setColorFades(this.getAsteroidUpgradeTextColors())
        m.addText('{you pretty much}\n{beat the game}')
        m.setDuration(4, 0.4)
        this.game.messageQueue.push(m)
    }

    addUpgradeText(subject, name, level, shipUpgrade = true) {
        let m = new MessageText(this.game, 0.04, 0.5, 0.22)
        m.align = 'center'
        m.setColorFades(shipUpgrade ? this.getShipUpgradeTextColors() : this.getAsteroidUpgradeTextColors())
        m.addText('{Auto Upgrade}\n{' + subject + '}\n{' + name + ' ' + level + '}')
        m.setDuration(2.4, 0.4)
        this.game.messageQueue.push(m)
    }

    addUnlockText(subject) {
        let m = new MessageText(this.game, 0.055, 0.5, 0.25)
        m.align = 'center'
        m.setColorFades(this.getShipUpgradeTextColors())
        m.addText('{Auto Unlock}\n{' + subject + '}')
        m.setDuration(4, 0.4)
        this.game.messageQueue.push(m)
    }

    addLevelText() {
        let m = new MessageText(this.game, 0.128, 0.5, 0.36)
        m.align = 'center'
        m.setColorFades(this.getAsteroidUpgradeTextColors())
        let level = this.game.gameState.activeAsteroids[this.game.gameState.level] + 1
        m.addText('{Level ' + level + '}')
        m.setDuration(4, 0.4)
        this.game.messageQueue.push(m)
    }

    addShipText() {
        let m = new MessageText(this.game, 0.128, 0.5, 0.36)
        m.align = 'center'
        m.setColorFades(this.getShipUpgradeTextColors())
        let props = this.stats.getProps('ship', this.game.gameState.ship)
        m.addText('{' + props[3] + '}')
        m.setDuration(4, 0.4)
        this.game.messageQueue.push(m)
    }

    getShipUpgradeTextColors() {
        let colorFade
        let colorFadeG
        let bgColorFade

        switch (this.game.gameState.ship) {
            case 0:
                colorFade = new ColorFade([0.8, 0.5, 0.2, 1], [1, 0.92, 0.78, 1])
                colorFadeG = new ColorFade([0.8, 0.5, 0.2, 1], [1, 0.92, 0.78, 1])
                bgColorFade = new ColorFade([0.16, 0.1, 0.04, 1], [0.2, 0.12, 0.08, 1])
                break
            case 1:
                colorFade = new ColorFade([0.499, 0.4, 0.99, 1], [0.7, 0.749, 0.99, 1])
                colorFadeG = new ColorFade([0.499, 0.4, 0.99, 1], [0.7, 0.749, 0.99, 1])
                bgColorFade = new ColorFade([0.1, 0.08, 0.2, 1], [0.14, 0.15, 0.2, 1])
                break
        }
        return [colorFade, colorFadeG, bgColorFade]
    }

    getAsteroidUpgradeTextColors() {
        let colorFade
        let colorFadeG
        let bgColorFade

        switch (this.game.gameState.activeAsteroids[this.game.gameState.level]) {
            case 0:
                colorFade = new ColorFade([0.2, 0.8, 1, 1], [0.7, 0.9, 1, 1])
                colorFadeG = new ColorFade([0.2, 0.8, 1, 1], [0.7, 0.9, 1, 1])
                bgColorFade = new ColorFade([0.1, 0.2, 0.2, 1], [0.1, 0.16, 0.3, 1])
                break
            case 1:
                colorFade = new ColorFade([0.8, 0.4, 0.2, 1], [1, 0.92, 0.78, 1])
                colorFadeG = new ColorFade([0.8, 0.4, 0.2, 1], [1, 0.92, 0.78, 1])
                bgColorFade = new ColorFade([0.16, 0.08, 0.04, 1], [0.2, 0.12, 0.08, 1])
                break
            case 2:
                colorFade = new ColorFade([0.58, 0.96, 0.99, 1], [0.79, 0.98, 1, 1])
                colorFadeG = new ColorFade([0.58, 0.96, 0.99, 1], [0.79, 0.98, 1, 1])
                bgColorFade = new ColorFade([0.116, 0.192, 0.198, 1], [0.158, 0.196, 0.2, 1])
                break
            case 3:
                colorFade = new ColorFade([0.8, 0.3, 0.7, 1], [0.74, 0.7149, 0.99, 1])
                colorFadeG = new ColorFade([0.8, 0.3, 0.7, 1], [0.74, 0.7149, 0.99, 1])
                bgColorFade = new ColorFade([0.2, 0.06, 0.14, 1], [0.15, 0.14, 0.2, 1])
                break
        }
        return [colorFade, colorFadeG, bgColorFade]
    }

    // Dashboard
    getDashboardData() {
        return this.game.scoreKeeper.getScoreData()
    }

    secondsToDate(seconds) {
        seconds = Number(seconds)
        var d = Math.floor(seconds / (3600 * 24))
        var h = Math.floor(seconds % (3600 * 24) / 3600)
        var m = Math.floor(seconds % 3600 / 60)
        var s = Math.floor(seconds % 60)

        var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : ""
        var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : ""
        var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : ""
        var sDisplay = s + (s === 1 ? " second" : " seconds")
        return dDisplay + hDisplay + mDisplay + sDisplay
    }

    getElapsedData() {
        let gameState = this.game.gameState
        if (gameState.type === 'title') {
            return new ElapsedModel()
        }

        let st = gameState.saveTime
        if (st < 0) {
            return new ElapsedModel()
        }

        let tDiff = (new Date().getTime() - st) / 1000
        if (tDiff < 2) {
            return new ElapsedModel()
        }

        let pps = gameState.score.pd * 0.01
        let score = gameState.score.points
        let diff = Math.floor(tDiff * pps)
        if (diff < 1) {
            return new ElapsedModel()
        }

        let props = this.stats.getProps('asteroid', this.game.gameState.activeAsteroids[this.game.gameState.level])
        let limit = props[2] * 100
        if (diff > limit && !gameState.completed) {
            diff = limit
        }

        let newScore = score + diff

        let elapsed = new ElapsedModel()
        elapsed.showElapsed = true
        elapsed.tDiff = tDiff
        elapsed.pps = pps
        elapsed.diff = diff
        elapsed.oldScore = score
        elapsed.newScore = newScore
        elapsed.timeAway = this.secondsToDate(tDiff)

        return elapsed
    }

    addElapsed() {
        let gameState = this.game.gameState
        let st = gameState.saveTime
        let tDiff = (new Date().getTime() - st) / 1000

        let pps = gameState.score.pd * 0.01
        let score = gameState.score.points
        let diff = Math.floor(tDiff * pps)
        let props = this.stats.getProps('asteroid', this.game.gameState.activeAsteroids[this.game.gameState.level])
        let limit = props[2] * 100
        if (diff > limit) {
            diff = limit
        }
        let newScore = score + diff

        gameState.score.pd = 0
        gameState.score.points = newScore
    }
}