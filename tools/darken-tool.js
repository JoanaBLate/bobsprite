// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function startDarken() {
    //
    continueDarken()
}

function continueDarken() { 
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
        paintDarken(ctx, p.x, p.y) 
    }
}

function finishDarken() {
    //
    paintLastX = null
    paintLastY = null
    //
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintDarken(ctx, x, y) {
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
    shallMemorizePaint = true
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
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false } 
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

