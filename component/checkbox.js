// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// accepts null action

///////////////////////////////////////////////////////////////////////////////

function Checkbox(id, ctx, left, top, dimension, action, checked) {
    //
    this.kind = "checkbox"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.top = top
    this.left = left
    this.width = dimension
    this.height = dimension
    //
    this.onClick = function () { checkboxClicked(this) }
    //
    this.action = action
    this.checked = checked
    //
    this.checkedBox = createCheckedBox(dimension)
    this.uncheckedBox = createUncheckedBox(dimension)
}

///////////////////////////////////////////////////////////////////////////////

function createCheckbox(id, ctx, left, top, dimension, action, checked) {
    //
    const checkbox = new Checkbox(id, ctx, left, top, dimension, action, checked)
    //
    Object.seal(checkbox)
    return checkbox
}

///////////////////////////////////////////////////////////////////////////////

function checkboxClicked(cb) {
    //
    cb.checked = ! cb.checked
    paintCheckbox(cb)
    //
    if (cb.action) { cb.action(cb) }
}

///////////////////////////////////////////////////////////////////////////////

function resetCheckbox(cb, checked) {
    //
    cb.checked = checked
    paintCheckbox(cb)
}

///////////////////////////////////////////////////////////////////////////////

function __revertCheckbox(cb) {
    //
    cb.checked = ! cb.checked
    paintCheckbox(cb)   
}

///////////////////////////////////////////////////////////////////////////////

function paintCheckbox(cb) {
    //
    let cnv = cb.checked ? cb.checkedBox : cb.uncheckedBox
    //
    cb.parentCtx.drawImage(cnv, cb.left, cb.top)
}

///////////////////////////////////////////////////////////////////////////////

function createUncheckedBox(dim) {
    //
    const cnv = createCanvas(dim, dim)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, dim, dim)
    //
    ctx.fillStyle = "gainsboro"
    ctx.fillRect(1, 1, dim-2, dim-2)
    //
    return cnv
}

function createCheckedBox(dim) {
    //
    const cnv = createUncheckedBox(dim)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(2, 2, dim-4, dim-4)
    //
    return cnv
}

