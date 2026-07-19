import Debris from '../models/Debris'
import Explosion from '../models/Explosion'
import ScreenFragment from '../models/ScreenFragment'

export default class Exploder {

    static explodeTexture(texture, nx, ny, velocity, lifespan, colorMask, gameArray, game) {
        let w = texture.width / nx
        let h = texture.height / ny

        for (let i = 0; i < nx; ++i) {
            for (let j = 0; j < ny; ++j) {
                let xinc = w / 2
                let x = xinc + 2 * i * xinc + texture.xPos - texture.width / 2
                let yinc = h / 2
                let y = yinc + 2 * j * yinc + texture.yPos - texture.height / 2

                let xratio = i / (nx - 1) - 0.5
                let yratio = j / (ny - 1) - 0.5

                let m = 1.16 - Math.abs(xratio) - Math.abs(yratio)
                m += Math.abs(texture.vr) * 0.1
                let vx = xratio * velocity * m
                let vy = yratio * velocity * m

                if (texture.rotation !== 0) {
                    let s = Math.sin(texture.rotation)
                    let c = Math.cos(texture.rotation)

                    let x0 = c * (x - texture.xPos) - s * (y - texture.yPos) + texture.xPos
                    let y0 = s * (x - texture.xPos) + c * (y - texture.yPos) + texture.yPos

                    x = x0
                    y = y0

                    let vx1 = c * vx - s * vy
                    let vy1 = s * vx + c * vy

                    vx = vx1
                    vy = vy1
                }

                let d = new Debris(w, h, x, y, texture.zPos, texture.textureId, game)

                let mr = 0.028
                let r = (Math.random() - 0.5) * mr
                d.vx = vx + texture.vx + r
                r = (Math.random() - 0.5) * mr
                d.vy = vy + texture.vy + r
                r = (Math.random() - 0.5) * 5.6
                d.vr = r

                let tx = 1 / nx
                let ty = 1 / ny

                d.xt1 = i * tx + tx
                d.xt2 = i * tx
                d.yt1 = j * ty
                d.yt2 = j * ty + ty

                d.activeTex = texture.activeTex
                d.lightType = texture.lightType
                d.shaderOp = texture.shaderOp
                d.lifespan = lifespan
                d.rotation = texture.rotation
                d.colorMask = colorMask.slice()
                gameArray.push(d)
            }
        }
    }

    static makeDebris(texture, nx, ny, lifespan, colorMask, game) {
        let w = texture.width / nx
        let h = texture.height / ny

        let array = []

        for (let i = 0; i < nx; ++i) {
            for (let j = 0; j < ny; ++j) {
                let xinc = w / 2
                let x = xinc + 2 * i * xinc + texture.xPos - texture.width / 2
                let yinc = h / 2
                let y = yinc + 2 * j * yinc + texture.yPos - texture.height / 2

                if (texture.rotation !== 0) {
                    let s = Math.sin(texture.rotation)
                    let c = Math.cos(texture.rotation)

                    let x0 = c * (x - texture.xPos) - s * (y - texture.yPos) + texture.xPos
                    let y0 = s * (x - texture.xPos) + c * (y - texture.yPos) + texture.yPos

                    x = x0
                    y = y0
                }

                let d = new Debris(w, h, x, y, texture.zPos, texture.textureId, game)

                let tx = 1 / nx
                let ty = 1 / ny

                d.xt1 = i * tx + tx
                d.xt2 = i * tx
                d.yt1 = j * ty
                d.yt2 = j * ty + ty

                d.activeTex = texture.activeTex
                d.lightType = texture.lightType
                d.shaderOp = texture.shaderOp
                d.lifespan = lifespan
                d.rotation = texture.rotation
                d.colorMask = colorMask.slice()
                array.push(d)
            }
        }
        return array
    }

    static impactProjectile(projectile, texture, colorMask, game) {
        let e = new Explosion(texture.width, texture.width, projectile.xPos, projectile.yPos, texture.zPos + 0.001, null, game)
        e.activeTex = texture.impactTex
        e.colorMask = colorMask.slice()
        e.at = texture
        e.atx = projectile.xPos - texture.xPos
        e.aty = projectile.yPos - texture.yPos
        e.atr = texture.rotation
        e.vr = Math.random() > 0.5 ? 2 + Math.random() : -2 - Math.random()
        e.rotation = Math.random() * 6.28
        game.sortedObjects.push(e)
    }

    static explodeScreen(texture, xnum, ynum, lifespan, game) {
        let w = texture.width / xnum
        let h = texture.height / ynum
        let sf = []

        for (let i = 0; i < xnum; ++i) {
            for (let j = 0; j < ynum; ++j) {
                let xinc = w / 2
                let x = xinc + 2 * i * xinc + texture.xPos - texture.width / 2
                let yinc = h / 2
                let y = yinc + 2 * j * yinc + texture.yPos - texture.height / 2

                let xratio = i / (xnum - 1) - 0.5
                let yratio = j / (ynum - 1) - 0.5

                let m = (2 + Math.abs(xratio) + Math.abs(yratio)) * 0.2
                let vx = xratio * m
                let vy = yratio * m

                let frag = new ScreenFragment(w, h, x, y, 0, null, game)

                frag.vx = vx
                frag.vy = vy
                frag.vmult = 1.02

                let tx = 1 / xnum
                let ty = 1 / ynum

                frag.xt1 = i * tx + tx
                frag.xt2 = i * tx
                frag.yt1 = j * ty
                frag.yt2 = j * ty + ty

                frag.lifespan = lifespan
                frag.rotation = texture.rotation
                sf.push(frag)
            }
        }
        game.screenFragments = sf
    }
}