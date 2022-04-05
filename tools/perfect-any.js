// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// helps thin-pen and mirror-pen //

var executeds  = []
var executedsA = [] // for mirror pen
var executedsB = [] // for mirror pen

///////////////////////////////////////////////////////////////////////////////

function PerfectPixel(x, y, r, g, b, a) {
    this.x = x
    this.y = y
    // old color:
    this.r = r
    this.g = g
    this.b = b
    this.a = a
}

///////////////////////////////////////////////////////////////////////////////

function resetPerfectAny() {
    executeds  = []
    executedsA = [] // for mirror pen
    executedsB = [] // for mirror pen
}

///////////////////////////////////////////////////////////////////////////////

function paintPerfectPixel(ctx, x, y, controlList) {
    //
    const R = shiftPressed ? 0 : RED
    const G = shiftPressed ? 0 : GREEN
    const B = shiftPressed ? 0 : BLUE
    const A = shiftPressed ? 0 : ALPHA
    // 
    const imgdata = ctx.getImageData(x, y, 1, 1)
    const data = imgdata.data
    const r = data[0]
    const g = data[1]
    const b = data[2]
    const a = data[3]
    //
    const pp = new PerfectPixel(x, y, r, g, b, a)
    //
    controlList.push(pp)
    if (controlList.length > 3) { controlList.shift() }
    //
    if (r==R && g==G && b==B && a==A) { return false }
    //
    data[0] = R
    data[1] = G
    data[2] = B
    data[3] = A
    //    
    ctx.putImageData(imgdata, x, y)    
    resetPerfectCorner(ctx, controlList)  
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function resetPerfectCorner(ctx, controlList) {
    // 
    if (controlList.length < 3) { return }
    //
    const last = controlList[2]
    const corner = controlList[1]
    const first  = controlList[0]
    // 
    if (! isDiagonal(last, first)) { return }
    if (isDiagonal(last, corner))  { return }
    //
    resetCornerPixel(ctx, corner)
    //
    // ERROR: CREATES ANOTHER LIST INSTEAD OF EDITING THE ORIGINAL!!!
    // controlList = [ last ] //
    //
    controlList.shift() // extracts the first
    controlList.shift() // extracts the corner
}

///////////////////////////////////////////////////////////////////////////////

function resetCornerPixel(ctx, corner) {
    const imgdata = ctx.getImageData(corner.x, corner.y, 1, 1)
    const data = imgdata.data
    data[0] = corner.r
    data[1] = corner.g
    data[2] = corner.b
    data[3] = corner.a
    ctx.putImageData(imgdata, corner.x, corner.y)    
}

function isDiagonal(a, b) {
    if (Math.abs(a.x - b.x) != 1) { return false }
    if (Math.abs(a.y - b.y) != 1) { return false }
    return true
}

