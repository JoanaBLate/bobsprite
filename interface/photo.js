// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var photoZoom = 1
var shallRepaintPhoto = true

///////////////////////////////////////////////////////////////////////////////

function changePhotoZoom(e) {
    //
    if (checkboxFrozen.checked) { return }
    //
    shallRepaintPhoto = true
    //
    if (e.deltaY > 0) { decreasePhotoZoom(); return false }
    if (e.deltaY < 0) { increasePhotoZoom(); return false }
    return false
}

function decreasePhotoZoom() {
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
    if (! shallRepaintPhoto) { return }
    shallRepaintPhoto = false
    //
    if (checkboxFrozen.checked) { return }
    //
    if (checkboxAnimation.checked) { paintAnimation(); return }
    //
    paintCanvasOnPhoto()
}

///////////////////////////////////////////////////////////////////////////////

function paintPhotoBackground() {
    //
    if (backgroundColor == "blank") { paintChessBgOnMonitorBox(); return }
    //
    monitorBoxCtx.fillStyle = backgroundColor
    monitorBoxCtx.fillRect(0, 0, 236, 240)
}

///////////////////////////////////////////////////////////////////////////////

function paintAnimation() { // always centered
    //
    paintPhotoBackground()
    //
    const src = animatedImageForPhoto
    if (src == null) { return }
    //
    const width = photoZoom * src.width
    const height = photoZoom * src.height
    //
    const left = Math.floor((236 - width) / 2)
    const top = Math.floor((240 - height) / 2)
    //
    monitorBoxCtx["imageSmoothingEnabled"] = ! checkboxMonitorPixelated.checked
    //
    monitorBoxCtx.drawImage(src, 0,0,src.width,src.height, left,top,width,height)
}

///////////////////////////////////////////////////////////////////////////////

function paintCanvasOnPhoto() {
    const src = canvas
    //
    paintPhotoBackground()
    //
    const width = photoZoom * src.width
    const height = photoZoom * src.height
    //
    const left = calcPhotoLeft(width)
    const top = calcPhotoTop(height)
    //
    monitorBoxCtx["imageSmoothingEnabled"] = ! checkboxMonitorPixelated.checked
    //
    monitorBoxCtx.drawImage(src, 0,0,src.width,src.height,  left,top,width,height)
}

///////////////////////////////////////////////////////////////////////////////

function calcPhotoLeft(width) {
    //
    const photoCenteredLeft = Math.floor((236 - width) / 2)
    //
    if (photoCenteredLeft >= 0) { return photoCenteredLeft }
    //
    const zoomedWidth = ZOOM * canvas.width
    const canvasCenteredLeft = 450 - Math.floor(zoomedWidth / 2)
    //
    const relativeDelta = (canvasCenteredLeft - canvasLeft) / zoomedWidth
    //
    let left = photoCenteredLeft - (relativeDelta * width) 
    //
    const min = 236 - width
    const max = 0
    if (left < min) { left = min }
    if (left > max) { left = max }
    return left   
}

function calcPhotoTop(height) {
    //
    const photoCenteredTop = Math.floor((240 - height) / 2)
    //
    if (photoCenteredTop >= 0) { return photoCenteredTop }
    //
    const zoomedHeight = ZOOM * canvas.height
    const centeredTop = 300 - Math.floor(zoomedHeight / 2)
    //
    const relativeDelta = (centeredTop - canvasTop) / zoomedHeight
    //
    let top = photoCenteredTop - (relativeDelta * height)
    //
    const min = 240 - height
    const max = 0
    if (top < min) { top = min }
    if (top > max) { top = max }
    return top   
}

