// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// validation by (mask != null)

var rectangleIsDot = true // 1 x 1 px 

///////////////////////////////////////////////////////////////////////////////

function startRectangle() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    maskCtx.fillStyle = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")" // traditional painting on mask
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueRectangle()
}

function continueRectangle() { 
    //
    if (mask == null) { return }
    //
    maskCtx.clearRect(0, 0, mask.width, mask.height)
    //
    const currentX = stageX - toplayer.left
    const currentY = stageY - toplayer.top
    //
    let startX = paintStartX
    let startY = paintStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = paintStartX }
    if (endY < startY) { startY = currentY; endY = paintStartY } 
    //
    const width  = endX - startX + 1
    const height = endY - startY + 1
    rectangleIsDot = (width < 2  &&  height < 2)
    // 
    maskCtx.fillRect(startX, startY, width, height) // filling
    //
    if (shiftPressed) { return } // done!
    if (width  < 3)   { return }
    if (height < 3)   { return }
    // erasing inside:
    maskCtx.clearRect(startX + 1, startY + 1, width -2, height -2)
}    
 
function finishRectangle() {
    //
    paintStartX = null
    paintStartY = null
    // 
    if (mask == null) { return }
    //
    if (rectangleIsDot) { mask = null; maskOn = false; return }
    //
    maskImgData = getFullImageData(mask) 
    //
    mask = null
    maskOn = false
    //
    const changed = applyMask()
    if (changed) { memorizeTopLayer() }
}

