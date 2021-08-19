// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var ZOOM = 5
var zooms = [ 1, 2, 3, 4, 5, 6, 10, 15, 20 ]

///////////////////////////////////////////////////////////////////////////////

function decreaseZoom() {
    if (ZOOM != 1) { setZoom(-1) }
}

function increaseZoom() {
    if (ZOOM != 20) { setZoom(+1) }
}

function setZoom(delta) {
    shallRepaint = true
    //
    const oldZoom = ZOOM
    const n = zooms.indexOf(ZOOM) + delta
    ZOOM = zooms[n]
    keepCanvasFocusAfterZoom(oldZoom)
    //
    paintZoomOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function keepCanvasFocusAfterZoom(oldZoom) {
    //
    const focusX = canvasFocusX(oldZoom)
    const focusY = canvasFocusY(oldZoom)
    //
    const zoomedFocusX = focusX * ZOOM
    const zoomedFocusY = focusY * ZOOM
    //
    canvasLeft = 450 - zoomedFocusX
    canvasTop = 300 - zoomedFocusY
}

///////////////////////////////////////////////////////////////////////////////

function canvasFocusX(zoom) { // using custom zoom, not ZOOM
    const zoomedWidth = canvas.width * zoom
    let zoomedFocusX = 450 - canvasLeft
    if (zoomedFocusX < 0) { zoomedFocusX = 0 }
    if (zoomedFocusX > zoomedWidth - 1) { zoomedFocusX = zoomedWidth - 1 }
    return Math.floor(zoomedFocusX / zoom)
}

function canvasFocusY(zoom) { // using custom zoom, not ZOOM
    const zoomedHeight = canvas.height * zoom
    let zoomedFocusY = 300 - canvasTop
    if (zoomedFocusY < 0) { zoomedFocusY = 0 }
    if (zoomedFocusY > zoomedHeight - 1) { zoomedFocusY = zoomedHeight - 1 }
    return Math.floor(zoomedFocusY / zoom)
}

