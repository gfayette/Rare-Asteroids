import { Texture } from '../../Texture.js'

export default class Text {
    game
    letters
    string
    lineWidths
    lineNum
    spacing = 0.8

    markedForRemoval

    texColor = [0, 0, 0, 1]
    texColorG = [0, 0, 0, 1]

    h0
    x0
    y0

    lightType = 0

    shaderOp = 2100

    constructor(g, h, x, y) {
        this.letters = []
        this.string = ''
        this.lineNum = 0
        this.lineWidths = []
        this.markedForRemoval = false
        this.game = g

        this.h0 = h
        this.x0 = x
        this.y0 = y
    }

    getHXY() {
        return [this.h0, this.x0, this.y0]
    }

    addText(string) {
        this.string += string
        let stringWidth = this.lineWidths[this.lineNum] || 0

        let [h, x, y] = this.getHXY()

        for (let i = 0; i < string.length; ++i) {
            if (string[i] === '\n') {
                this.lineWidths[this.lineNum] = stringWidth
                ++this.lineNum
                stringWidth = 0
                continue
            }

            let args = LetterMap.map[string[i]]

            let w = h * args.aspect
            let xLetter = x + stringWidth + w / 2
            let yLetter = y + h * this.lineNum * this.spacing

            let l = new Letter(w, h, xLetter, yLetter, 0, this.lightType, this.game)
            l.shaderOp = this.shaderOp
            l.l = string[i]

            l.xt1 = args.xOffset + args.yLen * args.aspect
            l.xt2 = args.xOffset
            l.yt1 = args.yOffset
            l.yt2 = args.yOffset + args.yLen
            l.texColor = this.texColor
            l.texColorG = this.texColorG

            this.letters.push(l)
            stringWidth += w
        }
        this.lineWidths[this.lineNum] = stringWidth
    }

    setRenderData(flip) {
        this.letters.forEach(e => {
            e.setRenderData(flip)
        })
    }
}

class Letter extends Texture {
    isVisible = true

    // shader data
    texColor = [1, 1, 1, 1]
    texColorG = [1, 1, 1, 1]
    bgColor = [0, 0, 0, 1]
    texCoords = [0, 0, 0, 0] // yt1, yt2, h

    l

    constructor(w, h, x, y, z, light, g) {
        super(w, h, x, y, z, null, g)
        this.activeTex = 7.5
        this.lightType = light
    }

    move(dx, dy, dr) {
        this.xPos += dx
        this.yPos += dy
        this.rotation += dr
    }
}

class LetterMap {

