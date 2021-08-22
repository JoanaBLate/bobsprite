// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var sprayLastX = null
var sprayLastY = null
var shallMemorizeSpray = false

///////////////////////////////////////////////////////////////////////////////

function startSpray() {
    shallMemorizeSpray = false
    sprayLastX = null
    sprayLastY = null
    continueSpray()
}

function continueSpray() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { sprayLastX = null; sprayLastY = null; return }
    //
    const arr = makeBresenham(sprayLastX, sprayLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintSpray(p.x, p.y) 
        sprayLastX = p.x
        sprayLastY = p.y   
    }
}

function paintSpray(x, y) {
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
        if (Math.random() < 0.02) { 
            const changed = paintHardPixel(data, index, shiftPressed, true) // protection = true  
            if (changed) { anyChange = true }
        }
        index += 4
    }
    //    
    if (! anyChange) { anyChange = paintAnyHardPixel(data, shiftPressed, true) } // protection = true
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizeSpray = true
}

function finishSpray() {
    sprayLastX = null
    sprayLastY = null
    if (shallMemorizeSpray) { memorizeTopLayer() }
    shallMemorizeSpray = false
}

