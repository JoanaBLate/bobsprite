// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var canvas    
var canvasCtx 

var canvasLeft = 0  // adjusted to current zoom
var canvasTop = 0   // adjusted to current zoom

var canvasChessBg 

///////////////////////////////////////////////////////////////////////////////

function initCanvas() {
    canvas = createCanvas(desiredWidth, desiredHeight)
    canvasCtx = canvas.getContext("2d")
    //
    setCanvasChessBox()
    //
    centerCanvas()
}

function setCanvasChessBox() {
    canvasChessBg = createChessBox(canvas.width, canvas.height, 10)
}

///////////////////////////////////////////////////////////////////////////////

function paintCanvas() {
    //
    paintCanvasBg()
    //
    for (let n = layers.length - 1; n >= 0; n--) {
        //    
        const layer = layers[n]
        if (! layer.enabled) { continue }
        //
        canvasCtx.globalAlpha = layer.opacity
        canvasCtx.drawImage(layer.canvas, layer.left, layer.top)
    }
    //
    canvasCtx.globalAlpha = 1.0
    //
    if (maskOn) { canvasCtx.drawImage(mask, 0, 0) }
}

function paintCanvasBg() {
    //
    if (getTopLayer() == null) {
        canvasCtx.fillStyle = "lime"
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
    }
    else if (backgroundColor == "blank") {
        canvasCtx.drawImage(canvasChessBg, 0, 0)
    }
    else {
        canvasCtx.fillStyle = backgroundColor
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

///////////////////////////////////////////////////////////////////////////////

function updateMouseColorByCanvas() {
    if (stageX == null) { return } // mouse not on stage
    //
    if (canvasX == null) { eraseMouseColor(); return } // mouse on stage but not on canvas
    //
    const layer = getTopLayer()
    if (layer == null) { eraseMouseColor(); return }
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null) { eraseMouseColor(); return }
    if (y == null) { eraseMouseColor(); return }
    //
    const data = layer.canvas.getContext("2d").getImageData(x, y, 1, 1).data
    changeMouseColor(data)
}

///////////////////////////////////////////////////////////////////////////////

function resizeCanvas(width, height) {
    canvas.width  = width
    canvas.height = height
    //
    setCanvasChessBox()
    centerCanvas()
}

///////////////////////////////////////////////////////////////////////////////

function centerCanvas() { // only by keyboard
    shallRepaint = true
    //    
    const zoomedWidth = ZOOM * canvas.width
    const zoomedHeight = ZOOM * canvas.height
    //
    canvasLeft = 450 - Math.floor(zoomedWidth / 2)
    canvasTop  = 300 - Math.floor(zoomedHeight / 2)
}

///////////////////////////////////////////////////////////////////////////////

function canvasToPicture() {
    //
    const cnv = createCanvas(canvas.width, canvas.height)
    const ctx = cnv.getContext("2d")
    //
    for (let n = layers.length - 1; n >= 0; n--) {
        //
        const layer = layers[n]
        if (! layer.enabled) { continue }
        //
        ctx.drawImage(layer.canvas, layer.left, layer.top)
    }
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function canvasToPictureProtected() {
    const width = canvas.width
    const height = canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const list = [ ]
    for (const layer of layers) {
        if (layer.enabled) { list.push(layer) }
    }
    //
    const base = list.pop()
    ctx.drawImage(base.canvas, base.left, base.top)
    const basedata = ctx.getImageData(0, 0, width, height).data
    //
    while (list.length > 0) {
        const layer = list.pop()
        const cnv2 = createCanvas(width, height)
        const ctx2 = cnv.getContext("2d")
        ctx2.drawImage(layer.canvas, layer.left, layer.top)
        const imgdata = ctx2.getImageData(0, 0, width, height)
        const data = imgdata.data
        clearDataByBase(basedata, data, width, height)
        ctx2.putImageData(imgdata, 0, 0)
        //
        ctx.drawImage(cnv2, 0, 0)
    }
    //
    return cnv
}

function clearDataByBase(basedata, data, width, height) {
    //
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            //
            const index = 4 * (y * width + x)
            const r = basedata[index]
            const g = basedata[index + 1]
            const b = basedata[index + 2]
            const a = basedata[index + 3]
            //
            let shallProtect = false 
            if (a == 0) { shallProtect = true }
            if (a == 255  &&  r + g + b == 0) { shallProtect = true }
            //
            if (! shallProtect) { continue }
            //
            data[index] = 0
            data[index + 1] = 0
            data[index + 2] = 0
            data[index + 3] = 0
        }
    }
}

