// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function thinPen() { 
    //
    adjustTopLayer()
    //
    const x1 = getTopLayerX()
    const y1 = getTopLayerY()
    //
    if (x1 == null  ||  y1 == null) { resetPerfectAny(); return }
    //
    let x0 = null
    let y0 = null
    //
    const n = executeds.length
    if (n != 0) { 
        const last = executeds[n - 1]
        x0 = last.x
        y0 = last.y
    }
    //
    const arr = makeBresenham(x0, y0, x1, y1)  // accepts xy0 == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintThinPen(p.x, p.y)    
    }
}

function paintThinPen(x, y) { 
    const layer = getTopLayerAdjusted()
    const ctx = layer.canvas.getContext("2d")
    //
    const changed = paintPerfectPixel(ctx, x, y, executeds)
    //
    if (changed) { memorizeLayer(layer) }
}

