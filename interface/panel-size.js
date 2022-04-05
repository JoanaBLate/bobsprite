// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelSize   
var panelSizeCtx

var boxNewWidth
var boxNewHeight

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
    //
    buttonResizeLayer = createButton("resize-layer", ctx, 40, 90, 160, 40, "resize layer", resizeLayer, false)
    //
    buttonScaleLayer = createButton("scale-layer", ctx, 40, 150, 160, 40, "scale layer", scaleLayer, false)
    //
    buttonAutocropLayer = createButton("autocrop-layer", ctx, 40, 210, 160, 40, "autocrop layer", autocropLayer, false)
    //
    checkboxSizePixelated = createCheckbox("pixelated-scale", ctx, 190, 275, 12, null, true)
    //
    panelSizeGadgets = [ boxNewWidth, boxNewHeight, buttonResizeLayer, buttonScaleLayer, buttonAutocropLayer, checkboxSizePixelated ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelSize() {
    panelSize.onclick = panelOnMouseUp
    panelSize.onmousedown = panelOnMouseDown
    panelSize.onmousemove = panelOnMouseMove
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
    paintButton(buttonResizeLayer)
    paintButton(buttonScaleLayer)
    paintButton(buttonAutocropLayer)
    //
    write(panelSizeCtx, "pixelated scaling", 55, 275)
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

