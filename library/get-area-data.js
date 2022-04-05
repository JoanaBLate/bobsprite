// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// area is copy of part of source //
// area become fuchsia when it is blank //

///////////////////////////////////////////////////////////////////////////////

function getAreaData(srcdata, width, height, x, y) {
    // 
    const px = startingPixel()
    const R = px[0]
    const G = px[1]
    const B = px[2]
    const A = px[3]  
    const isBlankArea = (R + G + B + A) == 0
    //    
    const data = srcdata.slice(0) // clones data 
    const off = data.length 
    for (let n = 0; n < off; n++) { data[n] = 0 }
    //
    let current = [] 
    let future  = [] // each point is already painted; serves as center to search neighbours 
    process()
    return data
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
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            srcdata[index],
            srcdata[index + 1],
            srcdata[index + 2],
            srcdata[index + 3]
        ]        
    }
}

