// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

const stageWidth = 900
const stageHeight = 600

const stageCenterX = 450
const stageCenterY = 300

var stage     
var stageCtx
  
var stageChessLight
var stageChessDark

var shallRepaint = true

///////////////////////////////////////////////////////////////////////////////

function initStage() {
    stage = createCanvas(stageWidth, stageHeight)
    stageCtx = stage.getContext("2d")
    //
    stage.style.position = "absolute"
    stage.style.top = "30px"
    stage.style.left = "160px"
    //
    bigdiv.appendChild(stage)
    //
    stageChessLight = createStageChessLight()
    stageChessDark = createStageChessDark()
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
    //
    paintStageBg()
    //
    paintLayersBackgrounds()
    //
    stageCtx["imageSmoothingEnabled"] = false
    paintLayersForegrounds()
    stageCtx["imageSmoothingEnabled"] = true // because of draw picture bug on chrome
    //
    paintTopLayerFrame()
    //
    drawPictureCursor() 
}

///////////////////////////////////////////////////////////////////////////////

function paintStageBg() {
    //
    const img = isDarkInterface ? stageChessDark : stageChessLight 
    //
    stageCtx.drawImage(img, 0, 0) 
}

///////////////////////////////////////////////////////////////////////////////

function paintLayersBackgrounds() {
    //
    if (backgroundColor == "blank") { return }
    //
    stageCtx.fillStyle = backgroundColor
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerBackground(layers[n]) }
}

function paintLayerBackground(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = zoomedLeft(layer)
    const top = zoomedTop(layer)
    //
    const width = layer.canvas.width * ZOOM
    const height = layer.canvas.height * ZOOM
    //
    stageCtx.fillRect(left, top, width, height)    
}

///////////////////////////////////////////////////////////////////////////////

function paintLayersForegrounds() {
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerForeground(layers[n]) }
    //
    paintMaskOnStage()
}

function paintLayerForeground(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = zoomedLeft(layer)
    const top = zoomedTop(layer)
    //
    const width = layer.canvas.width
    const height = layer.canvas.height
    //
    stageCtx.globalAlpha = layer.opacity
    stageCtx.drawImage(layer.canvas, 0,0,width,height, left,top,width*ZOOM,height*ZOOM)    
    stageCtx.globalAlpha = 1
}

function paintMaskOnStage() {
    //
    if (! maskOn) { return }
    //
    const left = zoomedLeft(toplayer)
    const top  = zoomedTop(toplayer)
    //
    const width = mask.width
    const height = mask.height
    //
    stageCtx.drawImage(mask, 0,0,width,height, left,top,width*ZOOM,height*ZOOM)   
}

///////////////////////////////////////////////////////////////////////////////

function paintTopLayerFrame() {
    //
    if (toplayer == null) { return }
    //
    stageCtx.fillStyle = canvasFrameColor()
    //
    const left = zoomedLeft(toplayer) - 1
    const top = zoomedTop(toplayer) - 1
    //
    const width = toplayer.canvas.width * ZOOM + 2
    const height = toplayer.canvas.height * ZOOM + 2
    //
    stageCtx.fillRect(left, top, width, 1) // top
    stageCtx.fillRect(left, top+height-1, width, 1) // bottom
    stageCtx.fillRect(left, top, 1, height) // left
    stageCtx.fillRect(left+width-1, top, 1, height) // right
}

