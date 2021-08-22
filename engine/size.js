// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


/* NEVER FORGET:
    
    (experimental technology)
    context["imageSmoothingQuality"] = "high" // medium, low // default is "low"

*/


var desiredWidth = 120
var desiredHeight = 80

///////////////////////////////////////////////////////////////////////////////

function resizeCanvasByNewDimensions() {
    resizeCanvas(getNewWidth(), getNewHeight())
}

function resizeCanvasByLayer() {
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    resizeCanvas(layer.canvas.width, layer.canvas.height)
}

///////////////////////////////////////////////////////////////////////////////

function resizeLayer() {
    shallRepaint = true
    // 
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    const cnv = createCanvas(getNewWidth(), getNewHeight())
    cnv.getContext("2d").drawImage(layer.canvas, 0, 0)
    //
    layer.top = 0
    layer.left = 0
    layer.canvas = cnv
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function scaleLayer() { 
    shallRepaint = true
    // 
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    const newWidth = getNewWidth()
    const newHeight = getNewHeight()
    //
    const cnv = createCanvas(newWidth, newHeight)
    const ctx = cnv.getContext("2d")
    //
    ctx["imageSmoothingEnabled"] = ! checkboxSizePixelated.checked
    ctx["imageSmoothingQuality"] = "high" // VERY IMORTANT!!! (or else lines of some grid disappear)
    ctx.drawImage(layer.canvas, 0,0,layer.canvas.width,layer.canvas.height, 0,0,newWidth,newHeight)
    ctx["imageSmoothingEnabled"] = true
    //
    layer.top = 0
    layer.left = 0
    layer.canvas = cnv
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function autocropLayer() { 
    shallRepaint = true
    // 
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    const cnv = autocrop(layer.canvas)
    //
    if (cnv.width == layer.canvas.width  &&  cnv.height == layer.canvas.height) { return }
    //
    layer.top = 0
    layer.left = 0
    layer.canvas = cnv
    memorizeTopLayer()
}

