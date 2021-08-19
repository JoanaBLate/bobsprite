// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var stage     // 900 x 600
var stageCtx  

var shallRepaint = true

///////////////////////////////////////////////////////////////////////////////

function initStage() {
    stage = createCanvas(900, 600)
    stageCtx = stage.getContext("2d")
    //
    stage.style.position = "absolute"
    stage.style.top = "30px"
    stage.style.left = "160px"
    //
    bigdiv.appendChild(stage)
}

///////////////////////////////////////////////////////////////////////////////

function startListeningStage() {
    stage.onwheel = mouseWheelHandler
    stage.onmouseup = mouseUpHandler
    stage.onmousedown = mouseDownHandler
    stage.onmousemove = mouseMoveHandler
    stage.onmouseleave = mouseLeaveHandler
}

///////////////////////////////////////////////////////////////////////////////

function paintStage() {
    if (! shallRepaint) { return }
    shallRepaint = false
    //
    shallRepaintPhoto = true
    //
    paintStageBg()
    paintCanvasFrame()
    //
    paintCanvas()
    stageCtx["imageSmoothingEnabled"] = false
    paintCanvasOnStage()
    stageCtx["imageSmoothingEnabled"] = true // because of draw picture bug on chrome
    //
    drawPictureCursor() 
}

///////////////////////////////////////////////////////////////////////////////

function paintStageBg() {
    stageCtx.fillStyle = stageColor()
    stageCtx.fillRect(0, 0, 900, 600)
}

function paintCanvasFrame() {
    //
    stageCtx.fillStyle = canvasFrameColor()
    //
    const left = canvasLeft - 1
    const top  = canvasTop - 1
    const width  = (ZOOM * canvas.width) + 2
    const height = (ZOOM * canvas.height) + 2
    //
    stageCtx.fillRect(left, top, width, 1) // top
    stageCtx.fillRect(left, top+height-1, width, 1) // bottom
    stageCtx.fillRect(left, top, 1, height) // left
    stageCtx.fillRect(left+width-1, top, 1, height) // right
}

function paintCanvasOnStage() {
    //
    const destLeft = canvasLeft 
    const destTop  = canvasTop
    const destWidth  = ZOOM * canvas.width
    const destHeight = ZOOM * canvas.height
    //
    stageCtx.drawImage(canvas, 0,0,canvas.width,canvas.height, destLeft,destTop,destWidth,destHeight)
}

