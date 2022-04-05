// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

/* NEVER FORGET:
    context["imageSmoothingQuality"] = "high" // medium, low
*/

var panelMonitor  
var panelMonitorCtx

var monitorBox
var monitorBoxCtx

var checkboxFrozen
var checkboxMonitorPixelated

var panelMonitorGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelMonitor() {
    //
    panelMonitor = createCanvas(240, 265)
    panelMonitorCtx = panelMonitor.getContext("2d")
    //
    panelMonitor.style.position = "absolute"
    panelMonitor.style.top = "30px"
    panelMonitor.style.left = "1060px"
    //
    bigdiv.appendChild(panelMonitor)
    //
    initPanelMonitor2()
}

function initPanelMonitor2() {
    //
    initFrozenPhoto()
    //
    makeMonitorBox()
    //
    checkboxFrozen = createCheckbox("frozen", panelMonitorCtx,  55, 5, 12, toggleFrozen, false)
    checkboxMonitorPixelated = createCheckbox("monitor-pixel", panelMonitorCtx, 170, 5, 12, togglePixelated, true)
    //
    panelMonitorGadgets = [ checkboxFrozen, checkboxMonitorPixelated ]
}

function makeMonitorBox() {
    //
    monitorBox = createCanvas(236, 240)
    monitorBoxCtx = monitorBox.getContext("2d")
    //
    monitorBox.style.position = "absolute"
    monitorBox.style.top = "52px"
    monitorBox.style.left = "1062px"
    monitorBox.style.zIndex = "2"
    //
    bigdiv.appendChild(monitorBox)
    //
    monitorBoxCtx["imageSmoothingQuality"] = "high" 
    //
    monitorBox.onwheel = changePhotoZoom
    monitorBox.onmousedown = resetFocusedGadget
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelMonitor() {
    panelMonitor.onmouseup = panelOnMouseUp
    panelMonitor.onmousedown = panelOnMouseDown
    panelMonitor.onmousemove = panelOnMouseMove
    panelMonitor.onmouseleave = panelOnMouseLeave
    panelMonitor.onmouseenter = function () { panelOnMouseEnter(panelMonitorGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelMonitor() { 
    // background
    panelMonitorCtx.fillStyle = wingColor()
    panelMonitorCtx.fillRect(0, 0, 240, 265)
    //
    greyTraceH(panelMonitorCtx, 5, 0, 230)
    //
    write(panelMonitorCtx, "frozen", 5, 5)
    paintCheckbox(checkboxFrozen)
    //
    write(panelMonitorCtx, "pixelated", 98, 5)
    paintCheckbox(checkboxMonitorPixelated)
    //
    paintMonitorBoxZoom()
    //
    greyTraceH(panelMonitorCtx, 5, 263, 230)
}

function paintMonitorBoxZoom() {
    panelMonitorCtx.fillRect(210,3,30,15)
    write(panelMonitorCtx, photoZoom + "x", 215, 5)
}

///////////////////////////////////////////////////////////////////////////////

function togglePixelated() { 
    //
    shallRepaint = true
}

function toggleFrozen() {
    //
    shallRepaint = true
    // 
    if (checkboxFrozen.checked) { updateFrozenPhoto() }
}

