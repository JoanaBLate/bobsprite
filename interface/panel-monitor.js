// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


/* NEVER FORGET:
    context["imageSmoothingQuality"] = "high" // medium, low
*/

var panelMonitor  
var panelMonitorCtx

var monitorBox
var monitorBoxCtx
var monitorChessBg

var checkboxFrozen
var checkboxAnimation
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
    makeMonitorBox()
    monitorChessBg = createChessBox(240, 240, 60)
    //
    checkboxFrozen = createCheckbox("frozen", panelMonitorCtx,  52, 5, 12, toggleFrozen, false)
    checkboxAnimation = createCheckbox("animation", panelMonitorCtx, 125, 5, 12, toggleAnimation, false)
    checkboxMonitorPixelated = createCheckbox("monit-pixel", panelMonitorCtx, 195, 5, 12, togglePixelated, true)
    //
    panelMonitorGadgets = [ checkboxFrozen, checkboxAnimation, checkboxMonitorPixelated ]
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
    write(panelMonitorCtx, "frozen", 2, 5)
    paintCheckbox(checkboxFrozen)
    //
    write(panelMonitorCtx, "animat", 80, 5)
    paintCheckbox(checkboxAnimation)
    //
    write(panelMonitorCtx, "pixel", 155, 5)
    paintCheckbox(checkboxMonitorPixelated)
    //
    paintMonitorBoxZoom()
    //
    greyTraceH(panelMonitorCtx, 5, 263, 230)
}

function paintMonitorBoxZoom() {
    panelMonitorCtx.fillRect(215,3,30,15)
    write(panelMonitorCtx, photoZoom + "x", 220, 5)
}

///////////////////////////////////////////////////////////////////////////////

function paintChessBgOnMonitorBox() {
    // shall be displaced 2 pixels to the left
    monitorBoxCtx.drawImage(monitorChessBg, -2, 0)
}

///////////////////////////////////////////////////////////////////////////////

function toggleAnimation() {
    shallRepaintPhoto = true
    //
    if (checkboxAnimation.checked) { animationClock = 0 } // animation starts ASAP
    //
    if (checkboxFrozen.checked) { resetCheckbox(checkboxFrozen, false) } // unfreezes
}

function togglePixelated() { 
    shallRepaintPhoto = true
    //
    if (checkboxFrozen.checked) { revertCheckbox(checkboxMonitorPixelated); return } // aborts
}

function toggleFrozen() {
    shallRepaintPhoto = true 
    // 
    if (! checkboxFrozen.checked) { return }
    //
    if (checkboxAnimation.checked) { resetCheckbox(checkboxAnimation, false) } // cancels animation
}

