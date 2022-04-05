// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var panelEffectA
var panelEffectACtx

var effectA1
var effectA2
var effectA3
var effectA4
var effectA5
var effectA6
var effectA7

var panelEffectAGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectA() {
    panelEffectA = createCanvas(240, 277)
    panelEffectACtx = panelEffectA.getContext("2d")
    //
    panelEffectA.style.position = "absolute"
    panelEffectA.style.top = "325px"
    panelEffectA.style.left = "1060px"
    panelEffectA.style.zIndex = "2"
    panelEffectA.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectA)
    //
    initPanelEffectA2()
}

function initPanelEffectA2() {
    const ctx = panelEffectACtx
    //
    effectA1 = createButton("effect-a1", ctx, 40,  20, 160, 25, "swap rgb", swapRgb, false)
    //
    effectA2 = createButton("effect-a2", ctx, 40,  55, 160, 25, "negative", negative, false)
    //
    effectA3 = createButton("effect-a3", ctx, 40,  90, 160, 25, "grey scale", greyScale, false)
    //
    effectA4 = createButton("effect-a4", ctx, 40, 125, 160, 25, "rotate 90 (R)", rotate90, false)
    //
    effectA5 = createButton("effect-a5", ctx, 40, 160, 160, 25, "mixed reverse (X)", mixedReverse, false)
    //
    effectA6 = createButton("effect-a6", ctx, 40, 195, 160, 25, "vertical reverse (V)", verticalReverse, false)
    //
    effectA7 = createButton("effect-a7", ctx, 40, 230, 160, 25, "horizontal reverse (H)", horizontalReverse, false)
    //
    panelEffectAGadgets = [ effectA1, effectA2, effectA3, effectA4, effectA5, effectA6, effectA7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectA() {
    panelEffectA.style.visibility = "hidden"
}

function paintAndShowPanelEffectA() {   
    paintPanelEffectA()
    panelEffectA.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectA() {
    panelEffectA.onmouseup = panelOnMouseUp
    panelEffectA.onmousedown = panelOnMouseDown
    panelEffectA.onmouseleave = panelOnMouseLeave
    panelEffectA.onmouseenter = function () { panelOnMouseEnter(panelEffectAGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectA() { 
    // background
    panelEffectACtx.fillStyle = wingColor()
    panelEffectACtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectA1)
    paintButton(effectA2)
    paintButton(effectA3)
    paintButton(effectA4)
    paintButton(effectA5)
    paintButton(effectA6)
    paintButton(effectA7)
}

