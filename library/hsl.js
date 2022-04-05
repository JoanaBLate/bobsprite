// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// Hue is a degree on the color wheel (from 0 to 359) - 0 (or 360) is red, 120 is green, 240 is blue. 
// Saturation is a percentage value; 0% means a shade of gray and 100% is the full color. 
// Lightness is also a percentage; 0% is black, 100% is white.

///////////////////////////////////////////////////////////////////////////////

function lightenDarkenColor(rgb, delta) { // bad for orion's face; best for everything else
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    const sat = hsl[1]
    let   lum = hsl[2]
    lum += delta
    if (lum < 0) { lum = 0 }
    if (lum > 1) { lum = 1 }
    //
    return hslToRgb([hue, sat, lum])
}

function __changeColorContrast(rgb, delta) {
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    let   sat = hsl[1]
    const lum = hsl[2]
    sat += delta
    if (sat < 0) { sat = 0 }
    if (sat > 1) { sat = 1 }
    //
    return hslToRgb([hue, sat, lum])
}

///////////////////////////////////////////////////////////////////////////////

function __hslToString(hsl) {
    const h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
    return "hsl(" + parseInt(h*100)/100 + "," + parseInt(s*10000)/100 + "%," + parseInt(l*10000)/100 + "%)"
}

///////////////////////////////////////////////////////////////////////////////

function rgbToHsl(rgb) { 
    const r = rgb[0] / 255.0
    const g = rgb[1] / 255.0
    const b = rgb[2] / 255.0
    //
    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    let hue
    let sat
    // luminosity is the average of the largest and smallest color components
    const lum = (max + min) / 2.0
    const chroma = max - min
    //
    if (chroma == 0) { // no saturation
        hue = 0 
        sat = 0
    }
    else {
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        if (lum < 0.5) {
            sat = chroma / (2 * lum)
        }
        else {
            sat = chroma / (2 - 2 * lum)
        }      
        //
        if (max == r  &&  g >= b) {
            hue = 1.0472 * (g - b) / chroma
        }
        else if (max == r  &&  g < b) {
            hue = 1.0472 * (g - b) / chroma + 6.2832
        }
        else if (max == g) {
            hue = 1.0472 * (b - r) / chroma + 2.0944
        }
        else if (max == b) {
            hue = 1.0472 * (r - g) / chroma + 4.1888
        }
    }
    //
    const H = Math.round(1000 * hue / 6.2832 * 360) / 1000
    const S = Math.round(1000 * sat) / 1000
    const L = Math.round(1000 * lum) / 1000
    return [ H, S, L ]
}

///////////////////////////////////////////////////////////////////////////////

function hslToRgb(hsl) { 
    /*
        const cnv = createCanvas(1, 1)    
        const ctx = cnv.getContext("2d")
        ctx.fillStyle = hslToString(hsl)
        ctx.fillRect(0,0,1,1)
        const data = ctx.getImageData(0, 0, 1, 1).data
        return [data[0], data[1], data[2]]
    */
    
    let   h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
    if (h < 0  ||  h > 360) { return [ 0, 0, 0 ] }
    if (s < 0  ||  s >   1) { return [ 0, 0, 0 ] }
    if (l < 0  ||  l >   1) { return [ 0, 0, 0 ] }
    //
    const chroma = (1 - Math.abs(2 * l - 1)) * s
    h = h / 60
    const x = (1 - Math.abs(h % 2 - 1)) * chroma
    let r, g, b = 0
    //
    if (h < 1) {
        r = chroma
        g = x
        b = 0
    }
    else if (h < 2) {
        r = x
        g = chroma
        b = 0
    }
    else if (h < 3) {
        r = 0
        g = chroma
        b = x
    }
    else if (h < 4) {
        r = 0
        g = x
        b = chroma
    }
    else if (h < 5) {
        r = x
        g = 0
        b = chroma
    }
    else {
        r = chroma
        g = 0
        b = x
    }
    //
    const m = l - chroma/2
    const R = Math.round(255 * (r + m))
    const G = Math.round(255 * (g + m))
    const B = Math.round(255 * (b + m))
    return [ R, G, B ]
}

///////////////////////////////////////////////////////////////////////////////

/* test (works fine) 

function testHsl() {
    testHslCore([97, 193, 54])
    testHslCore([169, 104, 54])
    testHslCore([1, 2, 3])
    testHslCore([0, 0, 0])
    testHslCore([255, 255, 255])
    testHslCore([0, 255, 100])
}

function testHslCore(rgb) {
    const hsl = rgbToHsl(rgb)
    //
    const rgb2 = hslToRgb(hsl)
    console.log(rgb, rgb2, hslToString(hsl))
    //
    const ok = true
    if (rgb[0] != rgb2[0]) { ok = false }
    if (rgb[1] != rgb2[1]) { ok = false }
    if (rgb[2] != rgb2[2]) { ok = false }
    if (ok) { return }
    //
    console.log("problem:", rgb, "!=", rgb2)
}
*/

///////////////////////////////////////////////////////////////////////////////

/* retired

function rgbToGrey(rgb) { 
    const hsl = rgbToHsl(rgb)
//  const hue = hsl[0]
//  const sat = hsl[1]
    const lum = hsl[2]
    return hslToRgb([0,0,lum])
}

function luminosityFromRgb(rgb) {
    const hsl = rgbToHsl(rgb)
//  const hue = hsl[0]
//  const sat = hsl[1]
    const lum = hsl[2]
    return lum
}

function luminosityToRgb(rgb, luminosity) {
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    const sat = hsl[1]
//  const lum = hsl[2]
    return hslToRgb([hue,sat,luminosity])
}
*/

