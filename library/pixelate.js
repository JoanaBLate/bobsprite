// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function pixelate2(cnv)  { 
    pixelate(cnv,  2) 
}

function pixelate3(cnv)  { 
    pixelate(cnv,  3) 
}

function pixelate4(cnv)  { 
    pixelate(cnv,  4) 
}

function pixelate5(cnv)  { 
    pixelate(cnv,  5) 
}

///////////////////////////////////////////////////////////////////////////////

// (no real need to create canvas source when dimensions come rounded) //

function pixelate(cnv, factor) {
    const width  = calcDimension(cnv.width)
    const height = calcDimension(cnv.height)
    //
    function calcDimension(dim) {
        const rest = dim % factor
        if (rest == 0) { return dim }
        return dim + factor - rest // ok (tested)
    }
    //    
    const source = createCanvas(width, height) 
    const sourceCtx = source.getContext("2d")
    sourceCtx.drawImage(cnv, 0, 0)    
    //    
    const reduced = createCanvas(width / factor, height / factor)
    const reducedCtx = reduced.getContext("2d")
    reducedCtx["imageSmoothingEnabled"] = false
    reducedCtx.drawImage(source, 0,0,width,height, 0,0,reduced.width,reduced.height)
    //
    sourceCtx.clearRect(0, 0, width, height)
    sourceCtx["imageSmoothingEnabled"] = false
    sourceCtx.drawImage(reduced, 0,0,reduced.width,reduced.height, 0,0,width,height)
    //
    const ctx = cnv.getContext("2d") 
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(source, 0, 0)    
}

