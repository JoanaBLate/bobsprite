// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var animationCnv
var animationCtx

var frameOffIcon
var frameCanvasIcon
var frameIconChessBg

var frameIconAtMouseDown = -1 // the index

var animationChessBg

var animationFps = 5 // 3, 5, 10, 15, 30

var animationZoom = 1

var animationClock = 0
var indexOfLastAnimatedObj = -1

var pictureForAnimation

///////////////////////////////////////////////////////////////////////////////

function initCanvasAnimation() {
    //
    animationCnv = createCanvas(1300, 660)
    animationCtx = animationCnv.getContext("2d")
    //
    animationCtx["imageSmoothingEnabled"] = false
    //
    animationCnv.style.position = "absolute"
    animationCnv.style.zIndex = "11"
    animationCnv.style.visibility = "hidden"
    //
    bigdiv.appendChild(animationCnv) 
    //
    initCanvasAnimation2()
}

function initCanvasAnimation2() {
    //
    frameOffIcon = makeFrameOffIcon()
    frameCanvasIcon = makeFrameCanvasIcon()
    frameIconChessBg = createChessBox(80, 80, 20, chessIconColorA, chessIconColorB)
    animationChessBg = createChessBox(400, 400, 25, chessIconColorA, chessIconColorB)
    //
    animationCnv.onwheel = animationOnWheel
    animationCnv.onmouseup = animationOnMouseUp
    animationCnv.onmousedown = animationOnMouseDown
    animationCnv.onmousemove = animationOnMouseMove
    animationCnv.onmouseleave = animationOnMouseLeave
}

///////////////////////////////////////////////////////////////////////////////

function showAnimation() {
    //
    if (toplayer == null) { customAlert("cannot show animation: no layer is on"); return }
    //
    if (favorites.length == 0) { customAlert("cannot show animation: no favorite (memorized image)"); return }
    //
    resetFocusedGadget()
    //
    startBlinkingIconOnTopBar("animation")
    //
    makeCheckedPicture(showAnimation2)
}
    
function showAnimation2(pic) {
    //
    MODE = "animation"
    //
    prepareAnimation(pic)
    paintPanelAnimation()
    //
    animationCnv.style.visibility = "visible"
}

