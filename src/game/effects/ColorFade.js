
export default class ColorFade {

    getColor
    setColor

    base
    diff

    constructor(colorFrom, colorTo) {
        let e0 = colorFrom[0] === colorTo[0]
        let e1 = colorFrom[1] === colorTo[1]
        let e2 = colorFrom[2] === colorTo[2]
        let e3 = colorFrom[3] === colorTo[3]

        this.base = colorFrom.slice()

        if (e0) {
            if (e1) {
                if (e2) {
                    if (e3) {
                        this.getColor = function (c) {
                            return this.base.slice()
                        }
                        this.setColor = function (c, color) {
                        }
                    } else {
                        this.diff = [0, 0, 0, colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1], this.base[2], this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                } else {
                    if (e3) {
                        this.diff = [0, 0, colorTo[2] - colorFrom[2], 0]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1], this.base[2] + this.diff[2] * c, this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[2] = this.base[2] + this.diff[2] * c
                        }
                    } else {
                        this.diff = [0, 0, colorTo[2] - colorFrom[2], colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1], this.base[2] + this.diff[2] * c, this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[2] = this.base[2] + this.diff[2] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                }
            } else {
                if (e2) {
                    if (e3) {
                        this.diff = [0, colorTo[1] - colorFrom[1], 0, 0]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1] + this.diff[1] * c, this.base[2], this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[1] = this.base[1] + this.diff[1] * c
                        }
                    } else {
                        this.diff = [0, colorTo[1] - colorFrom[1], 0, colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1] + this.diff[1] * c, this.base[2], this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[1] = this.base[1] + this.diff[1] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                } else {
                    if (e3) {
                        this.diff = [0, colorTo[1] - colorFrom[1], colorTo[2] - colorFrom[2], 0]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1] + this.diff[1] * c, this.base[2] + this.diff[2] * c, this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[1] = this.base[1] + this.diff[1] * c
                            color[2] = this.base[2] + this.diff[2] * c
                        }
                    } else {
                        this.diff = [0, colorTo[1] - colorFrom[1], colorTo[2] - colorFrom[2], colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0], this.base[1] + this.diff[1] * c, this.base[2] + this.diff[2] * c, this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[1] = this.base[1] + this.diff[1] * c
                            color[2] = this.base[2] + this.diff[2] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                }
            }
        } else {
            if (e1) {
                if (e2) {
                    if (e3) {
                        this.diff = [colorTo[0] - colorFrom[0], 0, 0, 0]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1], this.base[2], this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                        }
                    } else {
                        this.diff = [colorTo[0] - colorFrom[0], 0, 0, colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1], this.base[2], this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                } else {
                    if (e3) {
                        this.diff = [colorTo[0] - colorFrom[0], 0, colorTo[2] - colorFrom[2], 0]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1], this.base[2] + this.diff[2] * c, this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[2] = this.base[2] + this.diff[2] * c
                        }
                    } else {
                        this.diff = [colorTo[0] - colorFrom[0], 0, colorTo[2] - colorFrom[2], colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1], this.base[2] + this.diff[2] * c, this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[2] = this.base[2] + this.diff[2] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                }
            } else {
                if (e2) {
                    if (e3) {
                        this.diff = [colorTo[0] - colorFrom[0], colorTo[1] - colorFrom[1], 0, 0]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1] + this.diff[1] * c, this.base[2], this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[1] = this.base[1] + this.diff[1] * c
                        }
                    } else {
                        this.diff = [colorTo[0] - colorFrom[0], colorTo[1] - colorFrom[1], 0, colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1] + this.diff[1] * c, this.base[2], this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[1] = this.base[1] + this.diff[1] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                } else {
                    if (e3) {
                        this.diff = [colorTo[0] - colorFrom[0], colorTo[1] - colorFrom[1], colorTo[2] - colorFrom[2], 0]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1] + this.diff[1] * c, this.base[2] + this.diff[2] * c, this.base[3]]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[1] = this.base[1] + this.diff[1] * c
                            color[2] = this.base[2] + this.diff[2] * c
                        }
                    } else {
                        this.diff = [colorTo[0] - colorFrom[0], colorTo[1] - colorFrom[1], colorTo[2] - colorFrom[2], colorTo[3] - colorFrom[3]]
                        this.getColor = function (c) {
                            return [this.base[0] + this.diff[0] * c, this.base[1] + this.diff[1] * c, this.base[2] + this.diff[2] * c, this.base[3] + this.diff[3] * c]
                        }
                        this.setColor = function (c, color) {
                            color[0] = this.base[0] + this.diff[0] * c
                            color[1] = this.base[1] + this.diff[1] * c
                            color[2] = this.base[2] + this.diff[2] * c
                            color[3] = this.base[3] + this.diff[3] * c
                        }
                    }
                }
            }
        }
    }
}