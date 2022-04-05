// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelShear   
var panelShearCtx

var sliderRotate
var sliderShearV
var sliderShearH

var buttonShearReset
var buttonShearApply

var panelShearGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelShear() {
    panelShear = createCanvas(240, 305)
    panelShearCtx = panelShear.getContext("2d")
    //
    panelShear.style.position = "absolute"
    panelShear.style.top = "325px"
    panelShear.style.left = "1060px"
    panelShear.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelShear)
    //
    initPanelShear2()
}

function initPanelShear2() {
    const ctx = panelShearCtx
    //
    sliderRotate = createSlider(sliderRotate, ctx, 10, 40, 220, 0.5, rotateLayer)
    //
    sliderShearV = createSlider(sliderShearV, ctx, 10, 122, 220, 0.5, shearLayer)
    //
    sliderShearH = createSlider(sliderShearH, ctx, 10, 182, 220, 0.5, shearLayer)
    //
    buttonShearReset = createButton("shear-reset", ctx,  13, 250, 97, 30, "reset", panelShearReset, true)
    //
    buttonShearApply = createButton("shear-apply",  ctx, 130, 250, 97, 30, "apply", panelShearApply, true)
    //
    panelShearGadgets = [ sliderRotate, sliderShearV, sliderShearH, buttonShearReset, buttonShearApply ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelShear() {
    panelShear.onmouseup = panelOnMouseUp
    panelShear.onmousedown = panelOnMouseDown
    panelShear.onmousemove = panelOnMouseMove
    panelShear.onmouseleave = panelOnMouseLeave
    panelShear.onmouseenter = function () { panelOnMouseEnter(panelShearGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelShear() {
    // background 
    panelShearCtx.fillStyle = wingColor()
    panelShearCtx.fillRect(0, 0, 240, 305)
    //
    const ctx = panelShearCtx
    //
    write(ctx, "rotation", 10, 28)  
    paintSlider(sliderRotate)
    //
    greyTraceH(ctx, 20, 85, 200)
    //    
    write(ctx, "vertical shear", 10, 110)
    paintSlider(sliderShearV)
    //    
    write(ctx, "horizontal shear", 10, 170)
    paintSlider(sliderShearH)
    //
    greyTraceH(ctx, 20, 230, 200)
    //
    paintButton(buttonShearReset)
    paintButton(buttonShearApply)
}


///////////////////////////////////////////////////////////////////////////////

function panelShearApply() { 
    //
    panelShearResetGadgets()
    if (toplayer != null) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function panelShearReset() { 
    //
    panelShearResetGadgets()
    resetTopLayerByMemory()
}
 
function panelShearResetGadgets() { 
    //
    resetSliderShearH()
    resetSliderShearV()
    resetSliderRotate()
    //
    updateShearButtons()
}

///////////////////////////////////////////////////////////////////////////////

function resetSliderShearV() { 
    resetSlider(sliderShearV, 0.5)
}

function resetSliderShearH() { 
    resetSlider(sliderShearH, 0.5)
}

function resetSliderRotate() { 
    resetSlider(sliderRotate, 0.5)
}

///////////////////////////////////////////////////////////////////////////////

function updateShearButtons() {
    const changing = shearPanelChanging()
    //
    for (const button of [ buttonShearReset, buttonShearApply ]) {
        if (button.disabled == ! changing) { continue }
        button.disabled = ! changing
        paintButton(button)
    }
}

function shearPanelChanging() {
    if (sliderShearV.value != 0.5) { return true }
    if (sliderShearH.value != 0.5) { return true }
    if (sliderRotate.value != 0.5) { return true }
    return false
}

