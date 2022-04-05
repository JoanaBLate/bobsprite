// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

function getMouseRectangle(layer, x, y, toolSize) { // stage coordinates
    //
    const delta = Math.floor(toolSize / 2)
    //
    // defining the WYSIWYG mouse rectangle on stage
    //
    const stageLeft = Math.max(0, x - delta)
    const stageTop  = Math.max(0, y - delta)
    //
    const stageRight  = Math.min(stageWidth  - 1, x + delta)
    const stageBottom = Math.min(stageHeight - 1, y + delta)
    //
    // projecting the stage rectangle on layer
    //
    const layerLeft   = stageLeft  - layer.left
    const layerRight  = stageRight - layer.left
    const layerTop    = stageTop - layer.top
    const layerBottom = stageBottom - layer.top
    //
    const layerWidth = layer.canvas.width
    const layerHeight = layer.canvas.height
    //
    // filtering rectangle off layer
    //
    if (layerLeft > layerWidth - 1) { return null }
    if (layerTop > layerHeight - 1) { return null }
    //
    if (layerRight < 0)  { return null }
    if (layerBottom < 0) { return null }
    //
    // final adjust
    //
    const sqrLeft = Math.max(0, layerLeft)
    const sqrTop  = Math.max(0, layerTop)
    const sqrRight = Math.min(layerWidth - 1, layerRight)
    const sqrBottom = Math.min(layerHeight - 1, layerBottom)
    //
    const sqrWidth = sqrRight - sqrLeft + 1
    const sqrHeight = sqrBottom - sqrTop + 1
    //
    return new Rectangle(sqrLeft, sqrTop, sqrWidth, sqrHeight)
}

