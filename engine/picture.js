// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function makeCheckedPicture(callback) {
    //
    let count = 0
    let top = null
    //
    const off = layers.length
    //
    for (let n = 0; n < off; n++) {
        //
        if (! layers[n].enabled) { continue }
        //
        count += 1
        //
        if (top == null) { top = n }
    }
    //
    if (count == 0) { callback(null); return }
    //
    if (count == 1) { callback(cloneImage(toplayer.canvas)); return }
    //
    let index = indexOfBaseLayer()
    //
    if (index != null) { callback(makePictureCore(index)); return }
    //
    customAlert("layers do not match:\nthe resulting picture may not be what you expect", 
    
        function () { callback(makeBottomPicture(false)) }
    )
}

function makeTopPicture() {
    //
    const index = getNumberOfTopLayer()
    if (index == null) { return null }
    //
    const cnv = makePictureCore(index)
    //
    return cnv
}

function makeBottomPicture(protect) {
    //
    let count = 0
    let bottom = null
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) {
        //
        if (! layers[n].enabled) { continue }
        //
        count += 1
        //
        if (bottom == null) { bottom = n }
    }
    //
    if (count == 0) { return null }
    //
    if (count == 1) { return cloneImage(toplayer.canvas) }
    //
    if (protect) {
        return makeBottomPictureCoreProtected(bottom)
    }
    else {
        return makePictureCore(bottom)    
    }    
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makePictureCore(n) { // expecting 'n' to be a valid index
    //
    const reflayer = layers[n]
    //
    const width = reflayer.canvas.width
    const height = reflayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { 
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        const left = layer.left - reflayer.left
        const top  = layer.top  - reflayer.top
        //
        ctx.drawImage(layer.canvas, left, top)
    }
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeBottomPictureCoreProtected(bottom) { // expects at least 1 layer over the bottom layer
    //
    const reflayer = layers[bottom]
    //
    const width = reflayer.canvas.width
    const height = reflayer.canvas.height
    //
    const cnv = cloneImage(reflayer.canvas)
    const ctx = cnv.getContext("2d")
    //
    const refdata = ctx.getImageData(0, 0, width, height).data
    //
    const start = bottom - 1
    //
    for (let n = start; n > -1; n--) { 
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        const overcanvas = makeOverCanvasForMergeDown(layer, reflayer.left, reflayer.top, width, height, refdata)
        //
        ctx.drawImage(overcanvas, 0, 0) 
    }
    //    
    return cnv
}

function makeOverCanvasForMergeDown(layer, refleft, reftop, width, height, refdata) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const left = layer.left - refleft
    const top  = layer.top  - reftop
    //
    ctx.drawImage(layer.canvas, left, top) // projected (by position)
    //
    // clearing where reference pixel is blank
    //
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const off = width * height * 4
    //
    let index = 0
    //
    while (index < off) {
        //
        if (refdata[index+3] == 0) { //  blank
            //
            data[index]   = 0
            data[index+1] = 0
            data[index+2] = 0
            data[index+3] = 0
        }
        //
        index += 4
    } 
    //
    ctx.putImageData(imgdata, 0, 0)
    //
    return cnv 
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function indexOfBaseLayer() { // most relevant layer
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { 
    //
        if (layerContainsAllOthers(n)) { return n }
    }
    //
    return null
}

function layerContainsAllOthers(index) {
    //
    const candidate = layers[index]
    //
    if (! candidate.enabled) { return false }
    //
    const off = layers.length
    //
    for (let n = 0; n < off; n++) { 
        //
        if (n == index) { continue }
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        if (candidate.left > layer.left) { return false }
        //
        if (candidate.top > layer.top) { return false }
        //
        const layerRight = layer.left + layer.canvas.width
        const candidateRight = candidate.left + candidate.canvas.width
        if (candidateRight < layerRight) { return false }
        //
        const layerBottom = layer.top + layer.canvas.height
        const candidateBottom = candidate.top + candidate.canvas.height
        if (candidateBottom < layerBottom) { return false } 
    }
    //
    return true
}

