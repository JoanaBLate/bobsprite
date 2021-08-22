// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// for feather, lighten-tool, darken-tool and blur-pixel


var paintControlCtx = null

///////////////////////////////////////////////////////////////////////////////

function resetPaintControlCtx(shallFill) { 
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { paintControlCtx = null; return }
    //
    const width = layer.canvas.width
    const height = layer.canvas.height
    //
    const cnv = createCanvas(width, height)
    paintControlCtx = cnv.getContext("2d")
    //
    if (shallFill) { paintControlCtx.drawImage(layer.canvas, 0, 0) }
}

