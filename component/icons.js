// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var icons = { }

var iconSheet = null // also works as areIconsReady

var iconGuide = {
    // row and col are base one //
    "every": [1, 1],
    "rotate-rev": [1,2],
    "animation": [1,4],
    "tile-set": [1, 5],
    "palette": [1, 6],
    "colorize": [2, 1],
    "line": [2, 3],
    "load": [2, 4],
    "rubber": [2, 5],
    "brush": [2, 6],
    "effect": [3, 1],
    "rectangle": [3, 2],
    "save2": [3, 3],
    "scale": [3, 4], 
    "save": [4, 1],
    "ellipse": [4, 2],
    "capture": [4, 3],
    "select": [4, 4],
    "roll": [4, 6],
    "hand": [5, 1],
    "bucket": [5, 2],
    "trashcan": [5, 4],
    "paste": [5, 5],
    "border": [5, 6],
    "spray": [6, 1],
    "rotate": [6, 5],
    "black-dot": [8, 6],
    "blur-pixel": [9, 5],
    "clone": [10, 1],
    "mirror-left": [10, 2],
    "both": [10, 3],
    "scissor": [10, 4],
    "left": [10, 5],
    "right": [10, 6],
    "lasso": [11, 4],
    "previous": [11, 2],
    "next": [11, 3],
    "fast": [11, 6],
    "pen": [12, 1],
    "down": [12, 3],
    "up": [12, 4],
    "thin-pen": [12, 5],
    "register": [12, 6],
    "sprite": [13, 1],
    "mask": [13, 2],
    "blur-border": [13, 3],
    "undo": [13, 4],
    "redo": [13, 5],
    "help": [13, 6],
    "center": [14, 1],
    "feather": [14, 2],
    "protection": [14, 3],
    "lighten": [14, 4],
    "darken": [14, 5],
    "exchange": [15, 1],
    "halves": [15, 2],
    "shear": [15, 4],
    "plus": [16, 1],
    "minus": [16, 2],
    "zoom-in": [16, 3],
    "zoom-out": [16, 4],
    "select-area": [16, 5],
    "config": [16, 6],
    "favorites": [17, 1],
    "mirror-pen": [17, 2],
    "light": [17, 3],
    "color": [17,5],
    "size": [18, 6]
}

///////////////////////////////////////////////////////////////////////////////

function initIcons() {
    const img = new Image()
    img.onload = function () { iconSheetDownloaded(img) }
    img.src = "images/icon-sheet.png?version=20-jun-2021"
}

function iconSheetDownloaded(img) {
    iconSheet = cloneImage(img)
    //
    for (const id of toolboxScheme) { makeIcon(id, 30) }
    //  
    for (const id of topBarScheme) { makeIcon(id, 25) }       
    //  
    for (const id of miniBarScheme) { makeIcon(id, 25) } 
    //
    makeSuperHandIcon()
    makeBigTrashcanIcon()
    //
    makeIcon("up", 20)
    makeIcon("down", 20)
    atenuateIcon("up", 0.2)
    atenuateIcon("down", 0.2)
    //
    makeBobSpriteIcon()
    makeBobSpriteIconDark()
    //
    makeTextIcons()
}

///////////////////////////////////////////////////////////////////////////////

function makeIcon(id, side) {
    if (id == "") { return }
    //
    const row = iconGuide[id][0] // base one
    const col = iconGuide[id][1] // base one
    //
    icons[id] = createIcon(row, col, side)
}

function createIcon(row, col, side) { 
    // row and col come base one //
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    const left = (col - 1) * 50
    const top  = (row - 1) * 50
    //
    ctx.drawImage(iconSheet, left,top,50,50, 0,0,side,side)
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function atenuateIcon(id, ga) {
    const src = icons[id]
    const cnv = createCanvas(src.width, src.height)
    const ctx = cnv.getContext("2d")
    ctx.globalAlpha = ga
    ctx.drawImage(src, 0, 0)
    ctx.globalAlpha = 1
    icons[id] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeSuperHandIcon() {
    icons["superhand"] = createIcon(5, 1, 50)
}

///////////////////////////////////////////////////////////////////////////////

function makeBigTrashcanIcon() {
    const cnv = createCanvas(100, 100)
    const ctx = cnv.getContext("2d")
    const src = createIcon(5, 4, 120)
    ctx.drawImage(src, -10, -10)
    //
    icons["big-trashcan"] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeBobSpriteIcon() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -2, -850)
    icons["bobsprite"] = cnv
}

function makeBobSpriteIconDark() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -125, -850)
    icons["bobsprite-dark"] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeTextIcons() {
    const list = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " " ]
    const guide = [ 0,8, 8,8, 16,8, 24,8, 32,8, 40,8, 48,8, 56,8, 64,8, 72,8, 80,8 ]
    //
    const top = 874
    for (const id of list) {
        const left = guide.shift()
        const width = guide.shift()
        //
        const cnv = createCanvas(width, 10)
        cnv.getContext("2d").drawImage(iconSheet, -left, -top)
        //
        icons[id] = cnv
    }
}

