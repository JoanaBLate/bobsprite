// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


// all checks if (top) layer is good are made by who calls the memorize functions


const maxMemorySize = 30 * 1000 * 1000 // per layer

var memoryCount = 0 // number of memorizations in the current loop
var memorySpool = null

///////////////////////////////////////////////////////////////////////////////

function MemoryObject(canvas, kind) {
    this.canvas = canvas
    this.kind = kind // definitive, favorite, memory
    
    // 'frame' works as definitive
    // 'memory' means after undo or redo
}

///////////////////////////////////////////////////////////////////////////////

function manageMemorySpooling() {
    memoryCount = 0
    //
    if (memorySpool == null) { return }
    memorizeLayer(memorySpool)
    memorySpool = null
}

function memorizeTopLayer() {
    //
    memorizeLayer(getTopLayer())
}

function memorizeLayer(layer) {
    //
    if (memoryCount < 3) {
        memorizeLayerCore(layer)
        memoryCount += 1
    }
    else {
     // console.log("Memory spooling at loop", LOOP) 
        memorySpool = layer
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function memorizeLayerCore(layer) {
    //
    cancelPolyModel()
    relieveLayerMemory(layer)
    //
    const clone = cloneImage(layer.canvas)    
    const newobj = new MemoryObject(clone, "definitive")
    //
    beforeMemorizeLayer(layer)
    //
    layer.memory.push(newobj)
    layer.memorySize += clone.width * clone.height
    layer.memoryIndex = layer.memory.length - 1
}

function beforeMemorizeLayer(layer) {
    //
    const index = layer.memory.length - 1
    if (index == -1) { return } // happens on initialization
    //
    const lastobj = layer.memory[index]
    //
    if (lastobj.kind != "definitive") {    
        lastobj.kind = "definitive" // just a formality
        layer.memorySize += lastobj.canvas.width * lastobj.canvas.height
    }
}

///////////////////////////////////////////////////////////////////////////////

function memorizeLayerFromFavorites(layer) {
    //
    cancelPolyModel()
    //
    const clone = cloneImage(layer.canvas)    
    //
    const lastobj = layer.memory[layer.memory.length - 1]
    //
    if (lastobj.kind == "favorite") { // just replaces the canvas
        lastobj.canvas = clone 
    }
    else if (lastobj.kind == "memory") { // replaces the canvas and the kind
        lastobj.kind = "favorite"
        lastobj.canvas = clone 
    }
    else { // new memory object
        const newobj = new MemoryObject(clone, "favorite")
        layer.memory.push(newobj)
    }
    //
    layer.memoryIndex = layer.memory.length - 1
}

///////////////////////////////////////////////////////////////////////////////

function memorizeLayerAfterUndoOrRedo(layer) { // does not change layer.memoryIndex
    //
    cancelPolyModel()
    //
    const clone = cloneImage(layer.canvas)    
    //
    const lastobj = layer.memory[layer.memory.length - 1]
    //
    if (lastobj.kind == "memory") { // just replaces the canvas
        lastobj.canvas = clone 
        return
    }
    //
    if (lastobj.kind == "favorite") { // sets favorite as definitive
        lastobj.kind = "definitive"
        layer.memorySize += lastobj.canvas.width * lastobj.canvas.height
    }
    //
    const newobj = new MemoryObject(clone, "memory")
    layer.memory.push(newobj)
}

///////////////////////////////////////////////////////////////////////////////

function relieveLayerMemory(layer) {
    if (layer.memorySize < maxMemorySize) { return }
    while (layer.memorySize > maxMemorySize   &&  layer.memory.length > 1) { 
        const excluded = layer.memory.shift().canvas
        layer.memorySize -= excluded.width * excluded.height
    }
}

///////////////////////////////////////////////////////////////////////////////

function undo() {
    const layer = getTopLayer()
    if (layer == null) { return } 
    //
    const index = layer.memoryIndex - 1
    if (index < 0) { return }
    //
    startBlinkingIconOnTopBar("undo")
    //
    layer.memoryIndex = index
    recoverLayerAfterUndoOrRedo(layer)
}

function redo() {
    const layer = getTopLayer()
    if (layer == null) { return }
    //
    const max = layer.memory.length - 1
    const index = layer.memoryIndex + 1
    if (index > max) { return }
    //
    if (index == max  &&  layer.memory[index].kind == "memory") { return }
    //
    startBlinkingIconOnTopBar("redo")
    //
    layer.memoryIndex = index
    recoverLayerAfterUndoOrRedo(layer)
}

function recoverLayerAfterUndoOrRedo(layer) { 
    shallRepaint = true
    //
    const obj = layer.memory[layer.memoryIndex]
    layer.canvas = cloneImage(obj.canvas)
    memorizeLayerAfterUndoOrRedo(layer)
}

