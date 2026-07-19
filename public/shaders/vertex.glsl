precision highp float;
precision highp int;

attribute float vIndex;

uniform sampler2D uSampler[8];

uniform vec4 screen;
uniform vec4 sLight0;
uniform vec4 eLight00;
uniform vec4 eLight10;
uniform vec4 aLight00;
uniform vec4 aLight10;

varying vec3 als;
varying vec2 texCoord;

varying vec4 vData1;
varying vec4 vData2;
varying vec4 vData3;
varying vec4 vData4;

varying vec2 sLightCoords;
varying vec4 eLightCoords;
varying vec4 aLightCoords;

vec2 textureSize = vec2(512.0, 128.0);

vec4 getData(float index) {
    float column = mod(index, textureSize.x);
    float row = floor(index / textureSize.x);
    vec2 uvTex = vec2((column + 0.5) / textureSize.x, (row + 0.5) / textureSize.y);
    return texture2D(uSampler[0], uvTex);
}

vec2 rotate(vec2 coords, vec2 point, vec2 sc) {
    float x = sc.y * (coords.x - point.x) + sc.x * (coords.y - point.y) + point.x;
    float y = sc.y * (coords.y - point.y) - sc.x * (coords.x - point.x) + point.y;
    return vec2(x, y);
}

void main(void) {
    vec4 vData = getData(floor(vIndex));
    texCoord = vec2(vData.zw);

    float i = vIndex + floor(mod(vIndex, 1.0) * 10.0);
    vec4 data0 = getData(i);
    als = vec3(mod(data0.w, 10.0), floor(mod(data0.w, 100.0) / 10.0) + 0.1, data0.w / 100.0);

    int numOpData = int(data0.w / 1000.0);
    if(numOpData == 1) {
        vData1 = getData(++i);
    } else if(numOpData == 2) {
        vData1 = getData(++i);
        vData2 = getData(++i);
    } else if(numOpData == 3) {
        vData1 = getData(++i);
        vData2 = getData(++i);
        vData3 = getData(++i);
    } else if(numOpData == 4) {
        vData1 = getData(++i);
        vData2 = getData(++i);
        vData3 = getData(++i);
        vData4 = getData(++i);
    }

    vec4 vpos = vec4(vData.xy, 0.0, 1.0);

    vec2 slpos = vec2(sLight0.xy);
    vec4 elpos = vec4(eLight00.xy, eLight10.xy);
    vec4 alpos = vec4(aLight00.xy, aLight10.xy);

    if(data0.z != 0.0) {
        vec2 sc = vec2(sin(data0.z), cos(data0.z));
        vpos.xy = rotate(vpos.xy, data0.xy, sc);

        if(als.y > 0.5) {
            vec2 scl = vec2(sin(-1.0 * data0.z), cos(-1.0 * data0.z));
            if(mod(als.y, 2.0) > 0.5) {
                slpos.xy = rotate(slpos.xy, data0.xy, scl);
            }

            if(mod(als.y, 4.0) > 1.5) {
                elpos.xy = rotate(elpos.xy, data0.xy, scl);
                elpos.zw = rotate(elpos.zw, data0.xy, scl);
            }

            if(als.y > 3.5) {
                alpos.xy = rotate(alpos.xy, data0.xy, scl);
                alpos.zw = rotate(alpos.zw, data0.xy, scl);
            }
        }
    }

    float aspect = screen.y / screen.x;
    float hsx = 0.5 * screen.x;
    float hsy = 0.5 * screen.y;

    vpos.x *= aspect;

    slpos.x *= aspect;
    elpos.x *= aspect;
    elpos.z *= aspect;
    alpos.x *= aspect;
    alpos.z *= aspect;

    slpos.x = hsx + hsx * slpos.x;
    slpos.y = hsy + hsy * slpos.y;
    elpos.x = hsx + hsx * elpos.x;
    elpos.y = hsy + hsy * elpos.y;
    elpos.z = hsx + hsx * elpos.z;
    elpos.w = hsy + hsy * elpos.w;
    alpos.x = hsx + hsx * alpos.x;
    alpos.y = hsy + hsy * alpos.y;
    alpos.z = hsx + hsx * alpos.z;
    alpos.w = hsy + hsy * alpos.w;

    gl_Position = vpos;

    sLightCoords = slpos;
    eLightCoords = elpos;
    aLightCoords = alpos;
}