// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var tileset = null
var tilesetCtx = null

///////////////////////////////////////////////////////////////////////////////

function showTileSet() {
    if (getTopLayer() == null) { return }
    //
    MODE = "tile-set"
    startBlinkingIconOnTopBar("tile-set")
    showOverlay()
    //
    if (tileset == null) { initTileSet() }
    updateTileSet()
    tileset.style.visibility = "visible"
}

function hideTileSet() {
    MODE = "standard"
    hideOverlay()
    tileset.style.visibility = "hidden"    
}

///////////////////////////////////////////////////////////////////////////////

function initTileSet() {
    tileset = createCanvas(1300, 630)
    tilesetCtx = tileset.getContext("2d")
    //
    tileset.style.position = "absolute"
    tileset.style.top = "30px"
    tileset.style.zIndex = "31"
    tileset.style.visibility = "hidden"
    //
    bigdiv.appendChild(tileset) 
    //
    tileset.onclick = hideTileSet
}

function updateTileSet() {
    //
    tilesetCtx.fillStyle = "rgb(192,192,192)"
    tilesetCtx.fillRect(0, 0, 1300, 630)
    //
    const src = canvasToPicture()
    //
    let left = 0
    let top  = 0
    while (true) {
        tilesetCtx.drawImage(src, left, top)
        left += src.width 
        if (left > 1300) { left = 0; top += src.height }
        if (top  >  630) { break }
    }
}

