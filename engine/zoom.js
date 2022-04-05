// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var ZOOM = 5
var zooms = [ 0.5, 1, 2, 3, 4, 5, 6, 10, 15, 20 ]

///////////////////////////////////////////////////////////////////////////////

function decreaseZoom() {
    if (mouseBusy) { return }
    if (ZOOM == 0.5) { return }
    //    
    startBlinkingIconOnTopBar("minus") 
    setZoom(-1) 
}

function increaseZoom() {
    if (mouseBusy)  { return }
    if (ZOOM == 20) { return }
    //    
    startBlinkingIconOnTopBar("plus") 
    setZoom(+1) 
}

function setZoom(delta) {
    shallRepaint = true
    //
    const n = zooms.indexOf(ZOOM) + delta
    ZOOM = zooms[n]
    //
    updateStageXY()
    //
    paintZoomOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function zoomedLeft(layer) { 
    //
    const layerCenterX = layer.left + (layer.canvas.width / 2)
    //
    const layerDisplacementX = stageCenterX - layerCenterX
    //
    const layerZoomedCenterX = stageCenterX - (layerDisplacementX * ZOOM)
    //
    const halfZoomedWidth = layer.canvas.width * ZOOM / 2
    //
    return Math.floor(layerZoomedCenterX - halfZoomedWidth)
}

function zoomedTop(layer) { 
    //
    const layerCenterY = layer.top + (layer.canvas.height / 2)
    //
    const layerDisplacementY = stageCenterY - layerCenterY
    //
    const layerZoomedCenterY = stageCenterY - (layerDisplacementY * ZOOM)
    //
    const halfZoomedHeight = layer.canvas.height * ZOOM / 2
    //
    return Math.floor(layerZoomedCenterY - halfZoomedHeight)
}

