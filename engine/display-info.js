// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// not all info goes here 


var infoToolSize = null
var infoToolIntensity = null

var infoCanvasX = null
var infoCanvasY = null

var infoCanvasWidth = null
var infoCanvasHeight = null

var infoLayerWidth = null
var infoLayerHeight = null

var infoLayerLeft = null
var infoLayerTop = null

var infoLayerOpacity = null

///////////////////////////////////////////////////////////////////////////////

function displayGeneralInfo() {
    //
    displayToolSize()
    displayToolIntensity()
    //
    displayMousePosition()
    displayCanvasSize()
    displayLayerSize()
    displayLayerPosition()
    displayLayerOpacity()
}

///////////////////////////////////////////////////////////////////////////////

function displayToolSize() {
    //
    let data = null
    const side = toolSizeFor[tool]
    if (side != undefined) { data = side }
    //
    if (infoToolSize == data) { return }
    //
    infoToolSize = data
    paintToolSizeOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function displayToolIntensity() {
    //
    let data = null
    const intensity = intensityFor[tool]
    if (intensity != undefined) { data = intensity }
    //
    if (infoToolIntensity == data) { return }
    //
    infoToolIntensity = data
    paintToolIntensityOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function displayMousePosition() {
    //
    if (infoCanvasX == canvasX  &&  infoCanvasY == canvasY) { return }
    //
    infoCanvasX = canvasX
    infoCanvasY = canvasY
    //
    paintMousePositionOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayCanvasSize() {
    //
    if (infoCanvasWidth == canvas.width  &&  infoCanvasHeight == canvas.height) { return }
    //
    infoCanvasWidth = canvas.width
    infoCanvasHeight = canvas.height
    //
    paintCanvasSizeOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerSize() {
    //
    const layer = getTopLayer()
    //
    const width  = (layer == null) ? null : layer.canvas.width
    const height = (layer == null) ? null : layer.canvas.height
    //
    if (infoLayerWidth == width  &&  infoLayerHeight == height) { return }
    //
    infoLayerWidth = width
    infoLayerHeight = height
    //
    paintLayerSizeOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerPosition() {
    //
    const layer = getTopLayer()
    //
    const left = (layer == null) ? null : layer.left
    const top  = (layer == null) ? null : layer.top
    //
    if (infoLayerLeft == left  &&  infoLayerTop == top) { return }
    //
    infoLayerLeft = left
    infoLayerTop = top
    //
    paintLayerPositionOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerOpacity() {
    //
    const opacity = getTopLayerOpacity()
    //
    if (infoLayerOpacity == opacity) { return }
    //
    infoLayerOpacity = opacity
    //
    paintLayerOpacityOnBottomBar()
}

