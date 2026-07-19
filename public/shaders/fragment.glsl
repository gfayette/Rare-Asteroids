varying highp vec3 als;
varying highp vec2 texCoord;

varying highp vec4 vData1;
varying highp vec4 vData2;
varying highp vec4 vData3;
varying highp vec4 vData4;

varying highp vec2 sLightCoords;
varying highp vec4 eLightCoords;
varying highp vec4 aLightCoords;

uniform sampler2D uSampler[8];
uniform highp vec4 screen;

uniform highp vec4 sLight0;
uniform highp vec4 sLight1;
uniform highp vec4 eLight00;
uniform highp vec4 eLight01;
uniform highp vec4 eLight10;
uniform highp vec4 eLight11;
uniform highp vec4 aLight00;
uniform highp vec4 aLight01;
uniform highp vec4 aLight10;
uniform highp vec4 aLight11;
uniform highp float textEffectLight;

highp int texUnit;
highp float lightType;
highp int shaderOp;

highp vec4 getSample(highp vec2 uv) {
    if(texUnit == 1) {
        return texture2D(uSampler[1], uv);
    } else if(texUnit == 2) {
        return texture2D(uSampler[2], uv);
    } else if(texUnit == 3) {
        return texture2D(uSampler[3], uv);
    } else if(texUnit == 4) {
        return texture2D(uSampler[4], uv);
    } else if(texUnit == 5) {
        return texture2D(uSampler[5], uv);
    } else if(texUnit == 6) {
        return texture2D(uSampler[6], uv);
    } else if(texUnit == 7) {
        return texture2D(uSampler[7], uv);
    }
    return texture2D(uSampler[0], uv);
}

void point(highp vec4 effectArgs) {
    if(effectArgs.x < -0.5) {
        gl_FragColor = getSample(texCoord);
        gl_FragColor.a = 1.0;
        return;
    }

    highp float xdist0 = effectArgs.x - gl_FragCoord.x;
    highp float ydist0 = effectArgs.y - gl_FragCoord.y;

    highp float r = effectArgs.z;
    highp float mult = effectArgs.w;
    highp float hy = sqrt(xdist0 * xdist0 + ydist0 * ydist0);
    highp float hy0 = r - hy;

    highp vec2 t = texCoord;
    if(hy < r) {
        highp float m = mult * hy0 / r;
        highp float addtx = xdist0 * m / screen.x;
        highp float tx = t.x + addtx;
        highp float addty = ydist0 * m / screen.y;
        highp float ty = t.y + addty;

        if(tx < 0.0 || tx > 1.0 || ty > 1.0 || ty < 0.0) {
            gl_FragColor.r = 0.0;
            gl_FragColor.g = 0.0;
            gl_FragColor.b = 0.0;
            gl_FragColor.a = 0.0;
        } else {
            highp vec2 uv = vec2(tx, ty);
            gl_FragColor = getSample(uv);

            highp float ratio = hy0 / r;
            if(ratio < 0.18) {
                ratio = 0.18 - ratio;
                highp float m = ratio / 0.36;
                highp vec4 m4 = vec4(0.4 * m, 0.4 * m, 0.4 * m, 0.0);
                gl_FragColor += m4;
            }

            normalize(1.0);
            gl_FragColor.a = 1.0;
        }
    } else {
        gl_FragColor = getSample(texCoord);
        gl_FragColor.a = 1.0;
    }
}

void light0(highp vec4 xyri, highp vec4 rgbi) {
    if(xyri.w < 0.0001) {
        return;
    }
    highp float xn = (gl_FragCoord.x - xyri.x) / xyri.z;
    highp float yn = (gl_FragCoord.y - xyri.y) / xyri.z;
    highp float hy = sqrt(xn * xn + yn * yn);

    highp float ti = 0.0;
    if(hy < 2.0) {
        highp float txi = (texCoord.x - 0.5) * xn;
        highp float tyi = (texCoord.y - 0.5) * yn;
        ti = tyi - txi;
        if(ti < 0.0) {
            ti = 0.0;
        } else if(hy > 1.0) {
            ti *= 2.0 - hy;
        }
    }

    highp float di = 0.0;
    highp float hy1 = hy + 1.0;
    di = rgbi.w / (hy1 * hy1);

    highp float m = xyri.w * (ti + di);

    gl_FragColor.r += rgbi.r * gl_FragColor.r * m;
    gl_FragColor.g += rgbi.g * gl_FragColor.g * m;
    gl_FragColor.b += rgbi.b * gl_FragColor.b * m;
    gl_FragColor.a += gl_FragColor.a * m;
}

