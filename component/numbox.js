// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

// numbox action is triggered by input

var numboxes = [ ] // necessary for blinking control

///////////////////////////////////////////////////////////////////////////////

function Numbox(id, ctx, left, top, width, height, txt, maxval, action) {
    //
    this.kind = "numbox"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.top = top
    this.left = left
    this.width = width
    this.height = height
    //
    this.text = txt
    this.maxValue = maxval
    this.maxLength = ("" + maxval).length
    this.textTop = topForNumboxText(height) 
    this.textLeft = leftForNumboxText(width, this.maxLength) // must come after maxLength
    this.action = action
    //
    this.cursorOn = false
    this.cursorPosition = this.maxLength // comes before, after or BETWEEN digits; min value is zero; max value is numbox.maxLength
    this.blinkingClock = 0
    //
    this.imageDark = null
    this.imageLight = null
}

///////////////////////////////////////////////////////////////////////////////

function createNumbox(id, ctx, left, top, width, height, txt, maxval, action) {
    //
    const numbox = new Numbox(id, ctx, left, top, width, height, txt, maxval, action)
    //
    numbox.imageDark = makeNumboxImageDark(width, height)
    numbox.imageLight = makeNumboxImageLight(width, height)
    //
    Object.seal(numbox)
    numboxes.push(numbox)
    return numbox
}

function topForNumboxText(height) {
    //
    const innerHeight = height - 2
    const restV = innerHeight - 10 // 10 is the height of the characters
    return Math.floor(restV / 2) + 1 // +1 for the top border (outside innerHeight)
}

function leftForNumboxText(width, maxLength) {
    //
    const digits = 8 * maxLength // 8 is the width of the characters
    const spaces = maxLength - 1 // space between digits
    const txtWidth = digits + spaces 
    //
    const innerWidth = width - 2 
    const rest = innerWidth - txtWidth 
    return Math.floor(rest / 2) + 1 // +1 for the left border (outside innerWidth)
}

///////////////////////////////////////////////////////////////////////////////

function resetNumbox(numbox, txt) { 
    numbox.text = txt
    numbox.cursorPosition = numbox.maxLength
    paintNumbox(numbox)
}

///////////////////////////////////////////////////////////////////////////////

function manageNumboxesBlinking() {
    //
    for (const numbox of numboxes) { manageNumboxBlinking(numbox) }
}

function manageNumboxBlinking(numbox) {
    //
    if (numbox == focusedGadget) { manageNumboxBlinkingFocused(numbox); return }
    //
    // blured:
    if (! numbox.cursorOn) { return }
    //
    numbox.cursorOn = false
    numbox.cursorPosition = numbox.maxLength
    paintNumbox(numbox)
}
    
function manageNumboxBlinkingFocused(numbox) {
    //
    const duration = numbox.cursorOn ? 22 : 9
    //
    if (LOOP < numbox.blinkingClock + duration) { return }
    //
    numbox.blinkingClock = LOOP    
    numbox.cursorOn = ! numbox.cursorOn
    paintNumbox(numbox)
}

///////////////////////////////////////////////////////////////////////////////

function makeNumboxImageDark(width, height) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")      
    //
    ctx.fillStyle = "rgb(65,65,65)" 
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "rgb(255,255,255)" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    return cnv
}

function makeNumboxImageLight(width, height) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "rgb(150,150,150)" 
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = "rgb(255,255,255)" 
    ctx.fillRect(1, 1, width - 2, height - 2)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintNumbox(numbox) {
    //
    const cnv = isDarkInterface ? numbox.imageDark : numbox.imageLight
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "white"
    ctx.fillRect(1, 1, cnv.width - 2, cnv.height - 2)
    //
    drawTextOnNumbox(numbox, ctx)
    drawCursorOnNumbox(numbox, ctx)
    //
    numbox.parentCtx.drawImage(cnv, numbox.left, numbox.top)
}

function drawTextOnNumbox(numbox, ctx) {
    //
    const txt = numbox.text.padStart(numbox.maxLength) // filled with white spaces
    //
    let left = numbox.textLeft
    //
    for (const c of txt) { 
        //
        const spr = specialIcons[c]
        ctx.drawImage(spr, left, numbox.textTop)
        //
        left += spr.width + 1 // +1 as spacer
    }
}

function drawCursorOnNumbox(numbox, ctx) {
    //
    if (! numbox.cursorOn) { return }
    //
    ctx.fillStyle = "red"
    const left = numbox.textLeft - 1 + (numbox.cursorPosition * 9) // 9 = 8 + 1 // digit width + spacer 
    //
    ctx.fillRect(left, 5, 2, numbox.height - 10)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function numboxOnKeyDown(numbox, low) {
    //
    processKeyDownOnNumbox(numbox, low)
    //
    const original = numbox.text
    //
    let val = parseInt(numbox.text)
    //
    if (isNaN(val)) { val = 0 }
    if (val > numbox.maxValue)  { val = numbox.maxValue }
    //
    numbox.text = "" + val // also cleans "003" for example
    //
    if (original != numbox.text) { fixNumboxCursorPosition(numbox) }
    //
    paintNumbox(numbox)
    //
    if (numbox.action) { numbox.action(numbox) }
}

function fixNumboxCursorPosition(numbox) { // to be called after numbox text is fixed
    // or else deleting '1' of '1000' 
    // would leave the cursor far to the left
    if (numbox.text == 0) { numbox.cursorPosition = numbox.maxLength; return }
    //
    const minpos = numbox.maxLength - numbox.text.length
    if (numbox.cursorPosition < minpos) { numbox.cursorPosition = minpos }
}

///////////////////////////////////////////////////////////////////////////////

function processKeyDownOnNumbox(numbox, low) {
 // console.log(low)
    //
    const minpos = numbox.maxLength - numbox.text.length
    const maxpos = numbox.maxLength
    //
    if (low == "arrowleft") {
        if (numbox.cursorPosition > minpos) { numbox.cursorPosition -= 1 }
        return     
    }
    //
    if (low == "arrowright") {
        if (numbox.cursorPosition < maxpos) { numbox.cursorPosition += 1 }        
        return     
    }
    //
    if (low == "home") { numbox.cursorPosition = minpos; return }
    //
    if (low == "end")  { numbox.cursorPosition = maxpos; return }
    //
    if (low == "delete") { 
        if (numbox.cursorPosition == maxpos) { return } // no digit ahead
        removeNumboxDigit(numbox, numbox.cursorPosition)
        numbox.cursorPosition += 1 
        return 
    }
    //
    if (low == "backspace") { 
        if (numbox.cursorPosition == minpos) { return } // no digit behind
        removeNumboxDigit(numbox, numbox.cursorPosition - 1) 
        return 
    }
    //
    if (low < "0") { return }
    if (low > "9") { return }
    //
    if (minpos == 0) { return } // no room for another digit
    //
    insertNumboxDigit(numbox, numbox.cursorPosition, low)
}

///////////////////////////////////////////////////////////////////////////////

function removeNumboxDigit(numbox, pos) {
    //
    let txt = numbox.text.padStart(numbox.maxLength) // filled with white spaces
    //
    const list = txt.split("")
    list.splice(pos, 1)
    //
    numbox.text = list.join("").trim()
}

///////////////////////////////////////////////////////////////////////////////

function insertNumboxDigit(numbox, pos, digit) {
    //
    let txt = numbox.text.padStart(numbox.maxLength) // filled with white spaces
    //
    const list = txt.split("")
    list.splice(pos, 0, digit)
    //
    numbox.text = list.join("").trim()
}

