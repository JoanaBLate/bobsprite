// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var favoritesCnv
var favoritesCtx

var favoritesChessBg

var favoritesCursor = ""

var mouseDownOnFavoritesWasOK = false

///////////////////////////////////////////////////////////////////////////////

function initCanvasFavorites() {
    //
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
    favoritesChessBg = createChessBox(100, 100, 25, chessIconColorA, chessIconColorB)
    //
    favoritesCnv.onmouseup = favoritesOnMouseUp
    favoritesCnv.onmousedown = favoritesOnMouseDown
    favoritesCnv.onmousemove = favoritesOnMouseMove
    favoritesCnv.onmouseleave = favoritesOnMouseLeave
}

///////////////////////////////////////////////////////////////////////////////

function showFavorites() {
    //
    MODE = "favorites"
    resetFocusedGadget()
    //
    startBlinkingIconOnTopBar("favorites")
    //
    favoritesCursor = ""
    mouseDownOnFavoritesWasOK = false
    paintFavorites()
    //
    favoritesCnv.style.visibility = "visible"
}

function hideFavorites() {
    MODE = "standard"
    favoritesCnv.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function setFavoritesCursorDefault() {
    //
    if (favoritesCursor == "") { return }
    //
    favoritesCursor = ""
    favoritesCnv.style.cursor = ""
}

function setFavoritesCursorMove() {
    //
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
    standardWrite(favoritesCtx, "favorites", 610, 10)
    //
    if (favorites.length == 0) {
        //
        standardWrite(favoritesCtx, "No favorite to show", 590, 330)
        standardWrite(favoritesCtx, "Type any key to close this panel", 545, 360)
        //
        return
    }
    //
    const msg =  "       Use mouse to drag any favorite       |" + 
                 "       The first 12 favorites will be used in panel Animation        |" + 
                 "       Type any key to close this panel"
    //
    standardWrite(favoritesCtx, msg, 20, 625)
    //
    let n = 0
    let x = 15
    let y = 35
    //
    while (n < favorites.length) {
        //
        paintFavorite(n, x, y)
        //
        x += 130
        if (x >= 1200) { x = 15; y += 120 }
        //
        n += 1
    }
    //
    favoritesCtx.drawImage(specialIcons["big-trashcan"], 1185, 515)
    //
    markFavorite(indexOfSelectedFavorite)
}

function paintFavorite(n, x, y) {
    //
    favoritesCtx.fillStyle = "black"
    favoritesCtx.fillRect(x-1, y-1, 102, 102)   
    //
    if (backgroundColor == "blank") {
        //
        favoritesCtx.drawImage(favoritesChessBg, x, y)
    }
    else {
        favoritesCtx.fillStyle = backgroundColor
        favoritesCtx.fillRect(x, y, 100, 100)    
    }    
    //
    const f = favorites[n]
    favoritesCtx.drawImage(f.icon, x, y)
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
///////////////////////////////////////////////////////////////////////////////

function favoriteIndexByMouse(x, y) {
    const row = favoriteRow(y)
    const col = favoriteCol(x)
    //
    if (row == -1) { return -1 }
    if (col == -1) { return -1 }
    //
    let index = (row * 10) + col
    //
    if (index == 49) { return 49 } // trashcan
    //
    if (index > favorites.length - 1) { return -1 }
    //
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

function favoritesOnMouseDown(e) { 
    //
    const x = e.offsetX
    const y = e.offsetY
    let index = favoriteIndexByMouse(x, y)
    //
    mouseDownOnFavoritesWasOK = false
    //
    if (index == -1) { return } // nothing
    if (index == 49) { return } // trashcan
    //
    mouseDownOnFavoritesWasOK = true
    //
    indexOfSelectedFavorite = index
    //
    paintFavorites()
}

function favoritesOnMouseUp(e) {
    //
    setFavoritesCursorDefault()
    //
    if (! mouseDownOnFavoritesWasOK) { return }
    //
    mouseDownOnFavoritesWasOK = false
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = favoriteIndexByMouse(x, y)
    //
    if (index == -1) { return } // nothing
    //
    if (index == 49) { deleteFavorite(); return } // trashcan
    // 
    if (index == indexOfSelectedFavorite) { return } // self click
    //
    exchangeFavorites(indexOfSelectedFavorite, index) // exchange
}

function favoritesOnMouseMove(e) { 
    //
    const y = e.offsetY
    const dragging = (e.buttons == 1)
    //
    if (dragging  &&  y < 620  &&  mouseDownOnFavoritesWasOK) { 
        //
        setFavoritesCursorMove()
    }
    else {
        setFavoritesCursorDefault()
    }
}

function favoritesOnMouseLeave() {
    //
    setFavoritesCursorDefault()
    //
    mouseDownOnFavoritesWasOK = false
}

