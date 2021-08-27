// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp1Left()
    paintCanvasHelp1Center()
    paintCanvasHelp1Right()
}

///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1Left() {
    let y = 30
    let x = 20
    y = 20 + helpBobSprite(x, y)
    y = 20 + helpHelp(x, y)
    y = 20 + helpProtection(x, y)
    y = 20 + helpMoveCanvas(x, y)
    y = 20 + helpCenterCanvas(x, y)
}

function paintCanvasHelp1Center() {
    let y = 30
    let x = 455
    y = 20 + helpPen(x, y)
    y = 20 + helpBrush(x, y)
    y = 20 + helpFeather(x, y)
    y = 20 + helpSpray(x, y)
    y = 20 + helpRubber(x, y)
}

function paintCanvasHelp1Right() {
    let y = 30
    let x = 895
    y = 20 + helpMoveLayer(x, y)
    y = 20 + helpCenterLayer(x, y)
    y = 20 + helpThinPen(x, y)
    y = 20 + helpMirrorPen(x, y)
    y = 20 + helpRoll(x, y)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpBobSprite(x, y) {
    y += 30
    y += writeOnCanvasHelp("BOBSPRITE", x, y)
    y += writeOnCanvasHelp("  > BobSprite is a free online drawing tool especially", x, y)
    y += writeOnCanvasHelp("     designed for *Pixel Art*", x, y)
    y += writeOnCanvasHelp("  > you can learn more at the home page:", x, y)
    y += writeOnCanvasHelp("     www.bobsprite.com", x, y)
    return y
}

function helpHelp(x, y) {
    y += drawIconOnCanvasHelp("help", x + 170, y)
    y += writeOnCanvasHelp("Help", x, y)
    y += writeOnCanvasHelp("  > shows this help", x, y)
    return y
}

function helpProtection(x, y) {
    y += drawIconOnCanvasHelp("protection", x + 170, y)
    y += writeOnCanvasHelp("Protection  (no icon)", x, y)
    y += writeOnCanvasHelp("  > there are two kind of protected pixels:", x, y)
    y += writeOnCanvasHelp("      blank (rgba 0 0 0 0)", x, y)
    y += writeOnCanvasHelp("      black (rgba 0 0 0 255)", x, y)
    y += writeOnCanvasHelp("  > some tools and effects cannot change them", x, y)
    y += writeOnCanvasHelp("  > effect Weaken Black Pixels turns (rgba 0 0 0 255)", x, y)
    y += writeOnCanvasHelp("     pixels into (rgba 1 1 1 255) pixels", x, y)
    return y
}

function helpMoveCanvas(x, y) {
    y += 20
    y += writeOnCanvasHelp("Move the canvas", x, y)
    y += writeOnCanvasHelp("  > hotkeys: ArrowUp, ArrowDown, ArrowLeft, ArrowRight", x, y)
    return y
}

function helpCenterCanvas(x, y) {
    y += 20
    y += writeOnCanvasHelp("Center the canvas", x, y)
    y += writeOnCanvasHelp("  > hotkey: C", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpPen(x, y) {
    y += drawIconOnCanvasHelp("pen", x + 170, y)
    y += writeOnCanvasHelp("Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

function helpBrush(x, y) {
    y += drawIconOnCanvasHelp("brush", x + 170, y)
    y += writeOnCanvasHelp("Brush Tool", x, y)
    y += writeOnCanvasHelp("  > NO EFFECT on blank or black", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}
 
function helpFeather(x, y) {
    y += drawIconOnCanvasHelp("feather", x + 170, y)
    y += writeOnCanvasHelp("Feather Tool", x, y)
    y += writeOnCanvasHelp("  > NO EFFECT on blank or black", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpSpray(x, y) {
    y += drawIconOnCanvasHelp("spray", x + 170, y)
    y += writeOnCanvasHelp("Spray Tool", x, y)
    y += writeOnCanvasHelp("  > NO EFFECT on blank or black", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

function helpRubber(x, y) {
    y += drawIconOnCanvasHelp("rubber", x + 170, y)
    y += writeOnCanvasHelp("Rubber Tool", x, y)
    y += writeOnCanvasHelp("  > just erases", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////   
///////////////////////////////////////////////////////////////////////////////

function helpMoveLayer(x, y) {
    y += drawIconOnCanvasHelp("hand", x + 170, y)
    y += writeOnCanvasHelp("Hand Tool", x, y)
    y += writeOnCanvasHelp("  > moves the top layer", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, moves all selected layers", x, y)
    return y
}

function helpCenterLayer(x, y) {
    y += drawIconOnCanvasHelp("center", x + 170, y)
    y += writeOnCanvasHelp("Center layer", x, y)
    y += writeOnCanvasHelp("  > centers the top layer", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, centers all selected layers", x, y)
    return y
}

function helpThinPen(x, y) {
    y += drawIconOnCanvasHelp("thin-pen", x + 170, y)
    y += writeOnCanvasHelp("Thin Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > makes clean traces", x, y)
    y += writeOnCanvasHelp("  > undo/redo memory works pixel by pixel", x, y)
    return y
}

function helpMirrorPen(x, y) {
    y += drawIconOnCanvasHelp("mirror-pen", x + 170, y)
    y += writeOnCanvasHelp("Mirror Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > makes clean traces", x, y)
    y += writeOnCanvasHelp("  > undo/redo memory works pixel by pixel", x, y)
    return y
}

function helpRoll(x, y) {
    y += drawIconOnCanvasHelp("roll", x + 170, y)
    y += writeOnCanvasHelp("Roll", x, y)
    y += writeOnCanvasHelp("  > paints the whole top layer", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

