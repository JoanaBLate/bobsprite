// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// using Bresenham algorithm!
// the interface allows no interference 


///////////////////////////////////////////////////////////////////////////////

var lineStartX = null
var lineStartY = null


function startLine() {
    if (getTopLayer() == null) { return }
    //
    resetMask()
    //
    lineStartX = canvasX
    lineStartY = canvasY
    continueLine()
}

function continueLine() {
    if (lineStartX == null  ||  lineStartY == null) { return }
    const x = canvasX
    const y = canvasY
    if (x == null  ||  y == null) { return } // doesn't erase lineStartXY
    //
    clearMask()
    //    
    const arr = makeBresenham(lineStartX, lineStartY, x, y)  // accepts lineStartXY == null
    //
    if (arr.length != 1) { arr.unshift(createPoint(lineStartX, lineStartY)) } // tested
    //
    const width  = mask.width
    const height = mask.height
    const imgdata = maskCtx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    while (arr.length > 0) {
        const p = arr.shift() 
        paintLinePoint(p.x, p.y, data, width, height) 
    }
    //
    maskCtx.putImageData(imgdata, 0, 0)
}    

function paintLinePoint(centerX, centerY, data, width, height) {
    const delta = Math.floor(toolSizeFor[tool] / 2)
    const xa = centerX - delta
    const xb = centerX + delta + 1
    const ya = centerY - delta
    const yb = centerY + delta + 1
    //
    for (let x = xa; x < xb; x++) {
        for (let y = ya; y < yb; y++) {
            if (x < 0) { return }
            if (y < 0) { return }
            if (x >= width)  { return }
            if (y >= height) { return }
            //
            const index = 4 * (width * y + x)
            if (data[index + 3] != 0) { continue } // not blank pixel
            //
            data[index    ] = RED
            data[index + 1] = GREEN
            data[index + 2] = BLUE
            data[index + 3] = ALPHA
        }
    }
}
 
function finishLine() {
     // avoids painting old line by mouse up, when current one has not started
    if (lineStartX == null  ||  lineStartY == null) { return }
    //
    lineStartX = null
    lineStartY = null
    const changed = applyMask()
    if (changed) { memorizeTopLayer() }
}

