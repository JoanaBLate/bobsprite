// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var currentGadgets = [ ]

var focusedGadget = null     
var gadgetUnderMouse = null  // for panel-color-hsl and panel-color-rgba
var mouseLeftGadget = true

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseLeave() { // keeps focusedGadget (for numbox)
    //
    currentGadgets = [ ]
    mouseLeftGadget = true
    gadgetUnderMouse = null
    //
    eraseMouseColor()
    //
    if (focusedGadget == null) { return }
    //
    if (focusedGadget.kind != "numbox") { focusedGadget = null }
}

function resetFocusedGadget() { // for numbox
    focusedGadget = null
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseEnter(gadgets) {
    currentGadgets = gadgets
}

///////////////////////////////////////////////////////////////////////////////

function panelOnWheel(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    const sign = Math.sign(e.deltaY)
    //
    const gadget = getGadgetUnderMouse(x, y) 
    //
    if (gadget == null) { return }
    //
    if (gadget.onWheel) { gadget.onWheel(x - gadget.left, y - gadget.top, sign) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseDown(e) {
    //
    const x = e.offsetX
    const y = e.offsetY 
    //
    mouseLeftGadget = false
    //
    const gadget = getGadgetUnderMouse(x, y) 
    //
    focusedGadget = gadget
    //
    if (gadget == null) { return }
    //
    if (gadget.onMouseDown) { gadget.onMouseDown(x - gadget.left, y - gadget.top) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseUp(e) {
    //
    if (focusedGadget == null) { return } // mouse dragging started on other panel
    //
    const x = e.offsetX
    const y = e.offsetY 
    //
    const gadget = getGadgetUnderMouse(x, y) 
    //
    if (gadget == null) { focusedGadget = null; return }
    //
    if (gadget == focusedGadget) { 
        //
        if (gadget.kind != "numbox") { focusedGadget = null }
        //
        if (mouseLeftGadget) { focusedGadget = null; tryNormalizeCursor(gadget); return } // SPECIAL CASE
        //
        if (gadget.onClick) { gadget.onClick(x - gadget.left, y - gadget.top) }
        //
        return
    }
    // must be a exchange now
    //   
    const old = focusedGadget
    focusedGadget = null
    // SPECIAL CASE 
    tryExchangeOnPanelLayers(old, gadget)
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseMove(e) {
    //
    const x = e.offsetX
    const y = e.offsetY 
    const dragging = (e.buttons == 1)  
    //
    const gadget = getGadgetUnderMouse(x, y) 
    gadgetUnderMouse = gadget
    //
    if (gadget == null) {
        panelOnMouseMoveNoGadget(x, y, dragging)
    }
    else {
        panelOnMouseMoveOnGadget(gadget, x, y, dragging)    
    }
}

function panelOnMouseMoveNoGadget(x, y, dragging) {
    //
    mouseLeftGadget = true
    //
    eraseMouseColor()
    //
    if (focusedGadget == null) { return }
    //
    const gadget = focusedGadget
    //
    if (gadget.onMouseLeave) { gadget.onMouseLeave(); return }
    //
    // SPECIAL CASE
    //
    if (gadget.parentCtx == panelLayersCtx) { rawMovingOnPanelLayers(x, y, dragging) }
}

function panelOnMouseMoveOnGadget(gadget, x, y, dragging) {
    //
    if (focusedGadget == null  &&  gadget != surfaceHsl) { dragging = false }
    //
    if (gadget.onMouseMove) { gadget.onMouseMove(x - gadget.left, y - gadget.top, dragging) }        
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function getGadgetUnderMouse(x, y)  {
    //
    for (const gadget of currentGadgets) {
        if (isGadgetUnderMouse(x, y, gadget)) { return gadget }
    }
    //
    return null
}

function isGadgetUnderMouse(x, y, gadget) {
    //
    if (x < gadget.left) { return false }
    if (y < gadget.top)  { return false }
    //
    const right = gadget.left + gadget.width - 1
    const bottom = gadget.top + gadget.height - 1
    //
    if (x > right)  { return false }
    if (y > bottom) { return false }
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function focusedNumbox() {
    //
    if (focusedGadget == null) { return null }
    //
    if (focusedGadget.kind == "numbox") { return focusedGadget }
    //
    return null
}

