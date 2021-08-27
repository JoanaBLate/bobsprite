// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var polyModel = null // for colorize, shear and rotate

///////////////////////////////////////////////////////////////////////////////

function makePolyModel() {
    polyModel = null
    //
    const natural = getTopLayer()
    if (natural == null) { return }
    //
    let shallMemorize = false
    //
    if (natural.top != 0) { shallMemorize = true }
    if (natural.left != 0) { shallMemorize = true }
    //
    if (natural.canvas.width != canvas.width) { shallMemorize = true }
    if (natural.canvas.height != canvas.height) { shallMemorize = true }
    //
    if (shallMemorize) { memorizeTopLayer() }
    //
    const layer = getTopLayerAdjusted()
    //
    polyModel = cloneImage(layer.canvas) 
}

function cancelPolyModel() {
    if (polyModel == null) { return }
    //
    polyModel = null
    panelShearResetGadgets()
    panelColorizeResetGadgets()
}

function makePolyModelIfLayerDisplaced() { // displaced by tool hand
    //
    if (polyModel == null) { return } // for safety
    //
    const layer = getTopLayer() // must not be ajusted!!
    if (layer == null) { return } // for safety
    //
    if (layer.left == 0  &&  layer.top == 0) { return }
    //
    const cnv = createCanvas(polyModel.width, polyModel.height)
    const ctx = cnv.getContext("2d")
    //
    ctx.drawImage(polyModel, layer.left, layer.top)
    //
    polyModel = cnv
}

///////////////////////////////////////////////////////////////////////////////

function resetLayerByPolyModel() { 
    //
    if (polyModel == null) { return }
    //
    const layer = getTopLayerAdjusted() 
    if (layer == null) { return }
    //
    const cnv = layer.canvas
    const ctx = cnv.getContext("2d")
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(polyModel, 0, 0)
    //
    shallRepaint = true
}

///////////////////////////////////////////////////////////////////////////////

function rotateLayer(slider) {
    setTask(callback)
    //
    function callback() { polyModelRotateLayer(slider.value) }
}

function polyModelRotateLayer(value) {
    if (polyModel == null) { makePolyModel() }
    if (polyModel == null) { panelShearResetGadgets(); return }
    //
    makePolyModelIfLayerDisplaced()
    //
    shallRepaint = true
    //
    value -= 0.5
    const rad = 2 * Math.PI * value
    //
    const layer = getTopLayerAdjusted()
    if (layer == null) { return } // for safety
    //
    const cnv = layer.canvas
    const ctx = layer.canvas.getContext("2d")
    //
    const halfWidth  = Math.floor(cnv.width / 2)
    const halfHeight = Math.floor(cnv.height / 2)
    //    
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.save()
    ctx["imageSmoothingEnabled"] = false
    ctx.translate(halfWidth, halfHeight)
    ctx.rotate(rad)
    ctx.drawImage(polyModel, -halfWidth, -halfHeight)
    ctx.restore()
    //
    resetSliderShearV()
    resetSliderShearH()
    updateShearButtons()
}

///////////////////////////////////////////////////////////////////////////////

function shearLayer() {
    setTask(polyModelShearLayer)
}

function polyModelShearLayer() { 
    // 
    if (polyModel == null) { makePolyModel() }
    if (polyModel == null) { panelShearResetGadgets(); return }
    //
    makePolyModelIfLayerDisplaced()
    //
    shallRepaint = true
    // 
    const layer = getTopLayerAdjusted()
    if (layer == null) { return } // for safety
    //
    const cnv = layer.canvas
    const ctx = layer.canvas.getContext("2d")
    //
    const rawV = sliderShearV.value
    const rawH = sliderShearH.value
    //
    const v =  3 * (0.5 - rawV) 
    const h =  3 * (0.5 - rawH) 
    //
    const halfWidth  = Math.floor(cnv.width / 2)
    const halfHeight = Math.floor(cnv.height / 2)
    //    
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.save()
    ctx["imageSmoothingEnabled"] = false
    ctx.translate(halfWidth, halfHeight)
    ctx.transform(1, v, h, 1, 0, 0)
    ctx.drawImage(polyModel, -halfWidth, -halfHeight)
    ctx.restore()
    //
    resetSliderRotate()
    updateShearButtons()
}


///////////////////////////////////////////////////////////////////////////////

function colorizeLayer() {
    setTask(polyModelColorizeLayer)
}

function polyModelColorizeLayer() { 
    // 
    if (polyModel == null) { makePolyModel() }
    if (polyModel == null) { panelColorizeResetGadgets(); return }
    //
    makePolyModelIfLayerDisplaced()
    //
    shallRepaint = true
    // 
    const layer = getTopLayerAdjusted()
    if (layer == null) { return } // for safety
    //    
    const hue = sliderColorizeHue.value * 360
    const sat = sliderColorizeSat.value
    const lum = softLumValue(sliderColorizeLum.value)
    const opacity = sliderColorizeOpa.value
    //
    layer.canvas.getContext("2d").clearRect(0, 0, layer.canvas.width, layer.canvas.height)
    layer.canvas.getContext("2d").drawImage(polyModel, 0, 0)
    //
    const shallConsider = checkboxConsider.checked
    colorize(layer.canvas, hue, sat, lum, shallConsider)
    //
    if (opacity != 1) {
        const cnv = createCanvas(layer.canvas.width, layer.canvas.height)
        const ctx = cnv.getContext("2d")
        ctx.globalAlpha = opacity
        ctx.drawImage(layer.canvas, 0, 0)
        ctx.globalAlpha = 1.0
        layer.canvas = cnv    
    }
    //
    updateColorizeButtons()
}

function softLumValue(value) { // returns from 0.2 to 0.8
    //
    if (value == 0.5) { return 0.5 }
    //
    return (value < 0.5) ? softLumValueLow(value) : softLumValueHigh(value)
}

function softLumValueLow(value) {
    //
    const factor = value / 0.5
    return 0.2 + (0.3 * factor)
}

function softLumValueHigh(value) {
    //
    const factor = (value - 0.5) / 0.5
    return 0.5 + (0.3 * factor)
}

