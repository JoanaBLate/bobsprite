// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var topBar 
var topBarCtx  

var topBarScheme = [ 
    "roll",
    "",
    "center",
    "",
    "scissor",
    "",
    "",
    "minus",
    "plus",
    "",
    "",
    "halves-h",
    "halves-v",
    "tile-set",
    "",
    "",
    "undo",
    "redo",
    "",
    "",
    "register",
    "previous",
    "next",
    "favorites",
    "",
    "",
    "load",
    "save",
    "save2",
    "",
    "help"
]

const topBarLefts = [ ]

const topBarBlinkings = { } // { id: timer }

///////////////////////////////////////////////////////////////////////////////

function initTopBar() {
    topBar = createCanvas(1300, 30)
    topBarCtx = topBar.getContext("2d")
    //
    topBar.style.position = "absolute"
    //
    bigdiv.appendChild(topBar)
    //
    initTopBar2()
}

function initTopBar2() {
    fillTopBarLefts()
}

function fillTopBarLefts() {
    let left = 162
    //
    for (const id of topBarScheme) {
        topBarLefts.push(left)
        left += (id == "" ? 19 : 37)
    }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningTopBar() {
    topBar.onclick = topBarClicked
    topBar.onmousedown = resetFocusedGadget
}

///////////////////////////////////////////////////////////////////////////////

function paintTopBar() {
    paintTopBarBg()
    //
    paintBobSpriteLogo()
    paintIconsOnTopBar()
    paintCurrentColorOnTopBar()
}

function paintTopBarBg() {
    topBarCtx.fillStyle = wingColor()
    topBarCtx.fillRect(0, 0, 1300, 30)
}

function paintBobSpriteLogo() {
    let bobsprite = specialIcons["bobsprite"]
    if (isDarkInterface)  { bobsprite = specialIcons["bobsprite-dark"] }
    topBarCtx.drawImage(bobsprite, 26, 7)
}

///////////////////////////////////////////////////////////////////////////////

function paintIconsOnTopBar() {
    //
    const off = topBarScheme.length
    for (let n = 0; n < off; n++) {
        const id = topBarScheme[n]
        const left = topBarLefts[n]
        if (id != "") { paintIconOnTopBar(id, left) }
    }
}

function paintIconOnTopBar(id, left) {
    //
    if (topBarIconIsOn(id)) {
        paintBgOn25(topBarCtx, left, 3)
    }
    else {
        paintBgOff25(topBarCtx, left, 3)    
    }
    //
    const icon = getIcon25(id)
    topBarCtx.drawImage(icon, left, 3)
}

function topBarIconIsOn(id) {
    //
    const timer = topBarBlinkings[id]
    if (timer == undefined) { return false }
    return timer > LOOP
}

///////////////////////////////////////////////////////////////////////////////

function paintCurrentColorOnTopBar() {
    const x = 1030
    //
    topBarCtx.fillStyle = "black"
    topBarCtx.fillRect(x + 64, 1, 40, 28)
    topBarCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    topBarCtx.fillRect(x + 65, 2, 38, 26)    
    //
    topBarCtx.fillStyle = wingColor()
    topBarCtx.fillRect(x + 108, 7, 130, 20)
    //
    const alpha = (ALPHA == 255 ? "opaque" : ALPHA)
    const txt = RED + " " + GREEN + " " + BLUE + " " + alpha
    //
    write(topBarCtx, txt, x + 112, 12)
}

///////////////////////////////////////////////////////////////////////////////

function topBarClicked(e) {
    const id = clickedIconOnTopBar(e.offsetX, e.offsetY)
    //
    if (id == "") { return }
    //
    if (id == "help") { setTask(showOrHideHelp); return }
    if (id == "load") { loadImage(); return }
    if (id == "undo") { setTask(undo); return }
    if (id == "redo") { setTask(redo); return }
    if (id == "save") { saveImage("png"); return }
    if (id == "roll") { setTask(useRoll); return }
    if (id == "plus") { setTask(increaseZoom); return }
    if (id == "next") { setTask(showNextFavorite); return }
    if (id == "minus") { setTask(decreaseZoom); return }
    if (id == "save2") { setTask(showAlternativeSave); return }
    if (id == "center") { setTask(centerLayers); return }
    if (id == "scissor") { setTask(adjustTopLayer); return }
    if (id == "tile-set") { setTask(showTileSet); return }
    if (id == "halves-h") { setTask(leftRightToCenter); return }
    if (id == "halves-v") { setTask(topBottomToCenter); return }
    if (id == "register") { setTask(canvasToFavorites); return }
    if (id == "previous") { setTask(showPreviousFavorite); return }
    if (id == "favorites") { setTask(showFavorites); return }
}

///////////////////////////////////////////////////////////////////////////////

function clickedIconOnTopBar(x, y) {
    if (y < 2)  { return "" } 
    if (y > 28) { return "" } 
    //
    const off = topBarLefts.length 
    for (let n = 0; n < off; n++) {
        const left = topBarLefts[n]
        const a = left - 3
        const b = left + 25 + 3
        if (x < a) { continue }
        if (x > b) { continue }
        const id = topBarScheme[n]
        if (id != "") { return id }
    }
    return ""
}

///////////////////////////////////////////////////////////////////////////////

function startBlinkingIconOnTopBar(id) {
    topBarBlinkings[id] = LOOP + 5
    paintIconsOnTopBar()
    scheduleByLoop(paintIconsOnTopBar, 5)
}

