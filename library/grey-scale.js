// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function greyScale(cnv) { 
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
// old: const grey = Math.floor((r + g + b) / 3)
//old2: const rgb  = rgbToGrey([r,g,b])
//old2: const grey = rgb[0]
        let grey = getGrey(R, G, B)
        //
        if (grey == 0  &&  A == 255) { grey = 1 } // avoid false outline
        //
        data[index    ] = grey
        data[index + 1] = grey
        data[index + 2] = grey
        //
        if (R != grey  ||  G != grey  ||  B != grey) { changed = true }
    }
}

function getGrey(r, g, b) {
    let grey = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
    if (grey > 255) { grey = 255 }
    //
    return grey
}

function __getGrey2(r, g, b) {
    const sum = r + g + b
    if (sum == 0) { return 0 }
    //
    const standard = r * 0.299 + g * 0.587 + b * 0.114
    const forred   = r * 0.4   + g * 0.4   + b * 0.2
    const forblue  = r * 0.3   + g * 0.4   + b * 0.3
    //
    const factorForRed  = r / sum
    const factorForBlue = b / sum
    const factorForStandard = 1 - factorForRed - factorForBlue
    //
    let grey = Math.round(standard * factorForStandard + forred * factorForRed + forblue * factorForBlue)
    if (grey > 255) { grey = 255 }
    //
    return grey
}

