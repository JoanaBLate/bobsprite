// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function setDataInLocalStorage() {
    localStorage["new-width"] =  "" + getNewWidth()
    localStorage["new-height"] =  "" + getNewHeight()
    //
    localStorage["interface-color"] = isDarkInterface ? "dark" : "light"
    //
    localStorage["palette-custom1"] = palettes["custom 1"].join(";")
    localStorage["palette-custom2"] = palettes["custom 2"].join(";")
    localStorage["palette-custom3"] = palettes["custom 3"].join(";")
    localStorage["palette-custom4"] = palettes["custom 4"].join(";")
    localStorage["palette-custom5"] = palettes["custom 5"].join(";")
    localStorage["palette-custom6"] = palettes["custom 6"].join(";")
}

///////////////////////////////////////////////////////////////////////////////

function recoverDataFromLocalStorage() {
    recoverInterfaceColor()
    recoverCustomPalettes()
}

///////////////////////////////////////////////////////////////////////////////

function recoverInterfaceColor() {
    const mem = localStorage["interface-color"]
    if (mem == undefined) { return }
    //
    if (mem == "dark")  { isDarkInterface = true }
    if (mem == "light") { isDarkInterface = false }
}

///////////////////////////////////////////////////////////////////////////////

function recoverNewWidthFromLocalStorage() { // on demand
    //
    const mem = localStorage["new-width"]
    if (mem == undefined) { return 120 }
    //
    let val = parseInt(mem)
    if (isNaN(val)) { return 120 }
    if (val < 1  ||  val > 2000) { return 120 }
    //
    return val
}

///////////////////////////////////////////////////////////////////////////////

function recoverNewHeightFromLocalStorage() { // on demand
    //
    const mem = localStorage["new-height"]
    if (mem == undefined) { return 80 }
    //
    let val = parseInt(mem)
    if (isNaN(val)) { return 80 }
    if (val < 1  ||  val > 2000) { return 80 }
    //
    return val
}

///////////////////////////////////////////////////////////////////////////////

function recoverCustomPalettes() {
    palettes["custom 1"] = recoverCustomPalette("palette-custom1")
    palettes["custom 2"] = recoverCustomPalette("palette-custom2")
    palettes["custom 3"] = recoverCustomPalette("palette-custom3")
    palettes["custom 4"] = recoverCustomPalette("palette-custom4")
    palettes["custom 5"] = recoverCustomPalette("palette-custom5")
    palettes["custom 6"] = recoverCustomPalette("palette-custom6")
}

function recoverCustomPalette(key) {
    const data = localStorage[key]
    if (data == undefined) { return defaultCustomPalette() }
    //
    const list = data.split(";")
    if (list.length != 30) { return defaultCustomPalette() }
    //
    const newlist = [ ]
    for (const s of list) {
        if (s == "blank") { newlist.push("blank"); continue }
        //
        const tokens = s.split(",")
        if (tokens.length != 3) { return defaultCustomPalette() }
        //
        const r = parseInt(tokens.shift())
        const g = parseInt(tokens.shift())
        const b = parseInt(tokens.shift())
        //
        if (isNaN(r)) { return defaultCustomPalette() }
        if (isNaN(g)) { return defaultCustomPalette() }
        if (isNaN(b)) { return defaultCustomPalette() }
        //
        if (r < 0) { return defaultCustomPalette() }
        if (g < 0) { return defaultCustomPalette() }
        if (b < 0) { return defaultCustomPalette() }
        //
        if (r > 255) { return defaultCustomPalette() }
        if (g > 255) { return defaultCustomPalette() }
        if (b > 255) { return defaultCustomPalette() }
        //
        newlist.push("" + r + "," + g + "," + b)
    }
    return newlist
}

///////////////////////////////////////////////////////////////////////////////

