// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var tileset = null
var tilesetCtx = null

///////////////////////////////////////////////////////////////////////////////

function showTileSet() {
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("tile-set")
    //
    makeCheckedPicture(showTileSet2)
}

function showTileSet2(pic) {
    //
    MODE = "tile-set"
    //
    if (tileset == null) { initTileSet() }
    tileset.style.visibility = "visible"
    //
    updateTileSet(pic)
}

function hideTileSet() {
    MODE = "standard"
    tileset.style.visibility = "hidden"    
}

///////////////////////////////////////////////////////////////////////////////

function initTileSet() {
    tileset = createCanvas(1300, 660)
    tilesetCtx = tileset.getContext("2d")
    //
    tileset.style.position = "absolute"
    tileset.style.zIndex = "31"
    tileset.style.visibility = "hidden"
    //
    bigdiv.appendChild(tileset) 
    //
    tileset.onclick = hideTileSet
}

function updateTileSet(src) {
    //
    tilesetCtx.fillStyle = "rgb(192,192,192)"
    tilesetCtx.fillRect(0, 0, 1300, 660)
    //
    let left = 0
    let top  = 0
    while (true) {
        tilesetCtx.drawImage(src, left, top)
        left += src.width 
        if (left > 1300) { left = 0; top += src.height }
        if (top  >  660) { break }
    }
}

