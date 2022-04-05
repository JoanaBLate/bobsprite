// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

var layers = [ ] // superlayer is the layer for selection

var toplayer = null 

// constructor ////////////////////////////////////////////////////////////////

function Layer() {
    //
    this.canvas = createCanvas(desiredWidth, desiredHeight)
    //
    this.left = 0 // ignores the zoom level!
    this.top = 0  // ignores the zoom level!
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
    for (const layer of layers) { centerLayerCore(layer) }
    //
    for (const layer of layers) { memorizeLayerAfterEdition(layer) } // must be the core function:
                                                                     // avoids some  layer rejection at memory spooling!!!!
    //
    layers[1].enabled = true
    //
    toplayer = layers[1]
}

///////////////////////////////////////////////////////////////////////////////

function changeLayerVisibility(n) {
    //
    shallRepaint = true
    //
    const layer = layers[n]
    layer.enabled = ! layer.enabled
    //
    toplayer = getTopLayer()
    updateLayerButtons()
    //
    if (panelOpacityOn) { paintPanelOpacity() }
}

///////////////////////////////////////////////////////////////////////////////

function selectionIsOn() {
    //
    return layers[0].enabled
}

function alertSuperLayer() {
    //
    customAlert("cannot use select or lasso tools on layer 'selection'")
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

///////////////////////////////////////////////////////////////////////////////

function getTopLayerX() {
    //
    if (toplayer == null) { return null }
    //
    const x = stageX - toplayer.left
    //
    if (x < 0) { return null }
    if (x > toplayer.width - 1) { return null}
    //
    return x
}

function getTopLayerY() {
    //
    if (toplayer == null) { return null }
    //
    const y = stageY - toplayer.top
    //
    if (y < 0) { return null }
    if (y > toplayer.height - 1) { return null}
    //
    return y
}

///////////////////////////////////////////////////////////////////////////////

function getTopLayerOpacity() {
    //
    if (toplayer == null) { return null }
    return toplayer.opacity
}

///////////////////////////////////////////////////////////////////////////////

function getNumberOfTopLayer() {
    //
    let n = -1
    //
    for (const layer of layers) { 
        //
        n += 1
        if (layer.enabled) { return n }
    }
    //
    return null
}

function getNumberOfBottomLayer() {
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { 
        //
        const layer = layers[n]
        if (layer.enabled) { return n }
    }
    //
    return null
}

///////////////////////////////////////////////////////////////////////////////

function reverseOrder() { // ignores hidden layers
    //
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
    //
    toplayer = getTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function exchangeLayers(a, b) {
    //
    shallRepaint = true
    //
    const layerA = layers[a]
    const layerB = layers[b]
    //
    layers[a] = layerB
    layers[b] = layerA
    //
    updateLayerButtons()
    toplayer = getTopLayer()
    //
    startBlinkingButton(panelLayersGadgets[a])
    startBlinkingButton(panelLayersGadgets[b])
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
    }
}

function centerLayerCore(layer) { // ignores zoom level
    //
    layer.left = stageCenterX - Math.floor(layer.canvas.width / 2)
    layer.top  = stageCenterY - Math.floor(layer.canvas.height / 2)
}
 
///////////////////////////////////////////////////////////////////////////////

function sendImageToTopLayer(cnv) {
    //
    shallRepaint = true
    //
    if (toplayer == null) { changeLayerVisibility(1) }
    //
    const shallMemorize = ! canvasesAreEqual(toplayer.canvas, cnv)
    //
    toplayer.canvas = cnv
    //
    centerLayerCore(toplayer)
    if (shallMemorize) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function mouseColorOnVisibleLayer(layer) {
    //
    if (! layer.enabled) { return null }
    //
    const x = stageX - layer.left
    //
    if (x < 0) { return null }
    if (x > layer.width - 1) { return null}
    //
    //    
    const y = stageY - layer.top
    //
    if (y < 0) { return null }
    if (y > layer.height - 1) { return null}
    //
    //
    const data = layer.canvas.getContext("2d").getImageData(x, y, 1, 1).data
    //
    if (data[3] == 0) { return null } // blank
    //
    return data
}

///////////////////////////////////////////////////////////////////////////////

function mergeUp() {
    //
    setTask(mergeUpCore)
}

function mergeUpCore() {
    //
    shallRepaint = true
    //
    const cnv = makeTopPicture()
    //
    if (cnv == null) { return }
    //
    if (! canvasesAreEqual(toplayer.canvas, cnv)) {
        //
        toplayer.canvas = cnv
        memorizeTopLayer() 
    }
    //
    for (const layer of layers) { layer.enabled = false }
    //
    toplayer.enabled = true
    //
    updateLayerButtons()  
}

///////////////////////////////////////////////////////////////////////////////

function mergeDown() {
    //
    customConfirm("protect blank and black pixels of bottom layer?", mergeDownProtected, mergeDownUnprotected)
}

function mergeDownUnprotected() {    
    //
    setTask(function () { mergeDownCore(false) })
}

function mergeDownProtected() {
    //
    setTask(function () { mergeDownCore(true) })
}

function mergeDownCore(protect) {
    //
    shallRepaint = true
    //
    const cnv = makeBottomPicture(protect)
    //
    if (cnv == null) { return }
    //    
    const bottomlayer = layers[getNumberOfBottomLayer()]
    //    
    if (! canvasesAreEqual(bottomlayer.canvas, cnv)) {
        //
        bottomlayer.canvas = cnv
        memorizeLayer(bottomlayer) 
    }
    //
    for (const layer of layers) { layer.enabled = false }
    //
    bottomlayer.enabled = true
    //
    toplayer = getTopLayer()
    //
    updateLayerButtons()  
}

