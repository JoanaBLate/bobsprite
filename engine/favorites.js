// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

const favorites = [ ] 

var indexOfSelectedFavorite = -1 

///////////////////////////////////////////////////////////////////////////////

function Favorite() {
    this.canvas = null
    this.icon = null
}

function createFavorite(cnv) {
    //
    const f = new Favorite()
    Object.seal(f)
    //
    f.canvas = cloneImage(cnv)
    f.icon = makeFavoriteIcon(cnv)
    //
    return f
}

///////////////////////////////////////////////////////////////////////////////

function showPreviousFavorite() {
    //
    showFavorite("previous", -1)
}

function showNextFavorite() {
    showFavorite("next", +1)
}

function showFavorite(kind, delta) {
    //
    shallRepaint = true
    //
    if (favorites.length == 0) { customAlert("no favorite to show"); return }
    //
    if (toplayer == null) { return }
    //
    const max = favorites.length - 1
    //
    let index = indexOfSelectedFavorite + delta
    //
    if (index < 0) { index = 0 }
    if (index > max) { index = max }
    //
    indexOfSelectedFavorite = index
    //
    const f = favorites[indexOfSelectedFavorite]
    //
    const isEdge = (index == 0  ||  index == max)
    if (isEdge  &&  canvasesAreEqual(f.canvas, toplayer.canvas)) { return }
    //
    startBlinkingIconOnTopBar(kind)
    toplayer.canvas = cloneImage(f.canvas)
    memorizeLayerFromFavorites(toplayer)
}
   
///////////////////////////////////////////////////////////////////////////////

function deleteFavorite() {
    //
    favorites.splice(indexOfSelectedFavorite, 1)
    //
    indexOfSelectedFavorite = favorites.length - 1
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
    //
    paintFavorites()
}

///////////////////////////////////////////////////////////////////////////////

function fileToFavorites(cnv) { 
    //
    toFavoritesCore(cnv)
}

function pictureToFavorites() { 
    //
    if (toplayer == null) { return }
    //
    makeCheckedPicture(toFavoritesCore)
}

function toFavoritesCore(cnv) {
    //
    if (favorites.length == 49) { customAlert("no room for another favorite"); return }
    //
    startBlinkingIconOnTopBar("register")
    //
    const f = createFavorite(cnv)
    //
    favorites.push(f)
    //
    indexOfSelectedFavorite = favorites.length - 1
}

