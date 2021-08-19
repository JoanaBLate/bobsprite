// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var remainingMoveX = 0 // necessary when zoom is greater than one
var remainingMoveY = 0 // and mouse moves slowly

///////////////////////////////////////////////////////////////////////////////

function resetMove() {
    remainingMoveX = 0
    remainingMoveY = 0
}

///////////////////////////////////////////////////////////////////////////////

function moveLayersByMouse(rawDeltaX, rawDeltaY) {
    remainingMoveX += rawDeltaX
    remainingMoveY += rawDeltaY
    //
    // Math.floor is bad for negative values!!!!
    //
    const signX = Math.sign(remainingMoveX)
    const signY = Math.sign(remainingMoveY)
    //
    remainingMoveX = Math.abs(remainingMoveX)
    remainingMoveY = Math.abs(remainingMoveY)
    //
    let deltaX = Math.floor(remainingMoveX / ZOOM)
    let deltaY = Math.floor(remainingMoveY / ZOOM)
    //
    remainingMoveX -= (deltaX * ZOOM)
    remainingMoveY -= (deltaY * ZOOM)
    //
    remainingMoveX *= signX
    remainingMoveY *= signY
    //
    deltaX *= signX
    deltaY *= signY
    //
    moveLayersCore(deltaX, deltaY)
}

///////////////////////////////////////////////////////////////////////////////

function moveLayersCore(deltaLeft, deltaTop) {   
    //
    for (const layer of layers) {
        if (! layer.enabled) { continue }
        //
        layer.left += deltaLeft
        layer.top  += deltaTop
        //
        if (! shiftPressed) { break }
    }
}

