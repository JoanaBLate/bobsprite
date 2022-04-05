// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// not all info goes here 


var infoToolSize = null
var infoToolIntensity = null

var infoLayerX = null
var infoLayerY = null

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
    const layerX = getTopLayerX()
    const layerY = getTopLayerY()
    //
    if (infoLayerX == layerX  &&  infoLayerY == layerY) { return }
    //
    infoLayerX = layerX
    infoLayerY = layerY
    //
    paintMousePositionOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerSize() {
    //
    const width  = (toplayer == null) ? null : toplayer.canvas.width
    const height = (toplayer == null) ? null : toplayer.canvas.height
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
    const left = (toplayer == null) ? null : toplayer.left
    const top  = (toplayer == null) ? null : toplayer.top
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

