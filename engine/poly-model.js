// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var polyModel = null // for colorize, shear and rotate

///////////////////////////////////////////////////////////////////////////////

function makePolyModel() {
    polyModel = null
    const layer = getTopLayer()
    if (layer == null) { return }
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

///////////////////////////////////////////////////////////////////////////////

function resetLayerByPolyModel() { 
    //
    if (polyModel == null) { return }
    //
    const layer = getTopLayer()
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
    shallRepaint = true
    //
    const rad = 2 * Math.PI * value
    //
    const layer = getTopLayer()
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
    shallRepaint = true
    // 
    const layer = getTopLayer()
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
    shallRepaint = true
    // 
    const layer = getTopLayer()
    if (layer == null) { return } // for safety
    //    
    const hue = sliderColorizeHue.value * 360
    const sat = sliderColorizeSat.value
    const lum = sliderColorizeLum.value
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

