// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function useRoll() {
    //    
    if (toplayer == null) { return }
    //
    shallRepaint = true
    startBlinkingIconOnTopBar("roll")
    //
    const original = cloneImage(toplayer.canvas)
    const cnv = toplayer.canvas
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


