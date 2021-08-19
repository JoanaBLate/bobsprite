// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// the interface allows no interference


///////////////////////////////////////////////////////////////////////////////

var lassoStartX = null
var lassoStartY = null
var lassoEndX
var lassoEndY

// coordinates for the lasso rectangle
var lassoNorth
var lassoSouth
var lassoEast
var lassoWest


function startLasso() {
    if (getTopLayer() == null) { return }
    //
    resetMask()
    //
    const color = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    maskCtx.fillStyle = color
    //
    lassoStartX = canvasX
    lassoStartY = canvasY
    lassoEndX = canvasX
    lassoEndY = canvasY
    //
    lassoNorth = canvasY
    lassoSouth = canvasY
    lassoEast  = canvasX
    lassoWest  = canvasX
    //
    continueLasso()
}

function continueLasso() {
    if (lassoStartX == null  ||  lassoStartY == null) { return }
    const x = canvasX
    const y = canvasY
    if (x == null  ||  y == null) { return } // doesn't erase lassoStartXY
    //
    //
    const arr = makeBresenham(lassoEndX, lassoEndY, x, y)
    //
    while (arr.length > 0) {
        const p = arr.shift()
        continueLassoCore(p.x, p.y)
    }
}

function continueLassoCore(x, y) {
    lassoEndX = x
    lassoEndY = y
    //
    if (y < lassoNorth) { lassoNorth = y }
    if (y > lassoSouth) { lassoSouth = y }
    if (x < lassoWest)  { lassoWest  = x }
    if (x > lassoEast)  { lassoEast  = x }
    //
    maskCtx.clearRect(x, y, 1, 1) // clearing: not necessary when using opaque colors 
    maskCtx.fillRect(x,  y, 1, 1) // filling
}

function finishLasso() {
     // avoids mess by mouse up when lasso has not started
    if (lassoStartX == null  ||  lassoStartY == null) { return }
    //
    // jointing beacons
    if (lassoStartX != lassoEndX  ||  lassoStartY != lassoEndY) {
        continueLasso(lassoStartX, lassoStartY)
    }
    //    
    lassoStartX = null
    lassoStartY = null
    // setting rectangle
    const x = lassoWest
    const y = lassoNorth
    const width = lassoEast - lassoWest + 1
    const height = lassoSouth - lassoNorth + 1
    //
    if (width  < 1) { hideMask(); return }
    if (height < 1) { hideMask(); return }
    //    
    const cnv = makeLassoCanvas(x, y, width, height)
    fillLassoCanvas(cnv)
    reverseLassoCanvas(cnv)
    //
    maskCtx.drawImage(cnv, x, y)
    //
    const layer = getTopLayer()
    const shallErase = shiftPressed  &&  (layer != layers[0]) // not going to mess the superlayer
    // 
    adjustSuperLayerByMask()
    //
    if (shallErase) { clearLayerByMask(layer) }
}

///////////////////////////////////////////////////////////////////////////////

function makeLassoCanvas(x, y, width, height) {
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(mask, -x, -y)
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function fillLassoCanvas(cnv) {
    const width = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    return
    //
    function process() { // works on the edge
        processRow(0)
        processRow(height -1)
        processCol(0)
        processCol(width - 1)
    }
    //
    function processRow(y) {
        for (let x = 0; x < width; x++) { fillLassoCanvasAt(data, x, y, width, height) }
    }
    //
    function processCol(x) {
        for (let y = 0; y < height; y++) { fillLassoCanvasAt(data, x, y, width, height) }
    }    
}  

function fillLassoCanvasAt(data, x, y, width, height) { // fills outside blanks
    //
    const start = 4 * (y * width + x)
    if (data[start + 3] != 0) { return }
    //
    let current = [] 
    let future  = [] 
    process()
    return 
    //
    function process() {
        processAt(x, y) // must paint starting pixel
        while (future.length > 0) { walk() }
    }
    //
    function walk() {
        current = future 
        future  = []
        while (current.length > 0) { 
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }   
    // 
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }    
    //
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        //
        if (data[index + 3] != 0) { return } // original lasso or already processed
        // 
        data[index + 3] = 255 
        future.push(createPoint(x, y))
    }
} 

/////////////////////////////////////////////////////////////////////////////// 

function reverseLassoCanvas(cnv) {
    const width = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    return
    //
    function process() {
        for (let y = 0; y < height; y++) { processRow(y) }
    }    
    //
    function processRow(y) {
        for (let x = 0; x < width; x++) { reversePixel(x, y) }
    }    
    //
    function reversePixel(x, y) {
        const index = 4 * (y * width + x)
        //
        if (data[index + 3] == 0) { data[index + 3] = 255; return }
        //
        data[index]     = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
    }
}    

