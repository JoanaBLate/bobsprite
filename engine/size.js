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

///////////////////////////////////////////////////////////////////////////////

function enlarge() {
    if (getTopLayer() == null) { return }
    //
    shallRepaint = true
    startBlinkingIconOnTopBar("plus") 
    //
    if (canvas.width   > 1000) { error("canvas would be too big"); return }
    if (canvas.height  > 1000) { error("canvas would be too big"); return }
    //
    for (let n = 0; n < layers.length; n++) { 
        let ok = true
        if (layers[n].canvas.width > 1000) { ok = false }
        if (layers[n].canvas.height > 1000) { ok = false }
        if (ok) { continue }
        //  
        let symbol = "!ABCDE"[n]
        if (symbol == "!") { symbol = "Selection" }
        //
        error("layer " + symbol + " would be too big")
        return        
    }
    //
    resizeCanvas(canvas.width * 2, canvas.height * 2)
    //
    for (const layer of layers) { 
        //
        layer.canvas = enlargeHard(layer.canvas)
    }
}

function enlargeHard(src) {
    const cnv = createCanvas(2 * src.width, 2 * src.height)
    const ctx = cnv.getContext("2d")
    //
    ctx["imageSmoothingEnabled"] = false
    //
    ctx.drawImage(src, 0,0,src.width,src.height, 0,0,cnv.width,cnv.height)
    //
    ctx["imageSmoothingEnabled"] = true
    //
    return cnv
}
    
///////////////////////////////////////////////////////////////////////////////

function shorten() {
    if (getTopLayer() == null) { return }
    //
    shallRepaint = true
    startBlinkingIconOnTopBar("minus") 
    //
    if (canvas.width   < 2) { error("canvas would be too small"); return }
    if (canvas.height  < 2) { error("canvas would be too small"); return }
    //
    for (let n = 0; n < layers.length; n++) { 
        let ok = true
        if (layers[n].canvas.width < 2) { ok = false }
        if (layers[n].canvas.height < 2) { ok = false }
        if (ok) { continue }
        //  
        let symbol = "!ABCDE"[n]
        if (symbol == "!") { symbol = "Selection" }
        //
        error("layer " + symbol + " would be too small")
        return        
    }
    //
    let width = canvas.width
    if (width % 2 != 0) { width += 1 }
    //
    let height = canvas.height
    if (height % 2 != 0) { height += 1 }
    //
    resizeCanvas(width / 2, height / 2)
    //
    for (const layer of layers) { 
        //
        layer.canvas = setEvenDimensions(layer.canvas)
        layer.canvas = shortenSoft(layer.canvas)
    }
}

function setEvenDimensions(src) {
    let width = src.width
    if (width % 2 != 0) { width += 1 }
    //
    let height = src.height
    if (height % 2 != 0) { height += 1 }
    //
    if (width == src.width  &&  height == src.height) { return src }
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(src, 0, 0)
    return cnv
}

function shortenSoft(src) { // expects to receive even dimensions
    //
    const cnv = createCanvas(src.width / 2, src.height / 2)
    const ctx = cnv.getContext("2d")
    //
    ctx["imageSmoothingQuality"] = "high" // VERY IMORTANT!!! (or else lines of some grid disappear)
    //
    ctx.drawImage(src, 0,0,src.width,src.height, 0,0,cnv.width,cnv.height)
    //
    return cnv
}

