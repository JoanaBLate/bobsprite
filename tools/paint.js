// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// helper module for spray, hard brush and soft brush //

// setting data is *much* faster than use fillRect or drawImage //
// getImageData used to be 12x more expensive than putImageData //


var toolSizeFor = {
    "blur-pixel" : 3,
    "darken"     : 3,
    "feather"    : 3,
    "lighten"    : 3,
    "line"       : 3,
    "pen"        : 3,
    "rubber"     : 3,
    "brush"      : 3,
    "spray"      : 7,
    "thin-pen"   : 1,
    "mirror-pen" : 1
}

var toolSizesFor = {
    "blur-pixel" : [ 1, 3, 5, 7, 15, 21 ],
    "darken"     : [ 1, 3, 5, 7, 15, 21 ],
    "feather"    : [ 1, 3, 5, 7, 15, 21 ],
    "lighten"    : [ 1, 3, 5, 7, 15, 21 ],
    "line"       : [ 1, 3, 5, 7, 15, 21 ],
    "pen"        : [ 1, 3, 5, 7, 15, 21 ],
    "rubber"     : [ 1, 3, 5, 7, 15, 21 ],
    "brush"      : [ 1, 3, 5, 7, 15, 21 ],
    "spray"      : [ 3, 5, 7, 15, 21 ],
    "thin-pen"   : [ 1, 1 ],
    "mirror-pen" : [ 1, 1 ]
}

var intensityFor = {
    "blur-border" : 0.500,
    "blur-pixel"  : 0.500,
    "darken"      : 0.030,
    "feather"     : 0.200,
    "lighten"     : 0.030
}

var intensitiesFor = {
    "blur-border" : [ 0.200, 0.300, 0.400, 0.500, 0.600, 0.700, 0.750, 0.800, 0.850, 0.900 ],
    "blur-pixel"  : [ 0.200, 0.300, 0.400, 0.500, 0.600, 0.700, 0.750, 0.800, 0.850, 0.900 ],
    "darken"      : [ 0.015, 0.030, 0.045, 0.060 ],
    "feather"     : [ 0.015, 0.025, 0.050, 0.075, 0.100, 0.150, 0.200, 0.300, 0.400, 0.500 ],
    "lighten"     : [ 0.015, 0.030, 0.045, 0.060 ]
}

///////////////////////////////////////////////////////////////////////////////

function changeToolSize(delta) { 
    //
    const size = toolSizeFor[tool]
    if (size == undefined) { return }
    //
    const sizes = toolSizesFor[tool]
    const index = sizes.indexOf(size) + delta
    //
    if (index < 0) { return }
    if (index > sizes.length - 1) { return }
    //
    toolSizeFor[tool] = sizes[index]
}

///////////////////////////////////////////////////////////////////////////////

function changeIntensity(delta) {  
    // 
    const int = intensityFor[tool]
    if (int == undefined) { return }
    //
    const values = intensitiesFor[tool]
    const index = values.indexOf(int) + delta
    //
    if (index < 0) { return }
    if (index > values.length - 1) { return }
    //
    intensityFor[tool] = values[index]
}

///////////////////////////////////////////////////////////////////////////////

function paintHardPixel(data, index, erasing) {
    //
    let R = RED
    let G = GREEN
    let B = BLUE
    let A = ALPHA
    //
    if (erasing) {
        R = 0
        G = 0
        B = 0
        A = 0
    }
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (r == R  &&  g == G  &&  b == B  &&  a == A) { return false }
    //
    if (shallProtectBlank  &&  a == 0) { return false } 
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false } 
    //
    data[index]     = R
    data[index + 1] = G
    data[index + 2] = B
    data[index + 3] = A
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function paintAnyHardPixel(data, erasing) { // for spray not fail by chance
    //
    const indexes = [ ]
    let index = 0 // index of first channel of rgba color 
    //
    while (index < data.length) {
        indexes.push(index)
        index += 4
    }
    //
    while (indexes.length > 0) {
        //
        const position = Math.floor(Math.random() * indexes.length) // position inside list indexes
        //
        index = indexes[position]
        indexes.splice(position, 1) // removing used index
        //
        const changed = paintHardPixel(data, index, erasing)        
        if (changed) { return true }
    }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function paintSoftPixel(data, index, rate) {
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false } // blank
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    let R, G, B
    //
    const rate2 = 1 - rate
    R = Math.floor(RED   * rate  +  r * rate2)
    G = Math.floor(GREEN * rate  +  g * rate2)
    B = Math.floor(BLUE  * rate  +  b * rate2)
    //
    if (a == 0  &&  R + G + B == 0) { R = 1; G = 1; B = 1 } // avoids false outline
    //
    if (r == R  &&  g == G  &&  b == B) { return false }
    //
    data[index]     = R
    data[index + 1] = G
    data[index + 2] = B
    //
    return true
}

