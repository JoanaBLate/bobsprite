// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelPalette   
var panelPaletteCtx
                                
const paletteSide = 39

var surfacePalette

var buttonPreviousPalette
var buttonNextPalette
var buttonLoadPalette
var buttonSavePalette

var panelPaletteCursor = ""

var paletteIndexAtMouseDown = -1

var panelPaletteGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelPalette() {
    panelPalette = createCanvas(240, 305)
    panelPaletteCtx = panelPalette.getContext("2d")
    //
    panelPalette.style.position = "absolute"
    panelPalette.style.top = "325px"
    panelPalette.style.left = "1060px"
    panelPalette.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelPalette)
    //
    initPanelPalette2()
}

function initPanelPalette2() {
    //
    const ctx = panelPaletteCtx
    //
    surfacePalette = createSurface("image-palette", ctx, 3, 3, 6*paletteSide, 5*paletteSide)
    configSurfacePalette()
    updateSurfacePalette()
    //
    buttonPreviousPalette = createButton("previous-palette", ctx, 13, 225, 97, 27, "previous plt", previousPalette, true)
    //
    buttonNextPalette = createButton("next-palette", ctx, 127, 225, 97, 27, "next palette", nextPalette, false)
    //
    buttonLoadPalette = createButton("load-palette", ctx, 13, 265, 97, 27, "load palette", loadPalette, true)
    //
    buttonSavePalette = createButton("save-palette", ctx, 127, 265, 97, 27, "save palette", savePalette, false)
    //
    panelPaletteGadgets = [ surfacePalette, buttonPreviousPalette, buttonNextPalette, buttonLoadPalette, 
                            buttonSavePalette ]
}

///////////////////////////////////////////////////////////////////////////////

function setPaletteCursorDefault() {
    if (panelPaletteCursor == "") { return }
    //
    panelPaletteCursor = ""
    panelPalette.style.cursor = ""
}

function setPaletteCursorMove() {
    if (panelPaletteCursor == "move") { return }
    //
    panelPaletteCursor = "move"
    panelPalette.style.cursor = "move"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelPalette() {
    panelPalette.onwheel = panelOnWheel
    panelPalette.onmouseup = panelOnMouseUp
    panelPalette.onmousedown = panelOnMouseDown
    panelPalette.onmousemove = panelOnMouseMove
    panelPalette.onmouseleave = panelOnMouseLeave
    panelPalette.onmouseenter = function () { panelOnMouseEnter(panelPaletteGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelPalette() { 
    // background
    panelPaletteCtx.fillStyle = wingColor()
    panelPaletteCtx.fillRect(0, 0, 240, 305)
    //
    paintSurface(surfacePalette)
    greyOuterEdgeByGadget(surfacePalette)
    write(panelPaletteCtx, paletteName, 110, 205)
    //
    paintButton(buttonPreviousPalette)
    paintButton(buttonNextPalette)
    paintButton(buttonLoadPalette)
    paintButton(buttonSavePalette)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfacePalette() {
    //
    surfacePalette.onWheel = surfacePaletteOnWheel
    surfacePalette.onClick = surfacePaletteOnClick
    surfacePalette.onMouseDown = surfacePaletteOnMouseDown
    surfacePalette.onMouseMove = surfacePaletteOnMouseMove
    surfacePalette.onMouseLeave = surfacePaletteOnMouseLeave
}

function surfacePaletteOnWheel(x, y, sign) {
    //
    changePalette(sign) // changePalette does not call changeMouseColor
    //
    updateMouseColorByPalette(x, y)   
}

function surfacePaletteOnMouseDown(x, y) {
    paletteIndexAtMouseDown = paletteIndexByMouse(x, y)
}

function surfacePaletteOnMouseMove(x, y, dragging) {
    // 
    if (dragging  &&  paletteIndexAtMouseDown != -1) { 
        setPaletteCursorMove() 
    } 
    else { 
        setPaletteCursorDefault() 
    }
    //
    updateMouseColorByPalette(x, y)
}

function surfacePaletteOnClick(x, y) {
    //
    setPaletteCursorDefault()
    //
    const index = paletteIndexByMouse(x, y)
    //
    if (index != paletteIndexAtMouseDown) { moveColorInPalette(paletteIndexAtMouseDown, index); return }
    //
    if (shiftPressed) { addColorToPalette(index); return }
    //    
    if (ctrlPressed) { deleteColorInPalette(index); return }
    //
    captureColorFromPalette()
}

function surfacePaletteOnMouseLeave() {
    paletteIndexAtMouseDown = -1 
    eraseMouseColor()
    setPaletteCursorDefault()
}

///////////////////////////////////////////////////////////////////////////////

function updateMouseColorByPalette(x, y) {
    const index = paletteIndexByMouse(x, y)
    const color = paletteColorArrayByIndex(index)
    changeMouseColor(color)
}

function captureColorFromPalette() {
    //
    const color = [ mouseRed, mouseGreen, mouseBlue, mouseAlpha ]
    updateCurrentColor(color) 
}

function addColorToPalette(index) {
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    palettes[paletteName][index] = RED + "," + GREEN + "," + BLUE
    updateSurfacePalette()
    paintSurface(surfacePalette)
    changeMouseColor([RED, GREEN, BLUE, 255])
}

function deleteColorInPalette(index) {
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    palettes[paletteName][index] = "blank"
    updateSurfacePalette()
    paintSurface(surfacePalette)
    eraseMouseColor()
}

function moveColorInPalette(indexA, indexB) {
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    const palette = palettes[paletteName]
    //
    const a = palette[indexA]
    const b = palette[indexB]
    palette[indexA] = b
    palette[indexB] = a
    //
    updateSurfacePalette()
    paintSurface(surfacePalette)
    //
    const color = paletteColorArrayByIndex(indexB)
    changeMouseColor(color)
}

///////////////////////////////////////////////////////////////////////////////

function previousPalette() { 
    changePalette(-1)
}

function nextPalette() { 
    changePalette(+1)
}

function changePalette(delta) {
    const max = paletteNames.length - 1
    //
    let index = paletteNames.indexOf(paletteName) + delta
    if (index < 0)   { return }
    if (index > max) { return }
    //
    paletteName = paletteNames[index]
    buttonPreviousPalette.disabled = (index == 0)
    buttonNextPalette.disabled = (index == max)
    buttonLoadPalette.disabled = (paletteName == "bob")
    //
    updateSurfacePalette()
    paintPanelPalette() 
}

///////////////////////////////////////////////////////////////////////////////

function paletteIndexByMouse(x, y) {
    //
    const row = Math.floor(y / paletteSide)
    const col = Math.floor(x / paletteSide)
    return (row * 6) + col
}

function paletteColorArrayByIndex(index) {
    //
    const raw = palettes[paletteName][index]
    //
    if (raw == "blank") { return null }
    //    
    const strarr = raw.split(",")
    const r = parseInt(strarr[0])
    const g = parseInt(strarr[1])
    const b = parseInt(strarr[2])
    return [ r, g, b, 255 ]
}

///////////////////////////////////////////////////////////////////////////////

function updateSurfacePalette() {
    //
    const ctx = surfacePalette.canvas.getContext("2d")
    const width = surfacePalette.canvas.width
    const list = palettes[paletteName]
    const even = (paletteNames.indexOf(paletteName) % 2) == 0
    //
    paintThisPalette(ctx, width, list, paletteSide, 0, 0, even) // 0, 0 for left and top
}

