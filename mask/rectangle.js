// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// the interface allows no interference


///////////////////////////////////////////////////////////////////////////////

var rectangleStartX = null
var rectangleStartY = null
var rectangleIsDot = true // 1 x 1 px 


function startRectangle() {
    if (getTopLayer() == null) { return }
    //
    resetMask()
    //
    maskCtx.fillStyle = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")"
    //
    rectangleStartX = canvasX
    rectangleStartY = canvasY
    continueRectangle()
}

function continueRectangle() { 
    if (rectangleStartX == null  ||  rectangleStartY == null) { return }
    const currentX = canvasX
    const currentY = canvasY
    if (currentX == null  ||  currentY == null) { return } // doesn't erase rectangleStartXY
    //
    clearMask()
    //
    let startX = rectangleStartX
    let startY = rectangleStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = rectangleStartX }
    if (endY < startY) { startY = currentY; endY = rectangleStartY } 
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
     // avoids painting old rectangle by mouse up, when current one has not started
    if (rectangleStartX == null  ||  rectangleStartY == null) { return }
    //
    rectangleStartX = null
    rectangleStartY = null
    //
    if (rectangleIsDot) { hideMask(); return }
    //
    const changed = applyMask()
    if (changed) { memorizeTopLayer() }
}

