// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var favoritesCnv
var favoritesCtx

var frameBg
var frameOff     // "off"
var frameBlank
var frameCanvas  // "CANVAS"

var favoritesCursor = ""

var indexOfFavoriteOnMouseDown = -1

///////////////////////////////////////////////////////////////////////////////

function initCanvasFavorites() {
    favoritesCnv = createCanvas(1300, 660)
    favoritesCtx = favoritesCnv.getContext("2d")
    //
    favoritesCnv.style.position = "absolute"
    favoritesCnv.style.zIndex = "11"
    favoritesCnv.style.visibility = "hidden"
    //
    bigdiv.appendChild(favoritesCnv) 
    //
    initCanvasFavorites2()
}

function initCanvasFavorites2() {
    //
    frameOff = makeFrameOff()
    frameCanvas = makeFrameCanvas()
    frameBg = createChessBox(100, 100, 25)
    frameBlank = createColoredCanvas(100, 100, "rgb(240,110,0)") // blue -> rgb(63,50,174) 
    //
    favoritesCnv.onmouseup = favoritesOnMouseUp
    favoritesCnv.onmousedown = favoritesOnMouseDown
    favoritesCnv.onmousemove = favoritesOnMouseMove
    favoritesCnv.onmouseleave = favoritesOnMouseLeave
}

///////////////////////////////////////////////////////////////////////////////

function makeFrameOff() {
    const cnv = createColoredCanvas(100, 100, "rgba(0,0,0,0.75)")
    const ctx = cnv.getContext("2d")
    //
    const label = createCanvasLabel("Off", 20, "white") 
    const l = Math.floor((100 - label.width) / 2)
    const t = Math.floor((100 - label.height) / 2)
    //
    ctx.drawImage(label, l, t)
    return cnv
}

