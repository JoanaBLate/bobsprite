// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var photoZoom = 1
var frozenPhoto = null

///////////////////////////////////////////////////////////////////////////////

function initFrozenPhoto() {
    //
    frozenPhoto = createCanvas(236, 240)
}

///////////////////////////////////////////////////////////////////////////////

function changePhotoZoom(e) {
    //
    shallRepaint = true
    //
    if (e.deltaY > 0) { decreasePhotoZoom(); return false }
    if (e.deltaY < 0) { increasePhotoZoom(); return false }
    //
    return false
}

function decreasePhotoZoom() {
    //
    if (photoZoom == 5) {
        photoZoom = 4
    }
    else if (photoZoom == 4) {
        photoZoom = 3
    }
    else if (photoZoom == 3) {
        photoZoom = 2
    }
    else {
        photoZoom = 1
    }
    //
    paintMonitorBoxZoom()
}

function increasePhotoZoom() {
    //
    if (photoZoom == 1) {
        photoZoom = 2
    }
    else if (photoZoom == 2) {
        photoZoom = 3
    }
    else if (photoZoom == 3) {
        photoZoom = 4
    }
    else {
        photoZoom = 5
    }
    //
    paintMonitorBoxZoom()
}

///////////////////////////////////////////////////////////////////////////////

function paintPhoto() {
    //
    paintPhotoBackground()
    //
    monitorBoxCtx["imageSmoothingEnabled"] = ! checkboxMonitorPixelated.checked
    //
    if (checkboxFrozen.checked) {
        paintFrozenPhoto()
    }
    else {
        paintLayersOnPhoto()
    }
}

function paintPhotoBackground() {
    //
    monitorBoxCtx.fillStyle = backgroundColor
    monitorBoxCtx.fillRect(0, 0, 236, 240)
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////  painting layers  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintLayersOnPhoto() {
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerOnPhoto(layers[n]) }
}

function paintLayerOnPhoto(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = photoZoomedLeft(layer)
    const top  = photoZoomedTop(layer)
    //
    const src = layer.canvas
    //
    const width  = photoZoom * src.width
    const height = photoZoom * src.height
    //
    monitorBoxCtx.drawImage(src, 0,0,src.width,src.height,  left,top,width,height)
}

function photoZoomedLeft(layer) { 
    //
    // on stage:
    //
    const layerCenterX = layer.left + (layer.canvas.width / 2)
    //
    const layerDisplacementX = stageCenterX - layerCenterX
    //
    // on photo:
    //
    const layerZoomedCenterX = 118 - (layerDisplacementX * photoZoom) // 118 is horizontal center of monitor box
    //
    const halfZoomedWidth = layer.canvas.width * photoZoom / 2
    //
    return Math.floor(layerZoomedCenterX - halfZoomedWidth)
}

function photoZoomedTop(layer) { 
    //
    // on stage:
    //
    const layerCenterY = layer.top + (layer.canvas.height / 2)
    //
    const layerDisplacementY = stageCenterY - layerCenterY
    //
    // on photo:
    //
    const layerZoomedCenterY = 120 - (layerDisplacementY * photoZoom) // 120 is vertical center of monitor box
    //
    const halfZoomedHeight = layer.canvas.height * photoZoom / 2
    //
    return Math.floor(layerZoomedCenterY - halfZoomedHeight)
}

///////////////////////////////////////////////////////////////////////////////
////////////////////////  painting frozenPhoto  ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintFrozenPhoto() {
    //
    const zoomedWidthHalf = 236 * photoZoom / 2
    const left = 118 - zoomedWidthHalf
    //
    const zoomedHeightHalf = 240 * photoZoom / 2
    const top = 120 - zoomedHeightHalf
    //
    monitorBoxCtx.drawImage(frozenPhoto, 0,0,236,240, left,top,236*photoZoom,240*photoZoom)
}

///////////////////////////////////////////////////////////////////////////////

function updateFrozenPhoto() {
    //
    const ctx = frozenPhoto.getContext("2d")
    //
    ctx.clearRect(0, 0, 236, 240)
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerOnFrozenPhoto(ctx, layers[n]) }
}

function paintLayerOnFrozenPhoto(ctx, layer) {
    //
    if (! layer.enabled) { return }
    //
    const halfWidth = Math.floor(layer.canvas.width / 2)
    const layerCenterX = layer.left + halfWidth
    const layerDisplacementX = stageCenterX - layerCenterX
    const left = 118 - layerDisplacementX - halfWidth // 118 is horizontal center of monitor box
    //
    const halfHeight = Math.floor(layer.canvas.height / 2)
    const layerCenterY = layer.top + halfHeight
    const layerDisplacementY = stageCenterY - layerCenterY
    const top = 120 - layerDisplacementY - halfHeight // 120 is vertical center of monitor box
    //
    ctx.drawImage(layer.canvas, left, top)
}

