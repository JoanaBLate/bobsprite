// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

function paintCanvasHelp3() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp3Left()
    paintCanvasHelp3Center()
    paintCanvasHelp3Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Left() {
    let y = 30
    let x = 20
    y = 20 + helpAnimation(x, y)
    y = 20 + helpFavorites(x, y)
    y = 20 + helpMemorizeFavorite(x, y)
    y = 20 + helpPrevious(x, y)
    y = 20 + helpNext(x, y)
}

function helpAnimation(x, y) {
    y += drawIconOnCanvasHelp("animation", x + 170, y)
    y += writeOnCanvasHelp("Show panel Animation", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over it to change the zoom level", x, y)
    y += writeOnCanvasHelp("  > hotkey: A", x, y)
    return y
}

function helpFavorites(x, y) {
    y += drawIconOnCanvasHelp("favorites", x + 170, y)
    y += writeOnCanvasHelp("Show panel Favorites", x, y)
    y += writeOnCanvasHelp("  > hotkey: F", x, y)
    return y
}

function helpMemorizeFavorite(x, y) {
    y += drawIconOnCanvasHelp("register", x + 170, y)
    y += writeOnCanvasHelp("Memorize the current image as favorite", x, y)
    y += writeOnCanvasHelp("  > any loaded or saved image is automatically memorized", x, y)
    y += writeOnCanvasHelp("  > hotkey: Enter", x, y)
    return y
}

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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Center() {
    let y = 30
    let x = 455
    y = 20 + helpDecreaseZoom(x, y)
    y = 20 + helpIncreaseZoom(x, y)
    y = 20 + helpTileSet(x, y)
    y = 20 + helpSwapHalves(x, y)
}

function helpDecreaseZoom(x, y) {
    y += drawIconOnCanvasHelp("minus", x + 170, y)
    y += writeOnCanvasHelp("Zoom out", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over the canvas", x, y)
    y += writeOnCanvasHelp("  > avoid painting with zoom 0.5x", x, y)
    y += writeOnCanvasHelp("  > hotkey: Minus (-)", x, y)
    return y
}

function helpIncreaseZoom(x, y) {
    y += drawIconOnCanvasHelp("plus", x + 170, y)
    y += writeOnCanvasHelp("Zoom in", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over the canvas", x, y)
    y += writeOnCanvasHelp("  > hotkey: Plus (+)", x, y)
    return y
}

function helpTileSet(x, y) {
    y += drawIconOnCanvasHelp("tile-set", x + 170, y)
    y += writeOnCanvasHelp("Create tile set", x, y)
    y += writeOnCanvasHelp("  > shows a big tile set of the current image", x, y)
    y += writeOnCanvasHelp("  > you can save it by Right Clicking it", x, y)
    y += writeOnCanvasHelp("  > pressing any key closes it", x, y)
    return y
}

function helpSwapHalves(x, y) {
    drawIconOnCanvasHelp("halves-h", x + 140, y)
    y += drawIconOnCanvasHelp("halves-v", x + 200, y)
    y += writeOnCanvasHelp("Swap halves", x, y)
    y += writeOnCanvasHelp("  > swaps halves of the top layer (adjusted)", x, y)
    y += writeOnCanvasHelp("  > an odd dimension will be rounded up before swapping,", x, y)
    y += writeOnCanvasHelp("     by inserting one thin blank row or col", x, y)
    y += writeOnCanvasHelp("  > useful for creating a tile set of one sprite only", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Right() {
    let y = 30
    let x = 895
    y = 20 + helpLoadImage(x, y)
    y = 20 + helpSaveImage(x, y)
    y = 20 + helpAlternativeSave(x, y)
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

function helpAlternativeSave(x, y) {
    y += drawIconOnCanvasHelp("save2", x + 170, y)
    y += writeOnCanvasHelp("Save image (alternative method)", x, y)
    y += writeOnCanvasHelp("  > the saved image ignores the *displaying* opacities", x, y)
    y += writeOnCanvasHelp("  > you can save it by Right Clicking it", x, y)
    y += writeOnCanvasHelp("  > pressing any key closes it", x, y)
    return y
}

