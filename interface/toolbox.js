// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var tool = "thin-pen"
var toolBeforeCapture = "thin-pen"

var toolbox
var toolboxCtx

var toolboxScheme = [ 
    //
    "mirror-pen",
    "spray",
    "every",
    "bucket",
    "thin-pen",
    //
    "rectangle",
    "ellipse",
    "border",
    "line",
    "pen",
    //
    "darken",
    "lighten",
    "rubber",
    "capture",
    "feather",
    //
    "blur-pixel",
    "blur-border",
    "scale",    
    "hand",
    "", // for finding clicked icon
    //
    "select",
    "lasso",   
    "", // for finding clicked icon
    "", // for finding clicked icon
    ""  // for finding clicked icon
]

///////////////////////////////////////////////////////////////////////////////

function initToolbox() {
    toolbox = createCanvas(160, 185)
    toolboxCtx = toolbox.getContext("2d")
    //
    toolbox.style.position = "absolute"
    toolbox.style.top = "30px"
    //
    bigdiv.appendChild(toolbox)
}

///////////////////////////////////////////////////////////////////////////////

function startListeningToolbox() {
    toolbox.onmousedown = resetFocusedGadget
    toolbox.onclick = toolboxClicked
}

///////////////////////////////////////////////////////////////////////////////

function paintToolbox() {
    paintToolboxBg()
    //
    greyTraceH(toolboxCtx, 5, 0, 150)
    paintIconsOnToolbox()
    paintToolSizeOnToolbox()
    paintToolIntensityOnToolbox()
}

function paintToolboxBg() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(0, 0, 160, 185)
}

function paintIconsOnToolbox() {
    let left = 1
    let top  = 6
    //
    for (const id of toolboxScheme) {
        paintIconOnToolbox(id, left, top)
        left += 32
        if (left > 130) { left = 1; top += 32 }    
    }
}

function paintIconOnToolbox(id, left, top) {
    if (id == "") { return }
    //
    if (id == tool) { 
        paintBgOn30(toolboxCtx, left, top)
    }
    else {
        paintBgOff30(toolboxCtx, left, top)    
    }
    //
    const icon = getIcon30(id)
    toolboxCtx.drawImage(icon, left, top)
}

///////////////////////////////////////////////////////////////////////////////

function paintToolSizeOnToolbox() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(0, 165, 90, 20)
    //
    const side = toolSizeFor[tool]
    if (side == undefined) { return }
    //
    const txt = "size  " + side + " x " + side
    write(toolboxCtx, txt, 5, 170)
}

function paintToolIntensityOnToolbox() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(90, 165, 70, 20)
    //
    let intensity = intensityFor[tool]
    if (intensity == undefined) { return }
    if (tool == "lighten"  ||  tool == "darken") { intensity *= 10 }
    //
    const txt = "int  " + Math.floor(intensity * 100) + "%"
    write(toolboxCtx, txt, 95, 170)
}

///////////////////////////////////////////////////////////////////////////////

function toolboxClicked(e) {
    const wanted = clickedIconOnToolbox(e.offsetX, e.offsetY)
    //
    if (wanted == "") { return }
    //
    if (wanted == "capture") { toolBeforeCapture = tool }   
    //
    tool = wanted
    paintIconsOnToolbox()
}

function recoverToolBeforeCapture() {
    tool = toolBeforeCapture
    paintIconsOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function clickedIconOnToolbox(x, y) {
    const tops = [ 6, 38, 70, 106, 138 ] 
    //
    const off = tops.length
    for (let n = 0; n < off; n++) {
        const top = tops[n]
        if (y < top) { return "" }
        if (y < top + 30) { return clickedRowOnToolbox(x, n) }
    }
    //
    return ""
}
     
function clickedRowOnToolbox(x, row) {
    const lefts = [ 1, 33, 65, 97, 129 ] // excludes 2 pixels from left
    //
    const off = lefts.length
    for (let n = 0; n < off; n++) {
        const left = lefts[n]
        if (x < left) { return "" }
        if (x < left + 30) { return clickedRowColOnToolbox(row, n) }
    }
    return ""
}

function clickedRowColOnToolbox(row, col) {
    return toolboxScheme[row * 5 + col]
}

