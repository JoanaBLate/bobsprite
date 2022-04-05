// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// standard: 100, 50, 25
// strong:   140, 70, 35
// erases/overwrites translucid pixels;
// antialiases any solid neighbour;

///////////////////////////////////////////////////////////////////////////////

function antialiasingStandard(cnv) {
    antialiasingCore(cnv, 100, 50, 25)
}

function antialiasingStrong(cnv) {
    antialiasingCore(cnv, 140, 70, 35)
}

function antialiasingCore(cnv, A, B, C) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    // current system of marking points for review is a canvas;
    // the old system (growing list of points) used to break the program with big images!
    const reviewTable = createCanvas(width, height) 
    const reviewData = reviewTable.getContext("2d").getImageData(0, 0, width, height).data
    process() 
    ctx.putImageData(imgdata, 0, 0)
    return
    //
    function process() {
        //
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { eraseTranslucent(x, y) }
        } 
        //  
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { firstProcessAt(x, y) }
        } 
        //
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { secondProcessAt(x, y) }
        } 
    }
    function eraseTranslucent(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        if (a == 255) { return } // opaque
        //
        data[index    ] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
    }
    function firstProcessAt(x, y) {
        const index = 4 * (width * y + x) 
        let alpha = data[index + 3]
        if (alpha != 0) { return } // not blank
        //
        const north = isSolid(x, y - 1) 
        const south = isSolid(x, y + 1)
        const west  = isSolid(x - 1, y)
        const east  = isSolid(x + 1, y)
        //
        if (north && west) {  // corner
            alpha = A
        }
        else if (north && east) {  // corner
            alpha = A
        }
        else if (south && west) {  // corner
            alpha = A
        }
        else if (south && east) {  // corner
            alpha = A
        }
        else if (north || south || east  || west) {  // side
            alpha = C 
            reviewData[index + 3] = 255
        }
        //
        data[index + 3] = alpha    
    }   
    function secondProcessAt(x, y) {
        const index = 4 * (width * y + x)
        const a = reviewData[index + 3]
        if (a != 255) { return } // not marked to be reviewed
        //
        const north = isAntialiasingA(x, y - 1) 
        const south = isAntialiasingA(x, y + 1)
        const west  = isAntialiasingA(x - 1, y)
        const east  = isAntialiasingA(x + 1, y)
        //
        if (north  ||  south  ||  east  ||  west) { 
            data[index + 3] = B
        }
    }       
    function isSolid(x, y) {
        if (y < 0  ||  x < 0) { return false }
        if (y > height - 1  ||  x > width - 1) { return false }
        //
        const index = 4 * (width * y + x) 
        return data[index + 3] == 255
    }      
    function isAntialiasingA(x, y) {
        if (y < 0  ||  x < 0) { return false }
        if (y > height - 1  ||  x > width - 1) { return false }
        //
        const index = 4 * (width * y + x) 
        return data[index + 3] == A
    }   
}

