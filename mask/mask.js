// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// mask is not movable: always 0:0 coordinate

// used to draw line, ellipse, rectangle, lasso and select


var mask
var maskCtx
var maskOn = false

///////////////////////////////////////////////////////////////////////////////

function resetMask() {
    maskOn = true
    //
    mask = createCanvas(canvas.width, canvas.height)
    maskCtx = mask.getContext("2d")
}

function clearMask() {
    maskCtx.clearRect(0, 0, mask.width, mask.height)
}

function hideMask() {
    shallRepaint = true
    //
    maskOn = false
}

///////////////////////////////////////////////////////////////////////////////

function applyMask(respectBlanks) { // for line, rectangle and ellipse
    //
    const srcWidth  = mask.width
    const srcHeight = mask.height
    const srcData = maskCtx.getImageData(0, 0, srcWidth, srcHeight).data
    //
    const layer = getTopLayer()
    if (layer == null) { hideMask(); return }
    //
    const dstWidth  = layer.canvas.width
    const dstHeight = layer.canvas.height
    const layerImageData = layer.canvas.getContext("2d").getImageData(0, 0, dstWidth, dstHeight)
    const dstData = layerImageData.data
    const dstLeft = layer.left
    const dstTop  = layer.top
    //
    let changed = false
    //
    process()
    hideMask()
    if (! changed) { return false }
    layer.canvas.getContext("2d").putImageData(layerImageData, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < srcHeight; y++) {
            for (let x = 0; x < srcWidth; x++) {
                processAt(x, y)
            }
        }
    }
    //
    function processAt(x, y) {  
        // SOURCE
        // since mask is not movable and mask is the base of this
        // function, there is no need to perform checks on source
        const srcX = x
        const srcY = y        //
        const srcIndex = 4 * (srcWidth * srcY + srcX)
        //
        const srcR = srcData[srcIndex]
        const srcG = srcData[srcIndex + 1]
        const srcB = srcData[srcIndex + 2]
        const srcA = srcData[srcIndex + 3]
        //
        if (srcA == 0) { return } // blank source pixel
        //
        // DESTINY
        const dstX = x - dstLeft
        const dstY = y - dstTop
        //
        if (dstX < 0) { return }
        if (dstY < 0) { return }
        if (dstX >= dstWidth)  { return }
        if (dstY >= dstHeight) { return }
        //
        const dstIndex = 4 * (dstWidth * dstY + dstX)
        //
        const dstR = dstData[dstIndex]
        const dstG = dstData[dstIndex + 1]
        const dstB = dstData[dstIndex + 2]
        const dstA = dstData[dstIndex + 3]
        //
        if (respectBlanks  &&  dstA == 0) { return }
        //
        // APPLY
        dstData[dstIndex    ] = srcR
        dstData[dstIndex + 1] = srcG
        dstData[dstIndex + 2] = srcB
        dstData[dstIndex + 3] = srcA
        //
        if (srcR != dstR  ||  srcG != dstG  ||  srcB != dstB  || srcA != dstA) { changed = true }
    }
}

///////////////////////////////////////////////////////////////////////////////

function adjustSuperLayerByMask() { // for lasso, selection and bucket-selection
    //
    const cnv = canvasToPicture()
    const ctx = cnv.getContext("2d")
    const width = cnv.width
    const height = cnv.height
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const refdata = maskCtx.getImageData(0, 0, width, height).data
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    //
    layers[0].canvas = cnv
    layers[0].left = 0
    layers[0].top = 0
    showSuperLayerOnly()
    memorizeTopLayer()
    //
    hideMask()
    return
    //
    function process() {
        for (let y = 0; y < height; y++) { processRow(y) }
    }
    //
    function processRow(y) {
        for (let x = 0; x < width; x++) { processAt(x, y) }
    }
    //
    function processAt(x, y) {
        const index = 4 * (y * width + x)
        if (refdata[index + 3] != 0) { return }
        data[index    ] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
    }
}

///////////////////////////////////////////////////////////////////////////////

function clearLayerByMask(layer) { // for lasso, selection and bucket-selection
    //
    const srcWidth  = mask.width
    const srcHeight = mask.height
    const srcData = maskCtx.getImageData(0, 0, srcWidth, srcHeight).data
    //
    const dstWidth  = layer.canvas.width
    const dstHeight = layer.canvas.height
    const layerImageData = layer.canvas.getContext("2d").getImageData(0, 0, dstWidth, dstHeight)
    const dstData = layerImageData.data
    const dstLeft = layer.left
    const dstTop  = layer.top
    //
    let changed = false
    //
    process()
    if (! changed) { return }
    //
    layer.canvas.getContext("2d").putImageData(layerImageData, 0, 0)
    memorizeLayer(layer)                                        // memorizes!
    return
    //
    function process() {
        for (let y = 0; y < srcHeight; y++) {
            for (let x = 0; x < srcWidth; x++) {
                processAt(x, y)
            }
        }
    }
    //
    function processAt(x, y) {  
        // SOURCE
        // since mask is not movable and mask is the base of this
        // function, there is no need to perform checks on source
        const srcX = x
        const srcY = y        //
        const srcIndex = 4 * (srcWidth * srcY + srcX)
        //
        const srcA = srcData[srcIndex + 3]
        //
        if (srcA == 0) { return } // blank source pixel
        //
        // DESTINY
        const dstX = x - dstLeft
        const dstY = y - dstTop
        //
        if (dstX < 0) { return }
        if (dstY < 0) { return }
        if (dstX >= dstWidth)  { return }
        if (dstY >= dstHeight) { return }
        //
        const dstIndex = 4 * (dstWidth * dstY + dstX)
        //
        const dstA = dstData[dstIndex + 3]
        //
        if (dstA == 0) { return }
        //
        // APPLY
        dstData[dstIndex    ] = 0
        dstData[dstIndex + 1] = 0
        dstData[dstIndex + 2] = 0
        dstData[dstIndex + 3] = 0
        //
        changed = true
    }
    
}

