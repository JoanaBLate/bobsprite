// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var ctrlPressed  = false
var shiftPressed = false
var upPressed    = false
var downPressed  = false
var leftPressed  = false
var rightPressed = false

///////////////////////////////////////////////////////////////////////////////

function initKeyboard() {
    document.onkeyup = keyUpHandler
    document.onkeydown = keyDownHandler
}

///////////////////////////////////////////////////////////////////////////////

function resetKeyboard() {
    //
    // there was a horrible bug: (on old version yes; on new version, maybe not)
    // trying to move mask/sprite without it on,
    // raises alert
    // but key keeps 'pressed' under alert window,
    // so each main loop asks again checkMove wich
    // generates new alert window (thousands).
    // the solution is reset keyboard before alert
    //
    ctrlPressed  = false
    shiftPressed = false
    upPressed    = false
    downPressed  = false
    leftPressed  = false
    rightPressed = false
}

///////////////////////////////////////////////////////////////////////////////

function keyUpHandler(e) {
    //
    resetMoveByKeyboard()
    //
    shallRepaint = true
    //
    ctrlPressed  = e.ctrlKey
    shiftPressed = e.shiftKey
    //
    const low = e.key.toLowerCase()
    // console.log(low)
    if (low == "arrowup")    { upPressed    = false; return false }
    if (low == "arrowdown")  { downPressed  = false; return false }
    if (low == "arrowleft")  { leftPressed  = false; return false }
    if (low == "arrowright") { rightPressed = false; return false }
    //
    if (low == " ") { hideSuperHand(); return false }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function keyDownHandler(e) {
    //
    shallRepaint = true
    //
    const low = e.key.toLowerCase()
 // console.log(low)
    //
    ctrlPressed = e.ctrlKey
    shiftPressed = e.shiftKey
    // 
    if (low == "f5")  { return true }
    if (low == "f11") { return true }
    if (low == "f12") { return true }
    // 
    if (low == "-"  &&  e.ctrlKey) { return true }
    if (low == "+"  &&  e.ctrlKey) { return true }
    if (low == "="  &&  e.ctrlKey) { return true }
    if (low == "j"  &&  e.ctrlKey  &&  e.shiftKey) { return true }
    if (low == "u"  &&  e.ctrlKey) { return true }
    // 
    if (MODE == "help") { setTask(showOrHideHelp); return true }
    if (MODE == "tile-set") { setTask(hideTileSet); return true }
    if (MODE == "favorites") { setTask(hideFavorites); return true }
    if (MODE == "alternative-save") { setTask(hideAlternativeSave); return true }
    //
    if (MODE == "animation") { keyDownHandlerAnimationMode(low); return true }
    //
    if (MODE == "standard") { keyDownHandlerStandardMode(low); return false }
    //
    return false // should not happen
}

function keyDownHandlerAnimationMode(low) {
    //
    if (low == "arrowleft")  { changeFrameCanvasPosition(-1); return }
    if (low == "arrowright") { changeFrameCanvasPosition(+1); return }
    setTask(hideAnimation)
}

function keyDownHandlerStandardMode(low) {
    //
    // ########################################### //
    // ABORTING COMMAND TO NOT MESS WITH MOUSE JOB //
    // ########################################### //
    //
    if (mouseBusy  ||  superHandOn) { return false }
    //
    //
    const numbox = focusedNumbox()
    if (numbox != null) { numboxOnKeyDown(numbox, low); return }
    //
    if (low == "arrowup")    { upPressed    = true; return }
    if (low == "arrowdown")  { downPressed  = true; return }
    if (low == "arrowleft")  { leftPressed  = true; return }
    if (low == "arrowright") { rightPressed = true; return }
    //
    if (low == "pageup") { setTask(showPreviousFavorite); return }
    if (low == "pagedown") { setTask(showNextFavorite); return }
    //
    if (low == "enter") { setTask(pictureToFavorites); return }
    //
    if (low == "tab") { managerCapture(); return }
    //
    if (low == "backspace") {
        if (shiftPressed) { setTask(redo) } else { setTask(undo) }; return
    }
    //
    if (low == "0") { changeLayerVisibility(0); return }
    if (low == "1") { changeLayerVisibility(1); return }
    if (low == "2") { changeLayerVisibility(2); return }
    if (low == "3") { changeLayerVisibility(3); return }
    if (low == "4") { changeLayerVisibility(4); return }
    if (low == "5") { changeLayerVisibility(5); return }
    //
    if (low == "l"  &&  ctrlPressed)  { loadImage(); return }
    if (low == "s"  &&  ctrlPressed)  { saveImage("png"); return }
    if (low == "y"  &&  ctrlPressed)  { setTask(redo); return }
    if (low == "z"  &&  ctrlPressed)  { setTask(undo); return }
    //
    if (low == " ") { showSuperHand(); return }
    if (low == "a") { setTask(showAnimation); return }
    if (low == "c") { setTask(centerLayers); return }
    if (low == "d") { setTask(toggleDarkness); return }
    if (low == "f") { setTask(showFavorites); return }
    if (low == "h") { applyEffect(horizontalReverse); return }
    if (low == "r") { applyEffect(rotate90); return }
    if (low == "v") { applyEffect(verticalReverse); return }
    if (low == "x") { applyEffect(mixedReverse); return }
    if (low == "-") { setTask(decreaseZoom); return }
    if (low == "+") { setTask(increaseZoom); return }    
}

