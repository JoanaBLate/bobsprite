// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// validation by (originalPaint != null)

///////////////////////////////////////////////////////////////////////////////

function startScale() {
    //
    if (toplayer == null) { return }
    //
    originalPaint = cloneImage(toplayer.canvas)
    //
    paintLastX = stageX
    paintLastY = stageY
}

function continueScale() {
    setTask(function () { continueScaleCore() }) // useful!
}

function continueScaleCore() {
    //
    if (originalPaint == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const deltaWidth  = stageX - paintLastX
    const deltaHeight = stageY - paintLastY
    //
    paintLastX = stageX
    paintLastY = stageY
    //
    const newWidth = Math.max(1, toplayer.canvas.width  + deltaWidth)
    const newHeight = Math.max(1, toplayer.canvas.height + deltaHeight)
    //
    toplayer.canvas.width = newWidth
    toplayer.canvas.height = newHeight
    //
    ctx["imageSmoothingEnabled"] = false
    ctx.drawImage(originalPaint, 0,0,originalPaint.width,originalPaint.height,  0,0,newWidth,newHeight)
    ctx["imageSmoothingEnabled"] = true
}

function finishScale() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (originalPaint == null) { return } 
    //
    let different = false
    if (toplayer.width  != originalPaint.width)  { different = true }
    if (toplayer.height != originalPaint.height) { different = true }
    //
    if (different) { memorizeTopLayer() }
    originalPaint = null 
}

