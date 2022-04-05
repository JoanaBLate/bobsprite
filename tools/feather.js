// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function startFeather() {
    continueFeather()
}

function continueFeather() { 
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(false) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y   
        paintFeather(ctx, p.x, p.y) 
    }
}

function finishFeather() {
    //
    paintLastX = null
    paintLastY = null
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintFeather(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
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
    shallMemorizePaint = true
}

function featherPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    return paintSoftPixel(data, index, intensityFor[tool])
}

