class Texture {
    game
    width
    height
    xPos
    yPos
    zPos
    textureId

    /*

    *** Active Texture ***

    0.5 = data
    1.5 = bind during draw
    2.5 = asteroid
    3.5 = rare asteroid
    4.5 = asteroid impact
    5.5 = asteroid explosion
    6.5 = ricochet
    7.5 = text


    *** Lighting Type ***

    s = ship light
    e = effect lights
    a = ambient lights

    00 =
    10 = s
    20 =   e
    30 = s e
    40 =     a
    50 = s   a
    60 =   e a
    70 = s e a
    80 = s e   flat

    
    *** Shader Operation ***

    0000 =

    1000 = 1: texColor                  // bg, particle, ricochet, exhaust

    1100 = 1: colorMask                 // projectile, bgImage, asteroid, debris, impact, 

    2000 = 1: texColor                  // explosion
           2: colorMask

    2100 = 1: texColor                  // text
           2: texColorG

    3000 = 1: colorMask                 // ship
           2: borderAuraColor
           3: shieldArgs

    3100 = 1: fillColor                 // bar

    4000 = 1: texColor                  // shield
           2: shieldAuraColor
           3: shieldArgs
           4: impactArgs

    4100 = 1: texColor                 // message text
           2: texColorG
           3: bgColor
           4: texCoords

    4200 = 1: effectData0               // screen frag effect
           2: effectData1
           3: effectData2
           4: effectData3


    vIndex attribute = a.b1
        a = pixel index in data texture for vertex specific data ([x, y, tx, ty])
        b = offset from pixel index to texture specific data ([xCenter, yCenter, rotation, als])
    */

    activeTex = 1.5
    lightType = 0
    shaderOp = 0

    rotation = 0

    xt1 = 1
    xt2 = 0
    yt1 = 0
    yt2 = 1

    markedForRemoval = false

    constructor(w, h, x, y, z, texId, g) {
        this.game = g
        this.width = w
        this.height = h

        this.xPos = x
        this.yPos = y
        this.zPos = z

        this.textureId = texId
    }

    setRenderData(flip) {
        Texture.setTextureId(this.textureId)
        Texture.setVertexData()
        Texture.setTexData(this, flip)
    }

    static v0
    static v1
    static v2
    static v3

    static x
    static y

    static x1
    static x2
    static y1
    static y2

    static activeLightShaderOp

    static texIndex = 0
    static vIndex = 0
    static dtIndex = 0

    static textureIds = []
    static vertexData = new Float32Array(60000)
    static texData = new Float32Array(280000)

    static setTextureId(id) {
        Texture.textureIds[Texture.texIndex++] = id
    }

    static setVertexData() {
        Texture.v0 = Texture.dtIndex / 4 + 0.41
        Texture.v1 = Texture.v0 + 0.9
        Texture.v2 = Texture.v0 + 1.8
        Texture.v3 = Texture.v0 + 2.7

        Texture.vertexData[Texture.vIndex] = Texture.v0
        Texture.vertexData[++Texture.vIndex] = Texture.v1
        Texture.vertexData[++Texture.vIndex] = Texture.v2
        Texture.vertexData[++Texture.vIndex] = Texture.v0
        Texture.vertexData[++Texture.vIndex] = Texture.v2
        Texture.vertexData[++Texture.vIndex] = Texture.v3

        ++Texture.vIndex
    }

