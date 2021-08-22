// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// the interface allows no interference

// validation control is based on scaleOriginal


var scaleLastX = null
var scaleLastY = null
var scaleOriginal = null

///////////////////////////////////////////////////////////////////////////////

function startScale() {
    scaleLastX = null
    scaleLastY = null
    scaleOriginal = null
    //
    const layer = getTopLayer() // not adjusted!
    if (layer == null) { return }
    //
    scaleOriginal = cloneImage(layer.canvas)
    //
    scaleLastX = canvasX
    scaleLastY = canvasY
}

function continueScale() {
    setTask(function () { continueScaleCore() }) // useful!
}

function continueScaleCore() {
    if (scaleOriginal == null) { 
        scaleLastX = null
        scaleLastY = null
        return 
    }
    //
    const x = canvasX
    const y = canvasY
    //
    if (x == null  ||  y == null) { return }
    //
    const deltaWidth  = x - scaleLastX
    const deltaHeight = y - scaleLastY
    //
    scaleLastX = x
    scaleLastY = y
    //
    // happens when mousedrag returns to layer
    if (deltaWidth == 0  &&  deltaHeight == 0) { return } 
    //
    const layer = getTopLayer() // not adjusted!
    if (layer == null) { return } // for safety
    const cnv = layer.canvas
    //
    cnv.width  = Math.max(1, cnv.width  + deltaWidth)
    cnv.height = Math.max(1, cnv.height + deltaHeight)
    //
    const ctx = layer.canvas.getContext("2d")
    ctx["imageSmoothingEnabled"] = false
    ctx.drawImage(scaleOriginal, 0,0,scaleOriginal.width,scaleOriginal.height,  0,0,cnv.width,cnv.height)
    ctx["imageSmoothingEnabled"] = true
}

function finishScale() {
    if (scaleOriginal == null) { return } // filtering bad call (precocious or redundant)
    //
    const layer = getTopLayer() // not adjusted!
    //
    let different = false
    if (layer.width  != scaleOriginal.width)  { different = true }
    if (layer.height != scaleOriginal.height) { different = true }
    //
    if (different) { memorizeTopLayer() }
    //
    scaleLastX = null
    scaleLastY = null
    scaleOriginal = null 
}

