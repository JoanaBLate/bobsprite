// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// coordinates for the lasso inner rectangle
var lassoNorth
var lassoSouth
var lassoEast
var lassoWest

///////////////////////////////////////////////////////////////////////////////

function startLasso() {
    //
    continueLasso()
}

function continueLasso() {
    //
    if (toplayer == null) { return }
    //
    if (selectionIsOn()) { alertSuperLayer(); return }
    //
    if (mask == null) { 
        //
        resetMask()
        //
        const color = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")"
        maskCtx.fillStyle = color
    }
    //
    let x = Math.max(0, stageX - toplayer.left)
    let y = Math.max(0, stageY - toplayer.top)
    //
    x = Math.min(x, mask.width - 1)
    y = Math.min(y, mask.height - 1)
    //
    if (paintStartX == null) { 
        //
        paintStartX = x
        paintStartY = y 
        //
        paintLastX = x
        paintLastY = y
        //
        lassoNorth = y
        lassoSouth = y
        lassoEast = x
        lassoWest = x
    }
    //
    continueLasso2(x, y)
}

function continueLasso2(x, y) {
    //
    const arr = makeBresenham(paintLastX, paintLastY, x, y)
    //
    while (arr.length > 0) {
        const p = arr.shift()
        continueLassoCore(p.x, p.y)
    }
}

function continueLassoCore(x, y) {
    //
    paintLastX = x
    paintLastY = y
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
    //
    if (mask == null) { return }
    //
    // jointing beacons
    if (paintStartX != paintLastX  ||  paintStartY != paintLastY) {
        continueLasso2(paintStartX, paintStartY)
    }
    //
    // setting the inner rectangle coordinates
    const left = lassoWest
    const top = lassoNorth
    const width = lassoEast - lassoWest + 1
    const height = lassoSouth - lassoNorth + 1
    //
    if (width  > 0  &&  height > 0  &&  width+height > 2) { finishLasso2(left, top, width, height) }
    //
    mask = null
    maskOn = false
    //
    paintStartX = null
    paintStartY = null
}

function finishLasso2(left, top, width, height) {
    //
    const lassoCnv = createCanvas(width, height)
    const lassoCtx = lassoCnv.getContext("2d")
    //
    lassoCtx.drawImage(mask, -left, -top)
    //
    const lassoImgData = lassoCtx.getImageData(0, 0, width, height)
    const lassodata = lassoImgData.data
    //
    fillLassoCanvas(lassodata, width, height)
    //
    const toplayerCtx = toplayer.canvas.getContext("2d")
    const toplayerImgData = toplayerCtx.getImageData(left, top, width, height)
    const toplayerdata = toplayerImgData.data
    //
    let shallMemorize = passLassoData(toplayerdata, lassodata, width, height)
    //
    if (shallMemorize) {
        toplayerCtx.putImageData(toplayerImgData, left, top)
        memorizeTopLayer()
    }
    //
    lassoCtx.putImageData(lassoImgData, 0, 0)
    //
    //
    const superlayer = layers[0]
    //
    shallMemorize = ! canvasesAreEqual(lassoCnv, superlayer.canvas)
    //
    superlayer.canvas = lassoCnv 
    superlayer.left = toplayer.left + left
    superlayer.top  = toplayer.top + top
    //
    if (shallMemorize) { memorizeLayer(superlayer) }
    changeLayerVisibility(0) 
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function fillLassoCanvas(data, width, height) { // works on the edge
    //
    // start at first row
    for (let x = 0; x < width; x++) { fillLassoCanvasAt(data, x, 0, width, height) } 
    // 
    // start at last row
    for (let x = 0; x < width; x++) { fillLassoCanvasAt(data, x, height-1, width, height) } 
    //
    // start at first col
    for (let y = 0; y < height; y++) { fillLassoCanvasAt(data, 0, y, width, height) }
    //
    // start at last col
    for (let y = 0; y < height; y++) { fillLassoCanvasAt(data, width-1, y, width, height) }
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
        data[index] = 255 - RED // making it different of the trace by the user
        data[index + 3] = 255 
        future.push(createPoint(x, y))
    }
} 

///////////////////////////////////////////////////////////////////////////////

function passLassoData(layerdata, lassodata, width, height) {
    //
    let shallMemorize = false
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index =  4 * (width * y + x)
            //
            const layerR = layerdata[index]
            const layerG = layerdata[index + 1]
            const layerB = layerdata[index + 2]
            const layerA = layerdata[index + 3]
            //
            const lassoR = lassodata[index]
            const lassoA = lassodata[index + 3]
            //
            if (lassoA == 255  &&  lassoR == 255 - RED) { // different color of the trace by the user
                //
                lassodata[index] = 0
                lassodata[index + 1] = 0
                lassodata[index + 2] = 0
                lassodata[index + 3] = 0
                continue 
            }
            //            
            lassodata[index] = layerR
            lassodata[index + 1] = layerG
            lassodata[index + 2] = layerB
            lassodata[index + 3] = layerA
            //
            if (! shiftPressed) { continue } // not erasing the layer area
            //
            if (layerA == 0) { continue } // already blank
            //
            shallMemorize = true
            //
            layerdata[index] = 0
            layerdata[index + 1] = 0
            layerdata[index + 2] = 0
            layerdata[index + 3] = 0
        }
    }
    return shallMemorize
}

