// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function mirrorPen() {
    const x1 = getTopLayerX()
    const y1 = getTopLayerY()
    //
    if (x1 == null  ||  y1 == null) { resetPerfectAny(); return }
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
        paintMirrorPen(p.x, p.y)    
    }
}

function paintMirrorPen(x, y) { 
    const layer = getTopLayer()
    const ctx = layer.canvas.getContext("2d")
    const width = layer.canvas.width
    //
    const x2 = width - x
    //
    const changedA = paintPerfectPixel(ctx, x, y, executedsA)
    const changedB = paintPerfectPixel(ctx, x2, y, executedsB)
    //
    if (changedA  ||  changedB) { memorizeLayer(layer) }
}
   
