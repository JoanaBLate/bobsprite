// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// calling the same function again produces different result 


const reduxAZeroToOne = [ 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55, 0.50, 
                          0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05 ]

const reduxBZeroToOne = [ 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1 ]

const reduxCZeroToOne = [ 0.9, 0.7, 0.5, 0.3, 0.1 ]


const reduxAZeroTo360  = [ 360, 350, 340, 330, 320, 310, 300, 290, 280, 270,
                           260, 250, 240, 230, 220, 210, 200, 190, 180, 170,
                           160, 150, 140, 130, 120, 110, 100,  90,  80,  70,
                            60,  50,  40,  30,  20,  10 ]


const reduxBZeroTo360  = [ 350, 330, 310, 290, 270, 250, 230, 210, 190, 170,
                           150, 130, 110,  90,  70,  50,  30,  10 ]
                           
const reduxCZeroTo360  = [ 340, 300, 260, 220, 180, 140, 100, 60, 20 ]


///////////////////////////////////////////////////////////////////////////////

function reduceA(cnv) {
    return reduce(cnv, reduxAZeroTo360, reduxAZeroToOne, reduxAZeroToOne)
}

function reduceB(cnv) {
    return reduce(cnv, reduxBZeroTo360, reduxBZeroToOne, reduxBZeroToOne)
}

function reduceC(cnv) {
    return reduce(cnv, reduxCZeroTo360, reduxCZeroToOne, reduxCZeroToOne)
}

///////////////////////////////////////////////////////////////////////////////

function reduce(cnv, hArr, sArr, lArr) { 
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process() 
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
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
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //    
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        const hsl = rgbToHsl([R, G, B])
        const h = hsl[0]
        const s = hsl[1]
        const l = hsl[2]
        //
        const hue = adjustToArray(h, hArr)
        const sat = adjustToArray(s, sArr)
        const lum = adjustToArray(l, lArr)
        //
        const rgb = hslToRgb([hue, sat, lum])
        //         
        let r = rgb[0]
        let g = rgb[1]
        let b = rgb[2]
        let a = reduceChannel(A)
        if (r + g + b == 0  &&  a == 255) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g 
        data[index + 2] = b
        data[index + 3] = a
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
        if (A != a) { changed = true; return }
    } 
    function adjustToArray(val, arr) {
        //
        for (const ref of arr) {
            if (val >= ref) { return ref }
        }
        return 0 
    }
    function reduceChannel(m) {
        const factor = 25
        //
        const n = Math.round(m / factor) * factor
        if (n > 249) { return 255 }
        return n 
    }
}

