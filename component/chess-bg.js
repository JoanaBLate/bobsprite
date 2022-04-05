// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

const chessLightColorA = "rgb(180,180,180)"
const chessLightColorB = "rgb(172,172,172)"

const chessDarkColorA = "rgb(140,140,140)"
const chessDarkColorB = "rgb(130,130,130)"

const chessIconColorA = "rgb(220,220,220)"
const chessIconColorB = "rgb(200,200,200)"

///////////////////////////////////////////////////////////////////////////////

function createStageChessLight() {
    //
    return createChessBox(900, 600, 60, chessLightColorA, chessLightColorB)
}

function createStageChessDark() {
    //
    return createChessBox(900, 600, 60, chessDarkColorA, chessDarkColorB)
}

///////////////////////////////////////////////////////////////////////////////

function createChessBox(width, height, side, light, dark) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark
    ctx.fillRect(0, 0, width, height)
    //    
    ctx.fillStyle = light
    //    
    let top = 0
    let startJumping = false
    //
    while (true) {
        paintChessBoxRow(ctx, width, top, side, startJumping)
        startJumping = ! startJumping
        top += side        
        if (top > height - 1) { break }
    }
    //
    return cnv
}

function paintChessBoxRow(ctx, width, top, side, startJumping) {
    let left = startJumping ? side : 0
    while (true) {
        ctx.fillRect(left, top, side, side)
        left += side * 2
        if (left > width - 1) { break }
    }
}