void light1(highp vec4 xyri, highp vec4 rgbi) {
    if(xyri.w == 0.0) {
        return;
    }
    highp float xn = (gl_FragCoord.x - xyri.x) / xyri.z;
    highp float yn = (gl_FragCoord.y - xyri.y) / xyri.z;
    highp float hy = sqrt(xn * xn + yn * yn);

    highp float hy1 = hy + 1.0;
    highp float m = xyri.w / (hy1 * hy1);

    gl_FragColor.r += rgbi.r * gl_FragColor.r * m;
    gl_FragColor.g += rgbi.g * gl_FragColor.g * m;
    gl_FragColor.b += rgbi.b * gl_FragColor.b * m;
    gl_FragColor.a += gl_FragColor.a * m;
}

void light() {
    if(lightType < 0.5) {
        return;
    }

    if(lightType > 7.5) {
        light1(vec4(sLightCoords.xy, sLight0.zw), sLight1);
        light1(vec4(eLightCoords.xy, eLight00.zw), eLight01);
        light1(vec4(eLightCoords.zw, eLight10.zw), eLight11);
        return;
    }

    if(mod(lightType, 2.0) > 0.5) {
        light0(vec4(sLightCoords.xy, sLight0.zw), sLight1);
    }

    if(mod(lightType, 4.0) > 1.5 && textEffectLight < 0.5) {
        light0(vec4(eLightCoords.xy, eLight00.zw), eLight01);
        light0(vec4(eLightCoords.zw, eLight10.zw), eLight11);
    }

    if(lightType > 3.5) {
        light0(vec4(aLightCoords.xy, aLight00.zw), aLight01);
        light0(vec4(aLightCoords.zw, aLight10.zw), aLight11);
    }
}

