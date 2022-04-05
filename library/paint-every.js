// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// *erases* area when argument [r,g,b,a] == [0,0,0,0]

///////////////////////////////////////////////////////////////////////////////

function paintEvery(cnv, x, y, r, g, b, a) {
    const width   = cnv.width
    const height  = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    process()
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
        if (data[index]     != px[0]) { return }
        if (data[index + 1] != px[1]) { return }
        if (data[index + 2] != px[2]) { return }
        if (data[index + 3] != px[3]) { return }
        //
        data[index]     = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
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

