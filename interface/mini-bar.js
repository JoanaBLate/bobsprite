// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var miniBar   
var miniBarCtx

const miniBarScheme = [
    "palette",
    "color",
    "size",
    "effect",
    "colorize",
    "shear",
    "config"
]

const miniBarLefts = [ ]

var selectedOnMiniBar = "palette"

///////////////////////////////////////////////////////////////////////////////

function initMiniBar() {
    fillMiniBarLefts()
    //
    miniBar = createCanvas(240, 30)
    miniBarCtx = miniBar.getContext("2d")
    //
    miniBar.style.position = "absolute"
    miniBar.style.top = "295px"
    miniBar.style.left = "1060px"
    //
    bigdiv.appendChild(miniBar)
    //
    initMiniBar2()    
}

function initMiniBar2() {
    fillMiniBarLefts()
}

function fillMiniBarLefts() {
    let left = 8
    //
    const off = miniBarScheme.length
    for (let n = 0; n < off; n++) {
        miniBarLefts.push(left)
        left += 33
    }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningMiniBar() {
    miniBar.onmousedown = resetFocusedGadget
    miniBar.onclick = miniBarClicked
}

///////////////////////////////////////////////////////////////////////////////

function paintMiniBar() {
    paintMiniBarBg() 
    //
    miniBarCtx.fillStyle = wingColor()
    miniBarCtx.fillRect(0, 0, 240, 30)
    //
    greyTraceH(miniBarCtx, 5, 29, 230)
    //
    const off = miniBarScheme.length 
    for (let n = 0; n < off; n++) {
        const id = miniBarScheme[n]
        const left = miniBarLefts[n]
        paintIconOnMiniBar(id, left)
    }
}

function paintMiniBarBg() {
    miniBarCtx.fillStyle = wingColor()
    miniBarCtx.fillRect(0, 0, 240, 45)
}

function paintIconOnMiniBar(id, left) {
    if (id == selectedOnMiniBar) { paintBgOn25(miniBarCtx, left, 2) }
    //
    const icon = icons[id]
    miniBarCtx.drawImage(icon, left, 2)
}

///////////////////////////////////////////////////////////////////////////////

function miniBarClicked(e) {
    const wanted = clickedIconOnMiniBar(e.offsetX, e.offsetY)
    //
    if (wanted == "") { return }
    //
    hidePolyPanel()
    selectedOnMiniBar = wanted
    paintMiniBar()
    paintAndShowPolyPanel()
}

function clickedIconOnMiniBar(x, y) {
    if (y < 3)  { return "" }
    if (y > 28) { return "" }
    //
    const off = miniBarLefts.length 
    for (let n = 0; n < off; n++) {
        const left = miniBarLefts[n]
        const a = left - 1 // start including 1 pixel
        const b = left + 25 + 1 // end inluding 1 pixel
        //
        if (x < a) { continue }
        if (x > b) { continue }
        return miniBarScheme[n]
    }
    return ""
}

