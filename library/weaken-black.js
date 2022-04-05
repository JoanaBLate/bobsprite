// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function weakenBlack(cnv) { 
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
        if (a != 255) { return }  // not solid
        if (r + g + b != 0) { return } // not black
        //
        data[index    ] = 1
        data[index + 1] = 1
        data[index + 2] = 1
        changed = true
    }
}

