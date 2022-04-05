// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelEffectC
var panelEffectCCtx

var effectC1
var effectC2
var effectC3
var effectC4
var effectC5

var panelEffectCGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectC() {
    panelEffectC = createCanvas(240, 277)
    panelEffectCCtx = panelEffectC.getContext("2d")
    //
    panelEffectC.style.position = "absolute"
    panelEffectC.style.top = "325px"
    panelEffectC.style.left = "1060px"
    panelEffectC.style.zIndex = "2"
    panelEffectC.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectC)
    //
    initPanelEffectC2()
}

function initPanelEffectC2() {
    const ctx = panelEffectCCtx
    //
    effectC1 = createButton("effect-c1", ctx, 40,  20, 160, 25, "eat edge", eatBorder, false)
    //
    effectC2 = createButton("effect-c2", ctx, 40,  55, 160, 25, "paint edge inside", inliner, false)
    //
    effectC3 = createButton("effect-c3", ctx, 40,  90, 160, 25, "paint edge outside", outliner, false)
    //
    effectC4 = createButton("effect-c4", ctx, 40, 125, 160, 25, "antialiasing outside 1", antialiasingStandard, false)
    //
    effectC5 = createButton("effect-c5", ctx, 40, 160, 160, 25, "antialiasing outside 2", antialiasingStrong, false)
    //
    panelEffectCGadgets = [ effectC1, effectC2, effectC3, effectC4, effectC5 ]    
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectC() {
    panelEffectC.style.visibility = "hidden"
}

function paintAndShowPanelEffectC() {   
    paintPanelEffectC()
    panelEffectC.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectC() {
    panelEffectC.onmouseup = panelOnMouseUp
    panelEffectC.onmousedown = panelOnMouseDown
    panelEffectC.onmouseleave = panelOnMouseLeave
    panelEffectC.onmouseenter = function () { panelOnMouseEnter(panelEffectCGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectC() { 
    // background
    panelEffectCCtx.fillStyle = wingColor()
    panelEffectCCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectC1)
    paintButton(effectC2)
    paintButton(effectC3)
    paintButton(effectC4)
    paintButton(effectC5)
}

