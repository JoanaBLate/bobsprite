// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelOpacity
var panelOpacityCtx

var panelOpacityOn = false

var sliderOpacity0
var sliderOpacity1
var sliderOpacity2
var sliderOpacity3
var sliderOpacity4
var sliderOpacity5

var buttonOpacityReturn

var panelOpacityGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelOpacity() {
    panelOpacity = createCanvas(160, 415)
    panelOpacityCtx = panelOpacity.getContext("2d")
    //
    panelOpacity.style.position = "absolute"
    panelOpacity.style.top = "215px"
    panelOpacity.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelOpacity)
    //
    initPanelOpacity2()
}

function initPanelOpacity2() {
    const ctx = panelOpacityCtx
    //
    sliderOpacity0 = createSlider("opacity-0", ctx, 10,  50, 120, 1, changeOpacity)
    sliderOpacity1 = createSlider("opacity-1", ctx, 10, 100, 120, 1, changeOpacity)
    sliderOpacity2 = createSlider("opacity-2", ctx, 10, 150, 120, 1, changeOpacity)
    sliderOpacity3 = createSlider("opacity-3", ctx, 10, 200, 120, 1, changeOpacity)
    sliderOpacity4 = createSlider("opacity-4", ctx, 10, 250, 120, 1, changeOpacity)
    sliderOpacity5 = createSlider("opacity-5", ctx, 10, 300, 120, 1, changeOpacity)
    //
    buttonOpacityReturn = createButton("opacity-ret", ctx, 20, 350, 120, 35, "return", hidePanelOpacity, false)
    //
    panelOpacityGadgets = [ sliderOpacity0, sliderOpacity1, sliderOpacity2, sliderOpacity3,
                            sliderOpacity4, sliderOpacity5, buttonOpacityReturn ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelOpacity() {
    panelOpacity.onmouseup = panelOnMouseUp
    panelOpacity.onmousedown = panelOnMouseDown
    panelOpacity.onmousemove = panelOnMouseMove
    panelOpacity.onmouseleave = panelOnMouseLeave
    panelOpacity.onmouseenter = function () { panelOnMouseEnter(panelOpacityGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelOpacity() {
    // background
    panelOpacityCtx.fillStyle = wingColor()
    panelOpacityCtx.fillRect(0, 0, 160, 415)
    //
    greyTraceH(panelOpacityCtx, 5, 0, 150)
    //
    if (layers[0].enabled) {
        write(panelOpacityCtx, "opacity selec", 25, 35)
        resetSlider(sliderOpacity0, layers[0].opacity, true)
    }
    if (layers[1].enabled) {
        write(panelOpacityCtx, "opacity A", 25, 85)
        resetSlider(sliderOpacity1, layers[1].opacity, true)
    }
    if (layers[2].enabled) {
        write(panelOpacityCtx, "opacity B", 25, 135)
        resetSlider(sliderOpacity2, layers[2].opacity, true)
    }
    if (layers[3].enabled) {
        write(panelOpacityCtx, "opacity C", 25, 185)
        resetSlider(sliderOpacity3, layers[3].opacity, true)
    }
    if (layers[4].enabled) {
        write(panelOpacityCtx, "opacity D", 25, 235)
        resetSlider(sliderOpacity4, layers[4].opacity, true)
    }
    if (layers[5].enabled) {
        write(panelOpacityCtx, "opacity E", 25, 285)
        resetSlider(sliderOpacity5, layers[5].opacity, true)
    }
    //
    paintButton(buttonOpacityReturn)    
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelOpacity() {
    panelOpacityOn = false
    panelLayers.style.visibility = "visible"
    //
    panelOpacity.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function changeOpacity(slider) {
    shallRepaint = true
    //
    const n = parseInt(slider.id.replace("opacity-", ""))
    const layer = layers[n]
    if (! layer.enabled) {
        slider.value = layer.opacity 
        paintPanelOpacity() // erases disabled sliders that were automaticcaly painted
        return 
    }
    //
    layer.opacity = slider.value
}

