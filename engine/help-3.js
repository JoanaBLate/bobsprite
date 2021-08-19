// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


function paintCanvasHelp3() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp3Left()
    paintCanvasHelp3Center()
    paintCanvasHelp3Right()
}

///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Left() {
    let y = 30
    let x = 20
    y = 20 + helpAdjust(x, y)
    y = 20 + helpRotate(x, y)
    y = 20 + helpRotateRev(x, y)
    y = 20 + helpDouble(x, y)
    y = 20 + helpHalve(x, y)
}

function paintCanvasHelp3Center() {
    let y = 30
    let x = 455
    y = 20 + helpSwapHalves(x, y)
    y = 20 + helpTileSet(x, y)
    y = 20 + helpUndo(x, y)
    y = 20 + helpRedo(x, y)
    y = 20 + helpMemorizeFavorite(x, y)
}

function paintCanvasHelp3Right() {
    let y = 30
    let x = 895
    y = 20 + helpPrevious(x, y)
    y = 20 + helpNext(x, y)
    y = 20 + helpFavorites(x, y)
    y = 20 + helpLoadImage(x, y)
    y = 20 + helpSaveImage(x, y)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpAdjust(x, y) {
    y += drawIconOnCanvasHelp("scissor", x + 170, y)
    y += writeOnCanvasHelp("Adjust layer", x, y)
    y += writeOnCanvasHelp("  > adjusts position and size of the top layer to match", x, y)
    y += writeOnCanvasHelp("     the canvas", x, y)
    y += writeOnCanvasHelp("  > may crop content of the top layer", x, y)
    return y
}

function helpRotate(x, y) {
    y += drawIconOnCanvasHelp("rotate", x + 170, y)
    y += writeOnCanvasHelp("Rotate the canvas clockwise", x, y)
    y += writeOnCanvasHelp("  > also rotates all layers (visible or not)", x, y)
    return y
}

function helpRotateRev(x, y) {
    y += drawIconOnCanvasHelp("rotate-rev", x + 170, y)
    y += writeOnCanvasHelp("Rotate the canvas counterclockwise", x, y)
    y += writeOnCanvasHelp("  > also rotates all layers (visible or not)", x, y)
    return y
}

function helpDouble(x, y) {
    y += drawIconOnCanvasHelp("plus", x + 170, y)
    y += writeOnCanvasHelp("Double the canvas size", x, y)
    y += writeOnCanvasHelp("  > also doubles the size of all layers (visible or not)", x, y)
    y += writeOnCanvasHelp("  > the content of each layer is scaled in pixelated mode", x, y)
    y += writeOnCanvasHelp("  > you should NOT use this for zooming in", x, y)
    return y
}

function helpHalve(x, y) {
    y += drawIconOnCanvasHelp("minus", x + 170, y)
    y += writeOnCanvasHelp("Halve the canvas size", x, y)
    y += writeOnCanvasHelp("  > also halves the size of all layers (visible or not)", x, y)
    y += writeOnCanvasHelp("  > the content of each layer is scaled in smooth mode", x, y)
    y += writeOnCanvasHelp("  > any odd dimension will be rounded up before halving,", x, y)
    y += writeOnCanvasHelp("     by inserting one thin blank row or col", x, y)
    y += writeOnCanvasHelp("  > you should NOT use this for zooming out", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpSwapHalves(x, y) {
    y += drawIconOnCanvasHelp("halves", x + 170, y)
    y += writeOnCanvasHelp("Swap halves", x, y)
    y += writeOnCanvasHelp("  > swaps left and right halves of the top layer", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, swaps top and bottom halves instead", x, y)
    y += writeOnCanvasHelp("  > an odd dimension will be rounded up before swapping,", x, y)
    y += writeOnCanvasHelp("     by inserting one thin blank row or col", x, y)
    y += writeOnCanvasHelp("  > useful for creating a tile set of one sprite only", x, y)
    return y
}

function helpTileSet(x, y) {
    y += drawIconOnCanvasHelp("tile-set", x + 170, y)
    y += writeOnCanvasHelp("Create tile set", x, y)
    y += writeOnCanvasHelp("  > shows a big tile set of the current image", x, y)
    y += writeOnCanvasHelp("  > you can save it by Right Clicking it", x, y)
    y += writeOnCanvasHelp("  > pressing any key hides it", x, y)
    return y
}

function helpUndo(x, y) {
    y += drawIconOnCanvasHelp("undo", x + 170, y)
    y += writeOnCanvasHelp("Undo layer edition (not canvas edition)", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Z, Backspace", x, y)
    return y
}

function helpRedo(x, y) {
    y += drawIconOnCanvasHelp("redo", x + 170, y)
    y += writeOnCanvasHelp("Redo layer edition (not canvas edition)", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Y, Shift Backspace", x, y)
    return y
}

function helpMemorizeFavorite(x, y) {
    y += drawIconOnCanvasHelp("register", x + 170, y)
    y += writeOnCanvasHelp("Memorize the current image as favorite", x, y)
    y += writeOnCanvasHelp("  > any loaded or saved image is automatically memorized", x, y)
    y += writeOnCanvasHelp("  > hotkey: Enter", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpPrevious(x, y) {
    y += drawIconOnCanvasHelp("previous", x + 170, y)
    y += writeOnCanvasHelp("Show previous favorite", x, y)
    y += writeOnCanvasHelp("  > hotkey: PageUp", x, y)
    return y
}

function helpNext(x, y) {
    y += drawIconOnCanvasHelp("next", x + 170, y)
    y += writeOnCanvasHelp("Show next favorite", x, y)
    y += writeOnCanvasHelp("  > hotkey: PageDown", x, y)
    return y
}

function helpFavorites(x, y) {
    y += drawIconOnCanvasHelp("favorites", x + 170, y)
    y += writeOnCanvasHelp("Show panel Favorites/Animation", x, y)
    y += writeOnCanvasHelp("  > delete a favorite by dragging it to the trashcan", x, y)
    y += writeOnCanvasHelp("  > drag any favorite to change its position", x, y)
    y += writeOnCanvasHelp("  > clicking a favorite sets it to be an animation frame", x, y)
    y += writeOnCanvasHelp("     or not", x, y)
    y += writeOnCanvasHelp("  > CANVAS is a special, DYNAMIC, frame used for animation", x, y)
    y += writeOnCanvasHelp("  > hotkey: F", x, y)
    return y
}


function helpLoadImage(x, y) {
    y += drawIconOnCanvasHelp("load", x + 170, y)
    y += writeOnCanvasHelp("Load image", x, y)
    y += writeOnCanvasHelp("  > hotkey: Ctrl L", x, y)
    return y
}

function helpSaveImage(x, y) {
    y += drawIconOnCanvasHelp("save", x + 170, y)
    y += writeOnCanvasHelp("Save image", x, y)
    y += writeOnCanvasHelp("  > the saved image ignores the *displaying* opacities", x, y)
    y += writeOnCanvasHelp("  > hotkey: Ctrl S", x, y)
    return y
}

