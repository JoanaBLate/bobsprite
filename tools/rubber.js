// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var rubberLastX = null
var rubberLastY = null
var shallMemorizeRubber = false

///////////////////////////////////////////////////////////////////////////////

function startRubber() {
    shallMemorizeRubber = false
    rubberLastX = null
    rubberLastY = null
    continueRubber()
}

function continueRubber() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { rubberLastX = null; rubberLastY = null; return }
    //
    const arr = makeBresenham(rubberLastX, rubberLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintRubber(p.x, p.y) 
        rubberLastX = p.x
        rubberLastY = p.y   
    }
}

function paintRubber(x, y) {
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
        const changed = paintHardPixel(data, index, true, false) // protecting: false
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizeRubber = true
}

function finishRubber() {
    rubberLastX = null
    rubberLastY = null
    if (shallMemorizeRubber) { memorizeTopLayer() }
    shallMemorizeRubber = false
}

