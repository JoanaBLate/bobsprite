// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// validation by (mask != null)

// may not select the selection layer

///////////////////////////////////////////////////////////////////////////////

function startSelect() {
    //
    continueSelect()
}

function continueSelect() {
    //
    if (toplayer == null) { return }
    //
    if (selectionIsOn()) { alertSuperLayer(); return }
    //
    if (mask == null) { 
        //
        resetMask()
        //
        const color = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")"
        maskCtx.fillStyle = color
    }
    //
    let x = Math.max(0, stageX - toplayer.left)
    let y = Math.max(0, stageY - toplayer.top)
    //
    x = Math.min(x, mask.width - 1)
    y = Math.min(y, mask.height - 1)
    //
    if (paintStartX == null) { paintStartX = x; paintStartY = y }
    //
    paintLastX = x
    paintLastY = y
    //
    continueSelect2()
}

function continueSelect2() {
    //
    let startX = paintStartX
    let endX = paintLastX
    if (endX < startX) { startX = paintLastX; endX = paintStartX }
    //
    let startY = paintStartY
    let endY = paintLastY
    if (endY < startY) { startY = paintLastY; endY = paintStartY } 
    //
    const width  = endX - startX + 1
    const height = endY - startY + 1
    // 
    maskCtx.clearRect(0, 0, mask.width, mask.height)    
    //
    maskCtx.fillRect(startX, startY, width, height) // filling
    //
    if (width  < 3) { return }
    if (height < 3) { return }
    // erasing inside:
    maskCtx.clearRect(startX + 1, startY + 1, width - 2, height - 2) // clearing inside
}

function finishSelect() {
    //
    if (mask == null) { return }
    //
    const left = Math.min(paintStartX, paintLastX)
    const top  = Math.min(paintStartY, paintLastY)
    //
    const right  = Math.max(paintStartX, paintLastX)
    const bottom = Math.max(paintStartY, paintLastY)
    //
    const width  = right - left + 1
    const height = bottom - top + 1
    //
    maskOn = false
    mask = null    
    //
    paintStartX = null
    paintStartY = null
    //
    paintLastX = null
    paintLastY = null
    // 
    if (width  < 1) { return } 
    if (height < 1) { return } 
    if (width + height == 2) { return }
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.drawImage(toplayer.canvas, -left, -top)
    //
    tryEraseRectangleInTopLayer(ctx, left, top, width, height)
    //
    finishSelect2(cnv, left, top)
}

function finishSelect2(cnv, deltaLeft, deltaTop) {
    //
    const superlayer = layers[0]
    //
    const shallMemorize = ! canvasesAreEqual(cnv, superlayer.canvas)
    //
    superlayer.canvas = cnv 
    superlayer.left = toplayer.left + deltaLeft
    superlayer.top  = toplayer.top + deltaTop
    //
    if (shallMemorize) { memorizeLayer(superlayer) }
    //    
    changeLayerVisibility(0) 
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function tryEraseRectangleInTopLayer(ctx, left, top, width, height) {
    //    
    if (! shiftPressed) { return }
    //
    // does nothing if selected area is blank
    //
    const data = ctx.getImageData(0, 0, width, height).data
    //
    for (const value of data) { 
        if (value != 0) {
            toplayer.canvas.getContext("2d").clearRect(left, top, width, height)
            memorizeTopLayer() 
            return
        }   
    }
}

