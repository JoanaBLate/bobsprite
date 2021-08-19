// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var imageForAlternativeSave
var chessBoxForAlternativeSave 

///////////////////////////////////////////////////////////////////////////////

function showAlternativeSave() { 
    //
    if (getTopLayer() == null) { return }
    //
    startBlinkingIconOnTopBar("save2") 
    //
    MODE = "alternative-save"
    //
    showOverlay()
    //
    imageForAlternativeSave = canvasToPicture()
    //
    chessBoxForAlternativeSave = createChessBox(imageForAlternativeSave.width, imageForAlternativeSave.height, 10)
    //
    chessBoxForAlternativeSave.style.position = "absolute"
    chessBoxForAlternativeSave.style.zIndex = "31"
    bigdiv.appendChild(chessBoxForAlternativeSave)
    //
    imageForAlternativeSave.style.position = "absolute"
    imageForAlternativeSave.style.zIndex = "32"
    bigdiv.appendChild(imageForAlternativeSave)
}

function hideAlternativeSave() {
    MODE = "standard"
    bigdiv.removeChild(imageForAlternativeSave)
    bigdiv.removeChild(chessBoxForAlternativeSave)
    hideOverlay()
    //
    canvasToFavorites()
}

