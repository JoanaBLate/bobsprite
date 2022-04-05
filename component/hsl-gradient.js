// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function createGreyTranslucentGradient() { 
    const canvas = createGradient256()
    // vertical reduction
    const canvasV = createCanvas(256, 125)
    const contextV = canvasV.getContext("2d")
    contextV.drawImage(canvas, 0,  0,256,  3,   0,  0,256,  3) // rows   0 to   2 -> rows   0 to   2
    contextV.drawImage(canvas, 0,  3,256,200,   0,  3,256,100) // rows   3 to 202 -> rows   3 to 102
    contextV.drawImage(canvas, 0,203,256, 53,   0,103,256, 23) // rows 203 to 255 -> rows 103 to 125
    // horizontal reduction
    const canvasH = createCanvas(228, 125)  //  <-- final size!!!
    const contextH = canvasH.getContext("2d")
    contextH.drawImage(canvasV,   0,0,  1,125,    0,0,  1,125) // cols   0 to   0 -> cols  0 to   0
    contextH.drawImage(canvasV,   1,0,120,125,    1,0, 60,125) // cols   1 to 120 -> cols  1 to  60
    contextH.drawImage(canvasV, 121,0,135,125,   61,0,167,125) // cols 121 to 255 -> cols 61 to 227
    //
    contextH.fillStyle = "black"
    contextH.fillRect(227, 124, 1, 1)
    //
    return canvasH
}

//////////////////////////////////////////////////////////////////////////////

function createGradient256() {
    const cnv = createCanvas(256, 256) 
    const ctx = cnv.getContext("2d")
    // 
    ctx.drawImage(createWhiteGradient(), 0, 0)
    ctx.drawImage(createBlackGradient(), 0, 0)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function createWhiteGradient() { 
    const cnv = createCanvas(256, 256) 
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, 256, 256)
    const data = imgdata.data
    //
    for (let x = 0; x < 256; x++) { paintCol(x) }
    //
    ctx.putImageData(imgdata, 0, 0)
    return cnv
    //
    function paintCol(x) {
        const alpha = 255 - x
        for (let y = 0; y < 256; y++) {
            const index = 4 * (y * 256 + x)
            data[index] = 255
            data[index+1] = 255
            data[index+2] = 255
            data[index+3] = alpha
        }    
    }
}

///////////////////////////////////////////////////////////////////////////////
 
function createBlackGradient() { 
    const cnv = createCanvas(256, 256) 
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, 256, 256)
    const data = imgdata.data
    //
    for (let y = 0; y < 256; y++) { paintRow(y) }
    //
    ctx.putImageData(imgdata, 0, 0)
    return cnv
    //
    function paintRow(y) {
        const alpha = y
        for (let x = 0; x < 256; x++) {
            const index = 4 * (y * 256 + x)
            data[index] = 0
            data[index+1] = 0
            data[index+2] = 0
            data[index+3] = alpha
        }    
    }
}

