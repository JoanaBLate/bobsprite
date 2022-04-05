// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var canvasHelp
var canvasHelpCtx

///////////////////////////////////////////////////////////////////////////////

function initCanvasHelp() {
    canvasHelp = createCanvas(1300, 600)
    canvasHelpCtx = canvasHelp.getContext("2d")
    //
    canvasHelp.style.position = "absolute"
    canvasHelp.style.top = "30px"
    canvasHelp.style.zIndex = "31"
    canvasHelp.style.visibility = "hidden"
    //
    bigdiv.appendChild(canvasHelp) 
    //
    initCanvasHelp2()
}

function initCanvasHelp2() {
    canvasHelp.onclick = showOrHideHelp
}

function resetCanvasHelp() {
    //
    canvasHelpCtx.fillStyle = "rgb(192,192,192)"
    canvasHelpCtx.fillRect(0, 0, 1300, 600)
    //
    canvasHelpCtx.lineWidth = 1
    canvasHelpCtx.strokeStyle = "rgb(48,48,48)"
    canvasHelpCtx.strokeRect(2, 2, 1296, 596)
    canvasHelpCtx.strokeStyle = "rgb(160,160,160)"
    canvasHelpCtx.strokeRect(432, 25, 1, 540)
    canvasHelpCtx.strokeRect(866, 25, 1, 540)
}

///////////////////////////////////////////////////////////////////////////////

function showCanvasHelp() {
    canvasHelp.style.visibility = "visible"
}

function hideCanvasHelp() {
    canvasHelp.style.visibility = "hidden"
}

