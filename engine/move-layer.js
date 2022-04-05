// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var remainingMoveX = 0 // necessary when zoom is greater than one
var remainingMoveY = 0 // and mouse moves slowly

var consecutiveMovesByKeyboard = 0
var realTimeOfLastMoveByKeyboard = 0

///////////////////////////////////////////////////////////////////////////////

function resetMove() {
    remainingMoveX = 0
    remainingMoveY = 0
}

///////////////////////////////////////////////////////////////////////////////

function moveLayers(rawDeltaX, rawDeltaY) {
    //
    if (toplayer == null) { return }
    //
    const deltas = calcMoveValues(rawDeltaX, rawDeltaY) 
    //
    for (const layer of layers) {
        if (! layer.enabled) { continue }
        //
        layer.left += deltas["deltaX"]
        layer.top  += deltas["deltaY"]
    }
}

///////////////////////////////////////////////////////////////////////////////

function moveTopLayer(rawDeltaX, rawDeltaY) {
    //
    if (toplayer == null) { return }
    //
    const deltas = calcMoveValues(rawDeltaX, rawDeltaY)  
    //
    if (! ctrlPressed) {
        //
        toplayer.left += deltas["deltaX"]
        toplayer.top  += deltas["deltaY"]
        return
    }
    //
    // displacing content
    //
    const src = cloneImage(toplayer.canvas)
    //
    const ctx = toplayer.canvas.getContext("2d")
    ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
    ctx.drawImage(src, deltas["deltaX"], deltas["deltaY"])
    //
    if (! canvasesAreEqual(src, toplayer.canvas)) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function calcMoveValues(rawDeltaX, rawDeltaY) {
    //
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
    return { "deltaX": deltaX, "deltaY": deltaY }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function resetMoveByKeyboard() {
    //
    consecutiveMovesByKeyboard = 0
}

function moveTopLayerByKeyboard() { // no more than once per loop!
    //
    if (toplayer == null) { return }
    //
    const elapsedTime = Date.now() - realTimeOfLastMoveByKeyboard
    //
    if (elapsedTime < 200) { return }
    //
    let deltaLeft = 0
    let deltaTop = 0
    // 
    if (upPressed)    { deltaTop  = -1 }
    if (downPressed)  { deltaTop  = +1 }
    if (leftPressed)  { deltaLeft = -1 }
    if (rightPressed) { deltaLeft = +1 }
    //
    if (deltaLeft == 0  &&  deltaTop == 0) { return }
    //
    let factor = 1
    //
    if (consecutiveMovesByKeyboard > 0) { factor =  5 }
    if (consecutiveMovesByKeyboard > 5) { factor = 30 }
    //
    deltaLeft *= factor
    deltaTop  *= factor
    //
    // these flags must be updated here, after the abort checks
    // because mainLoop ALWAYS calls this function
    //
    consecutiveMovesByKeyboard += 1
    //
    realTimeOfLastMoveByKeyboard = Date.now()
    //
    shallRepaint = true // << it is here!
    //
    if (! ctrlPressed) {
        toplayer.left += deltaLeft
        toplayer.top  += deltaTop
        return
    }
    //
    // displacing content
    //
    const src = cloneImage(toplayer.canvas)
    //
    const ctx = toplayer.canvas.getContext("2d")
    ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
    ctx.drawImage(src, deltaLeft, deltaTop)
    //
    if (! canvasesAreEqual(src, toplayer.canvas)) { memorizeTopLayer() }
}

