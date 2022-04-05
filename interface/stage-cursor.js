// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

const cursors = { } // "side:color" : cnv

///////////////////////////////////////////////////////////////////////////////

function drawPictureCursor() {
    //
    if (! okToDrawCursor()) { stage.style.cursor = "default"; return }
    //
    stage.style.cursor = "none"
    //
    // ignoring zoom level
    //
    const deltaTool = (toolSizeFor[tool] - 1) / 2 // assumimg tool size is odd and greater than 1
    //
    const cornerX = stageX - deltaTool
    const cornerY = stageY - deltaTool
    //
    // applying zoom level
    //
    const cornerDeltaX = cornerX - stageCenterX
    const cornerDeltaY = cornerY - stageCenterY
    //
    const rawCornerX = stageCenterX + (cornerDeltaX * ZOOM)
    const rawCornerY = stageCenterY + (cornerDeltaY * ZOOM)
    //
    // painting cursor
    //
    const side = toolSizeFor[tool] * ZOOM
    //
    const isRedYellow = checkboxRedYellowCursor.checked 
    //
    const cursor = getCursor(side, isRedYellow)
    //   
    const thick = side > 9 ? 3 : 2
    //
    const left = rawCornerX - thick
    const top  = rawCornerY - thick
    //
    stageCtx.drawImage(cursor, left, top)    
}

function getCursor(side, isRedYellow) {
    //
    const id = side + ":" + (isRedYellow ? "red-yellow" : "black-white")
    //
    let cursor = cursors[id]
    //
    if (cursor == undefined) { 
        cursor = makeCursor(side, isRedYellow)
        cursors[id] = cursor
    }
    //
    return cursor
}

function makeCursor(innerSide, isRedYellow) {
    if (innerSide > 9) { 
        return makeFatCursor(innerSide, isRedYellow)
    }
    return makeThinCursor(innerSide, isRedYellow)
}
    
///////////////////////////////////////////////////////////////////////////////

function makeFatCursor(innerSide, isRedYellow) {
    //
    const side = innerSide + 6
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = (isRedYellow ? "red" : "white")
    //
    ctx.fillRect(0, 0, side, side)
    ctx.clearRect(3, 3, side - 6, side - 6)
    //
    ctx.fillStyle = (isRedYellow ? "yellow" : "black")
    //
    let len = Math.floor(side / 2) // middle part
    let rest = side - len // sum of two beacons
    //
    if (rest % 2 != 0) {
        len -= 1
        rest += 1
    }
    //
    const start = (rest / 2)
    //
    ctx.fillRect(start, 0, len, 3) // top
    ctx.fillRect(start, side-3, len, 3) // bottom
    ctx.fillRect(0, start, 3, len) // left
    ctx.fillRect(side-3, start, 3, len) // right
    //
    return cnv
}  

///////////////////////////////////////////////////////////////////////////////

function makeThinCursor(innerSide, isRedYellow) {
    //
    const side = innerSide + 4
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = (isRedYellow ? "red" : "white")
    //
    ctx.fillRect(0, 0, side, side)
    ctx.clearRect(2, 2, side - 4, side - 4)
    //
    ctx.fillStyle = (isRedYellow ? "yellow" : "black")
    //
    let len = Math.floor(side / 2) // middle part
    let rest = side - len // sum of two beacons
    //
    if (rest % 2 != 0) {
        len -= 1
        rest += 1
    }
    //
    const start = (rest / 2) 
    //
    ctx.fillRect(start, 0, len, 2) // top
    ctx.fillRect(start, side-2, len, 2) // bottom
    ctx.fillRect(0, start, 2, len) // left
    ctx.fillRect(side-2, start, 2, len) // right
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function okToDrawCursor() { 
    //
    if (stageRawX == null) { return false }
    //
    if (ZOOM == 0.5) { return false }
    //
    if (toolSizeFor[tool] == 1) { return false }
    //
    if (tool == "pen")     { return true }
    if (tool == "rubber")  { return true }
    if (tool == "brush")   { return true }
    if (tool == "feather") { return true }
    if (tool == "lighten") { return true }
    if (tool == "darken")  { return true }
    if (tool == "line")    { return true }
    if (tool == "spray")   { return true }
    if (tool == "blur-pixel") { return true }
    //
    return false
}

