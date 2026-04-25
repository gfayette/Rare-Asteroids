export default class Collisions {

    static addPairsToMap(al, bl, m) {
        al.forEach(a => {
            let collide = a.width / 2.2
            bl.forEach(b => {
                let yDist = a.yPos - b.yPos
                if (Math.abs(yDist) < collide) {
                    let xDist = a.xPos - b.xPos
                    if (Math.abs(xDist) < collide) {
                        let r2 = Math.sqrt(xDist * xDist + yDist * yDist)
                        if (r2 < collide) {
                            let id = a.cIndex + b.cIndex
                            m.set(id, [a, b])
                        }
                    }
                }
            })
        })
    }

    static projectileCollisions(a, p, w) {
        if (w < 0.5) {
            return Collisions.handleCollisionsVert(a, p, w)
        } else {
            return Collisions.handleCollisionsQuad(a, p, w)
        }
    }

    static handleCollisionsVert(a, p, w) {
        let a0 = []
        let a1 = []
        let a2 = []
        let a3 = []

        let b0 = []
        let b1 = []
        let b2 = []
        let b3 = []

        let as = []
        let ps = []

        let h0 = 0.225
        let h1 = 0.275
        let h2 = 0.475
        let h3 = 0.525
        let h4 = 0.725
        let h5 = 0.775

        let cIndex = 0
        a.forEach(a => {
            a.cIndex = ++cIndex
            if (a.yPos < h0) {
                a0.push(a)
            } else if (a.yPos < h1) {
                a0.push(a)
                a1.push(a)
            } else if (a.yPos < h2) {
                a1.push(a)
            } else if (a.yPos < h3) {
                a1.push(a)
                a2.push(a)
            } else if (a.yPos < h4) {
                a2.push(a)
            } else if (a.yPos < h5) {
                as.push(a)
                a2.push(a)
                a3.push(a)
            } else {
                as.push(a)
                a3.push(a)
            }
        })

        cIndex = 0
        p.forEach(p => {
            p.cIndex = cIndex
            cIndex += 10000
            p.cIndex = ++cIndex
            if (p.yPos < 0) { }
            else if (p.yPos < h0) {
                b0.push(p)
            } else if (p.yPos < h1) {
                b0.push(p)
                b1.push(p)
            } else if (p.yPos < h2) {
                b1.push(p)
            } else if (p.yPos < h3) {
                b1.push(p)
                b2.push(p)
            } else if (p.yPos < h4) {
                b2.push(p)
            } else if (p.yPos < h5) {
                ps.push(p)
                b2.push(p)
                b3.push(p)
            } else if (p.yPos < 1) {
                ps.push(p)
                b3.push(p)
            }
        })

        let m = new Map()
        Collisions.addPairsToMap(a0, b0, m)
        Collisions.addPairsToMap(a1, b1, m)
        Collisions.addPairsToMap(a2, b2, m)
        Collisions.addPairsToMap(a3, b3, m)


        m.forEach((value) => {
            value[0].collideProjectile(value[1])
        })

        return [as, ps, [a0, a1, a2, a3]]
    }

    static handleCollisionsQuad(a, p, w) {
        let a0 = []
        let a1 = []
        let a2 = []
        let a3 = []

        let b0 = []
        let b1 = []
        let b2 = []
        let b3 = []

        let as = []
        let ps = []

        let h0 = 0.475
        let h1 = 0.525
        let w0 = w * 0.5 - 0.025
        let w1 = w0 + 0.05

        let cIndex = 0
        a.forEach(a => {
            a.cIndex = ++cIndex
            if (a.yPos < h0) {
                if (a.xPos < w0) {
                    a0.push(a)
                } else if (a.xPos < w1) {
                    a0.push(a)
                    a1.push(a)
                } else {
                    a1.push(a)
                }
            } else if (a.yPos < h1) {
                if (a.xPos < w0) {
                    a0.push(a)
                    a2.push(a)
                } else if (a.xPos < w1) {
                    a0.push(a)
                    a1.push(a)
                    a2.push(a)
                    a3.push(a)
                } else {
                    a1.push(a)
                    a3.push(a)
                }
            } else {
                as.push(a)
                if (a.xPos < w0) {
                    a2.push(a)
                } else if (a.xPos < w1) {
                    a2.push(a)
                    a3.push(a)
                } else {
                    a3.push(a)
                }
            }
        })

        cIndex = 0
        p.forEach(p => {
            p.cIndex = cIndex
            cIndex += 10000
            if (p.yPos < 0) { }
            else if (p.yPos < h0) {
                if (p.xPos < w0) {
                    b0.push(p)
                } else if (p.xPos < w1) {
                    b0.push(p)
                    b1.push(p)
                } else {
                    b1.push(p)
                }
            } else if (p.yPos < h1) {
                if (p.xPos < w0) {
                    b0.push(p)
                    b2.push(p)
                } else if (p.xPos < w1) {
                    b0.push(p)
                    b1.push(p)
                    b2.push(p)
                    b3.push(p)
                } else {
                    b1.push(p)
                    b3.push(p)
                }
            } else if (p.yPos < 1) {
                ps.push(p)
                if (p.xPos < w0) {
                    b2.push(p)
                } else if (p.xPos < w1) {
                    b2.push(p)
                    b3.push(p)
                } else {
                    b3.push(p)
                }
            }
        })

        let m = new Map()
        Collisions.addPairsToMap(a0, b0, m)
        Collisions.addPairsToMap(a1, b1, m)
        Collisions.addPairsToMap(a2, b2, m)
        Collisions.addPairsToMap(a3, b3, m)


        m.forEach((value) => {
            value[0].collideProjectile(value[1])
        })

        return [as, ps, [a0, a1, a2, a3]]
    }

    static shipCollisions(list, ship, rCheck) {
        list.forEach(e => {
            let yDist = e.yPos - ship.yPos
            if (Math.abs(yDist) < rCheck) {
                let xDist = e.xPos - ship.xPos
                if (Math.abs(xDist) < rCheck) {
                    let rActual = Math.sqrt(xDist * xDist + yDist * yDist)
                    let rCollide = ship.shieldRadius + e.width / 2
                    if (rActual < rCollide) {
                        e.collideShip(ship, xDist, yDist, rCollide, rActual)
                    }
                }
            }
        })
    }

    static handleMissileExplodeCollision(list, missile, vScale) {
        list.forEach(e => {
            let yDist = e.yPos - missile.y
            if (Math.abs(yDist) < missile.radius) {
                let xDist = e.xPos - missile.x
                if (Math.abs(xDist) < missile.radius) {
                    let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                    if (hy <= missile.radius) {
                        let r0 = 1 - hy / missile.radius
                        let angle = Math.atan2(xDist, yDist)
                        let m = r0 / 2 + 0.5
                        m *= vScale
                        e.collideMissile(angle, m, missile.damage)
                    }
                }
            }
        })
    }

    static handlePrismCollision(list, prism, vScale) {
        list.forEach(e => {
            let ye21 = e.yPos - prism.game.mainShip.yPos
            let xe21 = e.xPos - prism.game.mainShip.xPos

            let hys = Math.sqrt(xe21 * xe21 + ye21 * ye21)
            if (hys < prism.width0 * 2) {
                let m = 0.7
                let r = prism.game.aspect > 1 ? prism.game.aspect : 1
                m *= vScale
                let sAngle = Math.atan2(xe21, ye21)
                e.collideMissile(sAngle, m, prism.damage)
                return
            }

            let num = ye21 * prism.x21 - xe21 * prism.y21
            let den = prism.den
            let d = num / den
            if (Math.abs(d) < prism.width0 * 1.6) {
                let m = 0.7
                m *= vScale

                let angle = 0
                if (e.yPos < prism.game.mainShip.yPos) {
                    angle = prism.angle + d * 3
                } else {
                    angle = prism.angle - Math.PI + d * 3
                }

                e.collideMissile(angle, m, prism.damage)
            }
        })
    }

    static addAsteroidPairsToMap(bucketLayer, map) {
        for (let i = 0; i < bucketLayer.length; ++i) {
            let a0 = bucketLayer[i]
            for (let j = i + 1; j < bucketLayer.length; ++j) {
                let a1 = bucketLayer[j]
                let collide = 0.46 * (a0.width + a1.width)
                let xDist = a0.xPos - a1.xPos
                if (Math.abs(xDist) < collide) {
                    let yDist = a0.yPos - a1.yPos
                    if (Math.abs(yDist) < collide) {
                        let hy = Math.sqrt(xDist * xDist + yDist * yDist)
                        if (hy < collide) {
                            let id = a0.cIndex.toString() + '-' + a1.cIndex.toString()
                            map.set(id, [a0, a1, xDist, yDist, hy])
                        }
                    }
                }
            }
        }
    }

    static asteroidCollisions(asteroidBuckets, numLayers, tick) {
        let addBack = 0
        let map = new Map()

        asteroidBuckets.forEach(asteroidBucket => {
            let layers = []
            for (let i = 0; i < numLayers; ++i) {
                layers[i] = []
            }

            asteroidBucket.forEach(a => {
                layers[a.layer].push(a)
            })

            layers.forEach(layer => {
                this.addAsteroidPairsToMap(layer, map)
            })
        })

        map.forEach(value => {
            let a0 = value[0]
            let a1 = value[1]
            let xDist = value[2]
            let yDist = value[3]
            let hy = value[4]

            if (a0.addedOnTick === tick) {
                if (!a0.markedForRemoval) {
                    a0.markedForRemoval = true
                    ++addBack
                }
            } else if (a1.addedOnTick === tick) {
                if (!a1.markedForRemoval) {
                    a1.markedForRemoval = true
                    ++addBack
                }
            } else {
                let dvx = a0.vx - a1.vx
                let dvy = a0.vy - a1.vy
                let m = Math.sqrt(dvx * dvx + dvy * dvy) / hy

                let mx = xDist * m
                let my = yDist * m

                let mass = a0.mass + a1.mass
                let ma0 = a0.mass / mass
                let ma1 = a1.mass / mass

                a0.vx += mx * ma1
                a0.vy += my * ma1
                a1.vx -= mx * ma0
                a1.vy -= my * ma0

                let vr0 = a0.vr * a0.width
                let vr1 = a1.vr * a1.width
                let diff = 0.5 * (vr0 + vr1)
                let dvr0 = ma1 * diff / a0.width
                let dvr1 = ma0 * diff / a1.width

                a0.vr -= dvr0
                a1.vr -= dvr1

                /*
                let rd = a0.width / (a0.width + a1.width)
                let rx = a0.xPos - xDist * rd
                let ry = a0.yPos - yDist * rd
                let rvx = a0.vx - dvx * 0.5
                let rvy = a0.vy - dvy * 0.5
                let rw = (a0.width + a1.width) / 2
                let angle = Math.atan2(xDist, yDist)
                a0.addAsteroidRicochet(rx, ry, rvx, rvy, angle, rw)
                */
            }
        })

        return addBack
    }
}