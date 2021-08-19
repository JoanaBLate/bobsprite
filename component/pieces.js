// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function createColoredCanvas(width, height, color) {
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function createCanvasLabel(txt, fontSize, fgColor) {
    const cnv = createCanvas(100, 100)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = fgColor
    ctx.font = "900 " + fontSize + "px Arial,Helvetica,MonoSpace,Sans-Serif"
    ctx.textBaseline = "top"
    ctx.fillText(txt, 0, 0)
    //
    return autocrop(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function greyTraceH(targetCtx, left, top, width) {
    greyArea(targetCtx, left, top, width, 1)
}

function greyTraceV(targetCtx, left, top, height) {
    greyArea(targetCtx, left, top, 1, height)
}

function greyArea(targetCtx, left, top, width, height) {
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = foldColor()
    ctx.fillRect(0, 0, width, height)
    //
    targetCtx.drawImage(cnv, left, top)
}

function greyOuterEdgeByGadget(gadget) {
    greyOuterEdge(gadget.parentCtx, gadget.left, gadget.top, gadget.width, gadget.height)
}

function greyOuterEdge(targetCtx, left, top, width, height) {
    greyEmptyRect(targetCtx, left-1, top-1, width+2, height+2)
}

function greyEmptyRect(targetCtx, left, top, width, height) {
    //
    greyTraceH(targetCtx, left, top, width) // top
    greyTraceH(targetCtx, left, top+height-1, width) // bottom
    //
    greyTraceV(targetCtx, left, top+1, height-2) // left
    greyTraceV(targetCtx, left+width-1, top+1, height-2) // right
}

///////////////////////////////////////////////////////////////////////////////

function paintBgOn25(ctx, left, top) {
    ctx.fillStyle = "white"
    ctx.fillRect(left, top, 25, 25)
}

function paintBgOn30(ctx, left, top) {
    ctx.fillStyle = "white"
    ctx.fillRect(left, top, 30, 30)
}

///////////////////////////////////////////////////////////////////////////////

function paintBgOff25(ctx, left, top) {
    ctx.fillStyle = wingColor()
    ctx.fillRect(left, top, 25, 25)
}

function paintBgOff30(ctx, left, top) {
    ctx.fillStyle = wingColor()
    ctx.fillRect(left, top, 30, 30)
}

///////////////////////////////////////////////////////////////////////////////

function createChessBox(width, height, side) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = chessColorDark
    ctx.fillRect(0, 0, width, height)
    //    
    ctx.fillStyle = chessColorLight
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

///////////////////////////////////////////////////////////////////////////////

function createStandardHueCanvas(width, height) { 
    const cnv = createCanvas(360, height) 
    const ctx = cnv.getContext("2d")
    //
    for (let left = 0; left < 360; left++) {
        ctx.fillStyle = "hsl(" + left + ",100%,50%)"
        ctx.fillRect(left, 0, 1, height)
    }
    //
    const cnv2 = createCanvas(width, height)
    cnv2.getContext("2d").drawImage(cnv, 0,0,360,height,  0,0,width,height)
    return cnv2
}

/*
function createStandardHueCanvas(width, height) { 
    const cnv = createCanvas(width, height) 
    const ctx = cnv.getContext("2d")
    //
    const grd = ctx.createLinearGradient(0, 0, width-1, 0)
    grd.addColorStop(0,    "rgb(255,   0,   0)")
    grd.addColorStop(0.17, "rgb(255, 255,   0)")
    grd.addColorStop(0.34, "rgb(0,   255,   0)")
    grd.addColorStop(0.51, "rgb(0,   255, 255)")
    grd.addColorStop(0.68, "rgb(0,     0, 255)")
    grd.addColorStop(0.85, "rgb(255,   0, 255)")
    grd.addColorStop(1,    "rgb(255,   0,   0)")
    //
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)
    //
    return cnv 
}
*/

///////////////////////////////////////////////////////////////////////////////

function createMarker(side) {
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, side, side)
    //
    ctx.fillStyle = "white"
    ctx.fillRect(1, 1, side-2,side-2)
    //
    ctx.clearRect(2, 2, side-4, side-4)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
  
function paintThisPalette(ctx, width, list, side, rowStart, top, even) {
    //
    const bg1 = even ? "rgb(180,180,180)" : "rgb(235,235,235)"
    const bg2 = even ? "rgb(235,235,235)" : "rgb(180,180,180)" 
    //
    let left = rowStart   
    //
    for (const raw of list) {
        //
        paintColorOnThisPalette(ctx, raw, left, top, side, bg1, bg2)
        //
        left += side
        if (left >= width ) { left = rowStart; top += side }
    }
}

function paintColorOnThisPalette(ctx, raw, left, top, side, bg1, bg2) {
    //
    if (raw != "blank") { 
        ctx.fillStyle = "rgb(" + raw + ")"
        ctx.fillRect(left, top, side, side)
        return
    }
    //
    ctx.fillStyle = bg1
    ctx.fillRect(left, top, side, side)  
    //
    const half = Math.floor(side / 2)
    const exact = (side == 2 * half)
    const delta = exact ? 0 : 1
    //          
    ctx.fillStyle = bg2
    ctx.fillRect(left, top, half, half+delta)
    ctx.fillRect(left+half, top+half+delta, half+delta, half)
}

