// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function mirrorPen() {
    //
    if (toplayer == null) { resetPerfectAny(); return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const width = toplayer.canvas.width
    const height = toplayer.canvas.width
    //
    const x1 = stageX - toplayer.left
    if (x1 < 0  ||  x1 >= width) { resetPerfectAny(); return }
    //
    const y1 = stageY - toplayer.top
    if (y1 < 0  ||  y1 >= height) { resetPerfectAny(); return }
    //
    let x0 = null
    let y0 = null
    //
    const n = executedsA.length
    if (n != 0) { 
        const last = executedsA[n - 1]
        x0 = last.x
        y0 = last.y
    }
    //
    const arr = makeBresenham(x0, y0, x1, y1)  // accepts xy0 == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintMirrorPen(ctx, p.x, p.y, width)    
    }
}

function paintMirrorPen(ctx, x, y, width) { 
    //
    const x2 = width - x - 1
    //
    const changedA = paintPerfectPixel(ctx, x, y, executedsA)
    const changedB = paintPerfectPixel(ctx, x2, y, executedsB)
    //
    if (changedA  ||  changedB) { memorizeTopLayer() }
}
   
