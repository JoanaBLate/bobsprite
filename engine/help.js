// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var currentHelp = 0

///////////////////////////////////////////////////////////////////////////////

function showOrHideHelp() {
    currentHelp += 1
    //
    if (currentHelp == 1) { showHelp1(); return }
    if (currentHelp == 2) { showHelp2(); return }
    if (currentHelp == 3) { showHelp3(); return }
    if (currentHelp == 4) { showHelp4(); return }
    //
    currentHelp = 0
    hideHelp()
}

function showHelp1() {    
    MODE = "help"
    startBlinkingIconOnTopBar("help")
    showOverlay()
    paintCanvasHelp1()
    showCanvasHelp()
}

function showHelp2() {
    paintCanvasHelp2()    
}

function showHelp3() {
    paintCanvasHelp3()    
}

function showHelp4() {
    paintCanvasHelp4()    
}
    
function hideHelp() {
    MODE = "standard"
    //
    hideOverlay()
    hideCanvasHelp()
}

///////////////////////////////////////////////////////////////////////////////

function drawIconOnCanvasHelp(id, x, y) {
    //
    canvasHelpCtx.drawImage(getIcon30(id), x, y)
    //
    return 35
}

