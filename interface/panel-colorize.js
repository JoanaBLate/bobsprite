// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelColorize   
var panelColorizeCtx

var checkboxConsider

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
    checkboxConsider = createCheckbox("consider", panelColorizeCtx, 207, 25, 12, colorizeLayer, false)
    //
    sliderColorizeHue = createSlider("colorize-hue", ctx, 10, 55, 220, 0, changeHue)
    sliderColorizeSat = createSlider("colorize-sat", ctx, 10, 100, 220, 0.5, colorizeLayer)
    sliderColorizeLum = createSlider("colorize-lum", ctx, 10, 145, 220, 0.5, colorizeLayer)
    sliderColorizeOpa = createSlider("colorize-opa", ctx, 10, 190, 220, 1, colorizeLayer)
    //
    buttonColorizeReset = createButton("colorize-reset", ctx,  13, 250, 97, 30, "reset", panelColorizeReset, true)
    buttonColorizeApply = createButton("colorize-apply",  ctx, 130, 250, 97, 30, "apply", panelColorizeApply, true)
    //
    panelColorizeGadgets = [ sliderColorizeHue, sliderColorizeSat, sliderColorizeLum, sliderColorizeOpa,
                             checkboxConsider, buttonColorizeReset, buttonColorizeApply ]
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
    write(ctx, "consider hue", 120, 25)
    paintCheckbox(checkboxConsider)
    //
    write(ctx, "hue", 10, 40)
    paintSlider(sliderColorizeHue)
    //    
    write(ctx, "saturation", 10, 85)
    paintSlider(sliderColorizeSat)
    //    
    write(ctx, "luminosity", 10, 130)
    paintSlider(sliderColorizeLum)
    //    
    write(ctx, "opacity", 10, 175)
    paintSlider(sliderColorizeOpa)
    //
    greyTraceH(ctx, 20, 230, 200)
    //
    paintButton(buttonColorizeReset)
    paintButton(buttonColorizeApply)
}

///////////////////////////////////////////////////////////////////////////////

function changeHue() {
    //
    if (! checkboxConsider.checked) { revertCheckbox(checkboxConsider) }
    //
    colorizeLayer()
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeApply() { 
    polyModel = null
    panelColorizeResetGadgets()
    if (getTopLayer() != null) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeReset() { 
    panelColorizeResetGadgets()
    resetLayerByPolyModel()
}
 
function panelColorizeResetGadgets() { 
    //
    resetCheckbox(checkboxConsider, false)
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
    if (sliderColorizeSat.value != 0.5) { return true }
    if (sliderColorizeLum.value != 0.5) { return true }
    if (sliderColorizeOpa.value != 1)   { return true }
    //
    if (checkboxConsider.checked) { return true }
    //
    return false
}

