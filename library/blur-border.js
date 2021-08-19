// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// does not work on blank areas //


///////////////////////////////////////////////////////////////////////////////

function blurBorder(cnv, x, y) {
    const width  = cnv.width 
    const height = cnv.height  
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data 
    //
    const index = 4 * (width * y + x)    
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false }
    //
    const refdata = getAreaData(data, width, height, x, y)
    //
    const changed = blurBorderCore(data, width, height, refdata, r, g, b)
    if (! changed) { return false }
    //
    ctx.putImageData(imgdata, 0, 0)
    return true
}

function blurBorderCore(data, width, height, refdata, r, g, b) { 
    let rsum 
    let gsum
    let bsum
    let counter
    let changed = false
    //
    process()
    return changed
    //
    function process() {
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) { processAt(x, y) }
        } 
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        if (refdata[index + 3] == 0) { return } // blank        
        //
        rsum = 0
        gsum = 0
        bsum = 0
        counter = 0
        //
        grabPixel(x, y - 1, false) // north
        grabPixel(x, y + 1, false) // south
        grabPixel(x - 1, y, false) // west
        grabPixel(x + 1, y, false) // east
        grabPixel(x - 1, y - 1, true) // northwest
        grabPixel(x + 1, y - 1, true) // northeast
        grabPixel(x - 1, y + 1, true) // southwest
        grabPixel(x + 1, y + 1, true) // southeast
        //
        if (counter == 0)  { return } // not border or neutral border (surrounded by blank or outline)
        //
        const R = rsum / counter
        const G = gsum / counter
        const B = bsum / counter
        //
        /*
            cant use: const rate = intensity * (counter / 8) 
            because counter often is 12 (straight counts double than diagonal);
            anyway, at least with rectangles, it is more beautiful without this consideration        
        */
        const rate  = intensityFor[tool]  // global variable
        const rate2 = 1 - rate
        //    
        let r2 = Math.round(R * rate  +  r * rate2)
        let g2 = Math.round(G * rate  +  g * rate2)
        let b2 = Math.round(B * rate  +  b * rate2)  
        //
        if (r2 > 255) { r2 = 255 }
        if (g2 > 255) { g2 = 255 }
        if (b2 > 255) { b2 = 255 }
        //
        if (r2 + g2 + b2 == 0) { r2 = 1; g2 = 1; b2 = 1 } // avoids make false outline
        //
        if (r2 == r  &&  g2 == g  &&  b2 == b)  { return }
        //
        data[index    ] = r2
        data[index + 1] = g2
        data[index + 2] = b2
        changed = true 
    }    
    //
    function grabPixel(x, y, diagonal) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x) 
        if (refdata[index + 3] != 0) { return } // neighbour inside target area
        //
        const r = data[index] 
        const g = data[index + 1] 
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (a == 0) { return } // not counting blank
        if (r + g + b == 0  &&  a == 255) { return } // not counting black (outline) 
        //
        rsum += r 
        gsum += g 
        bsum += b        
        counter += 1
        //
        if (diagonal) { return }
        // straight neighbours have double influence:
        rsum += r 
        gsum += g 
        bsum += b        
        counter += 1
    } 
} 

