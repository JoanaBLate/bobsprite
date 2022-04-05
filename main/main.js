// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

//  800 x 600 is 0.3% of all screens
// 1024 x 768 is 4%   of all screens
// 1280 x something is next 

var MODE = "standard" // help, favorites, animation, tile-set, alternative-save

var LOOP = 0

const LOOP_DURATION_IN_MS = 1000 / 30

///////////////////////////////////////////////////////////////////////////////

function main() {
    //
    if (isFramed()) { return }
    //
    document.body.onblur = resetKeyboard // maybe redundant: other modules also call resetKeyboard
    //
    recoverDataFromLocalStorage() // it is also a kind of initialization
    //
    initLoadAndSave()
    //
    initIcons()
    initFonts()
    //
    main2()
}

function main2() {
    //
    if (iconSheet != null  &&  fontSheet != null) { afterIconsAndFonts(); return }
    //
    setTimeout(main2, 30)
}

function afterIconsAndFonts() {
    //
    initLayers()
    initAnimation()
    initInterface() 
    //    
    window.onresize = resetBigDivPosition // cannot come before initInterface!
    //
    window.onbeforeunload = function () { setDataInLocalStorage(); return "leaving?" } 
    //
    initKeyboard()
    mainLoop()
    showOrHideHelp() 

}

///////////////////////////////////////////////////////////////////////////////

function mainLoop() { 
    //
    LOOP += 1
    //
    manageMemorySpooling() // must be the first
    updateSchedule()
    runTask()   
    //
    if (mouseBusy  ||  superHandOn) { } else { moveTopLayerByKeyboard() }
    //
    updateMouseColorByStage()
    //
    displayMouseColor()
    displayGeneralInfo()
    //
    manageNumboxesBlinking()
    //
    if (shallRepaint) { 
        paintStage()
        paintPhoto()
        shallRepaint = false 
    }
    //
    if (MODE == "animation") { drawAnimation() } 
    //    
    if (TASK == null  &&  memorySpool == null) { // also for MODE "animation"
        requestAnimationFrame(refresh)
    }
    else {
        requestAnimationFrame(mainLoop)
    }
}

function refresh() {
    requestAnimationFrame(mainLoop)
}

///////////////////////////////////////////////////////////////////////////////

function isFramed() {
    if (window.top == window.self) { return false }
    //
    window.top.location.replace(window.self.location.href)
    return true
}

