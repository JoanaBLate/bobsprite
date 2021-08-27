// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var icons50 = { }
var icons30 = { }
var icons25 = { }
var specialIcons = { }

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
    "halves-h": [15, 2],
    "halves-v": [15, 2],
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
    //
    iconSheet = cloneImage(img)
    //
    for (const id of Object.keys(iconGuide)) { createIcon50(id) }
    //
    rotateIcon50("halves-v")
    //  
    makeBigTrashcanIcon()
    //
    makeScaledIcon("up", 20, specialIcons)
    makeScaledIcon("down", 20, specialIcons)
    atenuateIcon(specialIcons["up"], 0.2)
    atenuateIcon(specialIcons["down"], 0.2)
    //
    makeBobSpriteIcon()
    makeBobSpriteIconDark()
    //
    makeTextIcons()
}

///////////////////////////////////////////////////////////////////////////////

function getIcon25(id) {
    //
    let icon = icons25[id]
    if (icon == undefined) { makeScaledIcon(id, 25, icons25); icon = icons25[id] }
    return icon
}

function getIcon30(id) {
    //
    let icon = icons30[id]
    if (icon == undefined) { makeScaledIcon(id, 30, icons30); icon = icons30[id] }
    return icon
}

///////////////////////////////////////////////////////////////////////////////

function createIcon50(id) {
    //
    const cnv = createCanvas(50, 50)
    const ctx = cnv.getContext("2d")
    //
    const row = iconGuide[id][0] // base one
    const col = iconGuide[id][1] // base one
    //
    const left = (col - 1) * 50
    const top  = (row - 1) * 50
    //
    ctx.drawImage(iconSheet, -left, -top)
    //
    icons50[id] = cnv
}

function rotateIcon50(id) {
    const src = icons50[id]
    const ctx = src.getContext("2d")
    const clone = cloneImage(src)
    //
    ctx.clearRect(0, 0, 50, 50)
    ctx.save()
    ctx.translate(25, 25)
    ctx.rotate(Math.PI/2)
    ctx.drawImage(clone, -25, -25)
    ctx.restore()
}

///////////////////////////////////////////////////////////////////////////////

function makeScaledIcon(id, side, dict) {
    //
    if (id == "") { return }
    //
    const src = icons50[id]
    //
    const cnv = createCanvas(side, side)
    cnv.getContext("2d").drawImage(src, 0,0,50,50, 0,0,side,side)
    //
    dict[id] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function atenuateIcon(cnv, ga) {
    const clone = cloneImage(cnv)
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    //
    ctx.globalAlpha = ga
    ctx.drawImage(clone, 0, 0)
    ctx.globalAlpha = 1
}

///////////////////////////////////////////////////////////////////////////////

function makeBigTrashcanIcon() {
    const src = icons50["trashcan"]
    const cnv = createCanvas(100, 100)
    cnv.getContext("2d").drawImage(src, 5,5,40,40, 0,0,100,100)
    //
    specialIcons["big-trashcan"] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeBobSpriteIcon() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -2, -850)
    specialIcons["bobsprite"] = cnv
}

function makeBobSpriteIconDark() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -125, -850)
    specialIcons["bobsprite-dark"] = cnv
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
        specialIcons[id] = cnv
    }
}

