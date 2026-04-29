

export default class ModelStats {

    game

    constructor(g) {
        this.game = g
    }


    getCosts(type, index) {
        let model = null
        let costs = []
        switch (type) {
            case 'ship':
                model = this.game.gameState.ships[index]
                let palc = model.accelLC
                let pslc = model.shieldLC
                switch (index) {
                    case 0:
                        //0: unlock
                        //1: velocity
                        //2: accel
                        //3: shield
                        let accel = [500, 50000, 7e7, 2e8, 0]
                        let shield = [2000, 50000, 7e7, 2e8, 0]
                        costs.push(0)
                        costs.push(0)
                        costs.push(accel[palc])
                        costs.push(shield[pslc])
                        return costs
                    case 1:
                        let accel1 = [1e14, 1e16, 5e19, 7e22, 0]
                        let shield1 = [7e14, 7e16, 1.6e21, 1.2e24, 0]
                        costs.push(1e11)
                        costs.push(0)
                        costs.push(accel1[palc])
                        costs.push(shield1[pslc])
                        return costs
                    default:
                        return
                }
            case 'projectile':
                model = this.game.gameState.projectiles[this.game.gameState.ship][index]
                let pdlc = model.damageLC
                let pilc = model.intervalLC
                let pvlc = model.velocityLC
                switch (this.game.gameState.ship) {
                    case (0):
                        switch (index) {
                            case 0:
                                //0: unlock
                                //1: damage
                                //2: interval
                                //3: [vx, vy]
                                let damage = [10, 1000, 1e5, 5e7, 0]
                                let interval = [10, 1000, 1e5, 4e8, 0]
                                let velocity = [10, 1000, 1e5, 2e10, 0]
                                costs.push(0)
                                costs.push(damage[pdlc])
                                costs.push(interval[pilc])
                                costs.push(velocity[pvlc])
                                return costs
                            case 1:
                                let damage1 = [1000, 1e5, 1e8, 0]
                                let interval1 = [1000, 1e5, 6e8, 0]
                                let velocity1 = [1000, 1e5, 2e10, 0]
                                costs.push(200)
                                costs.push(damage1[pdlc])
                                costs.push(interval1[pilc])
                                costs.push(velocity1[pvlc])
                                return costs
                            case 2:
                                let damage2 = [1e5, 2e8, 0]
                                let interval2 = [1e5, 8e8, 0]
                                let velocity2 = [1e5, 2e10, 0]
                                costs.push(2000)
                                costs.push(damage2[pdlc])
                                costs.push(interval2[pilc])
                                costs.push(velocity2[pvlc])
                                return costs
                            default:
                                return
                        }
                    case (1):
                        switch (index) {
                            case 0:
                                //0: unlock
                                //1: damage
                                //2: interval
                                //3: [vx, vy]
                                let damage = [3e18, 1.4e20, 9e21, 1.4e23, 2.4e25, 0]
                                let interval = [1e13, 1e14, 1e15, 1e16, 1e17, 0]
                                let velocity = [2e13, 2e14, 2e15, 2e16, 1.5e17, 0]
                                costs.push(0)
                                costs.push(damage[pdlc])
                                costs.push(interval[pilc])
                                costs.push(velocity[pvlc])
                                return costs
                            case 1:
                                let damage1 = [8e18, 2.4e20, 1e22, 2e23, 2.8e25, 0]
                                let interval1 = [1e13, 1e14, 1e15, 1e16, 1e17, 0]
                                let velocity1 = [2e13, 2e14, 2e15, 2e16, 1.5e17, 0]
                                costs.push(1e11)
                                costs.push(damage1[pdlc])
                                costs.push(interval1[pilc])
                                costs.push(velocity1[pvlc])
                                return costs
                            default:
                                return
                        }
                    default:
                        return
                }
            default:
                return
            case 'charged':
                model = this.game.gameState.chargedWeapons[this.game.gameState.ship]
                let cdlc = model.damageLC
                let cilc = model.intervalLC
                switch (this.game.gameState.ship) {
                    case 0:
                        //0: unlock
                        //1: damage
                        //2: interval
                        let damage = [10000, 1e9, 0]
                        let interval = [10000, 1e9, 0]
                        costs.push(5000)
                        costs.push(damage[cdlc])
                        costs.push(interval[cilc])
                        return costs
                    case 1:
                        let damage1 = [2e16, 1.7e21, 0]
                        let interval1 = [5e15, 1e24, 0]
                        costs.push(1e14)
                        costs.push(damage1[cdlc])
                        costs.push(interval1[cilc])
                        return costs
                    default:
                        return
                }
            case 'level':
                switch (index) {
                    case 0:
                        //0: unlock
                        costs.push(0)
                        return costs
                    case 1:
                        costs.push(10890)
                        return costs
                    default:
                        return
                }
            case 'asteroid':
                model = this.game.gameState.asteroids[this.game.gameState.level][index]
                let anlc = model.numLC
                let aplc = model.pointsLC
                switch (this.game.gameState.level) {
                    case (0):
                        switch (index) {
                            case 0:
                                //0: unlock
                                //1: frequency upgrade
                                //2: points upgrade
                                let num = [200, 1000, 1e4, 1e5, 2e5, 0]
                                let points = [50, 800, 2000, 4e4, 2.5e5, 0]
                                costs.push(0)
                                costs.push(num[anlc])
                                costs.push(points[aplc])
                                return costs
                            case 1:
                                let num1 = [5e7, 3e8, 5e8, 7e8, 3e11, 0]
                                let points1 = [1e7, 1e8, 2e9, 3e10, 3e11, 0]
                                costs.push(1e6)
                                costs.push(num1[anlc])
                                costs.push(points1[aplc])
                                return costs
                            case 2:
                                let num2 = [1e14, 4e14, 1.6e15, 8e15, 2e16, 0]
                                let points2 = [5e13, 2e14, 8e14, 4e15, 3e16, 0]
                                costs.push(1e12)
                                costs.push(num2[anlc])
                                costs.push(points2[aplc])
                                return costs
                            case 3:
                                let num3 = [1e20, 7e21, 1e23, 2e25, 3.2e25, 0]
                                let points3 = [1.6e19, 7e20, 1.2e22, 2.8e23, 8e25, 0]
                                costs.push(2.8e18)
                                costs.push(num3[anlc])
                                costs.push(points3[aplc])
                                return costs
                            default:
                                return
                        }
                    default:
                        return
                }
        }
    }

