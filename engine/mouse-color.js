// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var mouseRed   =  -1 // -1 means mouse not on any color pixel
var mouseGreen =  -1
var mouseBlue  =  -1
var mouseAlpha =  -1

var oldMouseRed   = 0
var oldMouseGreen = 0
var oldMouseBlue  = 0
var oldMouseAlpha = 0

var mustDisplayMouseColor = false

///////////////////////////////////////////////////////////////////////////////

function changeMouseColor(color, forced) {
    if (color == null) { eraseMouseColor(); return }
    //
    mouseRed   = color[0]
    mouseGreen = color[1]
    mouseBlue  = color[2]
    mouseAlpha = color[3]
    //
    if (forced) { mustDisplayMouseColor = true } // or else "(match)" does not appear
}

function eraseMouseColor() {
    mouseRed   = -1
    mouseGreen = -1
    mouseBlue  = -1
    mouseAlpha = -1
}

///////////////////////////////////////////////////////////////////////////////

function displayMouseColor() { // called by main loop 
    //
    if (mustDisplayMouseColor) {
        mustDisplayMouseColor = false
        displayMouseColorCore()
        return
    }
    //
    if (mouseColorChanged()) { displayMouseColorCore() }
}

function displayMouseColorCore() {
    //
    oldMouseRed   = mouseRed
    oldMouseGreen = mouseGreen
    oldMouseBlue  = mouseBlue
    oldMouseAlpha = mouseAlpha
    //
    paintMouseColorOnBottomBar() 
}

function mouseColorChanged() {
    //
    if (mouseRed   != oldMouseRed)   { return true }
    if (mouseGreen != oldMouseGreen) { return true }
    if (mouseBlue  != oldMouseBlue)  { return true }
    if (mouseAlpha != oldMouseAlpha) { return true }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function updateMouseColorByStage() {
    //
    if (stageX == null) { return }
    //
    let color = null
    //
    for (const layer of layers) {
        //
        color = mouseColorOnVisibleLayer(layer)
        if (color != null) { break }        
    }
    //
    changeMouseColor(color) 
}