function makeFrameCanvas() {
    const cnv = createColoredCanvas(100, 100, "black")
    const ctx = cnv.getContext("2d")
    //
    const label = createCanvasLabel("CANVAS", 20, "beige") 
    const l = Math.floor((100 - label.width) / 2)
    const t = Math.floor((100 - label.height) / 2)
    //
    ctx.drawImage(label, l, t)
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function showFavorites() {
    if (getTopLayer() == null) { return }
    //
    MODE = "favorites"
    resetFocusedGadget()
    //
    startBlinkingIconOnTopBar("favorites")
    paintFavorites()
    favoritesCursor = ""
    favoritesCnv.style.visibility = "visible"
}

function hideFavorites() {
    MODE = "standard"
    favoritesCnv.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function setFavoritesCursorDefault() {
    if (favoritesCursor == "") { return }
    //
    favoritesCursor = ""
    favoritesCnv.style.cursor = ""
}

function setFavoritesCursorMove() {
    if (favoritesCursor == "move") { return }
    //
    favoritesCursor = "move"
    favoritesCnv.style.cursor = "move"
}
    
///////////////////////////////////////////////////////////////////////////////

function paintFavorites() {
    //
    favoritesCtx.fillStyle = "rgb(192,192,192)"
    favoritesCtx.fillRect(0, 0, 1300, 660)
    //
    favoritesCtx.lineWidth = 1
    favoritesCtx.strokeStyle = "rgb(48,48,48)"
    favoritesCtx.strokeRect(2, 2, 1296, 656)
    //
    standardWrite(favoritesCtx, "favorites / animation", 577, 10)
    //
    const msg = "Clicking a favorite enables/disables it as animation frame." +
                "        You can drag any favorite." +
                "        Type any key to close this window."
    //
    standardWrite(favoritesCtx, msg, 20, 630)
    //
    let index = 0
    for (let y = 35; y < 600; y += 120) {
        for (let x = 15; x < 1200; x += 130) {
            //
            const f = favorites[index]
            const icon = makeFavoriteIconFor(f)
            favoritesCtx.drawImage(icon, x, y)
            //
            if (! f.enabled  &&  (f.canvas != null  ||  f.isLinkToCanvas)) {
               favoritesCtx.drawImage(frameOff, x, y) 
            }
            //
            index += 1
            if (index == 49) { break }
        }
    }
    //
    favoritesCtx.drawImage(icons["big-trashcan"], 1185, 510)
    //
    markFavorite(indexOfSelectedFavorite)
}

function markFavorite(n) {
    const row = Math.floor(n / 10)
    const col = n - (row * 10)
    //
    const x = 15 + (col * 130)
    const y = 35 + (row * 120)
    //
    favoritesCtx.lineWidth = 4
    favoritesCtx.strokeStyle = "rgb(48,48,48)"
    favoritesCtx.strokeRect(x-5, y-5, 110, 110)
}

///////////////////////////////////////////////////////////////////////////////

function makeFavoriteIconFor(f) {
    //
    if (f.isLinkToCanvas) { return frameCanvas }
    if (f.canvas == null) { return frameBlank }
    //
    const src = f.canvas
    const cnv = cloneImage(frameBg)
    const ctx = cnv.getContext("2d")
    //
    let x = 0
    let y = 0
    let width = src.width
    let height = src.height
    //
    if (width > height) {
        y = - Math.floor((width - height) / 2)
        height = width
    }
    else if (height > width) {
        x = - Math.floor((height - width) / 2)
        width = height
    }
    //    
    ctx.drawImage(src, x,y,width,height, 0,0,100,100)
    //    
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function selectFavorite(n) {
    //
    if (n == indexOfSelectedFavorite) { return }
    //
    indexOfSelectedFavorite = n 
    paintFavorites()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function favoriteIndexByMouse(x, y) {
    const row = favoriteRow(y)
    const col = favoriteCol(x)
    //
    if (row == -1) { return -1 }
    if (col == -1) { return -1 }
    //
    let index = (row * 10) + col
    if (index > 49) { return -1 }
    return index
}

function favoriteRow(y) {
    const adjustedY = y - 35
    if (adjustedY < 0) { return -1 }
    //
    const row = Math.floor(adjustedY / 120)
    if (row > 4) { return -1 }
    //
    const relativeY = adjustedY - (row * 120)
    if (relativeY > 99) { return -1 }
    //
    return row
}

function favoriteCol(x) {
    const adjustedX = x - 15
    if (adjustedX < 0) { return -1 }
    //
    const col = Math.floor(adjustedX / 130)
    if (col > 9) { return -1 }
    //
    const relativeX = adjustedX - (col * 130)
    if (relativeX > 99) { return -1 }
    //
    return col
}

///////////////////////////////////////////////////////////////////////////////

function favoritesOnMouseUp(e) {
    const x = e.offsetX
    const y = e.offsetY
    const index = favoriteIndexByMouse(x, y)
    const previousIndex = indexOfFavoriteOnMouseDown
    //
    indexOfFavoriteOnMouseDown = -1
    setFavoritesCursorDefault()
    // 
    if (index == -1) { return }
    //
    if (previousIndex == -1) { return }
    //
    if (index == previousIndex) { selectFavorite(index); toggleFavoriteEnabled(index); return }
    //
    if (index == 49) { deleteFavorite(previousIndex); return }
    //
    exchangeFavorites(previousIndex, index)
}

function favoritesOnMouseDown(e) { 
    const x = e.offsetX
    const y = e.offsetY
    let index = favoriteIndexByMouse(x, y)
    //
    if (index == 49) { index = -1 } // trashcan
    //
    indexOfFavoriteOnMouseDown = index
}

function favoritesOnMouseMove(e) { 
    //
    const y = e.offsetY
    const dragging = (e.buttons == 1)
    //
    if (! dragging) { setFavoritesCursorDefault(); return }
    //
    if (y > 619) { setFavoritesCursorDefault(); return }
    //
    if (indexOfFavoriteOnMouseDown != -1) { 
        //
        selectFavorite(indexOfFavoriteOnMouseDown) // reselecting dynamically
        setFavoritesCursorMove()
        return 
    }
    //
    setFavoritesCursorDefault()
}

function favoritesOnMouseLeave() {
    indexOfFavoriteOnMouseDown = -1
    setFavoritesCursorDefault()
}

