// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// may affect translucent pixels //

///////////////////////////////////////////////////////////////////////////////

function negative(cnv) { 
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
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //    
        if (A == 0) { return } // blank
    //  if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        let r = 255 - R
        let g = 255 - G
        let b = 255 - B
        if (A == 255  &&  r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g 
        data[index + 2] = b
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
    }
}

