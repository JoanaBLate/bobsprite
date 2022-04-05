// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function thinPen() { 
    //
    if (toplayer == null) { resetPerfectAny(); return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const x1 = stageX - toplayer.left
    if (x1 < 0  ||  x1 >= toplayer.canvas.width) { resetPerfectAny(); return }
    //
    const y1 = stageY - toplayer.top
    if (y1 < 0  ||  y1 >= toplayer.canvas.height) { resetPerfectAny(); return }
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
        //
        const p = arr.shift()
        //
        const changed = paintPerfectPixel(ctx, p.x, p.y, executeds)
        //
        if (changed) { memorizeTopLayer() }
    }
}

