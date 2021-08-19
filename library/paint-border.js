// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// does not paint area when mouseColor == color,
// because it is already painted... and worse:
// algorithm will go inifinite not because of first step
// but because of redundancy on future list

// *erases* area when argument [r,g,b,a] == [0,0,0,0]


///////////////////////////////////////////////////////////////////////////////

function paintBorder(cnv, x, y, r, g, b, a) {  
    const width  = cnv.width 
    const height = cnv.height  
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    const refdata = getAreaData(data, width, height, x, y)
    //
    process()
    ctx.putImageData(imgdata, 0, 0, 0, 0, width, height)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        } 
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        if (refdata[index + 3] == 0) { return } // blank
        //
        const north = isBlank(x, y - 1) 
        const south = isBlank(x, y + 1)
        const west  = isBlank(x - 1, y)
        const east  = isBlank(x + 1, y)
        //
        let good = false
        if (north && ! south) {  good = true }
        if (south && ! north) {  good = true }
        if (east  && ! west)  {  good = true }
        if (west  && ! east)  {  good = true }
        if (! good) { return }
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
    }    
    function isBlank(x, y) {
        if (y < 0  ||  x < 0) { return true }
        if (y > height - 1  ||  x > width - 1) { return true }
        const index = 4 * (width * y + x) 
        return refdata[index + 3] == 0
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