highp float random() {
    highp vec2 st = gl_FragCoord.xy / screen.xy;
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void outerBorderSolid(highp float w, highp vec4 color) {
    highp float num = 8.0;
    highp float inc = 2.0 * 3.14159 / num;
    highp float angle = 0.0;

    highp float hits = 0.0;
    for(highp float i = 0.0; i < 8.0; i += 1.01) {
        highp float x = cos(angle) * w + texCoord.x;
        highp float y = sin(angle) * w + texCoord.y;
        angle += inc;

        highp vec4 sample = getSample(vec2(x, y));
        if(sample.a != 0.0) {
            ++hits;
        }
    }

    if(hits > 0.0) {
        gl_FragColor = color;
    }
}

void outerGap(highp float w) {
    highp float num = 8.0;
    highp float inc = 2.0 * 3.14159 / num;
    highp float angle = 0.0;

    highp float hits = 0.0;
    for(highp float i = 0.0; i < 8.0; i += 1.01) {
        highp float x = cos(angle) * w + texCoord.x;
        highp float y = sin(angle) * w + texCoord.y;
        angle += inc;

        highp vec4 sample = getSample(vec2(x, y));
        if(sample.a != 0.0) {
            ++hits;
        }
    }

    if(hits > 0.0) {
        gl_FragColor.a = 0.0;
    }
}

void outerBorderAura(highp float w, highp float a, highp float alpha, highp vec4 color) {
    highp float num = 12.0;
    highp float inc = 2.0 * 3.14159 / num;
    highp float angle = a - inc * 4.0;

    highp float hits = 0.0;
    for(highp float i = 0.0; i < 9.0; i += 1.01) {
        highp float x = cos(angle) * w + texCoord.x;
        highp float y = sin(angle) * w + texCoord.y;
        angle += inc;

        highp vec4 sample = getSample(vec2(x, y));
        if(sample.a != 0.0) {
            ++hits;
        }
    }

    if(hits > 0.0) {
        gl_FragColor = color;
        gl_FragColor.a *= hits / 12.0 * alpha;
    }
}

void shieldAura(highp float w, highp float a, highp float alpha, highp vec4 color) {
    highp float dir = 1.0;
    highp float x = texCoord.x - 0.5;
    highp float y = texCoord.y - 0.5;
    highp float hy = sqrt(x * x + y * y);
    if(hy > 0.375) {
        dir = -1.0;
    }

    highp float num = 8.0;
    highp float inc = 2.0 * 3.14159 / num;
    highp float angle = a * dir;

    highp float hits = 0.0;
    for(highp float i = 0.0; i < 6.0; i += 1.01) {
        highp float x = cos(angle) * w + texCoord.x;
        highp float y = sin(angle) * w + texCoord.y;
        angle += inc;

        highp vec4 sample = getSample(vec2(x, y));
        if(sample.a != 0.0) {
            ++hits;
        }
    }

    if(hits > 0.0) {
        gl_FragColor = color;
        gl_FragColor.a *= hits / 8.0 * alpha;
    }
}

void shieldHitEffect(highp vec4 impactArgs) {
    if(gl_FragColor.a > 0.0) {
        highp float x = (1.0 + cos(impactArgs.x)) * 0.5;
        highp float xDist = abs(texCoord.x - x);

        highp float y = (1.0 + sin(impactArgs.x)) * 0.5;
        highp float yDist = abs(texCoord.y - y);
        highp float hy = sqrt(xDist * xDist + yDist * yDist);
        highp float m = impactArgs.w * (1.0 - hy / impactArgs.z);
        if(m < 0.0) {
            m = 0.0;
        }

        x = (1.0 + cos(impactArgs.y)) * 0.5;
        xDist = abs(texCoord.x - x);
        y = (1.0 + sin(impactArgs.y)) * 0.5;
        yDist = abs(texCoord.y - y);
        hy = sqrt(xDist * xDist + yDist * yDist);
        highp float m2 = impactArgs.w * (1.0 - hy / impactArgs.z);
        if(m2 < 0.0) {
            m2 = 0.0;
        }

        highp vec4 copy = gl_FragColor;
        gl_FragColor *= 0.36;

        highp float mf = 1.6 * (m + m2);
        if(mf >= 0.0) {
            gl_FragColor += copy * vec4(1.0, 1.0, 1.0, mf);
        }
    }
}

void drawBar(highp vec4 fillColor) {
    gl_FragColor = fillColor;
}

void replaceColorR0(highp vec4 color) {
    if(color.a > -0.5) {
        if(gl_FragColor.r > 0.0 && gl_FragColor.a > 0.0 && gl_FragColor.r == gl_FragColor.b) {
            highp float m = gl_FragColor.a;
            gl_FragColor = color * m;
        }
    }
}

void replaceColorR1(highp vec4 color) {
    if(color.a > -0.5) {
        if(gl_FragColor.r > 0.0 && gl_FragColor.a > 0.0 && gl_FragColor.r == gl_FragColor.b && gl_FragColor.g == 0.0) {
            highp float m = gl_FragColor.a;
            gl_FragColor = color;
            gl_FragColor.a = color.a * m;
        }
    }
}

void replaceColorRG(highp vec4 colorR, highp vec4 colorG) {
    if(gl_FragColor.a > 0.0) {
        highp float mr = gl_FragColor.a * gl_FragColor.r;
        highp float mg = gl_FragColor.a * gl_FragColor.g;
        gl_FragColor = colorR * mr + colorG * mg;
    }
}

void replaceColorBg(highp vec4 color, highp vec4 coords) {
    highp float r = coords.y - texCoord.y;
    highp float border = coords.z * 0.4;
    highp float dist = r / border;
    if(dist <= 1.0) {
        color.a *= sqrt(dist);
    }

    r = texCoord.y - coords.x;
    dist = r / border;
    if(dist <= 1.0) {
        color.a *= sqrt(dist);
    }

    if(gl_FragColor.a <= 0.0) {
        gl_FragColor = color;
    } else if(gl_FragColor.a < color.a) {
        gl_FragColor.a = color.a;
    }
}

void rightEnd(highp vec4 color) {
    gl_FragColor = color;
    gl_FragColor.a *= texCoord.x;

    if(texCoord.y > 0.6) {
        gl_FragColor.a *= sqrt(-(texCoord.y - 1.0) / 0.4);
    } else if(texCoord.y < 0.4) {
        gl_FragColor.a *= sqrt(texCoord.y / 0.4);
    }
}

void leftEnd(highp vec4 color) {
    gl_FragColor = color;
    gl_FragColor.a *= 1.0 - texCoord.x;

    if(texCoord.y > 0.6) {
        gl_FragColor.a *= sqrt(-(texCoord.y - 1.0) / 0.4);
    } else if(texCoord.y < 0.4) {
        gl_FragColor.a *= sqrt(texCoord.y / 0.4);
    }
}

void textBg(highp vec4 color, highp vec4 coords) {
    gl_FragColor = color;
    if(texCoord.y > coords.x) {
        gl_FragColor.a *= sqrt(-(texCoord.y - 1.0) / coords.y);
    } else if(texCoord.y < coords.y) {
        gl_FragColor.a *= sqrt(texCoord.y / coords.y);
    }

    if(texCoord.x > coords.z) {
        gl_FragColor.a *= sqrt(-(texCoord.x - 1.0) / coords.w);
    } else if(texCoord.x < coords.w) {
        gl_FragColor.a *= sqrt(texCoord.x / coords.w);
    }
}

void mask(highp vec4 color) {
    if(color.a > -0.5) {
        gl_FragColor *= color;
        normalize(1.0);
    }
}

void warpStart() {
    gl_FragColor = getSample(texCoord);

    highp float xdist0 = vData1.x - gl_FragCoord.x;
    highp float ydist0 = vData1.y - gl_FragCoord.y;

    highp float r = vData1.z;
    highp float hy = sqrt(xdist0 * xdist0 + ydist0 * ydist0);
    highp float rDist = r - hy;
    highp float width = vData1.w * r / screen.y;
    if(rDist <= width && rDist > 0.0) {
        highp float ratio = -0.5 * (cos(6.283 * rDist / width) - 1.0);
        highp float m = vData2.x * ratio / r;
        highp vec2 t = texCoord;
        highp float addtx = xdist0 * m;
        highp float addty = ydist0 * m;
        t.x += addtx;
        t.y += addty;
        gl_FragColor = getSample(t);

        highp float ring = width * 0.072;
        if(ring < 20.0) {
            ring = 20.0;
        }

        if(rDist < ring) {
            highp float ratio2 = -0.05 * (cos(6.283 * rDist / ring) - 1.0);
            gl_FragColor.r += ratio2;
            gl_FragColor.g += ratio2;
            gl_FragColor.b += ratio2;
        }

    }
}

void missileExplode() {
    gl_FragColor = getSample(texCoord);

    highp float xdist0 = vData1.x - gl_FragCoord.x;
    highp float ydist0 = vData1.y - gl_FragCoord.y;

    highp float r = vData1.z;
    highp float hy = sqrt(xdist0 * xdist0 + ydist0 * ydist0);

    if(hy < r) {
        highp float r0 = hy / r;
        if(r0 < 0.7) {
            highp float m = 0.7 - r0;
            m *= vData2.y;
            highp vec4 m4 = vec4(m, m, m, 0.0);
            gl_FragColor += m4;
        }
    }
}

void prismStart() {
    gl_FragColor = getSample(texCoord);

    highp float xdist0 = vData1.x - gl_FragCoord.x;
    highp float ydist0 = vData1.y - gl_FragCoord.y;

    highp float r = vData1.z;
    highp float hy = sqrt(xdist0 * xdist0 + ydist0 * ydist0);
    highp float rDist = r - hy;
    highp float width = vData1.w;
    if(abs(rDist) < width) {
        highp float x = 0.5 * (rDist + width) / width;
        highp float theta = 6.28 * x;
        highp float ratio = -0.5 * (cos(theta) - 1.0);
        highp float m = vData2.x * ratio / screen.y;
        highp vec2 t = texCoord;
        highp float addtx = xdist0 * m;
        highp float addty = ydist0 * m;
        t.x += addtx;
        t.y += addty;
        gl_FragColor = getSample(t);

        highp float x5 = x * 1.667;
        highp float theta5 = 6.28 * x5;

        highp float rr = 0.0;
        highp float rg = 0.0;
        highp float rb = 0.0;

        rr = -0.5 * (cos(theta5) - 1.0);
        rg = -0.5 * (cos(theta5 - 2.094) - 1.0);
        rb = -0.5 * (cos(theta5 + 2.094) - 1.0);

        highp float lightIntensity = vData2.y;
        highp float ml = -0.5 * (cos(theta) - 1.0);

        gl_FragColor.b += (ml * rr) * lightIntensity;
        gl_FragColor.g += (ml * rg) * lightIntensity;
        gl_FragColor.r += (ml * rb) * lightIntensity;
    }
}

void prism() {
    gl_FragColor = getSample(texCoord);

    highp float x1 = vData1.x;
    highp float y1 = vData1.y;
    highp float x2 = vData1.z;
    highp float y2 = vData1.w;
    highp float x3 = gl_FragCoord.x;
    highp float y3 = gl_FragCoord.y;

    highp float x21 = x2 - x1;
    highp float y21 = y2 - y1;

    highp float num = abs(x21 * (y1 - y3) - (x1 - x3) * y21);
    highp float den = sqrt(x21 * x21 + y21 * y21);
    highp float d = num / den;

    highp float width = vData2.y;

    if(d < width) {
        highp float x = d / width;
        highp float m = (cos(x * 3.14) + 1.0) * 0.5;
        highp float mi = m * vData2.x;

        gl_FragColor.r += mi;
        gl_FragColor.g += mi;
        gl_FragColor.b += mi;
    }
}

void post() {
    if(vData1.w < -0.5) {
        gl_FragColor = getSample(texCoord);
    } else if(vData4.x < 0.5) {
        missileExplode();
    } else if(vData4.x < 1.5) {
        warpStart();
    } else if(vData4.x < 2.5) {
        prismStart();
    } else if(vData4.x < 3.5) {
        prism();
    }
    gl_FragColor.a = 1.0;
}

void shaderOpBefore() {
    if(shaderOp == 10) {
        gl_FragColor = getSample(texCoord);
        replaceColorR0(vData1);
    } else if(shaderOp == 11) {
        gl_FragColor = getSample(texCoord);
        mask(vData1);
    } else if(shaderOp == 20) {
        gl_FragColor = getSample(texCoord);
        replaceColorR0(vData1);
        mask(vData2);
    } else if(shaderOp == 21) {
        gl_FragColor = getSample(texCoord);
        replaceColorRG(vData1, vData2);
    } else if(shaderOp == 30) {
        gl_FragColor = getSample(texCoord);
        mask(vData1);
    } else if(shaderOp == 31) {
        drawBar(vData1);
    } else if(shaderOp == 41) {
        if(vData4.a < 0.5) {
            gl_FragColor = getSample(texCoord);
            replaceColorRG(vData1, vData2);
            replaceColorBg(vData3, vData4);
        } else if(vData4.a < 1.5) {
            rightEnd(vData3);
        } else if(vData4.a < 2.5) {
            leftEnd(vData3);
        } else {
            textBg(vData3, vData1);
        }
    } else if(shaderOp == 42) {
        post();
    }
}

void shaderOpAfter() {
    if(shaderOp == 30) {
        if(gl_FragColor.a == 0.0) {
            outerBorderAura(vData3.y, vData3.z, vData3.w, vData2);
            outerGap(vData3.x);
        }
    } else if(shaderOp == 40) {
        gl_FragColor = getSample(texCoord);
        replaceColorR0(vData1);
        if(gl_FragColor.a == 0.0) {
            shieldAura(vData3.y, vData3.z, vData3.w, vData2);
            outerGap(vData3.x);
        }
        shieldHitEffect(vData4);
    }
}

void main(void) {
    texUnit = int(als.x);
    lightType = als.y;
    shaderOp = int(als.z);

    gl_FragColor = vec4(0.0);

    shaderOpBefore();
    light();
    shaderOpAfter();
}