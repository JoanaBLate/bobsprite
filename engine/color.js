// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var RED   = 230
var GREEN =  30
var BLUE  =   0
var ALPHA = 255

///////////////////////////////////////////////////////////////////////////////

function updateCurrentColor(color) {
    if (color == null) { return }
    if (color[3] < 0)  { return } // expecting to be -1 for blank slot in palette
    //
    RED    = color[0]
    GREEN  = color[1]
    BLUE   = color[2]
    ALPHA  = color[3] 
    //
    paintCurrentColorOnTopBar()
    //
    mustDisplayMouseColor = true // or else "(match)" does not appear
}

