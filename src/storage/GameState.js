class ShipState {
    unlocked = false

    accelLM = 4 // max level
    accelLC = 0 // highest level unlocked
    accelLS = 0 // level setting

    shieldLM = 4
    shieldLC = 0
    shieldLS = 0
}

class AsteroidState {
    unlocked = false

    numLM = 5
    numLC = 0
    numLS = 0

    pointsLM = 5
    pointsLC = 0
    pointsLS = 0
}

class LevelState {
    unlocked = false
}

class ProjectileState {

    unlocked = false
    active = false

    damageLM = 2
    damageLC = 0
    damageLS = 0

    intervalLM = 2
    intervalLC = 0
    intervalLS = 0

    velocityLM = 2
    velocityLC = 0
    velocityLS = 0

    constructor(iv = 1, d = 1) {
        this.damageLM *= d
        this.intervalLM *= iv
        this.velocityLM *= iv
    }
}

class ChargeWeaponState {
    unlocked = false

    damageLM = 2
    damageLC = 0
    damageLS = 0

    intervalLM = 2
    intervalLC = 0
    intervalLS = 0
}

class ScoreState {
    points = 1
    pd = 0
}

export default class GameState {
    saveTime = -1
    score = new ScoreState()

    type = "game"
    started = false
    completed = false
    ship = 0
    level = 0
    zoom = 1.6
    timeWarp = 1
    pace = 1
    autoUpgrade = true
    autoUnlock = true
    activeAsteroids = [0, 0]

    ships = [new ShipState(), new ShipState()]
    projectiles = [[new ProjectileState(2, 2), new ProjectileState(1.5, 1.5), new ProjectileState()], [new ProjectileState(2, 2.5), new ProjectileState(2, 2.5)]]
    levels = [new LevelState(), new LevelState()]
    chargedWeapons = [new ChargeWeaponState(), new ChargeWeaponState()]
    asteroids = [[new AsteroidState(), new AsteroidState(), new AsteroidState(), new AsteroidState()], [new AsteroidState(), new AsteroidState()]]

    constructor() {
        this.ships[0].unlocked = true

        this.projectiles[0][0].unlocked = true
        this.projectiles[1][0].unlocked = true
        this.projectiles[0][0].active = true
        this.projectiles[1][0].active = true

        this.levels[0].unlocked = true

        this.asteroids[0][0].unlocked = true
        
        /*
        this.asteroids[0][1].unlocked = true
        this.asteroids[0][2].unlocked = true
        this.asteroids[0][3].unlocked = true

        this.asteroids[0][3].numLC = 5
        this.asteroids[0][3].numLS = 5
        this.asteroids[0][3].pointsLC = 5
        this.asteroids[0][3].pointsLS = 5

        this.ships[1].unlocked = true
        this.ships[1].accelLC = 4
        this.ships[1].accelLS = 4
        this.ships[1].shieldLC = 4
        this.ships[1].shieldLS = 4

        this.projectiles[1][1].unlocked = true
        this.projectiles[1][1].active = true

        this.projectiles[1][0].damageLC = 5
        this.projectiles[1][0].damageLS = 5
        this.projectiles[1][0].intervalLC = 4
        this.projectiles[1][0].intervalLS = 4
        this.projectiles[1][0].velocityLC = 4
        this.projectiles[1][0].velocityLS = 4

        this.projectiles[1][1].damageLC = 5
        this.projectiles[1][1].damageLS = 5
        this.projectiles[1][1].intervalLC = 4
        this.projectiles[1][1].intervalLS = 4
        this.projectiles[1][1].velocityLC = 4
        this.projectiles[1][1].velocityLS = 4

        this.chargedWeapons[1].unlocked = true

        this.chargedWeapons[1].damageLC = 2
        this.chargedWeapons[1].damageLS = 2
        this.chargedWeapons[1].intervalLC = 2
        this.chargedWeapons[1].intervalLS = 2

        this.ship = 1
        this.activeAsteroids[0] = 3
        */

    }
}
