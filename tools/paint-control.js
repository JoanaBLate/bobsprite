// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var shallProtectBlank = false
var shallProtectBlack = false

var paintStartX = null
var paintStartY = null

var paintLastX = null
var paintLastY = null

var originalPaint = null // canvas

var paintControlCtx = null

var shallMemorizePaint = false

///////////////////////////////////////////////////////////////////////////////

function resetPaintControlCtx(shallFill) {
    //
    const width = toplayer.canvas.width
    const height = toplayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    paintControlCtx = cnv.getContext("2d")
    //
    if (shallFill) { paintControlCtx.drawImage(toplayer.canvas, 0, 0) }
}

function toggleProtection() {
    //
    shallProtectBlank = ! shallProtectBlank
    shallProtectBlack = ! shallProtectBlack
    //
    paintTopBar()
    //
    if (shallProtectBlank) { hintAlert("now some tools will not affect blank or black pixels") }
}

