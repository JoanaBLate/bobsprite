// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function createSliderCursor(dark) {
    const cnv = createCanvas(20, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : "rgb(90,90,90)"
    ctx.beginPath()
    ctx.arc(10, 10, 9, 0, 2 * Math.PI);
    ctx.fill()
    //
    ctx.fillStyle = dark ? "silver" : wingColorLight
    ctx.beginPath()
    ctx.arc(10, 10, 7, 0, 2 * Math.PI);
    ctx.fill()
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createSliderBar(width, dark) {
    //
    const cnv = createCanvas(width, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : wingColorLight
    ctx.fillRect(0, 0, width, 20)
    //
    const core = createSliderBarCore(width - 20, dark) // reserving space for cursor at ends
    ctx.drawImage(core, 10, 0)
    //
    return cnv
}

function createSliderBarCore(width, dark) {
    //
    const cnv = createCanvas(width, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : wingColorLight
    ctx.fillRect(0, 0, width, 20)
    //
    ctx.fillStyle = dark ? "rgb(170,170,180)" : "dimgrey"
    ctx.fillRect(0,  7, width, 2)
    ctx.fillRect(0, 11, width, 2)
    //
    ctx.drawImage(sliderLeftBeacon(dark), 0, 7)
    ctx.drawImage(sliderRightBeacon(dark), width-3, 7)
    // 
    if (dark) { ctx.fillRect(2, 9, width-4, 2) }
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function sliderLeftBeacon(dark) {
    if (dark) {
        return sliderBeacon([0,135,138, 135,172,172, 168,172,172], dark)
    }
    return sliderBeacon([0,141,109, 141,105,105, 109,105,170], dark)
}

function sliderRightBeacon(dark) {
    const src = sliderLeftBeacon(dark)
    const clone = cloneImage(src)
    horizontalReverse(clone)
    return clone
}

///////////////////////////////////////////////////////////////////////////////

function sliderBeacon(hints, dark) {
    const cnv = createCanvas(3, 6)
    const ctx = cnv.getContext("2d")
    //
    const colors = [ ]
    for (const hint of hints) { colors.push(colorFromHint(hint, dark)) }
    // top part
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 3; x ++) {
            const index = (y * 3) + x 
            const color = colors[index]
            ctx.fillStyle = color
            ctx.fillRect(x, y, 1, 1)
        }
    }
    // bottom part
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 3; x ++) {
            const index = (y * 3) + x 
            const color = colors[index]
            ctx.fillStyle = color
            ctx.fillRect(x, (5-y), 1, 1)
        }
    }
    //
    return cnv
}

function colorFromHint(hint, dark) {
    if (hint == 0) { return dark ? wingColorDark : wingColorLight }
    //
    return "rgb(" + hint + "," + hint + "," + hint + ")"
}

