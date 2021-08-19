// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function moveCanvasByKeyboard() { // no more than once per loop!
    //
    let deltaLeft = 0
    let deltaTop = 0
    // 
    if (upPressed)    { deltaTop = -1 }
    if (downPressed)  { deltaTop = +1 }
    if (leftPressed)  { deltaLeft = -1 }
    if (rightPressed) { deltaLeft = +1 }
    //
    if (deltaLeft == 0  &&  deltaTop == 0) { return }
    //
    shallRepaint = true // << it is here!
    //
    canvasLeft += 50 * deltaLeft
    canvasTop  += 50 * deltaTop
    fixCanvasPosition()
}

function fixCanvasPosition() {
    //
    const zoomedWidth = ZOOM * canvas.width
    const zoomedHeight = ZOOM * canvas.height
    //
    let minLeft = 100 - zoomedWidth // minimum show is 100
    if (minLeft > 0) { minLeft = 0 } // for small widths
    if (canvasLeft < minLeft) { canvasLeft = minLeft }
    //
    let maxLeft = 799 // minimum show is 100
    if (zoomedWidth <= 100)   { maxLeft = 899 - zoomedWidth + 1 } // for small widths
    if (canvasLeft > maxLeft) { canvasLeft = maxLeft }
    //
    let minTop = 100 - zoomedHeight // minimum show is 100
    if (minTop > 0) { minTop = 0 } // for small heights
    if (canvasTop < minTop) { canvasTop = minTop }
    //
    let maxTop = 499 // minimum show is 100
    if (zoomedHeight <= 100) { maxTop = 599 - zoomedHeight + 1 } // for small heights
    if (canvasTop > maxTop)  { canvasTop = maxTop }
}

