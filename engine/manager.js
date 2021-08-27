// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// when painting with mouse global mouseBusy blocks input by keyboard!
// also, when mouse is painting it is not pressing icons or panel buttons
// so task management may safely ignore painting by mouse

// the standard handling of an action is call setTask;
// some fast actions skip this step


// task management ////////////////////////////////////////////////////////////

var TASK = null

function setTask(callback) {
    if (TASK != null) { return }
    TASK = callback
}

function runTask() {
    if (TASK == null) { return }
    TASK()
    TASK = null
}

///////////////////////////////////////////////////////////////////////////////

function loadImage() {
    if (getTopLayer() == null) { return }
    //
    startBlinkingIconOnTopBar("load") 
    //
    isPaletteFile = false
    loadImageFile()
}

function afterLoadImage(cnv, __filename) {
    sendImageToTopLayer(cnv, true) // clones the image
    fileToFavorites(cnv)
    //
    if (cnv.width == canvas.width  &&  cnv.height == canvas.height) { return }
    //
    customConfirm("resize canvas to match layer size?", resizeCanvasByLayer)
}

///////////////////////////////////////////////////////////////////////////////

function saveImage(style) {
    if (getTopLayer() == null) { return }
    //
    startBlinkingIconOnTopBar("save") 
    //
    isPaletteFile = false
    saveStyle = style
    saveImageFile(canvasToPicture())
    canvasToFavorites()
}

///////////////////////////////////////////////////////////////////////////////

function applyEffect(func) {
    shallRepaint = true
    //
    function callback () { applyEffect1(func) }
    setTask(callback)
}

///////////////////////////////////////////////////////////////////////////////

function applyEffect1(func) {
    //
    if (func == pixelate2) { applyEffect2(func); return }
    if (func == pixelate3) { applyEffect2(func); return }
    if (func == pixelate4) { applyEffect2(func); return }
    if (func == pixelate5) { applyEffect2(func); return }
    if (func == verticalReverse) { applyEffect2(func); return }
    if (func == horizontalReverse) { applyEffect2(func); return }
    if (func == antialiasingStrong) { applyEffect2(func); return }
    if (func == antialiasingStandard) { applyEffect2(func); return }
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    const changed = func(layer.canvas)
    if (changed) { memorizeTopLayer() }
}

function applyEffect2(func) {
    const layer = getTopLayerAdjusted() 
    if (layer == null) { return }
    //
    const cnv = cloneImage(layer.canvas)
    func(layer.canvas)
    if (canvasesAreEqual(layer.canvas, cnv)) { return }
    //
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function managerCapture() { // very fast, need not to be set as task
    //
    if (canvasX == null  ||  canvasY == null) { return }
    //
    if (mouseAlpha <= 0) { return } // mouseAlpha is -1 when mouse is off layer
    //
    if (tool == "capture") { recoverToolBeforeCapture() }
    //
    const color = [ mouseRed, mouseGreen, mouseBlue, mouseAlpha ]
    updateCurrentColor(color) 
    //
    maybeRepaintColorPanel()
}

///////////////////////////////////////////////////////////////////////////////

function managerSelectArea() {
    setTask(managerSelectAreaCore) 
}

function managerSelectAreaCore() {
    if (canvasX == null  ||  canvasY == null) { return }
    const superlayer = layers[0]
    const src = canvasToPicture()
    superlayer.canvas = getArea(src, canvasX, canvasY)
    memorizeLayer(superlayer)
    showSuperLayerOnly()
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintArea() {
    setTask(managerPaintAreaCore)
}

function managerPaintAreaCore() {
    //
    const layer = getTopLayerAdjusted() // must come first
    if (layer == null) { return }
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    let changed 
    if (shiftPressed) {
        changed = paintArea(layer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintArea(layer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(layer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintEvery() {
    setTask(managerPaintEveryCore)
}

function managerPaintEveryCore() {
    //
    const layer = getTopLayerAdjusted() // must come first
    if (layer == null) { return }
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    let changed 
    if (shiftPressed) {
        changed = paintEvery(layer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintEvery(layer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(layer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintBorder() {
    setTask(managerPaintBorderCore)
}

function managerPaintBorderCore() {
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    let changed 
    if (shiftPressed) {
        changed = paintBorder(layer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintBorder(layer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(layer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerBlurBorder() {
    setTask(managerBlurBorderCore)
}

function managerBlurBorderCore() {
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    let changed = blurBorder(layer.canvas, x, y)
    if (changed) { memorizeLayer(layer) }
}

///////////////////////////////////////////////////////////////////////////////

function leftRightToCenter() {
    shallRepaint = true
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    startBlinkingIconOnTopBar("halves")
    //
    let width = layer.canvas.width
    if (width % 2 != 0) { width += 1 }
    //
    const height = layer.canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(width / 2)
    //
    ctx.drawImage(layer.canvas, -half, 0)
    ctx.drawImage(layer.canvas, +half, 0)
    //
    if (canvasesAreEqual(layer.canvas, cnv)) { return }
    //
    layer.canvas = cnv
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function topBottomToCenter() {
    shallRepaint = true
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return }
    //
    startBlinkingIconOnTopBar("halves") 
    //
    let height = layer.canvas.height
    if (height % 2 != 0) { height += 1 }
    //
    const width = layer.canvas.width
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(height / 2)
    //
    ctx.drawImage(layer.canvas, 0, -half)
    ctx.drawImage(layer.canvas, 0, +half)
    //
    if (canvasesAreEqual(layer.canvas, cnv)) { return }
    //
    layer.canvas = cnv
    memorizeTopLayer()
}

