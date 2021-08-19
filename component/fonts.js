// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var standardFont = { }
var strongFont = { }
var fontForDark = { }

var fontSheet = null // also works as areFontsReady

const fontReferenceA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const fontReferenceB = "abcdefghijklmnopqrstuvwxyz"
const fontReferenceC = "0123456789.,:;(){}[]<>"
const fontReferenceD = "?/|\\~^'\"!@#$%&*_-+="


const fontGuideA = [0,9,16,7,30,7,44,8,59,7,74,6,87,8,102,7,116,7,131,6,145,8,160,7,174,7,188,7,202,8,217,7,231,8,246,7,260,8,274,8,289,7,303,8,317,9,332,8,346,8,361,7]

const fontGuideB = [1,7,16,7,30,7,44,7,58,8,73,8,87,8,102,7,116,6,130,6,145,8,159,8,173,8,188,7,202,8,217,7,231,8,246,7,260,7,274,8,289,7,303,8,317,9,332,8,346,8,361,7]

const fontGuideC = [1,7,16,7,30,7,44,7,58,8,73,7,87,8,102,7,116,7,130,8,147,4,161,4,175,4,190,4,204,5,218,5,232,6,246,6,262,5,275,5,290,6,304,6]

const fontGuideD = [2,6,16,6,32,3,45,6,59,7,73,7,89,4,102,6,118,4,130,8,145,7,160,7,173,8,188,8,203,7,217,7,232,7,246,7,260,7]

///////////////////////////////////////////////////////////////////////////////

function initFonts() {
    const img = new Image()
    img.onload = function () { fontSheetDownloaded(img) }
    img.src = "images/font-sheet.png"
}

function fontSheetDownloaded(img) {
    fontSheet = cloneImage(img)
    fillFont(strongFont, 0)
    fillFont(standardFont, 60)
    fillFont(fontForDark, 120)
}

///////////////////////////////////////////////////////////////////////////////

function fillFont(font, top) {
    fillFontOnce(font, top, fontReferenceA, fontGuideA)
    top += 15
    fillFontOnce(font, top, fontReferenceB, fontGuideB)
    top += 15
    fillFontOnce(font, top, fontReferenceC, fontGuideC)
    top += 15
    fillFontOnce(font, top, fontReferenceD, fontGuideD)
}

///////////////////////////////////////////////////////////////////////////////

function fillFontOnce(font, top, reference, guide) {
    //
    const bar = createCanvas(370, 15)
    const ctx = bar.getContext("2d")
    ctx.drawImage(fontSheet, 0, -top)
    //
    const symbols = reference.split("")
    let n = -1
    for (const symbol of symbols) {
        n += 1 
        const begin = guide[n]
        n += 1
        const width = guide[n]
        //
        const cnv = createCanvas(width, 15)
        const ctx = cnv.getContext("2d")
        //
        const iDelta = (symbol == "i") ? -1 : 0 // ADULTERATING THE FONT 'i' !!!!!!!
        //
        ctx.drawImage(bar, -begin + iDelta, 0)
        //
        font[symbol] = cnv
    }
}

///////////////////////////////////////////////////////////////////////////////

function write(ctx, txt, left, top) {
    const font = isDarkInterface ? fontForDark : standardFont
    //
    writeCore(ctx, font, txt, left, top)
}

function standardWrite(ctx, txt, left, top) {
    writeCore(ctx, standardFont, txt, left, top)
}

function writeOnCanvasHelp(txt, left, top) {
    writeCore(canvasHelpCtx, strongFont, txt, left, top)
    return 15
}

function weakWriteOnCanvasHelp(txt, left, top) {
    writeCore(canvasHelpCtx, standardFont, txt, left, top)
    return 15
}

///////////////////////////////////////////////////////////////////////////////

function writeCore(ctx, font, txt, left, top) {
    //
    for (const c of txt) {
        if (c == " ") { left += 4; continue }
        //
        const spr = font[c]
        ctx.drawImage(spr, left, top)
        left += spr.width
    }
}

///////////////////////////////////////////////////////////////////////////////

function lengthOfText(txt) {
    let length = 0
    //
    for (const c of txt) {
        if (c == " ") { length += 4; continue }
        //
        length += (standardFont[c]).width
    }
    //
    return length    
}

