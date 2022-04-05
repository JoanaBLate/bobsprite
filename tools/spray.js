// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function startSpray() {
    //
    continueSpray()
}

function continueSpray() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y   
        paintSpray(ctx, p.x, p.y) 
    }
}

function finishSpray() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintSpray(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
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
            const changed = paintHardPixel(data, index, shiftPressed)
            if (changed) { anyChange = true }
        }
        index += 4
    }
    //    
    if (! anyChange) { anyChange = paintAnyHardPixel(data, shiftPressed) }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

