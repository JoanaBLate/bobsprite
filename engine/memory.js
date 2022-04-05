// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// all checks if (top) layer is good are made by who calls the memorize functions

const maxMemorySize = 30 * 1000 * 1000 // per layer

var memoryCount = 0 // number of memorizations in the current loop
var memorySpool = null

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function manageMemorySpooling() {
    //
    memoryCount = 0
    //
    if (memorySpool == null) { return }
    memorizeLayer(memorySpool)
    memorySpool = null
}

function memorizeTopLayer() {
    //
    memorizeLayer(toplayer)
}

function memorizeLayer(layer) {
    //
    if (memoryCount < 3) {
        memorizeLayerAfterEdition(layer)
        memoryCount += 1
    }
    else {
     // console.log("Memory spooling at loop", LOOP) 
        memorySpool = layer
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function MemoryObject(canvas, reviewing) {
    //
    this.canvas = canvas
    this.reviewing = reviewing // after: undo, redo or showing favorite
}

///////////////////////////////////////////////////////////////////////////////

function memorizeLayerAfterEdition(layer) { // keeps any old memory object
    //
    const clone = cloneImage(layer.canvas) 
    //   
    pushToMemory(layer, clone, false)
    //
    relieveLayerMemory(layer)
    //
    layer.memoryIndex = layer.memory.length - 1
}

///////////////////////////////////////////////////////////////////////////////

function memorizeLayerFromFavorites(layer) { // doesn't relieve memory
    //
    tryDeleteLastMemoryObject(layer) 
    //
    const clone = cloneImage(layer.canvas)   
    //
    pushToMemory(layer, clone, true)
    //
    layer.memoryIndex = layer.memory.length - 1
}

///////////////////////////////////////////////////////////////////////////////

function memorizeLayerAfterUndoOrRedo(layer) {  // doesn't relieve memory; doesn't change layer.memoryIndex
    //
    tryDeleteLastMemoryObject(layer) 
    //
    const clone = cloneImage(layer.canvas)   
    //
    pushToMemory(layer, clone, true)
}    

///////////////////////////////////////////////////////////////////////////////

function undo() {
    //
    if (toplayer == null) { return } 
    //
    const index = toplayer.memoryIndex - 1
    if (index < 0) { return }
    //
    startBlinkingIconOnTopBar("undo")
    //
    toplayer.memoryIndex = index
    recoverLayerByUndoOrRedo(toplayer)
}

function redo() {
    //
    if (toplayer == null) { return }
    //
    const max = toplayer.memory.length - 1
    const index = toplayer.memoryIndex + 1
    if (index > max) { return }
    //
    if (index == max  &&  toplayer.memory[index].reviewing) { return }
    //
    startBlinkingIconOnTopBar("redo")
    //
    toplayer.memoryIndex = index
    recoverLayerByUndoOrRedo(toplayer)
}

function recoverLayerByUndoOrRedo(layer) { 
    shallRepaint = true
    //
    const obj = layer.memory[layer.memoryIndex]
    layer.canvas = cloneImage(obj.canvas)
    memorizeLayerAfterUndoOrRedo(layer)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function pushToMemory(layer, canvas, reviewing) {
    //
    const newObj = new MemoryObject(canvas, reviewing)
    //
    layer.memory.push(newObj)
    //
    layer.memorySize += canvas.width * canvas.height
}

function tryDeleteLastMemoryObject(layer) {
    //
    if (layer.memory.length == 0) { return } // happens at initialization
    //
    const lastObj = layer.memory[layer.memory.length - 1]
    //
    if (lastObj.reviewing) { 
        //
        const excluded = layer.memory.pop().canvas // pops!
        layer.memorySize -= excluded.width * excluded.height
    }
}

function relieveLayerMemory(layer) {
    //
    if (layer.memorySize < maxMemorySize) { return }
    //
    while (layer.memorySize > maxMemorySize   &&  layer.memory.length > 1) { 
        //
        const excluded = layer.memory.shift().canvas // shifts!
        layer.memorySize -= excluded.width * excluded.height
    }
}

