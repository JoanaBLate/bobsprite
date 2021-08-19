// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelConfig   
var panelConfigCtx

var checkboxDark
var surfaceBgTable
var sliderSpeed

var panelConfigGadgets

var isDarkInterface = true

var backgroundColor = "blank"

const backgroundColors = [
    
    "blank", "15,141,0", "35,93,19", "255,50,43", "210,20,0", "131,0,0",    
    "189,183,127", "240,230,140", "240,240,160", "176,128,96", "178,119,55", "110,78,35",
     "5,17,85", "75,75,150", "60,150,170", "164,164,164", "255,255,255", "0,0,0"
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
    checkboxDark = createCheckbox("dark", panelConfigCtx, 130, 31, 12, toggleDarkness, isDarkInterface)
    //
    surfaceBgTable = createSurface("bg-table", panelConfigCtx, 3, 85,  6*paletteSide, 3*paletteSide)
    configSurfaceBgTable()
    //
    sliderSpeed = createSlider("speed", panelConfigCtx, 10, 255, 220, 0.5, changeFrameDuration)
    //
    panelConfigGadgets = [ checkboxDark, surfaceBgTable, sliderSpeed ]
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
    write(panelConfigCtx, "dark interface", 20, 30)
    paintCheckbox(checkboxDark)
    //
    write(panelConfigCtx, "canvas background", 20, 65)
    //
    greyOuterEdgeByGadget(surfaceBgTable) 
    paintSurface(surfaceBgTable)
    //
    paintFrameDuration()
    paintSlider(sliderSpeed)
}

function paintFrameDuration() {
    panelConfigCtx.fillStyle = wingColor()
    panelConfigCtx.fillRect(20, 233, 160, 20)
    write(panelConfigCtx, "animation speed", 22, 235)
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

