// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

function paintCanvasHelp2() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp2Left()
    paintCanvasHelp2Center()
    paintCanvasHelp2Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Left() {
    let y = 30
    let x = 20
    y = 20 + helpBucket(x, y)
    y = 20 + helpColorReplacer(x, y)
    y = 20 + helpPaintBorder(x, y)
    y = 20 + helpBlurPixel(x, y)
    y = 20 + helpBlurBorder(x, y)
}

function helpBucket(x, y) {
    y += drawIconOnCanvasHelp("bucket", x + 170, y)
    y += writeOnCanvasHelp("Bucket Tool", x, y)
    y += writeOnCanvasHelp("  > paints the clicked area", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpColorReplacer(x, y) {
    y += drawIconOnCanvasHelp("every", x + 170, y)
    y += writeOnCanvasHelp("Color Replacer Tool", x, y)
    y += writeOnCanvasHelp("  > paints all pixels that match the clicked pixel", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpPaintBorder(x, y) {
    y += drawIconOnCanvasHelp("border", x + 170, y)
    y += writeOnCanvasHelp("Paint Border Tool", x, y)
    y += writeOnCanvasHelp("  > paints the inner border of the clicked area", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpBlurPixel(x, y) {
    y += drawIconOnCanvasHelp("blur-pixel", x + 170, y)
    y += writeOnCanvasHelp("Blur Pixel Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpBlurBorder(x, y) {
    y += drawIconOnCanvasHelp("blur-border", x + 170, y)
    y += writeOnCanvasHelp("Blur Border Tool", x, y)
    y += writeOnCanvasHelp("  > blurs the inner border of the clicked area", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Center() {
    let y = 30
    let x = 455
    y = 20 + helpUndo(x, y)
    y = 20 + helpRedo(x, y)
    y = 20 + helpColorCapture(x, y)
    y = 20 + helpDarkenTool(x, y)
    y = 20 + helpLightenTool(x, y)
}

function helpColorCapture(x, y) {
    y += drawIconOnCanvasHelp("capture", x + 170, y)
    y += writeOnCanvasHelp("Color Capture Tool", x, y)
    y += writeOnCanvasHelp("  > only for use on the layer", x, y)
    y += writeOnCanvasHelp("  > hotkey: Tab", x, y)
    return y
}

function helpUndo(x, y) {
    y += drawIconOnCanvasHelp("undo", x + 170, y)
    y += writeOnCanvasHelp("Undo layer edition", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Z, Backspace", x, y)
    return y
}

function helpRedo(x, y) {
    y += drawIconOnCanvasHelp("redo", x + 170, y)
    y += writeOnCanvasHelp("Redo layer edition", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Y, Shift Backspace", x, y)
    return y
}

function helpDarkenTool(x, y) {
    y += drawIconOnCanvasHelp("darken", x + 170, y)
    y += writeOnCanvasHelp("Darken Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpLightenTool(x, y) {
    y += drawIconOnCanvasHelp("lighten", x + 170, y)
    y += writeOnCanvasHelp("Lighten Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Right() {
    let y = 30
    let x = 895
    y = 20 + helpRectangle(x, y)
    y = 20 + helpEllipse(x, y)
    y = 20 + helpRectangleSelect(x, y)
    y = 20 + helpLasso(x, y)
    y = 20 + helpScaleTool(x, y)
}

function helpRectangleSelect(x, y) {
    y += drawIconOnCanvasHelp("select", x + 170, y)
    y += writeOnCanvasHelp("Rectangle Select Tool", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, erases part of the top layer", x, y)
    y += writeOnCanvasHelp("  > selected part appears in the layer Selection", x, y)
    return y
}

function helpLasso(x, y) {
    y += drawIconOnCanvasHelp("lasso", x + 170, y)
    y += writeOnCanvasHelp("Lasso Tool", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, erases part of the top layer", x, y)
    y += writeOnCanvasHelp("  > selected part appears in the layer Selection", x, y)
    return y
}

function helpRectangle(x, y) {
    y += drawIconOnCanvasHelp("rectangle", x + 170, y)
    y += writeOnCanvasHelp("Rectangle Tool", x, y)
    y += writeOnCanvasHelp("  > strokes a rectangle", x, y)
    y += writeOnCanvasHelp("  > fills the rectangle if Shift is pressed", x, y)
    return y
}

function helpEllipse(x, y) {
    y += drawIconOnCanvasHelp("ellipse", x + 170, y)
    y += writeOnCanvasHelp("Ellipse Tool", x, y)
    y += writeOnCanvasHelp("  > strokes a ellipse", x, y)
    y += writeOnCanvasHelp("  > fills the ellipse if Shift is pressed", x, y)
    return y
}

function helpScaleTool(x, y) {
    y += drawIconOnCanvasHelp("scale", x + 170, y)
    y += writeOnCanvasHelp("Scale Tool", x, y)
    y += writeOnCanvasHelp("  > avoid releasing the mouse button more than once", x, y)
    return y
}



