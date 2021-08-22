// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var featherLastX = null
var featherLastY = null
var shallMemorizeFeather = false

///////////////////////////////////////////////////////////////////////////////

function startFeather() {
    shallMemorizeFeather = false
    featherLastX = null
    featherLastY = null
    resetPaintControlCtx()
    continueFeather()
}

function continueFeather() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { featherLastX = null; featherLastY = null; return }
    //
    if (paintControlCtx == null) { resetPaintControlCtx() }
    //
    const arr = makeBresenham(featherLastX, featherLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintFeather(p.x, p.y) 
        featherLastX = p.x
        featherLastY = p.y   
    }
}

function paintFeather(x, y) {
    const layer = getTopLayer()
    const ctx = layer.canvas.getContext("2d")
    const width = layer.canvas.width
    const height = layer.canvas.height
    //
    const rect = makePaintCoordinates(x, y, width, height, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height) 
    const data = imgdata.data
    //
    const refimgdata = paintControlCtx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const refdata = refimgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {    
        const changed = featherPixel(data, refdata, index)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    paintControlCtx.putImageData(refimgdata, rect.left, rect.top)
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizeFeather = true
}

function featherPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    return paintSoftPixel(data, index, intensityFor[tool])
}

function finishFeather() {
    featherLastX = null
    featherLastY = null
    paintControlCtx = null
    if (shallMemorizeFeather) { memorizeTopLayer() }
    shallMemorizeFeather = false
}

