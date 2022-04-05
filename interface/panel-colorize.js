// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelColorize   
var panelColorizeCtx

var sliderColorizeHue
var sliderColorizeSat
var sliderColorizeLum
var sliderColorizeOpa

var buttonColorizeReset
var buttonColorizeApply

var panelColorizeGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelColorize() {
    panelColorize = createCanvas(240, 305)
    panelColorizeCtx = panelColorize.getContext("2d")
    //
    panelColorize.style.position = "absolute"
    panelColorize.style.top = "325px"
    panelColorize.style.left = "1060px"
    panelColorize.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelColorize)
    //
    initPanelColorize2()
}

function initPanelColorize2() {
    const ctx = panelColorizeCtx
    //
    sliderColorizeHue = createSlider("colorize-hue", ctx, 10, 50, 220, 0, colorizeLayer)
    sliderColorizeSat = createSlider("colorize-sat", ctx, 10, 100, 220, 0.5, colorizeLayer)
    sliderColorizeLum = createSlider("colorize-lum", ctx, 10, 150, 220, 0.5, colorizeLayer)
    sliderColorizeOpa = createSlider("colorize-opa", ctx, 10, 200, 220, 1, colorizeLayer)
    //
    buttonColorizeReset = createButton("colorize-reset", ctx,  13, 255, 97, 30, "reset", panelColorizeReset, true)
    buttonColorizeApply = createButton("colorize-apply",  ctx, 130, 255, 97, 30, "apply", panelColorizeApply, true)
    //
    panelColorizeGadgets = [ sliderColorizeHue, sliderColorizeSat, sliderColorizeLum, sliderColorizeOpa,
                             buttonColorizeReset, buttonColorizeApply ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelColorize() {
    panelColorize.onmouseup = panelOnMouseUp
    panelColorize.onmousedown = panelOnMouseDown
    panelColorize.onmousemove = panelOnMouseMove    
    panelColorize.onmouseleave = panelOnMouseLeave
    panelColorize.onmouseenter = function () { panelOnMouseEnter(panelColorizeGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelColorize() { 
    // background
    panelColorizeCtx.fillStyle = wingColor()
    panelColorizeCtx.fillRect(0, 0, 240, 305)
    //   
    const ctx = panelColorizeCtx
    //
    write(ctx, "intensity of new hue", 10, 35)
    paintSlider(sliderColorizeHue)
    //    
    write(ctx, "saturation", 10, 85)
    paintSlider(sliderColorizeSat)
    //    
    write(ctx, "luminosity", 10, 135)
    paintSlider(sliderColorizeLum)
    //    
    write(ctx, "opacity", 10, 185)
    paintSlider(sliderColorizeOpa)
    //
    greyTraceH(ctx, 20, 235, 200)
    //
    paintButton(buttonColorizeReset)
    paintButton(buttonColorizeApply)
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeApply() { 
    //
    panelColorizeResetGadgets()
    if (toplayer != null) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeReset() { 
    //
    panelColorizeResetGadgets()
    resetTopLayerByMemory()
}
 
function panelColorizeResetGadgets() { 
    //
    resetSlider(sliderColorizeHue, 0)
    resetSlider(sliderColorizeSat, 0.5)
    resetSlider(sliderColorizeLum, 0.5)
    resetSlider(sliderColorizeOpa, 1)
    //
    updateColorizeButtons()
}

///////////////////////////////////////////////////////////////////////////////

function updateColorizeButtons() {
    const changing = colorizePanelChanging()
    //
    for (const button of [ buttonColorizeReset, buttonColorizeApply ]) {
        if (button.disabled == ! changing) { continue }
        button.disabled = ! changing
        paintButton(button)
    }
}

function colorizePanelChanging() {
    //
    if (sliderColorizeHue.value != 0)   { return true }
    if (sliderColorizeSat.value != 0.5) { return true }
    if (sliderColorizeLum.value != 0.5) { return true }
    if (sliderColorizeOpa.value != 1)   { return true }
    //
    return false
}

