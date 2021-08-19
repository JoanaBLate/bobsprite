// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelEffectE
var panelEffectECtx

var effectE1
var effectE2
var effectE3
var effectE4
var effectE5
var effectE6
var effectE7

var panelEffectEGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectE() {
    panelEffectE = createCanvas(240, 277)
    panelEffectECtx = panelEffectE.getContext("2d")
    //
    panelEffectE.style.position = "absolute"
    panelEffectE.style.top = "325px"
    panelEffectE.style.left = "1060px"
    panelEffectE.style.zIndex = "2"
    panelEffectE.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectE)
    //
    initPanelEffectE2()
}

function initPanelEffectE2() {
    const ctx = panelEffectECtx
    //
    effectE1 = createButton("effect-e1", ctx, 40,  20, 160, 25, "emboss", emboss, false)
    //
    effectE2 = createButton("effect-e2", ctx, 40,  55, 160, 25, "smooth", smooth, false)
    //
    effectE3 = createButton("effect-e3", ctx, 40,  90, 160, 25, "blur", blur, false)
    //
    effectE4 = createButton("effect-e4", ctx, 40, 125, 160, 25, "noise", addNoise, false)
    //
    effectE5 = createButton("effect-e5", ctx, 40, 160, 160, 25, "round alpha", roundAlpha, false)
    //
    effectE6 = createButton("effect-e6", ctx, 40, 195, 160, 25, "sepia tone", sepiaTone, false)
    //
    effectE7 = createButton("effect-e7", ctx, 40, 230, 160, 25, "weaken black pixels", weakenBlack, false)
    //
    panelEffectEGadgets = [ effectE1, effectE2, effectE3, effectE4, effectE5, effectE6, effectE7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectE() {
    panelEffectE.style.visibility = "hidden"
}

function paintAndShowPanelEffectE() {   
    paintPanelEffectE()
    panelEffectE.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectE() {
    panelEffectE.onmouseup = panelOnMouseUp
    panelEffectE.onmousedown = panelOnMouseDown
    panelEffectE.onmouseleave = panelOnMouseLeave
    panelEffectE.onmouseenter = function () { panelOnMouseEnter(panelEffectEGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectE() { 
    // background
    panelEffectECtx.fillStyle = wingColor()
    panelEffectECtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectE1)
    paintButton(effectE2)
    paintButton(effectE3)
    paintButton(effectE4)
    paintButton(effectE5)
    paintButton(effectE6)
    paintButton(effectE7)
}

