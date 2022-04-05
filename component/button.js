// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

///////////////////////////////////////////////////////////////////////////////

function Button(id, ctx, left, top, width, height, txt, action, disabled) {
    //
    this.kind = "button"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.top = top
    this.left = left
    this.width = width
    this.height = height
    //
    this.onClick = function () { buttonClicked(this) }
    //
    this.text = txt
    this.disabled = disabled
    this.action = action
    this.blinkTimer = 0
    //
    this.imageDark = null
    this.imageLight = null
    this.imagePressed = null
    this.imageDisabled = null
}

///////////////////////////////////////////////////////////////////////////////

function createButton(id, ctx, left, top, width, height, txt, action, disabled) {
    //
    const button = new Button(id, ctx, left, top, width, height, txt, action, disabled)
    //
    const restH = width - lengthOfText(txt)
    const txtLeft = Math.floor(restH / 2)
    //
    const restV = height - 12 // 12 is the height of the characters
    const txtTop = Math.floor(restV / 2)
    //
    const forLayer = button.id.startsWith("layer-")
    //
    button.imageDark = makeButtonImageDark(width, height, txt, txtLeft, txtTop)
    button.imageLight = makeButtonImageLight(width, height, txt, txtLeft, txtTop)
    button.imagePressed = makeButtonImagePressed(width, height)
    button.imageDisabled = makeButtonImageDisabled(width, height, txt, txtLeft, txtTop, forLayer) // special case
    //
    Object.seal(button)
    return button
}

///////////////////////////////////////////////////////////////////////////////

function paintButton(button) {
    //
    let cnv = isDarkInterface ? button.imageDark : button.imageLight
    if (button.disabled) { cnv = button.imageDisabled }
    if (button.blinkTimer > LOOP) { cnv = button.imagePressed }
    //
    button.parentCtx.drawImage(cnv, button.left, button.top)
}

///////////////////////////////////////////////////////////////////////////////

function buttonClicked(button) {
    //
    if (button.id.startsWith("layer-")) { layerButtonClicked(button); return } // special case
    //
    if (button.disabled) { return }
    //
    if (button.blinkTimer > LOOP) { return }
    //
    startBlinkingButton(button)
    //
    if (button.id.startsWith("effect-")) { applyEffect(button.action); return } // special case
    //
    button.action(button)    
}

function startBlinkingButton(button) {
    button.blinkTimer = LOOP + 7
    paintButton(button) // must come after setting blinkTimer
    scheduleByLoop(function () { paintButton(button) }, 7) 
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeButtonImageDark(width, height, txt, left, top) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "rgb(160,160,160)" 
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "rgb(240,240,240)" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    writeCore(ctx, standardFont, txt, left, top)
    //
    return cnv
}

function makeButtonImageLight(width, height, txt, left, top) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "rgb(150,150,150)" 
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "rgb(180,180,180)" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    ctx.fillStyle = "rgb(240,240,240)" 
    ctx.fillRect(2, 2, width - 4, height - 4)
    //
    writeCore(ctx, standardFont, txt, left, top)
    //
    return cnv
}

function makeButtonImagePressed(width, height) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "grey"
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "white" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    return cnv
}

function makeButtonImageDisabled(width, height, txt, left, top, forlayer) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "rgb(160,160,160)"
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "rgb(240,240,240)" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    writeCore(ctx, standardFont, txt, left, top)
    //
    ctx.fillStyle = forlayer ? "white" : "rgba(140,140,140,0.7)"
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    return cnv
}

