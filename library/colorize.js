// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// not checking if image changed!


///////////////////////////////////////////////////////////////////////////////

function colorize(cnv, HUE, SAT, LUM, considerHue) {
    //
    const RGB = hslToRgb([ HUE, 1, 0.5 ]) // max saturation & balanced luminosity = pure color
    //
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    return 
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        let r = data[index]
        let g = data[index + 1]
        let b = data[index + 2]
        let a = data[index + 3]
        //    
        if (a == 0) { return } // blank
        if (r + g + b == 0  &&  a == 255) { return } // solid black
        //
        const hsl = rgbToHsl([ r, g, b ])
        const hue = hsl[0]
        const sat = Math.min(1, hsl[1] * (SAT / 0.5))
        const lum = Math.min(1, hsl[2] * (LUM / 0.5))
        const rgb = hslToRgb([ hue, sat, lum ])
        r = rgb[0]
        g = rgb[1]
        b = rgb[2]
        //
        if (considerHue) {
            r = Math.min(255, Math.round((4 * r + RGB[0]) / 5))
            g = Math.min(255, Math.round((4 * g + RGB[1]) / 5))
            b = Math.min(255, Math.round((5 * b + RGB[2]) / 5))
        }
        //
        if (a == 255  &&  r == 0  &&  g == 0  &&  b == 0) { r = 1; g = 1; b = 1 } // avoid false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
    }
}

