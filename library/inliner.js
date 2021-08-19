// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function inliner(cnv) { 
    return inlinerCore(cnv, RED, GREEN, BLUE, ALPHA)
}

function inlinerCore(cnv, R, G, B, A) { 
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
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        //
        if (! hasBlankNeighbour(x, y)) { return }
        //
        if (data[index    ] != R) { changed = true }
        if (data[index + 1] != G) { changed = true }
        if (data[index + 2] != B) { changed = true }
        if (data[index + 3] != A) { changed = true }
        //
        data[index    ] = R
        data[index + 1] = G
        data[index + 2] = B
        data[index + 3] = A 
    }
    function hasBlankNeighbour(x, y) {
        if (isBlank(x    , y - 1)) { return true }
        if (isBlank(x    , y + 1)) { return true }
        if (isBlank(x - 1, y    )) { return true }
        if (isBlank(x + 1, y    )) { return true }
        return false
    }
    function isBlank(x, y) {
        if (x < 0) { return true }
        if (y < 0) { return true }
        if (x > width - 1) { return true }
        if (y > height- 1) { return true }
        //
        const index = 4 * (width * y + x)
        return (data[index + 3] == 0) // alpha
    }
}

