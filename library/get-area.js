// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// area is copy of part of source //
// area become fuchsia when it is blank //


///////////////////////////////////////////////////////////////////////////////

function getArea(cnv, x, y) {
    const width  = cnv.width
    const height = cnv.height
    //
    const ctx = cnv.getContext("2d")
    const srcdata = ctx.getImageData(0, 0, width, height).data
    // 
    let px = ctx.getImageData(x, y, 1, 1).data
    let R = px[0]
    let G = px[1]
    let B = px[2]
    let A = px[3]  
    const isBlankArea = (R + G + B + A) == 0
    //    
    const area = createCanvas(width, height)
    const areaCtx = area.getContext("2d")
    const imgdata = areaCtx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    let current = [] 
    let future  = [] // each point is already painted; serves as center to search neighbours 
    process()
    areaCtx.putImageData(imgdata, 0, 0)
    return area
    //
    function process() {
        processAt(x, y) // must paint starting pixel
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
        //
        if (data[index + 3] != 0) { return } // already processed
        // 
        if (R != srcdata[index    ]) { return }
        if (G != srcdata[index + 1]) { return }
        if (B != srcdata[index + 2]) { return }
        if (A != srcdata[index + 3]) { return }
        //
        if (isBlankArea) {
            // must mark desired area with some color;
            // no mess with fuchsia pixels from source because,
            // in this case, we are picking only blank pixels from source 
            data[index    ] = 255
            data[index + 1] =   0
            data[index + 2] = 255
            data[index + 3] = 255 
        }
        else {
            data[index    ] = R
            data[index + 1] = G
            data[index + 2] = B
            data[index + 3] = A         
        }
        //
        future.push(createPoint(x, y))
    }
}

