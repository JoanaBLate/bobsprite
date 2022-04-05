// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelEffectB
var panelEffectBCtx

var effectB1
var effectB2
var effectB3
var effectB4
var effectB5
var effectB6
var effectB7

var panelEffectBGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectB() {
    panelEffectB = createCanvas(240, 277)
    panelEffectBCtx = panelEffectB.getContext("2d")
    //
    panelEffectB.style.position = "absolute"
    panelEffectB.style.top = "325px"
    panelEffectB.style.left = "1060px"
    panelEffectB.style.zIndex = "2"
    panelEffectB.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectB)
    //
    initPanelEffectB2()
}

function initPanelEffectB2() {
    const ctx = panelEffectBCtx
    //
    effectB1 = createButton("effect-b1", ctx, 40,  20, 160, 25, "erase black", eraseBlack, false)
    //
    effectB2 = createButton("effect-b2", ctx, 40,  55, 160, 25, "erase colored", eraseColored, false)
    //
    effectB3 = createButton("effect-b3", ctx, 40,  90, 160, 25, "erase translucent", eraseTranslucent, false)
    //
    effectB4 = createButton("effect-b4", ctx, 40, 125, 160, 25, "erase all but black", eraseAllButBlack, false)
    //
    effectB5 = createButton("effect-b5", ctx, 40, 160, 160, 25, "erase all but colored", eraseAllButColored, false)
    //
    effectB6 = createButton("effect-b6", ctx, 40, 195, 160, 25, "erase all but transluc", eraseAllButTranslucent, false)
    //
    effectB7 = createButton("effect-b7", ctx, 40, 230, 160, 25, "erase palette match", erasePalettePixelsInLayer, false)
    //
    panelEffectBGadgets = [ effectB1, effectB2, effectB3, effectB4, effectB5, effectB6, effectB7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectB() {
    panelEffectB.style.visibility = "hidden"
}

function paintAndShowPanelEffectB() {   
    paintPanelEffectB()
    panelEffectB.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectB() {
    panelEffectB.onmouseup = panelOnMouseUp
    panelEffectB.onmousedown = panelOnMouseDown
    panelEffectB.onmouseleave = panelOnMouseLeave
    panelEffectB.onmouseenter = function () { panelOnMouseEnter(panelEffectBGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectB() { 
    // background
    panelEffectBCtx.fillStyle = wingColor()
    panelEffectBCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectB1)
    paintButton(effectB2)
    paintButton(effectB3)
    paintButton(effectB4)
    paintButton(effectB5)
    paintButton(effectB6)
    paintButton(effectB7)
}

