// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function outliner(cnv) { 
    return outlinerCore(cnv, RED, GREEN, BLUE, ALPHA)
}

function outlinerCore(cnv, red, green, blue, alpha) {
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
        if (ref[index + 3] != 0) { return } // not blank
        if (! hasContentNeighbour(x, y)) { return }
        //
        data[index]     = red
        data[index + 1] = green
        data[index + 2] = blue
        data[index + 3] = alpha 
        changed = true
    }
    function hasContentNeighbour(x, y) {
        if (hasContent(x    , y - 1)) { return true }
        if (hasContent(x    , y + 1)) { return true }
        if (hasContent(x - 1, y    )) { return true }
        if (hasContent(x + 1, y    )) { return true }
        return false
    }
    function hasContent(x, y) {
        if (x < 0) { return false }
        if (y < 0) { return false }
        if (x > width - 1) { return false }
        if (y > height- 1) { return false }
        //
        const index = 4 * (width * y + x)
        return (ref[index + 3] != 0) // alpha
    }
}

