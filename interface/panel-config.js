// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelConfig   
var panelConfigCtx

var checkboxHint
var checkboxDark
var checkboxRedYellowCursor
var surfaceBgTable

var panelConfigGadgets

var isDarkInterface = true

var shallHintAlert = true // to be configured at initialization

var backgroundColor = "white"

const backgroundColors = [
    
    "255,255,255", "237,237,237", "190,190,190", "128,128,128", "54,54,56", "0,0,0", 
    "240,240,160", "240,230,140", "189,183,127", "131,0,0", "15,25,75", "blank"
]

///////////////////////////////////////////////////////////////////////////////

function initPanelConfig() {
    //
    panelConfig = createCanvas(240, 305)
    panelConfigCtx = panelConfig.getContext("2d")
    //
    panelConfig.style.position = "absolute"
    panelConfig.style.top = "325px"
    panelConfig.style.left = "1060px"
    panelConfig.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelConfig)
    //
    initPanelConfig2()
}

function initPanelConfig2() {
    //
    checkboxHint = createCheckbox("hint", panelConfigCtx, 130, 35, 12, null, shallHintAlert)
    //
    checkboxDark = createCheckbox("dark", panelConfigCtx, 130, 75, 12, toggleDarkness, isDarkInterface)
    //
    checkboxRedYellowCursor = createCheckbox("dark", panelConfigCtx, 160, 115, 12, null, false)
    //
    surfaceBgTable = createSurface("bg-table", panelConfigCtx, 3, 160,  6*paletteSide, 2*paletteSide)
    configSurfaceBgTable()
    //
    panelConfigGadgets = [ checkboxHint, checkboxDark, checkboxRedYellowCursor, surfaceBgTable ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelConfig() {
    panelConfig.onmouseup = panelOnMouseUp
    panelConfig.onmousedown = panelOnMouseDown
    panelConfig.onmousemove = panelOnMouseMove
    panelConfig.onmouseleave = panelOnMouseLeave
    panelConfig.onmouseenter = function () { panelOnMouseEnter(panelConfigGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelConfig() { 
    // background
    panelConfigCtx.fillStyle = wingColor()
    panelConfigCtx.fillRect(0, 0, 240, 305)
    //
    write(panelConfigCtx, "hint alert on", 20, 35)
    paintCheckbox(checkboxHint)
    //
    write(panelConfigCtx, "dark interface", 20, 75)
    paintCheckbox(checkboxDark)
    //
    write(panelConfigCtx, "red & yellow cursor", 20, 115)
    paintCheckbox(checkboxRedYellowCursor)
    //
    greyOuterEdgeByGadget(surfaceBgTable) 
    paintSurface(surfaceBgTable)
    //
    write(panelConfigCtx, "layer background", 20, 255)
    write(panelConfigCtx, "(not part of  image)", 20, 275)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceBgTable() {
    //
    const ctx = surfaceBgTable.canvas.getContext("2d")
    const width = surfaceBgTable.canvas.width
    //
    paintThisPalette(ctx, width, backgroundColors, paletteSide, 0, 0, false)
    //
    surfaceBgTable.onClick = toggleBackground
    surfaceBgTable.onMouseMove = surfaceBgTableOnMouseMove
}

function surfaceBgTableOnMouseMove(x, y) {
    //
    const color = bgTableColorAt(x, y)
    //
    if (color == "blank") { eraseMouseColor(); return }
    //
    const parts = color.split(",")
    const res = [ 0, 0, 0, 255 ]
    res[0] = parseInt(parts[0])
    res[1] = parseInt(parts[1])
    res[2] = parseInt(parts[2])
    //        
    changeMouseColor(res)
}

function bgTableColorAt(x, y) {
    //
    const col = Math.floor(x / paletteSide)
    const row = Math.floor(y / paletteSide)
    const numberOfCols = Math.floor(surfaceBgTable.width / paletteSide)
    const index = col + (row * numberOfCols)
    return backgroundColors[index]
}

function toggleBackground() {
    shallRepaint = true
    //
    if (mouseAlpha == -1) { 
        backgroundColor = "blank"
    }
    else {
        backgroundColor = "rgb(" + mouseRed + "," + mouseGreen + "," + mouseBlue + ")"
    }
}

///////////////////////////////////////////////////////////////////////////////

function toggleDarkness() {
    isDarkInterface = ! isDarkInterface // also called by keyboard!
    checkboxDark.checked = isDarkInterface
    //
    paintInterface()
}

