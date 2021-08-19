// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function eraseMatchingPixels(cnv, rgbColors) { 
    //
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
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //             
        if (a == 0) { return } // blank
        //             
        if (a != 255) { return } // translucent
        //
        if (! isInColors(r, g, b)) { return }
        //
        data[index] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true        
    }
    function isInColors(r, g, b) {
        //
        for (const color of rgbColors) {
            if (r != color[0]) { continue }
            if (g != color[1]) { continue }
            if (b != color[2]) { continue }
            return true
        }
        return false
    }
}

