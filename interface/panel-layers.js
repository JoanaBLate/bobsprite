// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var panelLayers
var panelLayersCtx

var panelLayersCursor = ""

var buttonLayer0
var buttonLayer1
var buttonLayer2
var buttonLayer3
var buttonLayer4
var buttonLayer5

var buttonMergeDown
var buttonReverseOrder
var buttonDisplayOpacity

var panelLayersGadgets

var panelLayersDragCandidate = null

///////////////////////////////////////////////////////////////////////////////

function initPanelLayers() {
    panelLayers = createCanvas(160, 415)
    panelLayersCtx = panelLayers.getContext("2d")
    //
    panelLayers.style.position = "absolute"
    panelLayers.style.top = "215px"
    //
    bigdiv.appendChild(panelLayers)
    //
    initPanelLayers2()
}

function initPanelLayers2() {
    const ctx = panelLayersCtx
    //
    buttonLayer0 = createButton("layer-0", ctx, 40,  25, 80, 27, "selection", null, true)
    buttonLayer1 = createButton("layer-1", ctx, 40,  65, 80, 27, "layer A",   null, false)
    buttonLayer2 = createButton("layer-2", ctx, 40, 105, 80, 27, "layer B",   null, true)
    buttonLayer3 = createButton("layer-3", ctx, 40, 145, 80, 27, "layer C",   null, true)
    buttonLayer4 = createButton("layer-4", ctx, 40, 185, 80, 27, "layer D",   null, true)
    buttonLayer5 = createButton("layer-5", ctx, 40, 225, 80, 27, "layer E",   null, true)
    //
    buttonMergeDown = createButton("merge-down", ctx, 13, 280, 134, 30, "merge down", mergeDown, true)
    buttonReverseOrder = createButton("rev-order", ctx, 13, 325, 134, 30, "reverse order", reverseOrder, false)
    buttonDisplayOpacity = createButton("opacity", ctx, 13, 370, 134, 30, "display opacity", showPanelOpacity, false)
    //
    panelLayersGadgets = [ buttonLayer0, buttonLayer1, buttonLayer2, buttonLayer3, buttonLayer4, buttonLayer5, 
                           buttonMergeDown, buttonReverseOrder, buttonDisplayOpacity ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelLayers() {
    panelLayers.onmouseup = panelOnMouseUp
    panelLayers.onmousedown = panelOnMouseDown
    panelLayers.onmousemove = panelOnMouseMove
    panelLayers.onmouseleave = panelOnMouseLeave
    panelLayers.onmouseenter = function () { panelOnMouseEnter(panelLayersGadgets, panelLayersDragControl) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelLayers() {
    // background
    panelLayersCtx.fillStyle = wingColor()
    panelLayersCtx.fillRect(0, 0, 160, 415)
    //
    greyTraceH(panelLayersCtx, 5, 0, 150)
    //
    panelLayersCtx.drawImage(specialIcons["down"], 10, 28)
    panelLayersCtx.drawImage(specialIcons["up"], 130, 229)
    //
    paintButton(buttonLayer0)
    paintButton(buttonLayer1)
    paintButton(buttonLayer2)
    paintButton(buttonLayer3)
    paintButton(buttonLayer4)
    paintButton(buttonLayer5)
    //
    paintButton(buttonMergeDown)
    paintButton(buttonReverseOrder)
    paintButton(buttonDisplayOpacity)
}

///////////////////////////////////////////////////////////////////////////////

function setPanelLayersCursorDefault() {
    if (panelLayersCursor == "") { return }
    //
    panelLayersCursor = ""
    panelLayers.style.cursor = ""
}

function setPanelLayersCursorMove() {
    if (panelLayersCursor == "move") { return }
    //
    panelLayersCursor = "move"
    panelLayers.style.cursor = "move"
}

///////////////////////////////////////////////////////////////////////////////

function panelLayersDragControl(kind, x, y, gadget, dragging) {
    //
    if (x < 40  ||  x > 120) { cancelPanelLayersDrag(); return }
    if (y < 25  ||  y > 255) { cancelPanelLayersDrag(); return }
    //
    if (kind == "down") { 
        //  
        if (gadget == null) { cancelPanelLayersDrag() } else { panelLayersDragCandidate = gadget }
        return 
    }
    //
    if (kind == "move") {
        //
        if (! dragging  ||  panelLayersDragCandidate == null) { cancelPanelLayersDrag(); return } 
        //
        setPanelLayersCursorMove() 
        return 
    }
    // kind == "up"
    //
    if (gadget == null) { cancelPanelLayersDrag(); return }
    //
    if (panelLayersDragCandidate == null) { cancelPanelLayersDrag(); return }
    //
    if (gadget == panelLayersDragCandidate) { cancelPanelLayersDrag(); return } // standard click
    //
    finishPanelLayersDrag(panelLayersDragCandidate, gadget)
}

///////////////////////////////////////////////////////////////////////////////

function cancelPanelLayersDrag() {
    //
    panelLayersDragCandidate = null
    setPanelLayersCursorDefault()    
}

function finishPanelLayersDrag(buttonA, buttonB) {
    //
    setPanelLayersCursorDefault()  
    //
    const indexA = parseInt(buttonA.id.replace("layer-", ""))
    const indexB = parseInt(buttonB.id.replace("layer-", ""))
    //
    exchangeLayers(indexA, indexB)
}

///////////////////////////////////////////////////////////////////////////////

function layerButtonClicked(button) {
    //
    const n = parseInt(button.id.replace("layer-", ""))
    setPanelLayersCursorDefault()
    changeLayerVisibility(n)
}

///////////////////////////////////////////////////////////////////////////////

function showPanelOpacity() {
    panelOpacityOn = true
    paintPanelOpacity()
    panelOpacity.style.visibility = "visible"
    //
    panelLayers.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function updateLayerButtons() {  // helper 
    cancelPolyModel()
    //
    let count = 0
    //
    for (let n = 0; n < 6; n++) {
        const button = panelLayersGadgets[n]
        button.disabled = ! layers[n].enabled
        paintButton(button)
        if (! button.disabled) { count += 1 }
    }    
    //
    buttonMergeDown.disabled = count < 2
    paintButton(buttonMergeDown)    
    //
    buttonReverseOrder.disabled = count < 2
    paintButton(buttonReverseOrder)
    //
    updateOtherButtons(count == 0)
}

///////////////////////////////////////////////////////////////////////////////

function updateOtherButtons(disabled) {
    //
    if (buttonResizeByLayer.disabled == disabled) { return } // one represents all
    //
    const buttons = [
        buttonResizeByLayer, buttonResizeLayer, buttonScaleLayer, buttonAutocropLayer,
        effectA1, effectA2, effectA3, effectA4, effectA5, effectA6, effectA7, 
        effectB1, effectB2, effectB3, effectB4, effectB5, effectB6, effectB7, 
        effectC1, effectC2, effectC3, effectC5,  
        effectD1, effectD2, effectD3, effectD4, effectD5, effectD6, effectD7, 
        effectE1, effectE2, effectE3, effectE4, effectE5, effectE6, effectE7
    ]
    //
    for (const button of buttons) { 
        button.disabled = disabled
        paintButton(button)
    }
}

