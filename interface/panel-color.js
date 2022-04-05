// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// NOT REALLY A PANEL!

var hslOrRgba = "hsl"

var referenceRed   = 255 // 90
var referenceGreen =  81 // 130
var referenceBlue  =  55 // 200
var referenceAlpha = 255

///////////////////////////////////////////////////////////////////////////////

function tradeColors() {
    //
    const color = [ referenceRed, referenceGreen, referenceBlue, referenceAlpha ]
    //
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA 
    //
    updateCurrentColor(color)
}

///////////////////////////////////////////////////////////////////////////////

function paintAndShowPanelColor() {
    //
    if (hslOrRgba == "hsl") { 
        //
        paintPanelHsl() 
        panelHsl.style.visibility = "visible"         
    } 
    else { 
        //
        paintPanelRgba() 
        panelRgba.style.visibility = "visible"
    }
}

function hidePanelColor() {
    //
    if (hslOrRgba == "hsl") { 
        panelHsl.style.visibility = "hidden"         
    } 
    else { 
        panelRgba.style.visibility = "hidden"
    }
}

///////////////////////////////////////////////////////////////////////////////

function maybeRepaintColorPanel() {
    //
    if (selectedOnMiniBar != "color") { return }
    //
    if (hslOrRgba == "hsl") { paintPanelHsl() } else { paintPanelRgba() }
} 

