// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var brushLastX = null
var brushLastY = null
var shallMemorizeBrush = false

///////////////////////////////////////////////////////////////////////////////

function startBrush() {
    shallMemorizeBrush = false
    brushLastX = null
    brushLastY = null
    continueBrush()
}

function continueBrush() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { brushLastX = null; brushLastY = null; return }
    //
    const arr = makeBresenham(brushLastX, brushLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintBrush(p.x, p.y) 
        brushLastX = p.x
        brushLastY = p.y   
    }
}

function paintBrush(x, y) {
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
        let changed = paintHardPixel(data, index, shiftPressed, true) // protecting: true
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizeBrush = true
}

function finishBrush() {
    brushLastX = null
    brushLastY = null
    if (shallMemorizeBrush) { memorizeTopLayer() }
    shallMemorizeBrush = false
}

