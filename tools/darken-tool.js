// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var darkenLastX = null
var darkenLastY = null
var shallMemorizeDarken = false

///////////////////////////////////////////////////////////////////////////////

function startDarken() {
    shallMemorizeDarken = false
    darkenLastX = null
    darkenLastY = null
    resetPaintControlCtx()
    continueDarken()
}

function continueDarken() { 
    //
    adjustTopLayer()
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    if (x == null  ||  y == null) { darkenLastX = null; darkenLastY = null; return }
    //
    if (paintControlCtx == null) { resetPaintControlCtx() }
    //
    const arr = makeBresenham(darkenLastX, darkenLastY, x, y) // accepts lastXY == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintDarken(p.x, p.y) 
        darkenLastX = p.x
        darkenLastY = p.y   
    }
}

function paintDarken(x, y) {
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
    const refimgdata = paintControlCtx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const refdata = refimgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {    
        const changed = darkenPixel(data, refdata, index)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    paintControlCtx.putImageData(refimgdata, rect.left, rect.top)
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizeDarken = true
}

function darkenPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false } // blank
    if (a == 255  &&  r + g + b == 0) { return false } // black
    //
    const color = lightenDarkenColor([r, g, b], -intensityFor[tool])
    let r2 = color[0]
    let g2 = color[1]
    let b2 = color[2]
    //
    if (a == 255  &&  r2 + g2 + b2 == 0) { r2 = 1; g2 = 1; b2 = 1 } // avoid false outline
    //
    if (r2 == r  &&  g2 == g  &&  b2 == b) { return false } // no change  
    //
    data[index]     = r2
    data[index + 1] = g2
    data[index + 2] = b2
    //
    return true
}

function finishDarken() {
    darkenLastX = null
    darkenLastY = null
    paintControlCtx = null
    if (shallMemorizeDarken) { memorizeTopLayer() }
    shallMemorizeDarken = false
}

