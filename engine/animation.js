// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var animationClock = 0
var indexOfLastAnimatedFrame = -1

var animatedImageForPhoto = null

var frameDuration = 7 // 16 matches middle of slider

///////////////////////////////////////////////////////////////////////////////

function changeFrameDuration(slider) { 
    //
    frameDuration = 31 - Math.round(slider.value * 30)
    if (frameDuration == 31) { frameDuration = 30 }
    paintFrameDuration()
    
   // console.log(frameDuration)
}

///////////////////////////////////////////////////////////////////////////////

function manageAnimation() {
    //
    if (! checkboxAnimation.checked) { return }
    //
    if (LOOP < animationClock + frameDuration) { return }
    //
    animationClock = LOOP
    animatedImageForPhoto = getAnimatedImageForPhoto()
    shallRepaint = true
}

///////////////////////////////////////////////////////////////////////////////

function getAnimatedImageForPhoto() {
    //
    const n = indexOfNextFrame()
    indexOfLastAnimatedFrame = n 
    //
    if (n == -1) { return null }
    //
    const f = favorites[n]
    //
    if (f.isLinkToCanvas) { return canvasToPicture() }
    //
    return f.canvas // OK if canvas == null
}

///////////////////////////////////////////////////////////////////////////////

function indexOfNextFrame() {
    //
    let n = indexOfNextFrameAfter(indexOfLastAnimatedFrame)
    //
    if (n != -1) { return n }
    //
    return indexOfNextFrameAfter(-1)
}

function indexOfNextFrameAfter(n) {
    //
    while (true) {
        n += 1
        if (n > 48) { break }
        //
        const f = favorites[n]
        if (! f.enabled) { continue }
        if (f.canvas != null) { return n }
        if (f.isLinkToCanvas) { return n }
    }
    return -1
}

