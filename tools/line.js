// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// validation by (mask != null)

///////////////////////////////////////////////////////////////////////////////

function startLine() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueLine()
}

function continueLine() {
    setTask(function () { continueLineCore() }) 
}

function continueLineCore() {
    //
    if (mask == null) { return }
    //
    clearMask()
    //
    const currentX = stageX - toplayer.left
    const currentY = stageY - toplayer.top
    //
    const arr = makeBresenham(paintStartX, paintStartY, currentX, currentY)  // accepts paintStartXY == null; but this never happens here
    //
    if (arr.length != 1) { arr.unshift(createPoint(paintStartX, paintStartY)) } // necessary!
    //
    const maskdata = maskImgData.data
    const width = mask.width
    const height = mask.height
    //
    while (arr.length > 0) {
        //
        const p = arr.shift() 
        //
        const x = p.x
        const y = p.y
        paintLineSegment(x, y, maskdata, width, height)
    }
    //
    maskCtx.putImageData(maskImgData, 0, 0)
} 
 
function finishLine() {
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

function paintLineSegment(centerX, centerY, maskdata, width, height) {
    //
    const delta = Math.floor(toolSizeFor[tool] / 2)
    const xa = centerX - delta
    const xb = centerX + delta + 1
    const ya = centerY - delta
    const yb = centerY + delta + 1
    //
    for (let x = xa; x < xb; x++) {
        for (let y = ya; y < yb; y++) {
            //
            if (x < 0) { return }
            if (y < 0) { return }
            if (x >= width)  { return }
            if (y >= height) { return }
            //
            const index = 4 * (width * y + x)
            //
            maskdata[index    ] = RED
            maskdata[index + 1] = GREEN
            maskdata[index + 2] = BLUE
            maskdata[index + 3] = ALPHA
        }
    }
}

