// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function useRoll() {
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    shallRepaint = true
    startBlinkingIconOnTopBar("roll")
    //
    const original = cloneImage(layer.canvas)
    const cnv = layer.canvas
    const ctx = cnv.getContext("2d")
    const width  = cnv.width
    const height = cnv.height
    //
    ctx.clearRect(0, 0, width, height)
    //
    if (! shiftPressed) { 
        ctx.fillStyle = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + ALPHA / 255 + ")"
        ctx.fillRect(0, 0, width, height)
    }
    //
    if (! canvasesAreEqual(original, cnv)) { memorizeTopLayer() }
}


