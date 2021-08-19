// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function roundAlpha(cnv) { 
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
    //
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a ==   0) { return }
        if (a ==  25) { return }
        if (a ==  75) { return }
        if (a == 125) { return }
        if (a == 175) { return }
        if (a == 255) { return }
        //
        changed = true
        if (a <  10) { data[index + 3] =   0; return }
        if (a <  50) { data[index + 3] =  25; return }
        if (a < 100) { data[index + 3] =  75; return }
        if (a < 150) { data[index + 3] = 125; return }
        if (a < 200) { data[index + 3] = 175; return }
        data[index + 3] = 255
    }
}