    static setTexData(tex, flip) {
        Texture.x = tex.xPos * 2 - tex.game.aspect
        Texture.y = tex.yPos * -2 + 1

        Texture.x2 = Texture.x + tex.width
        Texture.x1 = Texture.x - tex.width
        Texture.y2 = Texture.y + tex.height
        Texture.y1 = Texture.y - tex.height

        if (flip) {
            Texture.y2 *= -1
            Texture.y1 *= -1
            Texture.y *= -1
        }

        Texture.activeLightShaderOp = tex.activeTex + tex.lightType + tex.shaderOp

        Texture.texData[Texture.dtIndex] = Texture.x2
        Texture.texData[++Texture.dtIndex] = Texture.y2
        Texture.texData[++Texture.dtIndex] = tex.xt1
        Texture.texData[++Texture.dtIndex] = tex.yt1

        Texture.texData[++Texture.dtIndex] = Texture.x1
        Texture.texData[++Texture.dtIndex] = Texture.y2
        Texture.texData[++Texture.dtIndex] = tex.xt2
        Texture.texData[++Texture.dtIndex] = tex.yt1

        Texture.texData[++Texture.dtIndex] = Texture.x1
        Texture.texData[++Texture.dtIndex] = Texture.y1
        Texture.texData[++Texture.dtIndex] = tex.xt2
        Texture.texData[++Texture.dtIndex] = tex.yt2

        Texture.texData[++Texture.dtIndex] = Texture.x2
        Texture.texData[++Texture.dtIndex] = Texture.y1
        Texture.texData[++Texture.dtIndex] = tex.xt1
        Texture.texData[++Texture.dtIndex] = tex.yt2

        Texture.texData[++Texture.dtIndex] = Texture.x
        Texture.texData[++Texture.dtIndex] = Texture.y
        Texture.texData[++Texture.dtIndex] = tex.rotation
        Texture.texData[++Texture.dtIndex] = Texture.activeLightShaderOp

        switch (tex.shaderOp) {
            case 1000:
                Texture.texData[++Texture.dtIndex] = tex.texColor[0]
                Texture.texData[++Texture.dtIndex] = tex.texColor[1]
                Texture.texData[++Texture.dtIndex] = tex.texColor[2]
                Texture.texData[++Texture.dtIndex] = tex.texColor[3]
                break
            case 1100:
                Texture.texData[++Texture.dtIndex] = tex.colorMask[0]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[1]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[2]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[3]
                break
            case 2000:
                Texture.texData[++Texture.dtIndex] = tex.texColor[0]
                Texture.texData[++Texture.dtIndex] = tex.texColor[1]
                Texture.texData[++Texture.dtIndex] = tex.texColor[2]
                Texture.texData[++Texture.dtIndex] = tex.texColor[3]

                Texture.texData[++Texture.dtIndex] = tex.colorMask[0]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[1]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[2]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[3]
                break
            case 2100:
                Texture.texData[++Texture.dtIndex] = tex.texColor[0]
                Texture.texData[++Texture.dtIndex] = tex.texColor[1]
                Texture.texData[++Texture.dtIndex] = tex.texColor[2]
                Texture.texData[++Texture.dtIndex] = tex.texColor[3]

                Texture.texData[++Texture.dtIndex] = tex.texColorG[0]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[1]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[2]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[3]
                break
            case 3000:
                Texture.texData[++Texture.dtIndex] = tex.colorMask[0]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[1]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[2]
                Texture.texData[++Texture.dtIndex] = tex.colorMask[3]

                Texture.texData[++Texture.dtIndex] = tex.borderAuraColor[0]
                Texture.texData[++Texture.dtIndex] = tex.borderAuraColor[1]
                Texture.texData[++Texture.dtIndex] = tex.borderAuraColor[2]
                Texture.texData[++Texture.dtIndex] = tex.borderAuraColor[3]

                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[0]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[1]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[2]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[3]
                break
            case 3100:
                Texture.texData[++Texture.dtIndex] = tex.fillColor[0]
                Texture.texData[++Texture.dtIndex] = tex.fillColor[1]
                Texture.texData[++Texture.dtIndex] = tex.fillColor[2]
                Texture.texData[++Texture.dtIndex] = tex.fillColor[3]
                break
            case 4000:
                Texture.texData[++Texture.dtIndex] = tex.texColor[0]
                Texture.texData[++Texture.dtIndex] = tex.texColor[1]
                Texture.texData[++Texture.dtIndex] = tex.texColor[2]
                Texture.texData[++Texture.dtIndex] = tex.texColor[3]

                Texture.texData[++Texture.dtIndex] = tex.shieldAuraColor[0]
                Texture.texData[++Texture.dtIndex] = tex.shieldAuraColor[1]
                Texture.texData[++Texture.dtIndex] = tex.shieldAuraColor[2]
                Texture.texData[++Texture.dtIndex] = tex.shieldAuraColor[3]

                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[0]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[1]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[2]
                Texture.texData[++Texture.dtIndex] = tex.shieldArgs[3]

                Texture.texData[++Texture.dtIndex] = tex.impactArgs[0]
                Texture.texData[++Texture.dtIndex] = tex.impactArgs[1]
                Texture.texData[++Texture.dtIndex] = tex.impactArgs[2]
                Texture.texData[++Texture.dtIndex] = tex.impactArgs[3]
                break
            case 4100:
                Texture.texData[++Texture.dtIndex] = tex.texColor[0]
                Texture.texData[++Texture.dtIndex] = tex.texColor[1]
                Texture.texData[++Texture.dtIndex] = tex.texColor[2]
                Texture.texData[++Texture.dtIndex] = tex.texColor[3]

                Texture.texData[++Texture.dtIndex] = tex.texColorG[0]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[1]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[2]
                Texture.texData[++Texture.dtIndex] = tex.texColorG[3]

                Texture.texData[++Texture.dtIndex] = tex.bgColor[0]
                Texture.texData[++Texture.dtIndex] = tex.bgColor[1]
                Texture.texData[++Texture.dtIndex] = tex.bgColor[2]
                Texture.texData[++Texture.dtIndex] = tex.bgColor[3]

                Texture.texData[++Texture.dtIndex] = tex.texCoords[0]
                Texture.texData[++Texture.dtIndex] = tex.texCoords[1]
                Texture.texData[++Texture.dtIndex] = tex.texCoords[2]
                Texture.texData[++Texture.dtIndex] = tex.texCoords[3]
                break
            case 4200:
                Texture.texData[++Texture.dtIndex] = tex.effectData1[0]
                Texture.texData[++Texture.dtIndex] = tex.effectData1[1]
                Texture.texData[++Texture.dtIndex] = tex.effectData1[2]
                Texture.texData[++Texture.dtIndex] = tex.effectData1[3]

                Texture.texData[++Texture.dtIndex] = tex.effectData2[0]
                Texture.texData[++Texture.dtIndex] = tex.effectData2[1]
                Texture.texData[++Texture.dtIndex] = tex.effectData2[2]
                Texture.texData[++Texture.dtIndex] = tex.effectData2[3]

                Texture.texData[++Texture.dtIndex] = tex.effectData3[0]
                Texture.texData[++Texture.dtIndex] = tex.effectData3[1]
                Texture.texData[++Texture.dtIndex] = tex.effectData3[2]
                Texture.texData[++Texture.dtIndex] = tex.effectData3[3]

                Texture.texData[++Texture.dtIndex] = tex.effectData4[0]
                Texture.texData[++Texture.dtIndex] = tex.effectData4[1]
                Texture.texData[++Texture.dtIndex] = tex.effectData4[2]
                Texture.texData[++Texture.dtIndex] = tex.effectData4[3]
                break
            default:
                break
        }
        ++Texture.dtIndex
    }
}

export { Texture }