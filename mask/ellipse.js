// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// the interface allows no interference


///////////////////////////////////////////////////////////////////////////////

var ellipseStartX = null
var ellipseStartY = null


function startEllipse() {
    if (getTopLayer() == null) { return }
    //
    resetMask()
    //
    ellipseStartX = canvasX
    ellipseStartY = canvasY
    continueEllipse()
}

function continueEllipse() { 
    if (ellipseStartX == null  ||  ellipseStartY == null) { return }
    const currentX = canvasX
    const currentY = canvasY
    if (currentX == null  ||  currentY == null) { return } // doesn't erase ellipseStartXY
    //
    clearMask()
    //
    let startX = ellipseStartX
    let startY = ellipseStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = ellipseStartX }
    if (endY < startY) { startY = currentY; endY = ellipseStartY } 
    //
    const imgdata = maskCtx.getImageData(0, 0, mask.width, mask.height)
    const data = imgdata.data
    //
    strokeEllipse(data, startX, startY, endX, endY) // must come before fillEllipse
    if (shiftPressed) { fillEllipse(data, startX, startY, endX, endY) } 
    //
    maskCtx.putImageData(imgdata, 0, 0)
} 

function finishEllipse() {
     // avoids painting old ellipse by mouse up, when current one has not started
    if (ellipseStartX == null  ||  ellipseStartY == null) { return }
    //
    ellipseStartX = null
    ellipseStartY = null
    const changed = applyMask()
    if (changed) { memorizeTopLayer() }
}

// stroke /////////////////////////////////////////////////////////////////////

function strokeEllipse(data, startX, startY, endX, endY) { 
    //
    const centerX = Math.round((startX + endX) / 2)
    const centerY = Math.round((startY + endY) / 2)
    const radiusX = endX - centerX
    const radiusY = endY - centerY
    const evenX = (startX + endX) % 2
    const evenY = (startY + endY) % 2
    //
    for (let x = startX; x <= centerX; x++) {
        const angle = Math.acos((x - centerX) / radiusX)
        const y = Math.round(radiusY * Math.sin(angle) + centerY)
        strokeEllipsePixel(data, x - evenX, y) // southwest
        strokeEllipsePixel(data, x - evenX, 2 * centerY - y - evenY) // northwest
        strokeEllipsePixel(data, 2 * centerX - x, y) // southeast
        strokeEllipsePixel(data, 2 * centerX - x, 2 * centerY - y - evenY) // northeast
    }
    //
    for (let y = startY; y <= centerY; y++) {
        const angle = Math.asin((y - centerY) / radiusY)
        const x = Math.round(radiusX * Math.cos(angle) + centerX)
        strokeEllipsePixel(data, x, y - evenY) // northeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, y - evenY) // northwest
        strokeEllipsePixel(data, x, 2 * centerY - y) // southeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, 2 * centerY - y) // southwest
    }
}

function strokeEllipsePixel(data, x, y) {
    if (isNaN(x)) { return }
    if (isNaN(y)) { return } // often happens on firefox
    //
    const index = 4 * (mask.width * y + x)
    //
    data[index    ] = RED
    data[index + 1] = GREEN
    data[index + 2] = BLUE
    data[index + 3] = ALPHA
}

// fill ///////////////////////////////////////////////////////////////////////

function fillEllipse(data, startX, startY, endX, endY) {
    //
    const centerY = Math.round((startY + endY) / 2)
    //
    for (let x = startX + 1; x < endX; x++) { 
        fillEllipseHalfColumn(data, x, centerY, +1, startY, endY)     // center and inferior half
        fillEllipseHalfColumn(data, x, centerY - 1, -1, startY, endY) // superior half
    }
}

function fillEllipseHalfColumn(data, x, y, delta, startY, endY) {
    while (true) {
        const index = 4 * (mask.width * y + x)
        if (data[index + 3] != 0) { return } // already painted (when stroked!)
        //
        data[index    ] = RED
        data[index + 1] = GREEN
        data[index + 2] = BLUE
        data[index + 3] = ALPHA
        //
        y += delta
        // necessary to avoid infinite loop sometimes
        if (y <= startY) { return }
        if (y >= endY)   { return }
    }
}

