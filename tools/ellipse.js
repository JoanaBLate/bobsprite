// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// validation by (mask != null)

///////////////////////////////////////////////////////////////////////////////

function startEllipse() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueEllipse()
}

function continueEllipse() { 
    //
    if (mask == null) { return }
    //
    clearMask()
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
    const maskdata = maskImgData.data
    const width = mask.width
    const height = mask.height
    //
    strokeEllipse(maskdata, startX, startY, endX, endY, width, height) // must come before fillEllipse
    if (shiftPressed) { fillEllipse(maskdata, startX, startY, endX, endY, width, height) } 
    //
    maskCtx.putImageData(maskImgData, 0, 0)
} 

function finishEllipse() {
    //
    paintStartX = null
    paintStartY = null
    // 
    if (mask == null) { return }
    //
    mask = null
    maskOn = false
    //
    const changed = applyMask()
    //
    if (changed) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// stroke /////////////////////////////////////////////////////////////////////

function strokeEllipse(data, startX, startY, endX, endY, width, height) { 
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
        //
        strokeEllipsePixel(data, x - evenX, y, width, height) // southwest
        strokeEllipsePixel(data, x - evenX, 2 * centerY - y - evenY, width, height) // northwest
        strokeEllipsePixel(data, 2 * centerX - x, y, width, height) // southeast
        strokeEllipsePixel(data, 2 * centerX - x, 2 * centerY - y - evenY, width, height) // northeast
    }
    //
    for (let y = startY; y <= centerY; y++) {
        const angle = Math.asin((y - centerY) / radiusY)
        const x = Math.round(radiusX * Math.cos(angle) + centerX)
        //
        strokeEllipsePixel(data, x, y - evenY, width, height) // northeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, y - evenY, width, height) // northwest
        strokeEllipsePixel(data, x, 2 * centerY - y, width, height) // southeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, 2 * centerY - y, width, height) // southwest
    }
}

function strokeEllipsePixel(data, x, y, width, height) {
    //
    if (isNaN(x)) { return }
    if (isNaN(y)) { return } // often happens on firefox
    //
    if (x < 0) { return }
    if (y < 0) { return }
    //
    if (x >= width)  { return }
    if (y >= height) { return }
    //
    const index = 4 * (mask.width * y + x)
    //
    data[index    ] = RED
    data[index + 1] = GREEN
    data[index + 2] = BLUE
    data[index + 3] = ALPHA
}

// fill ///////////////////////////////////////////////////////////////////////

function fillEllipse(data, startX, startY, endX, endY, width, height) {
    //
    const centerY = Math.round((startY + endY) / 2)
    //
    for (let x = startX + 1; x < endX; x++) { 
        fillEllipseHalfColumn(data, x, centerY, +1, startY, endY, width, height)     // center and inferior half
        fillEllipseHalfColumn(data, x, centerY - 1, -1, startY, endY, width, height) // superior half
    }
}

function fillEllipseHalfColumn(data, x, y, delta, startY, endY, width, height) {
    //
    if (x < 0) { return }
    if (y < 0) { return }
    //
    if (x >= width)  { return }
    if (y >= height) { return }
    //
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