    getProps(type, index) {
        let model = null
        let props = []
        switch (type) {
            case 'ship':
                model = this.game.gameState.ships[index]
                let pals = model.accelLS
                let psls = model.shieldLS
                switch (index) {
                    case 0:
                        //0: velocity
                        //1: accel
                        //2: shield
                        //3: Name
                        //4: Description
                        let accel = [2, 3.3, 4.6, 5, 6.2]
                        let shield = [75, 125, 250, 2000, 4000]
                        props.push(0.2)
                        props.push(accel[pals])
                        props.push(shield[psls])
                        props.push('Firebat')
                        props.push('This ship breathes fire. Its thermal cannons and missile launcher can obliterate most asteroids.')
                        return props
                    case 1:
                        //0: velocity
                        //1: accel
                        //2: shield
                        //3: Name
                        //4: Description
                        let accel1 = [2, 3.3, 4.6, 5, 6.2]
                        let shield1 = [5000, 7500, 10000, 2.8e5, 1e6]
                        props.push(0.2)
                        props.push(accel1[pals])
                        props.push(shield1[psls])
                        props.push('Void Ray')
                        props.push('This ship\'s prismatic core makes quite a light show as it blasts through asteroids.')
                        return props
                    default:
                        return
                }
            case 'projectile':
                model = this.game.gameState.projectiles[this.game.gameState.ship][index]
                let pdls = model.damageLS
                let pils = model.intervalLS
                let pvls = model.velocityLS
                switch (this.game.gameState.ship) {
                    case (0):
                        switch (index) {
                            case 0:
                                //0: damage
                                //1: interval
                                //2: [vx, vy]
                                //3: Mass
                                //4: Spec
                                //5: Name
                                //6: Num
                                //7: [[vxTarget0, vyTarget0], [vxTarget1, vyTarget1], ..]
                                //8: accelerations
                                //9: durations
                                let v = pvls * 2.5
                                let damage = [15, 40, 65, 100, 1000]
                                let interval = [0.25, 0.18, 0.13, 0.093, 0.052]
                                let mass = [3, 4, 5, 6, 7]
                                props.push(damage[pdls])
                                props.push(interval[pils])
                                props.push([2.5 + 0.25 * v, -4 - 0.4 * v])
                                props.push(mass[pdls])
                                props.push('The projectiles from these cannons are red hot, which really isn\'t all that hot in the grand scheme of things.')
                                props.push('Red Cannons')
                                props.push(2)
                                props.push(
                                    [
                                        [-0.3 - 0.03 * v, -4.25 - 0.425 * v],
                                        [-0.17 - 0.017 * v, -4.5 - 0.45 * v],
                                        [0, -5 - 0.5 * v],
                                    ])
                                props.push([18, 36, 40])
                                props.push([1, 1, 1])
                                return props
                            case 1:
                                let v1 = 2.5 + pvls * 2.5
                                let damage1 = [40, 65, 100, 1000]
                                let interval1 = [0.18, 0.13, 0.093, 0.052]
                                let mass1 = [4, 5, 6, 7]
                                props.push(damage1[pdls])
                                props.push(interval1[pils])
                                props.push([3.5 + 0.35 * v1, 4 + 0.4 * v1])
                                props.push(mass1[pdls])
                                props.push('These cannons have even more thermal energy than the red ones.')
                                props.push('Orange Cannons')
                                props.push(2)
                                props.push(
                                    [
                                        [-0.7 - 0.07 * v1, -4.5 - 0.45 * v1],
                                        [-0.17 - 0.017 * v1, -5 - 0.5 * v1],
                                        [0, -5.5 - 0.55 * v1],
                                    ])
                                props.push([2.5, 12, 17])
                                props.push([1, 1, 1])
                                return props
                            case 2:
                                let v2 = 5 + pvls * 2.5
                                let damage2 = [65, 100, 1000]
                                let interval2 = [0.13, 0.093, 0.052]
                                let mass2 = [5, 6, 7]
                                props.push(damage2[pdls])
                                props.push(interval2[pils])
                                props.push([3.5 + 0.35 * v2, 0])
                                props.push(mass2[pdls])
                                props.push('These cannons are the most advanced guns on the firebat, but they\'re still not powerful enough to destroy the rarest of asteroids.')
                                props.push('Yellow Cannons')
                                props.push(2)
                                props.push(
                                    [
                                        [-0.7 - 0.07 * v2, -4.75 - 0.475 * v2],
                                        [-0.17 - 0.017 * v2, -5.5 - 0.55 * v2],
                                        [0, -6.25 - 0.625 * v2],
                                    ])
                                props.push([4.0, 7.5, 30])
                                props.push([1, 1, 1])
                                return props
                            default:
                                return
                        }
                    case (1):
                        switch (index) {
                            case 0:
                                //0: damage
                                //1: interval
                                //2: [vx, vy]
                                //3: Mass
                                //4: Spec
                                //5: Name
                                //6: Num
                                //7: [[vxTarget0, vyTarget0], [vxTarget1, vyTarget1], ..]
                                //8: accel
                                //9: complete time mult
                                let v = pvls * 1.32
                                let damage = [5e4, 2.2e5, 8e5, 3e6, 1.2e7, 8e7]
                                let interval = [0.18, 0.14, 0.1, 0.07, 0.039]
                                let mass = [160, 300, 800, 1400, 1800, 3600]
                                props.push(damage[pdls])
                                props.push(interval[pils])
                                props.push([4 + 0.4 * v, -4 - 0.4 * v])
                                props.push(mass[pdls])
                                props.push('These cannons pack quite a punch when they\'re fully upgraded.')
                                props.push('Diffusion Cannons')
                                props.push(2)
                                props.push([
                                    [5 + 0.5 * v, -5 - 0.5 * v],
                                    [-2 + -0.2 * v, -6 - 0.6 * v],
                                    [0, -7 - 0.7 * v],
                                ])
                                props.push([60, 20, 5, 60, 8, 100])
                                props.push([1, 1, 1, 1, 1, 1, 1])
                                return props
                            case 1:
                                let v2 = pvls * 1.32
                                let damage1 = [5e4, 2.2e5, 8e5, 3e6, 1.2e7, 8e7]
                                let interval1 = [0.18, 0.14, 0.1, 0.07, 0.039]
                                let mass1 = [160, 300, 800, 1400, 1800, 3600]
                                props.push(damage1[pdls])
                                props.push(interval1[pils])
                                props.push([-0.7 + -0.07 * v2, -4 - 0.4 * v2])
                                props.push(mass1[pdls])
                                props.push('These cannons are powerful enough to demolish any type of asteroid.')
                                props.push('Plasma Cannons')
                                props.push(2)
                                props.push([
                                    [0.7 + 0.07 * v2, -5 - 0.5 * v2],
                                    [-0.7 + -0.07 * v2, -6.0 - 0.6 * v2],
                                    [0, -7.0 - 0.7 * v2]
                                ])
                                props.push([16, 7.7, 15, 100])
                                props.push([1, 1, 1, 1])
                                return props
                            default:
                                return
                        }
                    default:
                        return
                }
            case 'charged':
                model = this.game.gameState.chargedWeapons[index]
                let cdls = model.damageLS
                let cils = model.intervalLS
                switch (index) {
                    case 0:
                        //0: damage
                        //1: radius
                        //2: interval
                        //3: Spec
                        //4: Name
                        let damage = [900, 7000, 30000]
                        let radius = [0.25, 0.38, 0.56]
                        let interval = [8, 4.2, 2.4]
                        props.push(damage[cdls])
                        props.push(radius[cdls])
                        props.push(interval[cils])
                        props.push('The firebat\'s primary weapon doesn\'t just launch missile, it also manufactures them.')
                        props.push('Missile Launcher')
                        return props
                    case 1:
                        let damage1 = [7e5, 8e6, 1e14]
                        let radius1 = [0.8, 0.95, 1.1]
                        let interval1 = [8, 4, 2.4]
                        props.push(damage1[cdls])
                        props.push(radius1[cdls])
                        props.push(interval1[cils])
                        props.push('This weapon system creates a photonic gravity well that draws in nearby light and directs it towards the target.')
                        props.push('Prism Blast')
                        return props
                    default:
                        return
                }
            case 'level':
                switch (index) {
                    case 0:
                        //0: name
                        props.push('Terran system')
                        return props
                    case 1:
                        //0: name
                        props.push('Zerg system')
                        return props
                    default:
                        return
                }
            case 'asteroid':
                model = this.game.gameState.asteroids[this.game.gameState.level][index]
                let anls = model.numLS
                let apls = model.pointsLS
                switch (this.game.gameState.level) {
                    case (0):
                        switch (index) {
                            case 0:
                                //num
                                //spare
                                //points
                                //hp
                                //mass
                                //name
                                //description
                                let num = [5, 8, 14, 21, 30, 42]
                                let points = [2, 32, 60, 150, 2200, 10000]
                                let hp = [100, 150, 200, 260, 380, 490]
                                let mass = [50, 60, 70, 80, 90, 100]
                                props.push(anls == -1 ? 0 : num[anls])
                                props.push(0)
                                props.push(points[apls])
                                props.push(hp[apls])
                                props.push(mass[apls])
                                props.push('Blue')
                                props.push('These icy asteroids live at the edge of the solar system.')
                                return props
                            case 1:
                                let num1 = [5, 8, 14, 21, 30, 42]
                                let points1 = [1.6e6, 7e6, 2e7, 1e9, 1.5e9, 1e10]
                                let hp1 = [3600, 4500, 9000, 11000, 24000, 100000]
                                let mass1 = [700, 1000, 1200, 1800, 2000, 2200]
                                props.push(num1[anls])
                                props.push(0)
                                props.push(points1[apls])
                                props.push(hp1[apls])
                                props.push(mass1[apls])
                                props.push('Red')
                                props.push('These asteroids are so close to the sun that they\'re basically lava.')
                                return props
                            case 2:
                                let num2 = [5, 8, 14, 21, 30, 42]
                                let points2 = [3e12, 8e12, 1.7e13, 7e13, 2e14, 3e16]
                                let hp2 = [4e5, 4e5, 4e5, 4e5, 4e5, 4e5]
                                let mass2 = [4400, 4400, 4400, 5200, 6000, 6800]
                                props.push(num2[anls])
                                props.push(0)
                                props.push(points2[apls])
                                props.push(hp2[apls])
                                props.push(mass2[apls])
                                props.push('Green')
                                props.push('These botanical asteroids never hurt a fly. Well, maybe one or two.')
                                return props
                            case 3:
                                let num3 = [5, 8, 14, 21, 30, 42]
                                let points3 = [4e17, 1.7e19, 3e20, 2.6e21, 1.9e23, 2.2e28]
                                let hp3 = [4e6, 1e7, 2.2e7, 7e7, 3e8, 7e8]
                                let mass3 = [8e4, 1e5, 1.2e5, 1.5e5, 2.2e5, 2.2e5]
                                props.push(num3[anls])
                                props.push(0)
                                props.push(points3[apls])
                                props.push(hp3[apls])
                                props.push(mass3[apls])
                                props.push('Purple')
                                props.push('These shimmering crystalline asteroids are worth a lot of points, but the juice isn\'t always worth the squeeze.')
                                return props
                            default:
                                return
                        }
                    default:
                        return
                }
            default:
                return
        }
    }
}

