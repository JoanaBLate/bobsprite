// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var animationObjs = [ ]

///////////////////////////////////////////////////////////////////////////////

function AnimationObject() {
    //
    this.isOn = true
    this.isCanvas = false
    this.favIndex = -1 // index in favorites
}

function createAnimationObject(favIndex) {
    //
    if (favIndex == undefined) { favIndex = -1 }
    //
    const obj = new AnimationObject()  
    Object.seal(obj)
    //
    obj.favIndex = favIndex
    obj.isCanvas = favIndex == -1
    //
    return obj
}

///////////////////////////////////////////////////////////////////////////////

function initAnimation() {
    //
    animationObjs = [ createAnimationObject(-1) ]
}

///////////////////////////////////////////////////////////////////////////////

function prepareAnimation(pic) {
    //
    pictureForAnimation = pic
    //
    let temp = [ ]
    //
    for (const obj of animationObjs) {
        //
        if (obj.isCanvas) { temp.push(obj); continue }
        //
        if (obj.favIndex < favorites.length) { temp.push(obj); continue }    
    }
    //
    animationObjs = temp
    //
    const count = Math.min(13, favorites.length + 1) // the frame canvas + up to 12 favorites
    //
    while (animationObjs.length < count) { 
        //
        const index = animationObjs.length - 1 // less one because canvas is already there
        //
        const obj = createAnimationObject(index) 
        animationObjs.push(obj)
    }
}

///////////////////////////////////////////////////////////////////////////////

function toggleAnimationFrameOnOff(n) {
    //
    animationObjs[n].isOn = ! animationObjs[n].isOn
    //
    paintPanelAnimation()
}

///////////////////////////////////////////////////////////////////////////////

function changeFrameCanvasPosition(delta) {
    //
    const a = indexOfFrameCanvas()
    const b = a + delta
    //
    if (b < 0) { return }
    if (b > animationObjs.length - 1) { return }
    //
    const objA = animationObjs[a]
    const objB = animationObjs[b]
    //
    animationObjs[a] = objB
    animationObjs[b] = objA
    //
    paintPanelAnimation()
}

function indexOfFrameCanvas() {
    //
    let n = -1
    //
    for (const obj of animationObjs) {
        //
        n += 1
        if (obj.isCanvas) { return n }
    }
}

///////////////////////////////////////////////////////////////////////////////

function indexOfNextAnimationObj() {
    //
    const off = animationObjs.length
    //
    for (let n = 0; n < off; n++) {
        //
        if (n <= indexOfLastAnimatedObj) { continue }
        //
        const obj = animationObjs[n]
        //
        if (obj.isOn) { return n }
    }
    // 
    for (let m = 0; m < off; m++) {
        //
        const obj = animationObjs[m]
        //
        if (obj.isOn) { return m }
    }
    //
    return -1
}

