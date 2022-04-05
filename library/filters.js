// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// avoids make false outline 
// own pixel replaces value of some invalid neighbour
// completely ignores blank and black pixels

/*
function edgeDetection(cnv) {
    return applyFilter(cnv, [ 0,  1,  0,    1,  -4,  1,    0,  1, 0 ])
}

function edgeDetection2(cnv) {
   return applyFilter(cnv, [ -1,  -1,  -1,    -1,  8,  -1,    -1,  -1, -1 ])
}

function raise(cnv) {
    return applyFilter(cnv, [ 0,  0,  -2,    0,  2,  0,     1,  0,  0 ])
}

function sharpen(cnv) {
 // return applyFilter(cnv, [ -1,  -1,  -1,    -1,  9,  -1,   -1,  -1,  -1 ]) // old
    return applyFilter(cnv, [ 0,   -1,   0,    -1,  5,  -1,    0,  -1,   0 ])
}
*/

///////////////////////////////////////////////////////////////////////////////

function emboss(cnv) {
    return applyFilter(cnv, [ -1,  0,  0,    0,  1,  0,    0,  0,  1 ])
}

function blur(cnv) {
    return applyFilter(cnv, [ 1/9,  1/9,  1/9,    1/9,  1/9,  1/9,     1/9,  1/9,  1/9 ])
}

function smooth(cnv) {
    return applyFilter(cnv, [ 1/20,  1/20,  1/20,    1/20,  12/20,  1/20,    1/20,  1/20,  1/20 ])
}
  
///////////////////////////////////////////////////////////////////////////////

function applyFilter(cnv, filter) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const srcdata = data.slice(0)
    let channels, R, G, B, A  
    //
    process() 
    if (! changed) { return false }  
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        R = srcdata[index]
        G = srcdata[index + 1]
        B = srcdata[index + 2]
        A = srcdata[index + 3]
        //  
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        channels = [0, 0, 0]
        fillChannelsWith(x - 1, y - 1, filter[0]) // northwest
        fillChannelsWith(x    , y - 1, filter[1]) // north
        fillChannelsWith(x + 1, y - 1, filter[2]) // northeast
        fillChannelsWith(x - 1, y    , filter[3]) // west
        fillChannelsWith(x    , y    , filter[4]) // center 
        fillChannelsWith(x + 1, y    , filter[5]) // east
        fillChannelsWith(x - 1, y + 1, filter[6]) // southwest
        fillChannelsWith(x    , y + 1, filter[7]) // south
        fillChannelsWith(x + 1, y + 1, filter[8]) // southeast
        //
        let r = Math.floor(channels[0])
        let g = Math.floor(channels[1])
        let b = Math.floor(channels[2])
        //
        if (r > 255) { r = 255 } 
        if (g > 255) { g = 255 } 
        if (b > 255) { b = 255 } 
        //
        if (r < 0) { r = 0 } // necessary when some factor is negative
        if (g < 0) { g = 0 } // or else may fool 'avoid false outline' control
        if (b < 0) { b = 0 } //
        //
        if (r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b  
        //
        if (R != r  ||  G != g  ||  B != b) { changed = true }
    }
    function fillChannelsWith(x, y, factor) {
        const px = getPixel(x, y)
        channels[0] += px[0] * factor
        channels[1] += px[1] * factor
        channels[2] += px[2] * factor
    }
    function getPixel(x, y) {
        if (x < 0) { return [R, G, B] }
        if (y < 0) { return [R, G, B] }
        if (x > width - 1) { return [R, G, B] }
        if (y > height- 1) { return [R, G, B] }
        //
        const index = 4 * (width * y + x)
        const r = srcdata[index]
        const g = srcdata[index + 1]
        const b = srcdata[index + 2]
        const a = srcdata[index + 3]
        //
        if (a == 0) { return [R, G, B] } // blank
        //
        if (r + g + b == 0  &&  a == 255) { return [R, G, B] } // solid black
        //
        return [r, g, b]
    }
}