    static map = {
        '`': {
            xOffset: 0.01,
            yOffset: 0.2,
            yLen: 0.1,
            aspect: 1,
        },
        '0': {
            xOffset: 0.0,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        '1': {
            xOffset: 0.244,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.5,
        },
        '2': {
            xOffset: 0.853,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.72,
        },
        '3': {
            xOffset: 0.197,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.72,
        },
        '4': {
            xOffset: 0.413,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.72,
        },
        '5': {
            xOffset: 0.0,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.71,
        },
        '6': {
            xOffset: 0.502,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.71,
        },
        '7': {
            xOffset: 0.396,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.71,
        },
        '8': {
            xOffset: 0.1456,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        '9': {
            xOffset: 0.925,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.704,
        },
        'A': {
            xOffset: 0.642,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        'B': {
            xOffset: 0.14,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.71,
        },
        'C': {
            xOffset: 0.694,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.61,
        },
        'D': {
            xOffset: 0.486,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.66,
        },
        'E': {
            xOffset: 0.45,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.62,
        },
        'F': {
            xOffset: 0.512,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.62,
        },
        'G': {
            xOffset: 0.071,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.68,
        },
        'H': {
            xOffset: 0.219,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.7,
        },
        'I': {
            xOffset: 0.2,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.47,
        },
        'J': {
            xOffset: 0.594,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.66,
        },
        'K': {
            xOffset: 0.21,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.71,
        },
        'L': {
            xOffset: 0.26,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.65,
        },
        'M': {
            xOffset: 0.725,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.83,
        },
        'N': {
            xOffset: 0.89,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.73,
        },
        'O': {
            xOffset: 0.785,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.68,
        },
        'P': {
            xOffset: 0.688,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.69,
        },
        'Q': {
            xOffset: 0.074,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        'R': {
            xOffset: 0.433,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        'S': {
            xOffset: 0.28,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.66,
        },
        'T': {
            xOffset: 0.57,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.66,
        },
        'U': {
            xOffset: 0.574,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.68,
        },
        'V': {
            xOffset: 0.712,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.73,
        },
        'W': {
            xOffset: 0.366,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.96,
        },
        'X': {
            xOffset: 0.36,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.74,
        },
        'Y': {
            xOffset: 0.345,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.72,
        },
        'Z': {
            xOffset: 0.634,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.60,
        },
        'a': {
            xOffset: 0.725,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.63,
        },
        'b': {
            xOffset: 0.6226,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.64,
        },
        'c': {
            xOffset: 0.814,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.58,
        },
        'd': {
            xOffset: 0.756,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.63,
        },
        'e': {
            xOffset: 0.323,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.63,
        },
        'f': {
            xOffset: 0.341,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.46,
        },
        'g': {
            xOffset: 0.334,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.63,
        },
        'h': {
            xOffset: 0.823,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.634,
        },
        'i': {
            xOffset: 0.866,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        'j': {
            xOffset: 0.841,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        'k': {
            xOffset: 0.466,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.66,
        },
        'l': {
            xOffset: 0.816,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        'm': {
            xOffset: 0.27,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.96,
        },
        'n': {
            xOffset: 0.89,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.634,
        },
        'o': {
            xOffset: 0.791,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.62,
        },
        'p': {
            xOffset: 0.0016,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.635,
        },
        'q': {
            xOffset: 0.068,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.635,
        },
        'r': {
            xOffset: 0.0565,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.5,
        },
        's': {
            xOffset: 0.196,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.61,
        },
        't': {
            xOffset: 0.295,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.46,
        },
        'u': {
            xOffset: 0.136,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.62,
        },
        'v': {
            xOffset: 0.385,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.656,
        },
        'w': {
            xOffset: 0.46,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.9,
        },
        'x': {
            xOffset: 0.5516,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.7,
        },
        'y': {
            xOffset: 0.128,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.68,
        },
        'z': {
            xOffset: 0.871,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.58,
        },
        '\'': {
            xOffset: 0.8906,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        '|': {
            xOffset: 0.791,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        ';': {
            xOffset: 0.761,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.25,
        },
        ',': {
            xOffset: 0.735,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.25,
        },
        ':': {
            xOffset: 0.709,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        '.': {
            xOffset: 0.681,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        ' ': {
            xOffset: 0.66,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        '{': {
            // right bg
            xOffset: 0,
            yOffset: 0,
            yLen: 1,
            aspect: 1,
        },
        '}': {
            // left bg
            xOffset: 0,
            yOffset: 0,
            yLen: 1,
            aspect: 1,
        },
        '!': {
            xOffset: 0.6234,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.226,
        },
        ']': {
            xOffset: 0.581,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.38,
        },
        '[': {
            xOffset: 0.547,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.38,
        },
        '(': {
            xOffset: 0.5104,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.38,
        },
        ')': {
            xOffset: 0.4696,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.38,
        },
        '/': {
            xOffset: 0.152,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.5,
        },
        '\\': {
            xOffset: 0.104,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.5,
        },
        '^': {
            xOffset: 0.0,
            yOffset: 0.723,
            yLen: 0.1,
            aspect: 0.552,
        },
        '<': {
            xOffset: 0.0,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.63,
        },
        '=': {
            xOffset: 0.064,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.65,
        },
        '?': {
            xOffset: 0.751,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.65,
        },
        '*': {
            xOffset: 0.927,
            yOffset: 0.583,
            yLen: 0.1,
            aspect: 0.59,
        },
        '_': {
            xOffset: 0.267,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.64,
        },
        '+': {
            xOffset: 0.66,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.636,
        },
        '~': {
            xOffset: 0.854,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.66,
        },
        '%': {
            xOffset: 0.919,
            yOffset: 0.443,
            yLen: 0.1,
            aspect: 0.65,
        },
        '"': {
            xOffset: 0.957,
            yOffset: 0.303,
            yLen: 0.1,
            aspect: 0.41,
        },
        '$': {
            xOffset: 0.292,
            yOffset: 0.163,
            yLen: 0.1,
            aspect: 0.67,
        },
        '#': {
            xOffset: 0.5523,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.84,
        },
        '@': {
            xOffset: 0.6397,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.822,
        },
        '&': {
            xOffset: 0.81,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.798,
        },
        '-': {
            xOffset: 0.962,
            yOffset: 0.023,
            yLen: 0.1,
            aspect: 0.38,
        },
    }
}