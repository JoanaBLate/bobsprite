// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


function paintCanvasHelp4() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp4Left()
    paintCanvasHelp4Center()
    paintCanvasHelp4Right()
}

///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp4Left() {
    let y = 30
    let x = 20
    y = 20 + helpPalette(x, y)
    y = 20 + helpPanelColor(x, y)
    y = 20 + helpPanelSize(x, y)
    y = 20 + helpPanelEffect(x, y)
}

function paintCanvasHelp4Center() {
    let y = 30
    let x = 455
    y = 20 + helpPanelColorize(x, y)
    y = 20 + helpPanelShear(x, y)
    y = 20 + helpPanelConfig(x, y)
    y = 20 + helpMonitorBox(x, y)
}

function paintCanvasHelp4Right() {
    let y = 30
    let x = 895
    y = 20 + helpPanelLayers(x, y)
    y = 20 + helpPanelOpacity(x, y)
    y = 20 + helpVersion(x, y)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpPalette(x, y) {
    y += drawIconOnCanvasHelp("palette", x + 170, y)
    y += writeOnCanvasHelp("Panel Palette", x, y)
    y += writeOnCanvasHelp("  > palette 'bob' is not editable", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel to change the selected palette", x, y)
    y += writeOnCanvasHelp("  > Left Click selects a color", x, y)
    y += writeOnCanvasHelp("  > Shift Left Click replaces a color with the current color", x, y)
    y += writeOnCanvasHelp("  > Ctrl Left Click erases a color", x, y)
    y += writeOnCanvasHelp("  > Mouse Drag changes position of a color", x, y)
    y += writeOnCanvasHelp("  > when loading a palette, translucent colors are ignored", x, y)
    y += writeOnCanvasHelp("     or, if almost opaque, converted to opaque", x, y)
    return y
}

function helpPanelColor(x, y) {
    y += drawIconOnCanvasHelp("color", x + 170, y)
    y += writeOnCanvasHelp("Color: Panel HSL and Panel RGBA", x, y)
    y += writeOnCanvasHelp("  > 2 color samples: reference (left) and current (right)", x, y)
    y += writeOnCanvasHelp("  > current color is the color under edition", x, y)
    y += writeOnCanvasHelp("  > click on any color sample to swap both", x, y)
    y += writeOnCanvasHelp("  > only in Panel RGBA you can edit the opacity", x, y)
    return y
}

function helpPanelSize(x, y) {
    y += drawIconOnCanvasHelp("size", x + 170, y)
    y += writeOnCanvasHelp("Panel Size", x, y)
    y += writeOnCanvasHelp("  > notice the checkbox for pixelated scaling", x, y)
    return y
}

function helpPanelEffect(x, y) {
    y += drawIconOnCanvasHelp("effect", x + 170, y)
    y += writeOnCanvasHelp("Panel Effect", x, y)
    y += writeOnCanvasHelp("  > notice the 5 checkboxes for selecting subpanels", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpPanelColorize(x, y) {
    y += drawIconOnCanvasHelp("colorize", x + 170, y)
    y += writeOnCanvasHelp("Panel Colorize", x, y)
    y += writeOnCanvasHelp("  > the layer opacity is edited (not only its displaying)", x, y)
    return y
}

function helpPanelShear(x, y) {
    y += drawIconOnCanvasHelp("shear", x + 170, y)
    y += writeOnCanvasHelp("Panel Shear", x, y)
    y += writeOnCanvasHelp("  > works in pixelated mode", x, y)
    return y
}

function helpPanelConfig(x, y) {
    y += drawIconOnCanvasHelp("config", x + 170, y)
    y += writeOnCanvasHelp("Panel Config", x, y)
    y += writeOnCanvasHelp("  > controls the speed of the animation", x, y)
    y += writeOnCanvasHelp("  > the background color is NOT part of the image", x, y)
    y += writeOnCanvasHelp("  > hotkey: D", x, y)
    return y
}

function helpMonitorBox(x, y) {
    y += drawIconOnCanvasHelp("zoom-in", x + 170, y)
    y += writeOnCanvasHelp("Panel Monitor", x, y)
    y += writeOnCanvasHelp("  > it runs the *animation* (checkbox 'animat')", x, y)
    y += writeOnCanvasHelp("  > mark checkbox 'pixel' for pixelated zooming in", x, y)
    y += writeOnCanvasHelp("  > a frozen image works as a reference for drawing", x, y)
    y += writeOnCanvasHelp("  > if frozen, it cannot change zoom or pixelated option", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over it to change the zoom level", x, y)
    y += writeOnCanvasHelp("  > if image is too big, it matches the position of the canvas", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function helpPanelLayers(x, y) {
    y += 30
    y += writeOnCanvasHelp("Panel Layers", x, y)
    y += writeOnCanvasHelp("  > there are 5 standard layers: A, B, C, D and E", x, y)
    y += writeOnCanvasHelp("  > the special layer Selection shows the result of using", x, y)
    y += writeOnCanvasHelp("     selection tools", x, y)
    y += writeOnCanvasHelp("  > some actions automatically adjusts a layer to match", x, y)
    y += writeOnCanvasHelp("     size and position of the canvas", x, y)
    y += writeOnCanvasHelp("  > *dragging* a layer over other one, exchanges the", x, y)
    y += writeOnCanvasHelp("     contents of the layers; their names do not change", x, y)
    y += writeOnCanvasHelp("  > using Merge Down Protecting: blank and black pixels", x, y)
    y += writeOnCanvasHelp("     of the bottom layer remain untouched; if the whole", x, y)
    y += writeOnCanvasHelp("     bottom layer is blank, nothing happens", x, y)
    y += writeOnCanvasHelp("  > hotkeys: 0, 1, 2, 3, 4, 5", x, y)
    return y
}

function helpPanelOpacity(x, y) {
    y += 25
    y += writeOnCanvasHelp("Panel Opacity", x, y)
    y += writeOnCanvasHelp("  > only shows sliders for enabled layers", x, y)
    y += writeOnCanvasHelp("  > sets the displaying (on the screen) opacity only", x, y)
    y += writeOnCanvasHelp("  > does not affect the true opacity of the layer", x, y)
    y += writeOnCanvasHelp("     (try Panel Colorize for the true opacity)", x, y)
    return y
}

function helpVersion(x, y) {
    y += 30
    y += writeOnCanvasHelp("Version", x, y)
    y += writeOnCanvasHelp("  > August 2021", x, y)
    return y
}

