// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

/* NEVER FORGET:
    
    (experimental technology)
    context["imageSmoothingQuality"] = "high" // medium, low // default is "low"

*/

var desiredWidth = 120
var desiredHeight = 80

///////////////////////////////////////////////////////////////////////////////

function resizeLayer() {
    //
    shallRepaint = true
    // 
    if (toplayer == null) { return }
    //
    const src = toplayer.canvas
    //
    const newWidth = getNewWidth()
    const newHeight = getNewHeight()
    //
    if (newWidth == src.width  &&  newHeight == src.height) { return }
    //
    const cnv = createCanvas(newWidth, newHeight)
    cnv.getContext("2d").drawImage(src, 0, 0)
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function scaleLayer() { 
    //
    shallRepaint = true
    // 
    if (toplayer == null) { return }
    //
    const src = toplayer.canvas
    //
    const newWidth = getNewWidth()
    const newHeight = getNewHeight()
    //
    if (newWidth == src.width  &&  newHeight == src.height) { return }
    //
    const cnv = createCanvas(newWidth, newHeight)
    const ctx = cnv.getContext("2d")
    //
    ctx["imageSmoothingEnabled"] = ! checkboxSizePixelated.checked
    ctx["imageSmoothingQuality"] = "high" // VERY IMORTANT!!! (or else lines of some grid disappear)
    ctx.drawImage(src, 0,0,src.width,src.height, 0,0,newWidth,newHeight)
    ctx["imageSmoothingEnabled"] = true
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function autocropLayer() { 
    //
    shallRepaint = true
    // 
    if (toplayer == null) { return }
    //
    const cnv = autocrop(toplayer.canvas)
    //    
    const deltaWidth = cnv.width - toplayer.canvas.width
    const deltaHeight = cnv.height - toplayer.canvas.height
    //
    if (deltaWidth == 0  &&  deltaHeight == 0) { return }
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

