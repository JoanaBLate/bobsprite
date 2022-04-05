// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// does not paint area when mouseColor == color,
// because it is already painted... and worse:
// algorithm will run infinitely not because of first step
// but because of redundancy on future list

// *erases* area when argument [r,g,b,a] == [0,0,0,0]

///////////////////////////////////////////////////////////////////////////////

function paintArea(cnv, x, y, r, g, b, a) {
    const ctx = cnv.getContext("2d")
    const width   = cnv.width
    const height  = cnv.height
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    let current = [] // already painted, useful for find neighbours
    let future  = [] // already painted, useful for find neighbours
    process()
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        processAt(x, y)
        while (future.length > 0) { walk() }
    }
    function walk() {
        current = future 
        future  = []
        while (current.length > 0) { 
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }    
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        if (data[index]     != px[0]) { return }
        if (data[index + 1] != px[1]) { return }
        if (data[index + 2] != px[2]) { return }
        if (data[index + 3] != px[3]) { return }
        //
        data[index]     = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
        //
        future.push(createPoint(x, y))
    }
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        ]        
    }
}

