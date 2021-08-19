// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


const favorites = [ ] // list of Favorite

var indexOfSelectedFavorite = 0 // always some favorite is selected

///////////////////////////////////////////////////////////////////////////////

function Favorite() {
    this.canvas = null
    this.enabled = true
    this.isLinkToCanvas = false
}

///////////////////////////////////////////////////////////////////////////////

function initFavorites() {
    //
    for (let n = 0; n < 49; n++) { favorites.push(new Favorite()) }
    //
    favorites[0].isLinkToCanvas = true
}

///////////////////////////////////////////////////////////////////////////////

function showPreviousFavorite() {
    showFavorite("previous", previousFavoriteIndex)
}

function showNextFavorite() {
    showFavorite("next", nextFavoriteIndex)
}

function showFavorite(kind, indexFinder) {
    //
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    const oldIndex = indexOfSelectedFavorite 
    indexOfSelectedFavorite = indexFinder()
    //
    const f = favorites[indexOfSelectedFavorite]
    const cnv = f.canvas
    if (cnv == null) { return }
    //
    if (oldIndex == indexOfSelectedFavorite  &&  canvasesAreEqual(cnv, layer.canvas)) { return }
    //
    startBlinkingIconOnTopBar(kind)
    layer.canvas = cloneImage(cnv)
    memorizeLayerFromFavorites(layer)
    shallRepaint = true
}
   
///////////////////////////////////////////////////////////////////////////////

function deleteFavorite(n) {
    //
    const f = favorites[n]
    //
    if (f.isLinkToCanvas) { customAlert("cannot delete link to canvas"); return }
    //
    f.canvas = null
    f.enabled = true
    //
    paintFavorites()
}

function toggleFavoriteEnabled(n) {
    //
    const f = favorites[n]
    //
    if (f.canvas == null  &&  ! f.isLinkToCanvas) { return }
    //
    f.enabled = ! f.enabled
    //
    paintFavorites()
}

function exchangeFavorites(a, b) {
    //
    const favoriteA = favorites[a]
    const favoriteB = favorites[b]
    // 
    favorites[a] = favoriteB
    favorites[b] = favoriteA
    //
    indexOfSelectedFavorite = b
    paintFavorites()
}

///////////////////////////////////////////////////////////////////////////////

function fileToFavorites(cnv) { 
    startBlinkingIconOnTopBar("register")
    //
    const n = emptyFavoriteIndex()
    if (n == -1) { customAlert("no room for this favorite"); return }
    //
    const f = favorites[n] 
    f.canvas = cnv
    //
    indexOfSelectedFavorite = n
}

///////////////////////////////////////////////////////////////////////////////

function canvasToFavorites() { 
    if (getTopLayer() == null) { return }
    //
    startBlinkingIconOnTopBar("register")
    //
    const n = emptyFavoriteIndex()
    if (n == -1) { customAlert("no room for this favorite"); return }
    //
    const f = favorites[n] 
    f.canvas = canvasToPicture()
    //
    indexOfSelectedFavorite = n
}

///////////////////////////////////////////////////////////////////////////////

function emptyFavoriteIndex() {
    for (let n = 0; n < 49; n++) {
        const f = favorites[n]
        if (f.isLinkToCanvas) { continue }
        if (f.canvas == null) { return n }
    }
    return -1
}

function previousFavoriteIndex() {
    //
    let n = indexOfSelectedFavorite
    while (true) {
        n -= 1
        if (n < 0) { break}
        const f = favorites[n]
        if (f.canvas != null) { return n }
    }
    //
    return indexOfSelectedFavorite
}

function nextFavoriteIndex() {
    //
    let n = indexOfSelectedFavorite
    while (true) {
        n += 1
        if (n > 48) { break }
        const f = favorites[n]
        if (f.canvas != null) { return n }
    }
    //
    return indexOfSelectedFavorite
}

