// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var penLastX = null
var penLastY = null
var shallMemorizePen = false

///////////////////////////////////////////////////////////////////////////////

function startPen() {
    shallMemorizePen = false
    penLastX = null
    penLastY = null
    continuePen()
}

function continuePen() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { penLastX = null; penLastY = null; return }
    //
    const arr = makeBresenham(penLastX, penLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintPen(p.x, p.y) 
        penLastX = p.x
        penLastY = p.y   
    }
}

function paintPen(x, y) {
    const layer = getTopLayerAdjusted()
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
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {    
        const changed = paintHardPixel(data, index, shiftPressed, false) // protecting: false
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePen = true
}

function finishPen() {
    penLastX = null
    penLastY = null
    if (shallMemorizePen) { memorizeTopLayer() }
    shallMemorizePen = false
}