function hideAnimation() {
    MODE = "standard"
    animationCnv.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelAnimation() {  // mainLoop will call drawAnimation
    // reseting animation stats
    animationClock = 0
    indexOfLastAnimatedObj = -1
    //
    animationCtx.fillStyle = "rgb(192,192,192)"
    animationCtx.fillRect(0, 0, 1300, 660)
    //
    animationCtx.lineWidth = 1
    animationCtx.strokeStyle = "rgb(48,48,48)"
    animationCtx.strokeRect(2, 2, 1296, 656)
    //
    paintAnimationFps()
    standardWrite(animationCtx, "zoom " + animationZoom + "x", 625, 485)
    //
    standardWrite(animationCtx, "animation", 610, 10)
    //
    const msg =  "   Uses the first 12 favorites and the current canvas      |" + 
                 "     Clicking any frame toggles it on/off    |" + 
                 "     Left and right arrows move the frame CANVAS    |" + 
                 "     Any other key closes this panel"
    //
    standardWrite(animationCtx, msg, 20, 630)
    //
    paintAnimationIcons()
}

///////////////////////////////////////////////////////////////////////////////

function paintAnimationFps() {
    //
    animationCtx.strokeStyle = "grey"
    animationCtx.lineWidth = 2
    //
    for (let n = 0; n < 5; n++) {
        const x = 955 + n * 50
        animationCtx.strokeRect(x, 200, 40, 30)
    }
    //
    standardWrite(animationCtx, "frames per second", 1015, 180)
    const msg = "  3          5          10         15         30"
    standardWrite(animationCtx, msg, 965, 210)
    //
    const index = [3, 5, 10, 15, 30].indexOf(animationFps)
    const left = 955 + (index * 50)
    animationCtx.strokeStyle = "black"
    animationCtx.strokeRect(left, 200, 40, 30)
}

///////////////////////////////////////////////////////////////////////////////

function paintAnimationIcons() {
    //
    let x = 15 - 99
    const y = 530
    //
    for (const obj of animationObjs) { 
        //
        x += 99
        //
        animationCtx.strokeStyle = "black"
        animationCtx.lineWidth = 1
        animationCtx.strokeRect(x-1, y-1, 82, 82)
        //
        if (! obj.isOn) { animationCtx.drawImage(frameOffIcon, x, y); continue }
        //
        if (obj.isCanvas) { animationCtx.drawImage(frameCanvasIcon, x, y); continue }
        //
        if (backgroundColor == "blank") {
            //
            animationCtx.drawImage(frameIconChessBg, x, y)
        }
        else {
            animationCtx.fillStyle = backgroundColor
            animationCtx.fillRect(x, y, 80, 80) 
        }
        //
        const fav = favorites[obj.favIndex]
        //
        animationCtx.drawImage(fav.icon, 0,0,100,100, x,y,80,80)    
    }
}
    
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function animationOnWheel(e) {
    //
    const delta = (e.deltaY > 0) ? -1 : +1
    //
    const zoom = animationZoom + delta
    //
    if (zoom < 1) { return }
    if (zoom > 3) { return }
    //
    animationZoom = zoom
    paintPanelAnimation()
}

///////////////////////////////////////////////////////////////////////////////

function animationOnMouseDown(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    frameIconAtMouseDown = frameIndexByMouse(x, y)
    changeFpsByMouse(x, y)
}

function animationOnMouseUp(e) {
    //
    if (frameIconAtMouseDown == -1) { return }
    //
    const previous = frameIconAtMouseDown
    frameIconAtMouseDown = -1
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = frameIndexByMouse(x, y)
    //
    if (index == -1) { return }
    //
    if (index == previous) { toggleAnimationFrameOnOff(index) }
}

function animationOnMouseMove(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = frameIndexByMouse(x, y)
    //
    if (index == -1) { frameIconAtMouseDown = -1 }
}

function animationOnMouseLeave() {
    //
    frameIconAtMouseDown = -1
}

function frameIndexByMouse(x, y) {
    //
    if (y < 530) { return -1 }
    if (y > 610) { return -1 }
    //
    const adjustedX = x - 15
    //
    if (adjustedX < 0) { return -1 }
    //
    const col = Math.floor(adjustedX / 99)
    //
    if (adjustedX - (col * 99) > 79) { return -1 }
    //
    return col
}

///////////////////////////////////////////////////////////////////////////////

function changeFpsByMouse(x, y) {
    //
    if (y < 201) { return }
    if (y > 229) { return }
    //
    if (x < 957) { return }
    if (x < 995) { changeFps(3); return }
    //
    if (x < 957 + 50) { return }
    if (x < 995 + 50) { changeFps(5); return }
    //
    if (x < 957 + 100) { return }
    if (x < 995 + 100) { changeFps(10); return }
    //
    if (x < 957 + 150) { return }
    if (x < 995 + 150) { changeFps(15); return }
    //
    if (x < 957 + 200) { return }
    if (x < 995 + 200) { changeFps(30); return }
}

function changeFps(fps) {
    //
    if (fps != animationFps) { animationFps = fps; paintPanelAnimation() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function drawAnimation() { // called by mainLoop if MODE=="animation"
    //
    if (favorites.length == 0) { return }
    //
    const intervalInLoops = 30 / animationFps // mainLoop runs at 30 FPS
    //
    if (LOOP < animationClock + intervalInLoops) { return }
    //
    animationClock = LOOP
    //
    animationCtx.strokeStyle = "black"
    animationCtx.lineWidth = 1
    animationCtx.strokeRect(448, 68, 404, 404)
    //
    if (backgroundColor == "blank") {
        //
        animationCtx.drawImage(animationChessBg, 449, 69)
    }
    else {
        animationCtx.fillStyle = backgroundColor
        animationCtx.fillRect(449, 69, 402, 402) 
    }
    //
    drawAnimationFrame()
}

function drawAnimationFrame() { // 402 x 402 px virtual canvas
    //
    indexOfLastAnimatedObj = indexOfNextAnimationObj()
    //
    if (indexOfLastAnimatedObj == -1) { return }
    //
    const obj = animationObjs[indexOfLastAnimatedObj]
    //
    const src = (obj.isCanvas) ? pictureForAnimation : favorites[obj.favIndex].canvas
    //
    const side = 402 / animationZoom
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    const left = Math.floor((side - src.width) / 2) 
    const top  = Math.floor((side - src.height) / 2) 
    //
    ctx.drawImage(src, left, top)
    //
    animationCtx.drawImage(cnv, 0,0,side,side, 449,69,402,402)
}

