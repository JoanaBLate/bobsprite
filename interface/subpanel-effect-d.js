// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelEffectD
var panelEffectDCtx

var effectD1
var effectD2
var effectD3
var effectD4
var effectD5
var effectD6
var effectD7

var panelEffectDGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectD() {
    panelEffectD = createCanvas(240, 277)
    panelEffectDCtx = panelEffectD.getContext("2d")
    //
    panelEffectD.style.position = "absolute"
    panelEffectD.style.top = "325px"
    panelEffectD.style.left = "1060px"
    panelEffectD.style.zIndex = "2"
    panelEffectD.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectD)
    //
    initPanelEffectD2()
}

function initPanelEffectD2() {
    const ctx = panelEffectDCtx
    //
    effectD1 = createButton("effect-d1", ctx, 40,  20, 160, 25, "pixelate 2x2", pixelate2, false)
    //
    effectD2 = createButton("effect-d2", ctx, 40,  55, 160, 25, "pixelate 3x3", pixelate3, false)
    //
    effectD3 = createButton("effect-d3", ctx, 40,  90, 160, 25, "pixelate 4x4", pixelate4, false)
    //
    effectD4 = createButton("effect-d4", ctx, 40, 125, 160, 25, "pixelate 5x5", pixelate5, false)
    //
    effectD5 = createButton("effect-d5", ctx, 40, 160, 160, 25, "reduce color A", reduceA, false)
    //
    effectD6 = createButton("effect-d6", ctx, 40, 195, 160, 25, "reduce color B", reduceB, false)
    //
    effectD7 = createButton("effect-d7", ctx, 40, 230, 160, 25, "reduce color C", reduceC, false)
    //
    panelEffectDGadgets = [ effectD1, effectD2, effectD3, effectD4, effectD5, effectD6, effectD7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectD() {
    panelEffectD.style.visibility = "hidden"
}

function paintAndShowPanelEffectD() {   
    paintPanelEffectD()
    panelEffectD.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectD() {
    panelEffectD.onmouseup = panelOnMouseUp
    panelEffectD.onmousedown = panelOnMouseDown
    panelEffectD.onmouseleave = panelOnMouseLeave
    panelEffectD.onmouseenter = function () { panelOnMouseEnter(panelEffectDGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectD() { 
    // background 
    panelEffectDCtx.fillStyle = wingColor()
    panelEffectDCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectD1)
    paintButton(effectD2)
    paintButton(effectD3)
    paintButton(effectD4)
    paintButton(effectD5)
    paintButton(effectD6)
    paintButton(effectD7)
}

