// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var mouseBusy = false // flag to abort concurrent keyboard command

var stageRawX = null // stage raw coordinate (ignores ZOOM)
var stageRawY = null // stage raw coordinate (ignores ZOOM)

var stageX = null // stage natural coordinate (after unzooming)
var stageY = null // stage natural coordinate (after unzooming)

///////////////////////////////////////////////////////////////////////////////

function updateStageXY() { // also called by module "zoom"
    //
    stageX = null
    stageY = null
    //
    if (stageRawX == null) { return } 
    //
    const deltaXZoomed = stageRawX - stageCenterX
    const deltaYZoomed = stageRawY - stageCenterY
    //
    const deltaX = Math.floor(deltaXZoomed / ZOOM)
    const deltaY = Math.floor(deltaYZoomed / ZOOM)
    //
    stageX = stageCenterX + deltaX
    stageY = stageCenterY + deltaY
}

///////////////////////////////////////////////////////////////////////////////

// palette has own handler for wheel

function mouseWheelHandler(e) {
    shallRepaint = true
    //
    if (e.shiftKey) {
        if (e.deltaY > 0) { changeToolSize(-1); return false }
        if (e.deltaY < 0) { changeToolSize(+1); return false }
    }
    else if (e.ctrlKey) {
        if (e.deltaY > 0) { changeIntensity(-1); return false }
        if (e.deltaY < 0) { changeIntensity(+1); return false }
    }
    else {
        if (e.deltaY > 0) { decreaseZoom(); return false }
        if (e.deltaY < 0) { increaseZoom(); return false }
    }    
}  

///////////////////////////////////////////////////////////////////////////////

function mouseUpHandler() {
    //
    shallRepaint = true
    mouseBusy = false
    //
    finishMouseAction()
    return false
}

///////////////////////////////////////////////////////////////////////////////

function mouseLeaveHandler() {
    //
    shallRepaint = true 
    mouseBusy = false
    //
    stageRawX = null
    stageRawY = null
    updateStageXY()
    //
    finishMouseAction()
    eraseMouseColor()    
    return false
}

///////////////////////////////////////////////////////////////////////////////

function finishMouseAction() {
    //
    if (superHandOn)          { resetMove(); return }
    //
    if (tool == "pen")        { finishPen(); return }
    if (tool == "hand")       { resetMove(); return }
    if (tool == "line")       { finishLine(); return }
    if (tool == "blur-pixel") { finishBlur(); return }
    if (tool == "brush")      { finishBrush(); return }
    if (tool == "spray")      { finishSpray(); return }
    if (tool == "scale")      { finishScale(); return }
    if (tool == "lasso")      { finishLasso(); return }
    if (tool == "rubber")     { finishRubber(); return }
    if (tool == "select")     { finishSelect(); return }
    if (tool == "darken")     { finishDarken(); return }
    if (tool == "ellipse")    { finishEllipse(); return }
    if (tool == "feather")    { finishFeather(); return }
    if (tool == "lighten")    { finishLighten(); return }
    if (tool == "thin-pen")   { resetPerfectAny(); return }
    if (tool == "rectangle")  { finishRectangle(); return }
    if (tool == "mirror-pen") { resetPerfectAny(); return }
}

///////////////////////////////////////////////////////////////////////////////

function mouseDownHandler(e) {
    shallRepaint = true
    resetFocusedGadget()
    //
    mouseBusy = true
    //
    if (superHandOn) { return false }
    //
    if (e.buttons != 1)  { return false } // avoid mess with right button click
    //    
    if (tool == "hand")        { return false }
    if (tool == "thin-pen")    { thinPen(); return false }
    if (tool == "pen")         { startPen(); return false }
    if (tool == "line")        { startLine(); return false }
    if (tool == "mirror-pen")  { mirrorPen(); return false }
    if (tool == "blur-pixel")  { startBlur(); return false }
    if (tool == "lasso")       { startLasso(); return false }
    if (tool == "scale")       { startScale(); return false }
    if (tool == "spray")       { startSpray(); return false }
    if (tool == "brush")       { startBrush(); return false }
    if (tool == "select")      { startSelect(); return false }
    if (tool == "darken")      { startDarken(); return false }
    if (tool == "rubber")      { startRubber(); return false }
    if (tool == "ellipse")     { startEllipse(); return false }
    if (tool == "feather")     { startFeather(); return false }
    if (tool == "lighten")     { startLighten(); return false }
    if (tool == "capture")     { managerCapture(); return false }
    if (tool == "rectangle")   { startRectangle(); return false }
    if (tool == "bucket")      { managerPaintArea(); return false }
    if (tool == "blur-border") { managerBlurBorder(); return false }
    if (tool == "every")       { managerPaintEvery(); return false }
    if (tool == "border")      { managerPaintBorder(); return false }
    //    
    return false
}  

///////////////////////////////////////////////////////////////////////////////

function mouseMoveHandler(e) {
   shallRepaint = true
    //
 // mouseBusy = (e.which == 1)  // good for chrome, bad for firefox (always 1)
 // mouseBusy = (e.button == 1) // only for pressing and releasing
    mouseBusy = (e.buttons == 1)
    //
    stageRawX = e.offsetX
    stageRawY = e.offsetY
    const oldStageX = stageX
    const oldStageY = stageY
    updateStageXY()
    //
    if (! mouseBusy) { return false } 
    //
    resetFocusedGadget()
    //    
    if (superHandOn) { moveLayers(e["movementX"], e["movementY"]); return false }
    //
    if (tool == "hand") { moveTopLayer(e["movementX"], e["movementY"]); return false } 
    //
    if (stageX == oldStageX  &&  stageY == oldStageY) { return false }
    //
    if (tool == "thin-pen")   { thinPen(); return false }
    if (tool == "mirror-pen") { mirrorPen(); return false }
    if (tool == "pen")        { continuePen(); return false }
    if (tool == "line")       { continueLine(); return false }
    if (tool == "blur-pixel") { continueBlur(); return false }
    if (tool == "brush")      { continueBrush(); return false }
    if (tool == "lasso")      { continueLasso(); return false }
    if (tool == "scale")      { continueScale(); return false }
    if (tool == "spray")      { continueSpray(); return false }
    if (tool == "darken")     { continueDarken(); return false }
    if (tool == "rubber")     { continueRubber(); return false }
    if (tool == "select")     { continueSelect(); return false }
    if (tool == "ellipse")    { continueEllipse(); return false }
    if (tool == "feather")    { continueFeather(); return false }
    if (tool == "lighten")    { continueLighten(); return false }
    if (tool == "rectangle")  { continueRectangle(); return false }
    //
    return false
}

