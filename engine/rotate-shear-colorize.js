// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function resetTopLayerByMemory() { 
    //
    if (toplayer == null) { return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(model, 0, 0)
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
    //
    if (toplayer == null) { panelShearResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    //
    value -= 0.5
    const rad = 2 * Math.PI * value
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    const halfWidth  = Math.floor(cnv.width / 2)
    const halfHeight = Math.floor(cnv.height / 2)
    //    
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.save()
    ctx["imageSmoothingEnabled"] = false
    ctx.translate(halfWidth, halfHeight)
    ctx.rotate(rad)
    ctx.drawImage(model, -halfWidth, -halfHeight)
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
    if (toplayer == null) { panelShearResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    // 
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
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
    ctx.drawImage(model, -halfWidth, -halfHeight)
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
    if (toplayer == null) { panelColorizeResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    // 
    const intensityOfNewHue = sliderColorizeHue.value 
    const sat = sliderColorizeSat.value
    const lum = softLumValue(sliderColorizeLum.value)
    const opacity = sliderColorizeOpa.value
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(model, 0, 0)
    //
    colorize(cnv, intensityOfNewHue, sat, lum)
    //
    if (opacity != 1) {
        const colorized = cloneImage(toplayer.canvas)
        ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
        ctx.globalAlpha = opacity
        ctx.drawImage(colorized, 0, 0)
        ctx.globalAlpha = 1.0
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

