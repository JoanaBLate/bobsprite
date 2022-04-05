// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var paletteName = "bob"

var loadingPaletteName = ""

var paletteNames = ["bob", "custom 1", "custom 2", "custom 3", "custom 4", "custom 5", "custom 6"] 

const palettes = {

    "bob": [
    
        "255,50,43", "255,0,0", "232,2,0", "192,0,0", "160,0,0", "131,0,0", 
        "247,170,48", "255,144,0", "255,128,0", "224,96,16", "255,79,0", "208,48,0", 
        "5,17,85", "75,75,150", "60,150,170", "0,128,128", "136,146,111", "160,144,112",
        "250,47,122", "230,28,247", "153,47,124", "224,192,80", "212,168,60", "112,108,96",
        "35,93,19", "15,141,0", "81,225,19", "255,255,255", "128,128,128", "0,0,0"
    ]
}

///////////////////////////////////////////////////////////////////////////////
    
function defaultCustomPalette() {
    return [ 
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank"
    ]
}

///////////////////////////////////////////////////////////////////////////////

function erasePalettePixelsInLayer(cnv) {
    const list = rgbColorsFromPalette()
    return eraseMatchingPixels(cnv, list) // so layer can be memorized or not
}

///////////////////////////////////////////////////////////////////////////////

function savePalette() { 
    isPaletteFile = true
    saveStyle = "png"
    //
    const cnv = createCanvas(240, 200)
    const ctx = cnv.getContext("2d")
    //
    let left = 0
    let top  = 0
    //
    for (const raw of palettes[paletteName]) {
        if (raw != "blank") {
            ctx.fillStyle = "rgb(" + raw + ")"
            ctx.fillRect(left, top, 40, 40)
        }
        left += 40
        if (left == 240) { left = 0; top += 40 }
    }
    //
    saveImageFile(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function loadPalette() {
    const msg = "replace colors of palette '" + paletteName + "'?" +
                "\n(translucent colors will be ignored or converted)"
     //
    customConfirm(msg, loadPalette2)
}
 
function loadPalette2() { 
    //
    isPaletteFile = true
    loadingPaletteName = paletteName
    loadImageFile() 
}

function paletteLoaded(cnv) {
    const raws = [ ]
    const off = 4 * (cnv.width * cnv.height)
    const data = cnv.getContext("2d").getImageData(0, 0, cnv.width, cnv.height).data
    //
    for (let n = 0; n < off; n += 4) {
        const r = data[n]
        const g = data[n + 1]
        const b = data[n + 2]
        const a = data[n + 3]
        //
        if (a < 200) { continue }
        //
        const raw = r + "," + g + "," + b
        if (raws.includes(raw)) { continue }
        //
        raws.push(raw)
        if (raws.length == 30) { break }
    }
    //
    while(raws.length < 30) { raws.push("blank") }
    //
    palettes[loadingPaletteName] = raws
    //    
    updateSurfacePalette()
    paintPanelPalette()
}

///////////////////////////////////////////////////////////////////////////////

function rgbColorsFromPalette() {
    //
    const colors = [ ]
    const raws = palettes[paletteName]
    //
    for (const raw of raws) {
        const color = rgbFromRaw(raw)
        if (! colorInColors(color)) { colors.push(color) }
    }
    return colors
    //
    function rgbFromRaw(raw) {
        const color = [0, 0, 0]
        //
        if (raw == "blank") { return color }
        //
        const tokens = raw.split(",")
        color[0] = parseInt(tokens[0])
        color[1] = parseInt(tokens[1])
        color[2] = parseInt(tokens[2])
        //
        return color
    }
    //
    function colorInColors(newcolor) {
        //
        for (const color of colors) {
            if (color[0] != newcolor[0]) { continue }
            if (color[1] != newcolor[1]) { continue }
            if (color[2] != newcolor[2]) { continue }
            //
            return true 
        }
        return false
    }
}

