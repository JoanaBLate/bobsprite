// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function eraseBlack(cnv) {   
    return selectiveErase(cnv, true, false, false) 
}
    
function eraseColored(cnv) {
    return selectiveErase(cnv, false, true, false) 
}
    
function eraseTranslucent(cnv) {
    return selectiveErase(cnv, false, false, true) 
}
    
function eraseAllButBlack(cnv) {
    return selectiveErase(cnv, false, true, true) 
}
    
function eraseAllButColored(cnv) {
    return selectiveErase(cnv, true, false, true) 
}
    
function eraseAllButTranslucent(cnv) {
    return selectiveErase(cnv, true, true, false) 
}

///////////////////////////////////////////////////////////////////////////////

function selectiveErase(cnv, black, colored, transluc) { 
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
        //
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (! shallErase(r, g, b, a)) { return } 
        data[index]     = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true
    }
    function shallErase(r, g, b, a) {
        if (a == 0)  { return false }
        if (a < 255) { return transluc }
        if (r + g + b == 0) { return black }
        return colored 
    }
}

