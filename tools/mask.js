// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// used to draw line, ellipse, rectangle, lasso and select

var mask = null // also used for validation 

var maskCtx = null // may keep obsolet value

var maskImgData = null // may keep obsolet value

var maskOn = false

///////////////////////////////////////////////////////////////////////////////

function resetMask() { 
    //
    mask = createCanvas(toplayer.canvas.width, toplayer.canvas.height)
    //
    maskCtx = mask.getContext("2d")
    //
    maskImgData = getFullImageData(mask)    
    //
    maskOn = true
}

///////////////////////////////////////////////////////////////////////////////

function clearMask() {
    //
    const maskdata = maskImgData.data
    const off = maskdata.length
    //
    for(let n = 0; n < off; n++) { maskdata[n] = 0 }
}

///////////////////////////////////////////////////////////////////////////////

function applyMask() { // for line, rectangle and ellipse
    //
    const width  = toplayer.canvas.width
    const height = toplayer.canvas.height
    //
    const ctx = toplayer.canvas.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const maskdata = maskImgData.data
    //
    let changed = false
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index = 4 * (width * y + x)
            const gotChange = applyMaskPixel(data, maskdata, index)
            if (gotChange) { changed = true }
        }
    }
    //
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
}

function applyMaskPixel(data, maskdata, index) {
    //
    const maskR = maskdata[index]
    const maskG = maskdata[index + 1]
    const maskB = maskdata[index + 2]
    const maskA = maskdata[index + 3]
    //
    if (maskA == 0) { return } // blank mask pixel
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (shallProtectBlank  &&  a == 0) { return }
    if (shallProtectBlack  &&  a == 255  &&  r+g+b == 0) { return }
    // 
    data[index    ] = maskR
    data[index + 1] = maskG
    data[index + 2] = maskB
    data[index + 3] = maskA
    //
    if (maskR != r  ||  maskG != g  ||  maskB != b  || maskA != a) { return true }
    //
    return false
}

