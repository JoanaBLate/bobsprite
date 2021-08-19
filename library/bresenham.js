// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function makeBresenham(x0, y0, x1, y1) { 
    if (x0 == null) { return [createPoint(x1, y1)] } // just starting
    //
    return makeBresenhamCore(x0, y0, x1, y1) 
}

function makeBresenhamCore(x0, y0, x1, y1) { 
    //
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    if (dx < 2  &&  dy < 2) { return [createPoint(x1, y1)] } // no jump
    //
    let sx = (x0 < x1) ? 1 : -1
    let sy = (y0 < y1) ? 1 : -1
    //
    let err = dx - dy
    const arr = [ ]
    // adapted bresenham !
    while (true) {
        if ((x0 == x1) && (y0 == y1)) { break }
        //
        const e2 = 2 * err
        if (e2 > -dy) { err -= dy; x0 += sx }
        if (e2 <  dx) { err += dx; y0 += sy }
        //
        arr.push(createPoint(x0, y0)) // this line is at end to not include x0y0
    }    
    return arr
}

