// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


var surfaceHslCtx
var surfaceHueCtx
var surfaceDetailCtx

var surfaceHslX 
var surfaceHslY 

var hslGradient    // 228 x 125
var hslGradientCtx

var greyTranslucentGradient // 228 x 125

var hslMarker

///////////////////////////////////////////////////////////////////////////////

function initHslComplements() {
    //
    hslMarker = createMarker(11)
    //
    greyTranslucentGradient = createGreyTranslucentGradient()
    //
    hslGradient = createCanvas(228, 125)
    hslGradientCtx = hslGradient.getContext("2d")
}

function drawHslGradient(hue) {
    //
    hslGradientCtx.fillStyle = "hsl(" + hue + ",100%,50%)" // solid
    hslGradientCtx.fillRect(0, 0, 228, 125)
    //
    hslGradientCtx.drawImage(greyTranslucentGradient, 0, 0) // translucent
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHue() { 
    //
    const width = surfaceHue.width
    const height = surfaceHue.height
    //
    surfaceHue.canvas = createStandardHueCanvas(width, height)
    surfaceHueCtx = surfaceHue.canvas.getContext("2d")
    //
    surfaceHue.onMouseDown = updateByHue
    surfaceHue.onMouseMove = surfaceHueOnMouseMove
}

function surfaceHueOnMouseMove(x, y, dragging) {
    //
    changeMouseColor(colorAtHue(x, y))
    //
    if (dragging) { updateByHue() }
}

function colorAtHue(x, y) {
    //
    return surfaceHueCtx.getImageData(x, y, 1, 1).data
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceDetail() {
    // 
    surfaceDetailCtx = surfaceDetail.canvas.getContext("2d")
    //
    surfaceDetail.onMouseDown = updateByDetail
    surfaceDetail.onMouseMove = surfaceDetailOnMouseMove
}

function surfaceDetailOnMouseMove(x, y, dragging) {
    //
    changeMouseColor(colorAtDetail(x, y))
    //
    if (dragging) { updateByDetail() }
}

function paintSurfaceDetail(hue) {
    //
    drawSurfaceDetail(hue)
    paintSurface(surfaceDetail)
}

function drawSurfaceDetail(hue) { 
    //
    hue = Math.round(hue)
    if (hue >= 360) { hue -= 360 }
    //
    const width = surfaceDetail.canvas.width
    const height = surfaceDetail.canvas.height
    const thick = 8
    const amount = Math.ceil(width / thick)
    const half = Math.round(amount / 2)
    //
    let start = hue - half // hue is already rounded
    for (let n = 0; n < amount; n++) {
        let hue = start + n
        if (hue < 0)    { hue += 360 }
        if (hue >= 360) { hue -= 360 }
        //
        surfaceDetailCtx.fillStyle = "hsl(" + hue + ",100%,50%)"
        surfaceDetailCtx.fillRect(n*thick, 0, thick, height)
    }
}

function colorAtDetail(x, y) {
    //
    return surfaceDetailCtx.getImageData(x, y, 1, 1).data
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function configSurfaceHsl() {
    //
    surfaceHsl.canvas = createCanvas(228, 125) // reduced canvas helps set marker on edges!!!
    surfaceHslCtx = surfaceHsl.canvas.getContext("2d")
    //
    surfaceHslX = 227
    surfaceHslY = 0
    //
    surfaceHsl.onMouseDown = surfaceHslOnMouseDown
    surfaceHsl.onMouseMove = surfaceHslOnMouseMove
}

function surfaceHslOnMouseDown(x, y) {
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y) 
    //
    const color = colorAtHsl(x, y)
    updateCurrentColor(color) // alpha is 255
    //
    inputOnSurfaceHsl(x, y)
    paintSurfaceHslCurrent()
}

function surfaceHslOnMouseMove(x, y, dragging) {
    //
    if (dragging) { draggingOnSurfaceHsl(x, y) } else { justMovingOnSurfaceHsl(x, y) }
}

///////////////////////////////////////////////////////////////////////////////

function justMovingOnSurfaceHsl(x, y) {
    //
    if (x < 5) { eraseMouseColor(); return }
    if (y < 5) { eraseMouseColor(); return }
    //
    if (x > 232) { eraseMouseColor(); return }
    if (y > 129) { eraseMouseColor(); return }
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y) 
    //
    changeMouseColor(colorAtHsl(x, y))
}

function draggingOnSurfaceHsl(x, y) {
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y) 
    //
    const color = colorAtHsl(x, y)
    changeMouseColor(color)
    updateCurrentColor(color) // alpha is 255
    //
    inputOnSurfaceHsl(x, y) 
    paintSurfaceHslCurrent()
}

function inputOnSurfaceHsl(x, y) {
    //
    surfaceHslX = x
    surfaceHslY = y
    repaintSurfaceHsl() // must repaint because marker has new position
}

///////////////////////////////////////////////////////////////////////////////

function paintSurfaceHsl(hue) { 
    //
    drawHslGradient(hue)
    repaintSurfaceHsl()
}

function repaintSurfaceHsl() { // keeps the same hue
    //
    surfaceHslCtx.drawImage(hslGradient, 0, 0)
    surfaceHslCtx.drawImage(hslMarker, surfaceHslX - 5, surfaceHslY - 5)
    //
    panelHslCtx.drawImage(surfaceHsl.canvas, surfaceHsl.left + 5, surfaceHsl.top + 5)
}

///////////////////////////////////////////////////////////////////////////////

function fixedXForSurfaceHsl(x) {
    x -= 5
    if (x < 0) { return 0 }
    if (x > 227) { return 227 }
    return x
}

function fixedYForSurfaceHsl(y) {
    y -= 5
    if (y < 0) { return 0 }
    if (y > 124) { return 124 }
    return y
}

function colorAtHsl(x, y) {
    //
    return hslGradientCtx.getImageData(x, y, 1, 1).data // must be on hslGradientCtx because of the mark
} 

function colorAtHslMark() { // for passive color update
    //
    return hslGradientCtx.getImageData(surfaceHslX, surfaceHslY, 1, 1).data 
} 

