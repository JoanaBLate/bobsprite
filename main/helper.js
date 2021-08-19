// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function cloneImage(img) {
    const cnv = createCanvas(img.width, img.height)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(img, 0, 0)
    return cnv
}
    
///////////////////////////////////////////////////////////////////////////////

function Point(x, y) {
    this.x = x
    this.y = y
}

function createPoint(x, y) {
    return new Point(x, y)
}

///////////////////////////////////////////////////////////////////////////////

function Rectangle(left, top, width, height) {
    this.left = left
    this.top  = top
    this.width  = width
    this.height = height
}

///////////////////////////////////////////////////////////////////////////////

function pixelsMatch(px1, px2) {
    if (px1[0] != px2[0]) { return false }
    if (px1[1] != px2[1]) { return false }
    if (px1[2] != px2[2]) { return false }
    if (px1[3] != px2[3]) { return false }
    return true
}

///////////////////////////////////////////////////////////////////////////////

function canvasesAreEqual(a, b) {
    const width  = a.width
    const height = a.height
    if (width  !=  b.width)  { return false }
    if (height !=  b.height) { return false }
    //
    const dataA = a.getContext("2d").getImageData(0, 0, width, height).data
    const dataB = b.getContext("2d").getImageData(0, 0, width, height).data
    const off = dataA.length
    for (let n = 0; n < off; n++) {
        if (dataA[n] != dataB[n]) { return false }
    }
    return true
}

///////////////////////////////////////////////////////////////////////////////

function bestMatchingPixel(cnv, target) {
    const ctx = cnv.getContext("2d")
    const width = cnv.width
    const height = cnv.height
    const data = ctx.getImageData(0, 0, width, height).data
    //
    let bestDelta = 3 * 255 
    let bestX = 0
    let bestY = 0
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index = 4 * (y * width + x)
            //
            const dr = Math.abs(data[index    ] - target[0])
            const dg = Math.abs(data[index + 1] - target[1])
            const db = Math.abs(data[index + 2] - target[2])
            const delta = dr + dg + db
            //
            if (delta > bestDelta) { continue }
            //
            bestDelta = delta
            bestX = x
            bestY = y
        }
    }
    //
    return new Point(bestX, bestY)
}

///////////////////////////////////////////////////////////////////////////////

/*
// considering color [67,97,137,136]

function testChromeGetImageDataBugOnTranslucentPixels() {
    var cnv = document.createElement("canvas")
    cnv.width  = 100
    cnv.height = 100
    var ctx = cnv.getContext("2d")
    ctx.fillStyle = "rgba(67,98,137," + 136/255 + ")"
    ctx.fillRect(0, 0, 100, 100)
    //
    console.log("painted with [67,98,137,136]")
    console.log(ctx.getImageData(0,0,1,1).data) // prints [67,97,137,136] // CHANGES BLUE 98 TO BLUE 97
    console.log(ctx.getImageData(0,0,1,1).data) // prints [67,98,137,136] // correct reading
}
 
/*
    it is the same for loaded images:
    the first getImageData on a pixel brings  [67,97,137,136] // CHANGES BLUE 98 TO BLUE 97
    the second brings [67,98,137,136] // correct reading
* /

*/

///////////////////////////////////////////////////////////////////////////////

