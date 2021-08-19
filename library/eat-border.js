// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function eatBorder(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)    
    const data = imgdata.data
    let changed = false
    //
    const ref = data.slice(0)
    //
    process() 
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        if (ref[index + 3] == 0) { return } // blank
        if (! isBorder(x, y)) { return }
        //
        data[index]     = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true 
    }
    function isBorder(x, y) {
        if (isBlankOrOff(x    , y - 1)) { return true }
        if (isBlankOrOff(x    , y + 1)) { return true }
        if (isBlankOrOff(x - 1, y    )) { return true }
        if (isBlankOrOff(x + 1, y    )) { return true }
        return false
    }
    function isBlankOrOff(x, y) {
        if (x < 0) { return true }
        if (y < 0) { return true }
        if (x > width - 1) { return true }
        if (y > height- 1) { return true }
        //
        const index = 4 * (width * y + x)
        return (ref[index + 3] == 0) // alpha
    }
}

