// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// height of slider is 20


const sliders = { } // just the images

///////////////////////////////////////////////////////////////////////////////
    
function Slider(id, ctx, left, top, width, value, action) {
    //
    this.kind = "slider"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.left = left
    this.top = top
    this.width = width
    this.height = 30 // constant; for mouse coordinates only
    //
    this.onClick = function (x) { inputOnSlider(this, x) }
    this.onMouseMove = function (x, __y, dragging) { 
        if (dragging) { inputOnSlider(this, x) }
    }
    //
    this.value = value
    this.action = action
}

///////////////////////////////////////////////////////////////////////////////

function createSlider(id, ctx, left, top, width, value, action) {
    //
    const slider = new Slider(id, ctx, left, top, width, value, action)
    //
    Object.seal(slider)
    return slider
}

///////////////////////////////////////////////////////////////////////////////

function resetSlider(slider, value, forced) {
    //
    if (slider.value == value  &&  ! forced) { return }
    //
    slider.value = value
    //    
    paintSlider(slider)
}

///////////////////////////////////////////////////////////////////////////////

function paintSlider(slider) {
    //
    const dark = isDarkInterface
    //
    slider.parentCtx.drawImage(sliderBar(slider.width, dark), slider.left, slider.top)
    //
    slider.parentCtx.drawImage(sliderCursor(dark), sliderCursorLeft(slider), slider.top)
}

///////////////////////////////////////////////////////////////////////////////

function sliderBar(width, dark) {
    //
    const id = width + "-" + (dark ? "dark" : "light") 
    //
    let slider = sliders[id]
    //
    if (slider == undefined) { slider = createSliderBar(width, dark); sliders[id] = slider }
    //
    return slider
}

///////////////////////////////////////////////////////////////////////////////

function sliderCursor(dark) {
    //
    const id = "cursor-" + (dark ? "dark" : "light") 
    //
    let cursor = sliders[id]
    //    
    if (cursor == undefined) { cursor = createSliderCursor(dark); sliders[id] = cursor }
    //
    return cursor
}

///////////////////////////////////////////////////////////////////////////////

function sliderCursorLeft(slider) {
    //
    const logicalWidth = slider.width - 20
    //    
    const logicalLeft = Math.round(slider.value * logicalWidth)
    //
    return slider.left + 10 + logicalLeft - 10 // +10: visible bar displacement; -10: half cursor width
}
  
///////////////////////////////////////////////////////////////////////////////

function inputOnSlider(slider, x) {
    //
    const adjustedX = x - 10 // -10: visible bar displacement
    //    
    const logicalWidth = slider.width - 20
    //
    slider.value = adjustedX / logicalWidth
    //
    if (slider.value < 0) { slider.value = 0 }
    if (slider.value > 1) { slider.value = 1 }
    //
    paintSlider(slider)
    //    
    slider.action(slider)
}

