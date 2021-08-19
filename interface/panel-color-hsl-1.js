// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelHsl   
var panelHslCtx

var surfaceHslReference
var surfaceHslCurrent

var surfaceHsl
var surfaceHue
var surfaceDetail

var buttonHslCopy
var buttonToRgba

var panelHslGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelHsl() {
    panelHsl = createCanvas(240, 305)
    panelHslCtx = panelHsl.getContext("2d")
    //
    panelHsl.style.position = "absolute"
    panelHsl.style.top = "325px"
    panelHsl.style.left = "1060px"
    panelHsl.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelHsl)
    //
    initPanelHsl2()
}

function initPanelHsl2() {
    //
    initHslComplements()
    //
    surfaceHslReference = createSurface("hsl-reference", panelHslCtx, 40, 4, 80, 35)
    configSurfaceHslReference()
    //
    surfaceHslCurrent = createSurface("hsl-current", panelHslCtx, 120, 4, 80, 35)
    configSurfaceHslCurrent()
    //
    surfaceHsl = createSurface("box-hsl", panelHslCtx, 6-5, 48-5, 228+10, 125+10)
    configSurfaceHsl()
    //
    surfaceDetail = createSurface("box-detail", panelHslCtx, 3, 185, 234, 25)
    configSurfaceDetail()
    //
    surfaceHue = createSurface("box-hue", panelHslCtx, 3, 217, 234, 41)
    configSurfaceHue()
    //
    buttonToRgba = createButton("to-rgba", panelHslCtx,  13, 267, 97, 30, "to  R G B A", changeToRgba, false)
    buttonHslCopy = createButton("hsl-copy", panelHslCtx, 130, 267, 97, 30, "copy to ref", hslCopyToReference, false)
    //
    panelHslGadgets = [ surfaceHslReference, surfaceHslCurrent, surfaceHue, surfaceHsl, surfaceDetail, 
                        buttonToRgba, buttonHslCopy ]
    //
    adjustHslGadgetsToCurrentColor()
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelHsl() {
    panelHsl.onmouseup = panelOnMouseUp
    panelHsl.onmousedown = panelOnMouseDown
    panelHsl.onmousemove = panelOnMouseMove
    panelHsl.onmouseleave = panelOnMouseLeave
    panelHsl.onmouseenter = function () { panelOnMouseEnter(panelHslGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelHsl() {
    // background
    panelHslCtx.fillStyle = wingColor()
    panelHslCtx.fillRect(0, 0, 240, 305)
    //
    greyEmptyRect(panelHslCtx, surfaceHslReference.left-1, surfaceHslReference.top-1, 
                               surfaceHslReference.width*2+2, surfaceHslReference.height+2)
    //
    paintSurfaceHslReference()
    paintSurfaceHslCurrent()
    //
    write(panelHslCtx, "ref", 10, 17)
    write(panelHslCtx, "cur", 205, 17)
    // 
    greyEmptyRect(panelHslCtx, surfaceHsl.left+5-1, surfaceHsl.top+5-1, 
                               surfaceHsl.width-10+2, surfaceHsl.height-10+2)
    //
    greyOuterEdgeByGadget(surfaceDetail)
    //
    adjustHslGadgetsToCurrentColor()
    //
    greyOuterEdgeByGadget(surfaceHue)
    paintSurface(surfaceHue)
    //
    paintButton(buttonToRgba)
    paintButton(buttonHslCopy)
}

function paintSurfaceHslReference() {
    //
    panelHslCtx.fillStyle = "rgb(" + referenceRed + "," + referenceGreen + "," + referenceBlue + ")"
    //
    const gadget = surfaceHslReference
    panelHslCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceHslReference) { return }
    //
    changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha], true)
}

function paintSurfaceHslCurrent() {
    //
    panelHslCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    //
    const gadget = surfaceHslCurrent
    panelHslCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceHslCurrent) { return }
    //
    changeMouseColor([RED, GREEN, BLUE, ALPHA], true)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHslReference() {
    //
    surfaceHslReference.onMouseMove = function () { changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha]) }
    //
    surfaceHslReference.onMouseDown = function () { tradeColors(); paintPanelHsl() }
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHslCurrent() {
    //
    surfaceHslCurrent.onMouseMove = function () { changeMouseColor([RED, GREEN, BLUE, ALPHA]) }
    //
    surfaceHslCurrent.onMouseDown = function () { tradeColors(); paintPanelHsl() }
}

///////////////////////////////////////////////////////////////////////////////

function adjustHslGadgetsToCurrentColor() { 
    //
    const color = [RED, GREEN, BLUE]
    //
    const hsl = rgbToHsl(color)
    const hue = hsl[0]
    // 
    paintSurfaceDetail(hue) 
    //
    drawHslGradient(hue) 
    //
    const point = bestMatchingPixel(hslGradient, color) // must send canvas without marker!
    surfaceHslX = point.x
    surfaceHslY = point.y
    //
    repaintSurfaceHsl()
}

///////////////////////////////////////////////////////////////////////////////

function updateByHue() {
    const hsl = rgbToHsl([mouseRed, mouseGreen, mouseBlue])
    const hue = hsl[0]
    //
    paintSurfaceDetail(hue) 
    paintSurfaceHsl(hue)
    updateCurrentColorByHsl()
}

function updateByDetail() {
    const hsl = rgbToHsl([mouseRed, mouseGreen, mouseBlue])
    const hue = hsl[0]
    //
    paintSurfaceHsl(hue)
    updateCurrentColorByHsl()
}

function updateCurrentColorByHsl() { // not by input on surfaceHsl
    const color = colorAtHslMark()
    //
    updateCurrentColor(color) // alpha is 255
    //
    paintSurfaceHslCurrent()
}

///////////////////////////////////////////////////////////////////////////////

function hslCopyToReference() {
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA 
    //
    paintSurfaceHslReference()
}

///////////////////////////////////////////////////////////////////////////////

function changeToRgba() {
    hidePolyPanel()
    hslOrRgba = "rgba"
    startBlinkingButton(buttonToHsl) // other panel button
    paintAndShowPolyPanel()
}

