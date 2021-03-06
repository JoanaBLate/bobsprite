// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function startBlur() { 
    //
    continueBlur() 
}

function continueBlur() { 
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(true) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y   
        paintBlur(ctx, p.x, p.y) 
    }
}

function finishBlur() {
    //
    paintLastX = null
    paintLastY = null
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintBlur(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    // paint rectangle is expanded to include outside neighbors!!!
    // any pixel outside layer comes as [0,0,0,0]
    //
    paintBlur2(ctx, rect.left-1, rect.top-1, rect.width+2, rect.height+2)
}

function paintBlur2(ctx, left, top, width, height) {
    //
    const imgdata = ctx.getImageData(left, top, width, height) 
    const data = imgdata.data
    //
    const refdata = paintControlCtx.getImageData(left, top, width, height).data
    //
    let anyChange = false
    //
    // paint rectangle was expanded to include outside neighbors!!!
    // any pixel outside layer comes as [0,0,0,0]
    // iterating on INNER rectangle now!!!
    //
    for (let x = 1; x < width-1; x++) {
        for (let y = 1; y < height-1; y++) {
            const changed = paintBlurAt(data, refdata, width, x, y) 
            if (changed) { anyChange = true }
        }
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, left, top)
    shallMemorizePaint = true
}

function paintBlurAt(data, refdata, width, x, y) { 
    //
    // bounds are ok because rectangle was previously expanded
    // any pixel outside layer comes as [0,0,0,0]
    //
    const index = 4 * (y * width + x)
    // original values
    const R = refdata[index]
    const G = refdata[index + 1]
    const B = refdata[index + 2]
    const A = refdata[index + 3]
    //
    if (A == 0) { return false } // blank
    if (shallProtectBlack  &&  A == 255  &&  R + G + B == 0) { return false }
    //
    // current values
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    // 
    if (r != R  ||  g != G  ||   b != B) { return false } // already done
    //     
    return paintBlurAt2(data, refdata, width, x, y, R, G, B, A) 
}
    
function paintBlurAt2(data, refdata, width, x, y, R, G, B, A) { 
    //  
    const RGB = getBlurInfo(refdata, width, x, y) // fractionary values
    if (RGB == null) { return false }
    //
    let rate = intensityFor[tool]
    const rate2 = 1 - rate
    //    
    let r, g, b
    //
    if (shiftPressed) { 
        // antiblur
        rate *= 1.25
        //
        r = R + Math.round(rate * (R - RGB[0]))
        g = G + Math.round(rate * (G - RGB[1]))
        b = B + Math.round(rate * (B - RGB[2]))
    }
    else {
        // blur
        r = Math.round(RGB[0] * rate  +  R * rate2)
        g = Math.round(RGB[1] * rate  +  G * rate2)
        b = Math.round(RGB[2] * rate  +  B * rate2)  
    }
    // fix bounds 
    if (r < 0) { r = 0 }
    if (g < 0) { g = 0 }
    if (b < 0) { b = 0 }
    // fix bounds 
    if (r > 255) { r = 255 }
    if (g > 255) { g = 255 }
    if (b > 255) { b = 255 }
    // checking
    if (A == 255 &&  r + g + b == 0) { r = 1; g = 1; b = 1 } // avoiding false outline
    if (r == R  &&  g == G  &&  b == B) { return false } // no change
    // applying
    const index = 4 * (y * width + x)
    //
    data[index]     = r
    data[index + 1] = g
    data[index + 2] = b
    //
    return true
}

function getBlurInfo(refdata, width, x, y) { // fractionary values
    //
    // bounds are ok because rectangle was previously expanded
    // any pixel outside layer comes as [0,0,0,0]
    //
    let count = 0
    const arr = [0, 0, 0] // [R, G, B]
    //
    addNeighbor(x,   y-1, false) // north
    addNeighbor(x,   y+1, false) // south
    addNeighbor(x-1, y,   false) // west
    addNeighbor(x+1, y,   false) // east
    addNeighbor(x-1, y-1, true) // northwest
    addNeighbor(x+1, y-1, true) // northeast
    addNeighbor(x-1, y+1, true) // southwest
    addNeighbor(x+1, y+1, true) // southeast
    // 
    if (count == 0) { return null } // no blur
    //
    arr[0] /= count
    arr[1] /= count
    arr[2] /= count
    //
    return arr
    //
    function addNeighbor(x, y, diagonal) {
        // bounds are ok because rectangle was expanded
        // bounds need not to be checked
        //
        const index = 4 * (width * y + x)
        const r = refdata[index]
        const g = refdata[index + 1]
        const b = refdata[index + 2]
        const a = refdata[index + 3]
        //
        if (a == 0) { return } // blank
        if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return } 
        //
        const factor = diagonal ? 1 : 2 // straight weighs double than diagonal
        arr[0] += r * factor
        arr[1] += g * factor
        arr[2] += b * factor
        //
        count += factor
    }
} 

