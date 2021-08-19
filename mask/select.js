// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// the interface allows no interference


///////////////////////////////////////////////////////////////////////////////

var selectStartX = null
var selectStartY = null
var selectEndX // necessary to fix inverted coordinate
var selectEndY // necessary to fix inverted coordinate


function startSelect() {
    if (getTopLayer() == null) { return }
    //
    resetMask()
    //
    maskCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    //
    selectStartX = canvasX
    selectStartY = canvasY
    continueSelect()
}

function continueSelect() {
    if (selectStartX == null  ||  selectStartY == null) { return }
    const currentX = canvasX
    const currentY = canvasY
    if (currentX == null  ||  currentY == null) { return } // doesn't erase selectStartXY
    //
    clearMask()
    //
    selectEndX = currentX
    selectEndY = currentY
    //
    let startX = selectStartX
    let startY = selectStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = selectStartX }
    if (endY < startY) { startY = currentY; endY = selectStartY }
    //
    const width  = endX - startX + 1
    const height = endY - startY + 1
    //
    maskCtx.clearRect(startX, startY, width, height) // clearing: not necessary when using opaque colors 
    maskCtx.fillRect(startX, startY, width, height)  // filling
    //
    if (width  < 3) { return }
    if (height < 3) { return }
    // erasing inside:
    maskCtx.clearRect(startX + 1, startY + 1, width - 2, height - 2)
}

function finishSelect() {
     // avoids mess by mouse up when select has not started
    if (selectStartX == null  ||  selectStartY == null) { return }
    //
    if (selectStartX > selectEndX) {
        const x = selectStartX; selectStartX = selectEndX; selectEndX = x
    }
    //
    if (selectStartY > selectEndY) {
        const y = selectStartY; selectStartY = selectEndY; selectEndY = y
    }
    //
    const left = selectStartX + 1 // internal side
    const top  = selectStartY + 1 // internal side
    const width  = selectEndX - selectStartX - 1 // internal side
    const height = selectEndY - selectStartY - 1 // internal side
    //
    selectStartX = null
    selectStartY = null
    //
    if (width  < 1) { hideMask(); return } // -1 happens on single click
    if (height < 1) { hideMask(); return } // -1 happens on single click
    //
    maskCtx.fillRect(left, top, width, height)
    //
    const layer = getTopLayer()
    const shallErase = shiftPressed  &&  (layer != layers[0]) // not going to mess the superlayer
    // 
    adjustSuperLayerByMask()
    //
    if (shallErase) { clearLayerByMask(layer) }
}

