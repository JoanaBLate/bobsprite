// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var layers = [ ] // superlayer is the zero layer   
  
// constructor ////////////////////////////////////////////////////////////////

function Layer() {
    this.canvas = createCanvas(desiredWidth, desiredHeight)
    this.left = 0
    this.top = 0
    //
    this.enabled = false
    this.opacity = 1.0 // presentation opacity
    //
    this.memory = [ ] // list of MemoryObject
    this.memoryIndex = -1
    this.memorySize = 0
}

///////////////////////////////////////////////////////////////////////////////

function initLayers() {
    //
    layers.push(new Layer()) // superlayer
    layers.push(new Layer()) // 1
    layers.push(new Layer()) // 2
    layers.push(new Layer()) // 3
    layers.push(new Layer()) // 4
    layers.push(new Layer()) // 5
    //
    for (const layer of layers) { memorizeLayerCore(layer) } // must be CORE or else some layers are rejected at memory spooling!!!!
    //
    layers[1].enabled = true
}

///////////////////////////////////////////////////////////////////////////////

function getTopLayer() {
    //
    for (const layer of layers) { 
        if (layer.enabled) { return layer } 
    }
    //
    return null
}

function getTopLayerAdjusted() { // or else user could not draw on displaced layer
    //
    const layer = getTopLayer()
    if (layer == null) { return null } 
    //
    if (shallAdjustLayer(layer)) { adjustLayerCore(layer) }
    //
    return layer
}

function getTrueTopLayerForced() {
    //
    const top = getTopLayer()
    if (top != null) { return top }
    //
    layers[1].enabled = true
    updateLayerButtons()
    return layers[1]
}

///////////////////////////////////////////////////////////////////////////////

function getTopLayerX() {
    //
    if (canvasX == null) { return null } 
    //
    const layer = getTopLayer()
    if (layer == null) { return null }
    //
    const x = canvasX - layer.left
    //
    if (x < 0) { return null }
    //
    if (x >= layer.canvas.width)  { return null }
    //
    return x
}    

function getTopLayerY() {
    //
    if (canvasY == null) { return null } 
    //
    const layer = getTopLayer()
    if (layer == null) { return null }
    //
    const y = canvasY - layer.top
    //
    if (y < 0) { return null }
    //
    if (y >= layer.canvas.height)  { return null }
    //
    return y
}

///////////////////////////////////////////////////////////////////////////////

function getTopLayerOpacity() {
    //
    for (const layer of layers) {
        if (layer.enabled) { return layer.opacity }
    }
    //
    return null
}

///////////////////////////////////////////////////////////////////////////////

function changeLayerVisibility(n) {
    shallRepaint = true
    //
    const layer = layers[n]
    layer.enabled = ! layer.enabled
    //
    updateLayerButtons()
    if (panelOpacityOn) { paintPanelOpacity() }
}

///////////////////////////////////////////////////////////////////////////////

function reverseOrder() { // ignores hidden layers
    shallRepaint = true
    //
    const list = [ ]
    //
    for (let n = 0; n < layers.length; n++) { if (layers[n].enabled) { list.push(n) } }
    //
    while (list.length > 1) { 
        const a = list.shift()
        const b = list.pop()
        exchangeLayers(a, b)
    }
}

///////////////////////////////////////////////////////////////////////////////

function exchangeLayers(a, b) {
    shallRepaint = true
    //
    const data = layers[a]
    const data2 = layers[b]
    //
    layers[a] = data2
    layers[b] = data  
    //
    startBlinkingButton(panelLayersGadgets[a])
    startBlinkingButton(panelLayersGadgets[b])
    //
    updateLayerButtons()
}

///////////////////////////////////////////////////////////////////////////////

function showSuperLayerOnly() {
    //
    for (const layer of layers) { layer.enabled = false }
    //    
    layers[0].enabled = true
    //
    updateLayerButtons()
}

///////////////////////////////////////////////////////////////////////////////

function adjustTopLayer() {
    //
    const layer = getTopLayer()
    //
    if (layer == null) { return }
    //
    if (! shallAdjustLayer(layer)) { return }
    //
    adjustLayerCore(layer)
    //
    memorizeTopLayer()
}

function adjustLayerCore(layer) {
    //
    startBlinkingIconOnTopBar("scissor")
    //
    const cnv = createCanvas(canvas.width, canvas.height)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(layer.canvas, layer.left, layer.top)
    //
    layer.left = 0
    layer.top = 0
    layer.canvas = cnv
}

function shallAdjustLayer(layer) {
    if (layer.left != 0) { return true }
    if (layer.top  != 0) { return true }
    if (layer.canvas.width != canvas.width) { return true }
    if (layer.canvas.height != canvas.height) { return true } 
    return false
}

///////////////////////////////////////////////////////////////////////////////

function mergeDown() {
    setTask(function () { mergeDownCore(false) })
}

function mergeDownProtected() {
    setTask(function () { mergeDownCore(true) })
}

function mergeDownCore(protect) {
    shallRepaint = true
    //
    let index = -1
    for (let n = 0; n < layers.length; n++) { 
        if (layers[n].enabled) { index = n } 
    }
    //
    if (index == -1) { return } // for safety
    //
    const layer = layers[index]
    layer.canvas = protect ? canvasToPictureProtected() : canvasToPicture()
    memorizeLayer(layer)
    //
    layer.left = 0 // must come after merging
    layer.top = 0  // must come after merging
    //    
    for (const layer of layers) { layer.enabled = false }
    layers[index].enabled = true
    //
    updateLayerButtons()
}
 
///////////////////////////////////////////////////////////////////////////////

function sendImageToTopLayer(cnv, shallResetPosition) {
    shallRepaint = true
    //
    const layer = getTrueTopLayerForced()
    layer.canvas.width = cnv.width
    layer.canvas.height = cnv.height
    const ctx = layer.canvas.getContext("2d")
    ctx.clearRect(0, 0, layer.width, layer.height)
    ctx.drawImage(cnv, 0, 0)
    //
    if (shallResetPosition) { layer.left = 0; layer.top = 0 }
    memorizeLayer(layer)
}

///////////////////////////////////////////////////////////////////////////////

function centerLayers() { 
    //
    if (getTopLayer() == null) { return }
    //
    shallRepaint = true 
    startBlinkingIconOnTopBar("center")   
    //
    for (const layer of layers) {
        if (! layer.enabled) { continue }
        //
        centerLayerCore(layer)
        //
        if (! shiftPressed) { return }
    }
}

function centerLayerCore(layer) {
    //
    layer.left = Math.floor((canvas.width - layer.canvas.width) / 2)
    layer.top  = Math.floor((canvas.height - layer.canvas.height) / 2)
}

///////////////////////////////////////////////////////////////////////////////

function __keepLayerRelativePosition(layer, newWidth, newHeight) {
    const width = layer.canvas.width
    const height = layer.canvas.height
    //
    if (newWidth == width  &&  newHeight == height) { return false }
    //
    const middleLeft = layer.left + Math.floor(width  / 2)
    const middleTop  = layer.top  + Math.floor(height / 2)
    //
    layer.left = middleLeft - Math.floor(newWidth  / 2)
    layer.top  = middleTop  - Math.floor(newHeight / 2)
    //
    return true
}

