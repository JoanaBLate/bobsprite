// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var imageForAlternativeSave
var frameForAlternativeSave

///////////////////////////////////////////////////////////////////////////////

function showAlternativeSave() { 
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("save2") 
    //
    makeCheckedPicture(showAlternativeSave2)
}
    
function showAlternativeSave2(pic) {    
    //
    imageForAlternativeSave = pic
    //
    MODE = "alternative-save"
    //
    showOverlay(true)
    //
    const width = 2 + imageForAlternativeSave.width
    const height = 2 + imageForAlternativeSave.height
    //
    const left = Math.floor((1300 - width) / 2)
    const top  = Math.floor((660 - height) / 2)
    //
    frameForAlternativeSave = createCanvas(width, height)
    const ctx = frameForAlternativeSave.getContext("2d")
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    ctx.clearRect(1, 1, width-2, height-2)
    //
    frameForAlternativeSave.style.position = "absolute"
    frameForAlternativeSave.style.zIndex = "32"
    frameForAlternativeSave.style.left = (left - 1) + "px"
    frameForAlternativeSave.style.top = (top - 1) + "px"
    bigdiv.appendChild(frameForAlternativeSave)
    //
    imageForAlternativeSave.style.position = "absolute"
    imageForAlternativeSave.style.zIndex = "33"
    imageForAlternativeSave.style.left = left + "px"
    imageForAlternativeSave.style.top = top + "px"
    bigdiv.appendChild(imageForAlternativeSave)
}

function hideAlternativeSave() {
    MODE = "standard"
    bigdiv.removeChild(frameForAlternativeSave)
    bigdiv.removeChild(imageForAlternativeSave)
    hideOverlay()
}

