// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// when painting with mouse, global mouseBusy blocks input by keyboard!
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
    //
    if (toplayer == null) { customAlert("no layer on for image loading"); return }
    //
    startBlinkingIconOnTopBar("load") 
    //
    isPaletteFile = false
    loadImageFile()
}

function imageLoaded(cnv) {
    //
    sendImageToTopLayer(cloneImage(cnv))
    //
    fileToFavorites(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function saveImage(style) {
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("save") 
    //
    isPaletteFile = false
    saveStyle = style
    //
    makeCheckedPicture(saveImage2)
}

function saveImage2(pic) {
    //
    saveImageFile(pic)
    //
    toFavoritesCore(pic)
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
    if (toplayer == null) { return }
    //
    const changed = func(toplayer.canvas)
    if (changed) { memorizeTopLayer() }
}

function applyEffect2(func) {
    if (toplayer == null) { return }
    //
    const cnv = cloneImage(toplayer.canvas)
    func(toplayer.canvas)
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function managerCapture() { // very fast, need not to be set as task
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

function managerPaintArea() {
    setTask(managerPaintAreaCore)
}

function managerPaintAreaCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed 
    if (shiftPressed) {
        changed = paintArea(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintArea(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintEvery() {
    setTask(managerPaintEveryCore)
}

function managerPaintEveryCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed 
    if (shiftPressed) {
        changed = paintEvery(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintEvery(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintBorder() {
    setTask(managerPaintBorderCore)
}

function managerPaintBorderCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed 
    if (shiftPressed) {
        changed = paintBorder(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintBorder(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)    
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerBlurBorder() {
    setTask(managerBlurBorderCore)
}

function managerBlurBorderCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed = blurBorder(toplayer.canvas, x, y)
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function leftRightToCenter() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("halves")
    //
    let width = toplayer.canvas.width
    if (width % 2 != 0) { width += 1 }
    //
    const height = toplayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(width / 2)
    //
    ctx.drawImage(toplayer.canvas, -half, 0)
    ctx.drawImage(toplayer.canvas, +half, 0)
    //
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    toplayer.canvas = cnv
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function topBottomToCenter() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("halves") 
    //
    let height = toplayer.canvas.height
    if (height % 2 != 0) { height += 1 }
    //
    const width = toplayer.canvas.width
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(height / 2)
    //
    ctx.drawImage(toplayer.canvas, 0, -half)
    ctx.drawImage(toplayer.canvas, 0, +half)
    //
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    toplayer.canvas = cnv
    memorizeTopLayer()
}

