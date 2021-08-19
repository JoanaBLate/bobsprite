// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelRgba   
var panelRgbaCtx

var surfaceRgbaReference
var surfaceRgbaCurrent

var numboxRgbaRed
var numboxRgbaGreen
var numboxRgbaBlue
var numboxRgbaAlpha

var buttonToHsl
var buttonRgbaCopy

var panelRgbaGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelRgba() {
    panelRgba = createCanvas(240, 305)
    panelRgbaCtx = panelRgba.getContext("2d")
    //
    panelRgba.style.position = "absolute"
    panelRgba.style.top = "325px"
    panelRgba.style.left = "1060px"
    panelRgba.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelRgba)
    //
    initPanelRgba2()
}

function initPanelRgba2() {
    //
    surfaceRgbaReference = createSurface("rgba-reference", panelRgbaCtx, 40, 4, 80, 35)
    configSurfaceRgbaReference()
    //
    surfaceRgbaCurrent = createSurface("rgba-current", panelRgbaCtx, 120, 4, 80, 35)
    configSurfaceRgbaCurrent()
    //
    numboxRgbaRed   = createNumbox("rgba-red",   panelRgbaCtx, 135,  70, 60, 30, ""+RED,   255, updateCurrentColorByRgba)
    numboxRgbaGreen = createNumbox("rgba-green", panelRgbaCtx, 135, 115, 60, 30, ""+GREEN, 255, updateCurrentColorByRgba)
    numboxRgbaBlue  = createNumbox("rgba-blue",  panelRgbaCtx, 135, 160, 60, 30, ""+BLUE,  255, updateCurrentColorByRgba)
    numboxRgbaAlpha = createNumbox("rgba-alpha", panelRgbaCtx, 135, 205, 60, 30, ""+ALPHA, 255, updateCurrentColorByRgba)
    //
    buttonToHsl = createButton("to-hsl", panelRgbaCtx, 13, 267, 97, 30, "to  H S L", changeToHsl, false)
    buttonRgbaCopy = createButton("rgba-copy", panelRgbaCtx, 130, 267, 97, 30, "copy to ref", rgbaCopyToReference, false)
    //
    panelRgbaGadgets = [ surfaceRgbaReference, surfaceRgbaCurrent, buttonToHsl, buttonRgbaCopy,
                         numboxRgbaRed, numboxRgbaGreen, numboxRgbaBlue, numboxRgbaAlpha ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelRgba() {
    panelRgba.onmouseup = panelOnMouseUp
    panelRgba.onmousedown = panelOnMouseDown
    panelRgba.onmousemove = panelOnMouseMove
    panelRgba.onmouseleave = panelOnMouseLeave
    panelRgba.onmouseenter = function () { panelOnMouseEnter(panelRgbaGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelRgba() {
    // background
    panelRgbaCtx.fillStyle = wingColor()
    panelRgbaCtx.fillRect(0, 0, 240, 305)
    //
    greyEmptyRect(panelRgbaCtx, surfaceRgbaReference.left-1, surfaceRgbaReference.top-1, 
                                surfaceRgbaReference.width*2+2, surfaceRgbaReference.height+2)
    //
    paintSurfaceRgbaReference()
    paintSurfaceRgbaCurrent()
    //
    write(panelRgbaCtx, "ref", 10, 17)
    write(panelRgbaCtx, "cur", 205, 17)
    //
    write(panelRgbaCtx, "RED",   60,  83)
    write(panelRgbaCtx, "GREEN", 60, 128)
    write(panelRgbaCtx, "BLUE",  60, 173)
    write(panelRgbaCtx, "ALPHA", 60, 218)    
    //
    resetNumbox(numboxRgbaRed,   ""+RED)
    resetNumbox(numboxRgbaGreen, ""+GREEN)
    resetNumbox(numboxRgbaBlue,  ""+BLUE)
    resetNumbox(numboxRgbaAlpha, ""+ALPHA)    
    //
    paintNumbox(numboxRgbaRed)
    paintNumbox(numboxRgbaGreen)
    paintNumbox(numboxRgbaBlue)
    paintNumbox(numboxRgbaAlpha)
    // 
    paintButton(buttonToHsl)
    paintButton(buttonRgbaCopy)
}

function paintSurfaceRgbaReference() {
    //
    panelRgbaCtx.fillStyle = "rgb(" + referenceRed + "," + referenceGreen + "," + referenceBlue + ")"
    //
    const gadget = surfaceRgbaReference
    panelRgbaCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceRgbaReference) { return }
    //
    changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha], true)
}

function paintSurfaceRgbaCurrent() {
    //
    panelRgbaCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    //
    const gadget = surfaceRgbaCurrent
    panelRgbaCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceRgbaCurrent) { return }
    //
    changeMouseColor([RED, GREEN, BLUE, ALPHA], true)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceRgbaReference() {
    //
    surfaceRgbaReference.onMouseMove = function () { changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha]) }
    //
    surfaceRgbaReference.onMouseDown = function () { tradeColors(); paintPanelRgba() }
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceRgbaCurrent() {
    //
    surfaceRgbaCurrent.onMouseMove = function () { changeMouseColor([RED, GREEN, BLUE, ALPHA]) }
    //
    surfaceRgbaCurrent.onMouseDown = function () { tradeColors(); paintPanelRgba() }
}

///////////////////////////////////////////////////////////////////////////////

function updateCurrentColorByRgba() {
    const r = parseInt(numboxRgbaRed.text)
    const g = parseInt(numboxRgbaGreen.text)
    const b = parseInt(numboxRgbaBlue.text)
    const a = parseInt(numboxRgbaAlpha.text)
    //
    updateCurrentColor([r, g, b, a])
    paintSurfaceRgbaCurrent()
}

///////////////////////////////////////////////////////////////////////////////

function rgbaCopyToReference() {
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA 
    //
    paintSurfaceRgbaReference()
}

///////////////////////////////////////////////////////////////////////////////

function changeToHsl() { 
    hidePolyPanel()
    hslOrRgba = "hsl"
    startBlinkingButton(buttonToRgba) // other panel button
    paintAndShowPolyPanel()
}

