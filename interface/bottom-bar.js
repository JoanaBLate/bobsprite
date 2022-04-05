// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var bottomBar 
var bottomBarCtx

///////////////////////////////////////////////////////////////////////////////

function initBottomBar() {
    bottomBar = createCanvas(1300, 30)
    bottomBarCtx = bottomBar.getContext("2d")
    //
    bottomBar.style.position = "absolute"
    bottomBar.style.top = "630px"
    //
    bigdiv.appendChild(bottomBar)
}

///////////////////////////////////////////////////////////////////////////////

function startListeningBottomBar() {
    bottomBar.onmousedown = resetFocusedGadget
}

///////////////////////////////////////////////////////////////////////////////

function paintBottomBar() {
    paintBottomBarBg()
    //
    paintMousePositionOnBottomBar()
    //
    bottomBarCtx.fillStyle = "black"
    bottomBarCtx.fillRect(64, 1, 40, 28)
    paintMouseColorOnBottomBar()
    //  
    paintZoomOnBottomBar()   
    //  
    paintLayerSizeOnBottomBar()   
    //  
    paintLayerPositionOnBottomBar()   
    //  
    paintLayerOpacityOnBottomBar() 
}

///////////////////////////////////////////////////////////////////////////////

function paintBottomBarBg() {
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(0, 0, 1300, 30)
}

///////////////////////////////////////////////////////////////////////////////

function paintMousePositionOnBottomBar() {
    //
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(5, 0, 55, 30)
    //  
    if (infoLayerX == null  ||  infoLayerY == null) { return }
    //
    write(bottomBarCtx, "x  " + (infoLayerX + 1), 10, 1)
    write(bottomBarCtx, "y  " + (infoLayerY + 1), 10, 15)
}

///////////////////////////////////////////////////////////////////////////////

function paintZoomOnBottomBar() {
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(525, 0, 70, 30)
    //
    const txt = "zoom  " + ZOOM + "x"
    write(bottomBarCtx, txt, 530, 10)
}

///////////////////////////////////////////////////////////////////////////////

function paintLayerSizeOnBottomBar() {
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(645, 0, 195, 30)
    //
    if (toplayer == null) { return }
    //
    const txt = "top layer size  " + toplayer.canvas.width + " x " + toplayer.canvas.height
    write(bottomBarCtx, txt, 650, 10)
}

///////////////////////////////////////////////////////////////////////////////

function paintLayerPositionOnBottomBar() {
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(865, 0, 245, 30)
    //
    if (toplayer == null) { return }
    //
    const txt = "top layer position  " + toplayer.left + " x " + toplayer.top
    write(bottomBarCtx, txt, 870, 10)
}

///////////////////////////////////////////////////////////////////////////////

function paintLayerOpacityOnBottomBar() {
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(1120, 0, 170, 30)
    //
    const opacity = getTopLayerOpacity()
    if (opacity == null) { return }
    //
    const percent = Math.floor(100 * opacity)
    const txt = "top layer opacity  " + percent + "%"
    write(bottomBarCtx, txt, 1125, 10)
}

///////////////////////////////////////////////////////////////////////////////

function paintMouseColorOnBottomBar() {
    let color = "rgb(" + mouseRed + "," + mouseGreen + "," + mouseBlue + ")"
    //
    if (mouseRed == -1  ||  mouseAlpha == 0) { color = bottomBarColor() }
    //
    bottomBarCtx.fillStyle = color
    bottomBarCtx.fillRect(65, 2, 38, 26)
    //
    bottomBarCtx.fillStyle = bottomBarColor()
    bottomBarCtx.fillRect(109, 7, 180, 20)
    //
    if (mouseRed == -1) { return }    
    //
    const alpha = (mouseAlpha == 255 ? "opaque" : mouseAlpha)
    //
    const txt =  mouseRed + " " + mouseGreen + " " + mouseBlue + " " + alpha + " " + colorAndMouseColor()
    write(bottomBarCtx, txt, 112, 10)
}

function colorAndMouseColor() {
    if (RED   != mouseRed)   { return "" }
    if (GREEN != mouseGreen) { return "" }
    if (BLUE  != mouseBlue)  { return "" }
    if (ALPHA != mouseAlpha) { return "" }
    return "(match)"
}

