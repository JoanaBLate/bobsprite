// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

const wingColorDark = "rgb(102,104,108)" 
const wingColorLight = "rgb(192,192,192)"

var bigdiv

///////////////////////////////////////////////////////////////////////////////

function initInterface() { 
    //
    bigdiv = document.getElementById("bigdiv")
    resetBigDivPosition()
    //
    initOverlay() 
    initCanvasFavorites() 
    initCanvasAnimation()
    initCanvasHelp()
    //
    initTopBar()  
    initStage()
    initBottomBar()
    //
    initToolbox()
    initPanelLayers()
    initPanelOpacity()
    //
    initPanelMonitor()
    initMiniBar()
    initPolyPanel()
    //
    initSuperHand()
    //
    paintInterface()
    startListening()
}

function resetBigDivPosition() {
    let excedent = window.innerWidth - 1300
    if (excedent <= 0) { excedent = 0 }
    //
    const left = Math.floor(excedent / 2)
    bigdiv.style.left = left + "px"    
}

///////////////////////////////////////////////////////////////////////////////

function paintInterface() {
    //
    paintTopBar()
    shallRepaint = true // necessary
    paintStage()
    paintBottomBar()
    //
    paintToolbox()
    //
    paintPanelLayers()
    paintPanelOpacity()
    //
    paintPanelMonitor()
    paintMiniBar()
    //
    paintAndShowPolyPanel()
}

///////////////////////////////////////////////////////////////////////////////

function startListening() {
    //
    startListeningTopBar()
    startListeningStage()
    startListeningBottomBar()
    startListeningToolbox()
    startListeningPanelLayers()
    startListeningPanelOpacity()
    startListeningPanelMonitor()
    startListeningMiniBar()
    startListeningPolyPanel()
}

///////////////////////////////////////////////////////////////////////////////

function wingColor() {
    if (isDarkInterface) { return wingColorDark }
    return wingColorLight
}

function __stageColor() { // unused
 // if (isDarkInterface) { return "rgb(88,90,92)" }
 // return "rgb(110,112,114)"
    if (isDarkInterface) { return "rgb(46,48,52)" }
    return "rgb(130,132,134)"
}

function bottomBarColor() {
    if (isDarkInterface) { return "rgb(94,96,100)" }
    return "rgb(208,208,208)"
}

function foldColor() {
    if (isDarkInterface) { return "rgb(78,80,84)" }
    return "darkgrey"
}

function canvasFrameColor() {
    if (isDarkInterface) { return "rgb(48,48,48)" }
    return "rgb(128,128,128)"
}

