// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelSize   
var panelSizeCtx

var boxNewWidth
var boxNewHeight

var buttonResizeCanvas
var buttonResizeByLayer
var buttonResizeLayer
var buttonScaleLayer
var buttonAutocropLayer

var checkboxSizePixelated

var panelSizeGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelSize() {
    panelSize = createCanvas(240, 305)
    panelSizeCtx = panelSize.getContext("2d")
    //
    panelSize.style.position = "absolute"
    panelSize.style.top = "325px"
    panelSize.style.left = "1060px"
    panelSize.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelSize)
    //
    initPanelSize2() 
}

function initPanelSize2() {
    //
    const ctx = panelSizeCtx
    const w = "" + recoverNewWidthFromLocalStorage()
    const h = "" + recoverNewHeightFromLocalStorage()
    //
    boxNewWidth = createNumbox("new-width",  ctx,  40, 20, 60, 30, w,  2000, null)
    boxNewHeight = createNumbox("new-height", ctx, 140, 20, 60, 30, h, 2000, null)
    //        
    buttonResizeCanvas = createButton("resize-canvas", ctx, 40,  80, 160, 28, "resize canvas", 
                                      resizeCanvasByNewDimensions, false)
    //
    buttonResizeByLayer = createButton("resize-by-layer", ctx, 40, 120, 160, 28, "resize canvas by layer", 
                                       resizeCanvasByLayer, false)
    //
    buttonResizeLayer = createButton("resize-layer", ctx, 40, 160, 160, 28, "resize layer", resizeLayer, false)
    //
    buttonScaleLayer = createButton("scale-layer", ctx, 40, 200, 160, 28, "scale layer", scaleLayer, false)
    //
    buttonAutocropLayer = createButton("autocrop-layer", ctx, 40, 240, 160, 28, "autocrop layer", autocropLayer, false)
    //
    checkboxSizePixelated = createCheckbox("pixelated-scale", ctx, 185, 280, 12, null, true)
    //
    panelSizeGadgets = [ boxNewWidth, boxNewHeight, buttonResizeCanvas, buttonResizeByLayer, buttonResizeLayer,
                         buttonScaleLayer, buttonAutocropLayer, checkboxSizePixelated ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelSize() {
    panelSize.onclick = panelOnMouseUp
    panelSize.onmousedown = panelOnMouseDown
    panelSize.onmouseleave = panelOnMouseLeave
    panelSize.onmouseenter = function () { panelOnMouseEnter(panelSizeGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelSize() { 
    // background
    panelSizeCtx.fillStyle = wingColor()
    panelSizeCtx.fillRect(0, 0, 240, 305)
    //
    write(panelSizeCtx, "new width", 37, 55)
    write(panelSizeCtx, "new height", 133, 55)
    //
    paintNumbox(boxNewWidth)
    paintNumbox(boxNewHeight)
    //
    paintButton(buttonResizeCanvas)
    paintButton(buttonResizeByLayer)
    paintButton(buttonResizeLayer)
    paintButton(buttonScaleLayer)
    paintButton(buttonAutocropLayer)
    //
    write(panelSizeCtx, "pixelated scaling", 55, 280)
    paintCheckbox(checkboxSizePixelated)
}

///////////////////////////////////////////////////////////////////////////////

function getNewWidth() {
    fixNewWidth() 
    return parseInt(boxNewWidth.text)
}

function getNewHeight() {
    fixNewHeight() 
    return parseInt(boxNewHeight.text)
}

///////////////////////////////////////////////////////////////////////////////

function fixNewWidth() { 
    fixNewDimension(boxNewWidth, 120)
}

function fixNewHeight() { 
    fixNewDimension(boxNewHeight, 80)
}

function fixNewDimension(numbox, defaul) {
    //
    let val = parseInt(numbox.text)
    //
    if (isNaN(val)) { val = defaul }
    if (val == 0)   { val = defaul }
    if (val > 2000) { val = 2000 }
    resetNumbox(numbox, "" + val) // also cleans "003" for example
    //
    return val
}

