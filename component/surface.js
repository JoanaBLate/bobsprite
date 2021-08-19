// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


///////////////////////////////////////////////////////////////////////////////

function Surface(id, ctx, left, top, width, height) {
    //
    this.kind = "surface"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.top = top
    this.left = left
    this.width = width
    this.height = height
    //
    this.onClick = null 
    this.onWheel = null
    this.onMouseDown = null 
    this.onMouseMove = null 
    this.onMouseLeave = null  
    //
    this.canvas = createCanvas(width, height)
}

///////////////////////////////////////////////////////////////////////////////

function createSurface(id, ctx, left, top, width, height) {
    //
    const surface = new Surface(id, ctx, left, top, width, height)
    //
    Object.seal(surface)
    return surface
}

///////////////////////////////////////////////////////////////////////////////

function paintSurface(surface) {
    //
    surface.parentCtx.drawImage(surface.canvas, surface.left, surface.top)
}

