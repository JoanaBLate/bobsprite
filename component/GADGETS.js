// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


// a layout (container) is a gadget


var currentGadgets = [ ]

var focusedGadget = null     
var gadgetUnderMouse = null  // for panel-color-hsl and panel-color-rgba

var panelDragControl = function () { }

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseLeave() { // keeps focusedGadget (for numbox)
    //
    currentGadgets = [ ]
    gadgetUnderMouse = null
    panelDragControl = function () { }
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

function panelOnMouseEnter(gadgets, dcCallback) {
    //
    currentGadgets = gadgets
    panelDragControl = dcCallback ? dcCallback : function () { } 
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
    const gadget = getGadgetUnderMouse(x, y) 
    //
    panelDragControl("down", x, y, gadget, false)
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
    const x = e.offsetX
    const y = e.offsetY 
    //
    const gadget = getGadgetUnderMouse(x, y) 
    //
    panelDragControl("up", x, y, gadget, false)
    //
    if (gadget == null) { return }
    //
    if (gadget != focusedGadget) { focusedGadget = null; return }
    //
    // classic click
    //
    if (gadget.kind != "numbox") { focusedGadget = null }
    //
    if (gadget.onClick) { gadget.onClick(x - gadget.left, y - gadget.top) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseMove(e) {
    //
    const x = e.offsetX
    const y = e.offsetY 
    const dragging = (e.buttons == 1)  
    //
    const gadget = getGadgetUnderMouse(x, y)
    //
    panelDragControl("move", x, y, gadget, dragging) 
    //
    if (gadget == null) {
        //    
        eraseMouseColor()
        //
        if (focusedGadget == null) { return }
        //
        //  focusedGadget != null
        //
        if (focusedGadget.onMouseLeave) { focusedGadget.onMouseLeave() }
        //
        if (dragging  ||  gadget.kind != "numbox") { focusedGadget = null }
    }
    else { // good gadget
        if (gadget.onMouseMove) { gadget.onMouseMove(x - gadget.left, y - gadget.top, dragging) }
    }
}

///////////////////////////////////////////////////////////////////////////////

function getGadgetUnderMouse(x, y)  {
    //
    gadgetUnderMouse = getGadgetUnderMouseCore(x, y)
    return gadgetUnderMouse
}

function getGadgetUnderMouseCore(x, y)  {
    //
    for (const gadget of currentGadgets) {
        //
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

