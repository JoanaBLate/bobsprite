// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var overlay

///////////////////////////////////////////////////////////////////////////////

function initOverlay() {
    //
    overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.width  = "1300px"
    overlay.style.height = "660px"
    overlay.style.zIndex = "30"
    overlay.style.visibility = "hidden"
    //
    bigdiv.appendChild(overlay) 
}

function showOverlay(white) {
    //
    overlay.style.backgroundColor = white ? "white" : "rgba(0,0,0,0.7)"
    //
    overlay.style.visibility = "visible"
}

function hideOverlay() {
    //
    overlay.style.visibility = "hidden"
}

