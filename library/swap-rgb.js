// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


const swaps = [ "rgbToGbr", "rgbToGbr", "rgbToRbg", "rgbToGbr", "rgbToGbr", "rgbToRbg" ]

///////////////////////////////////////////////////////////////////////////////

function swapRgb(cnv) { 
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const swap = swaps[0]
    swaps.push(swaps.shift())
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
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //      
        if (a == 0) { return } // blank
        if (swap == "rgbToGbr") { 
            data[index    ] = g
            data[index + 1] = b
            data[index + 2] = r
            //
            if (r != g  ||  g != b  ||  b != r) { changed = true }
        }
        else {  
            data[index    ] = r
            data[index + 1] = b
            data[index + 2] = g
            //
            if (g != b) { changed = true }
        }
    }
}

