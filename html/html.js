// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function clickHtmlElement(element) { 
    // Firefox (and Edge) does not click link that is not body's child
    const e = document.createEvent("MouseEvents")
    e.initEvent("click", true, true) // event type, can bubble?,  cancelable?
    element.dispatchEvent(e) 
}

function createCanvas(width, height) {
    const cnv = document.createElement("canvas")
    cnv.width  = width
    cnv.height = height
    return cnv
}

