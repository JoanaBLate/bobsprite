// # Copyright (c) 2014-2024 Feudal Code Limitada #

"use strict"

// file: main/file.js //
// "use strict"

var fileSelector
var downloadLink

var saveStyle = "" // png, jpg-40%, jpg-60%, jpg-80%
var spriteName = ""
var isPaletteFile = false

///////////////////////////////////////////////////////////////////////////////

function initLoadAndSave() {
    //
    createFileSelector()
    createDownloadLink()
    //
    const div = document.createElement("div")
    div.style.position = "fixed"
    div.style.visibility = "hidden"
    div.style.zIndex = "-90"
    //
    div.appendChild(downloadLink)
    div.appendChild(fileSelector)
    //
    document.body.appendChild(div)
}

function createFileSelector() {
    fileSelector = document.createElement("input")
    fileSelector.type = "file"
    fileSelector.onchange = fileSelectorChanged
}

function createDownloadLink() {
    downloadLink = document.createElement("a")
    downloadLink.text = "pseudo-download-link"
    downloadLink.target = "_blank"
    downloadLink.href = ""
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function loadImageFile() {
    //
    resetKeyboard() // or else, for example, ctrlPressed keeps true
    fileSelector.value = "" // or else same file will not trigger onchange event again
    clickHtmlElement(fileSelector)
}

function fileSelectorChanged() {
    const file = fileSelector.files[0]
    //
    if (file == undefined) { console.log("image loading aborted"); return } // should not happen
    //
    console.log("loading:", file.type, "  ", file.name, "  bytes:", file.size)
    //
    const kind = getFileNameExtension(file.name)
    if (kind == null) { customError("file name extension is not valid"); return }
    //
    const reader = new FileReader()
    reader.onloadend = function (e) { readerEndedLoading(file.name, e.target.result) }
    reader.readAsDataURL(file)
}

function readerEndedLoading(__filename, data) {
    //
    const img = document.createElement("img")
    img.onload = function () { imageOrPaletteLoaded(img) }
    img.src = data
}

function imageOrPaletteLoaded(img) {
    //
    const cnv = cloneImage(img)
    //
    if (isPaletteFile) {
        paletteLoaded(cnv)
    }
    else {
        imageLoaded(cnv)
    }
}

///////////////////////////////////////////////////////////////////////////////

function getFileNameExtension(name) {
    const index = name.lastIndexOf(".")
    if (index == -1) { return null }
    //
    const end = name.toLowerCase().substr(index)
    if (end == ".bmp")  { return "bmp" }
    if (end == ".png")  { return "png" }
    if (end == ".svg")  { return "svg" }
    if (end == ".jpg")  { return "jpg" }
    if (end == ".ico")  { return "ico" }
    if (end == ".gif")  { return "gif" }
    if (end == ".jpeg") { return "jpeg" }
    if (end == ".webp") { return "webp" }
    //
    return null
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function saveImageFile(cnv) {
    customPrompt("name of " + saveStyle + " file to be saved", callback, spriteName)
    //
    function callback(name) {
        if (name == "") { return }
        spriteName = name
        const extension = (saveStyle == "png") ? ".png" : ".jpg"
        saveImageFileWithThisName(name + extension, cnv)
    }
}

function saveImageFileWithThisName(filename, cnv) {
    // pseudo download
    downloadLink.download = filename
    //
    let data
    if (saveStyle == "jpg-40%") {
        data = cnv.toDataURL("image/jpeg", 0.4)
    }
    else if (saveStyle == "jpg-60%") {
        data = cnv.toDataURL("image/jpeg", 0.6)
    }
    else if (saveStyle == "jpg-80%") {
        data = cnv.toDataURL("image/jpeg", 0.8)
    }
    else {
        data = cnv.toDataURL("image/png")
    }
    //
    downloadLink.href = data
    clickHtmlElement(downloadLink)
}

// file: main/helper.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function hintAlert(msg) {
    //
    if (checkboxHint.checked) { customAlert(msg) }
}

///////////////////////////////////////////////////////////////////////////////

function cloneImage(img) {
    const cnv = createCanvas(img.width, img.height)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(img, 0, 0)
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function Point(x, y) {
    this.x = x
    this.y = y
}

function createPoint(x, y) {
    return new Point(x, y)
}

///////////////////////////////////////////////////////////////////////////////

function Rectangle(left, top, width, height) {
    this.left = left
    this.top  = top
    this.width  = width
    this.height = height
}

///////////////////////////////////////////////////////////////////////////////

function pixelsMatch(px1, px2) {
    if (px1[0] != px2[0]) { return false }
    if (px1[1] != px2[1]) { return false }
    if (px1[2] != px2[2]) { return false }
    if (px1[3] != px2[3]) { return false }
    return true
}

///////////////////////////////////////////////////////////////////////////////

function canvasesAreEqual(a, b) {
    const width  = a.width
    const height = a.height
    if (width  !=  b.width)  { return false }
    if (height !=  b.height) { return false }
    //
    const dataA = a.getContext("2d").getImageData(0, 0, width, height).data
    const dataB = b.getContext("2d").getImageData(0, 0, width, height).data
    const off = dataA.length
    for (let n = 0; n < off; n++) {
        if (dataA[n] != dataB[n]) { return false }
    }
    return true
}

///////////////////////////////////////////////////////////////////////////////

function getFullImageData(cnv) {
    //
    return cnv.getContext("2d").getImageData(0, 0, cnv.width, cnv.height)
}

///////////////////////////////////////////////////////////////////////////////

function bestMatchingPixel(cnv, target) {
    const ctx = cnv.getContext("2d")
    const width = cnv.width
    const height = cnv.height
    const data = ctx.getImageData(0, 0, width, height).data
    //
    let bestDelta = 3 * 255
    let bestX = 0
    let bestY = 0
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index = 4 * (y * width + x)
            //
            const dr = Math.abs(data[index    ] - target[0])
            const dg = Math.abs(data[index + 1] - target[1])
            const db = Math.abs(data[index + 2] - target[2])
            const delta = dr + dg + db
            //
            if (delta > bestDelta) { continue }
            //
            bestDelta = delta
            bestX = x
            bestY = y
        }
    }
    //
    return new Point(bestX, bestY)
}

///////////////////////////////////////////////////////////////////////////////

/*
// considering color [67,97,137,136]

function testChromeGetImageDataBugOnTranslucentPixels() {
    var cnv = document.createElement("canvas")
    cnv.width  = 100
    cnv.height = 100
    var ctx = cnv.getContext("2d")
    ctx.fillStyle = "rgba(67,98,137," + 136/255 + ")"
    ctx.fillRect(0, 0, 100, 100)
    //
    console.log("painted with [67,98,137,136]")
    console.log(ctx.getImageData(0,0,1,1).data) // prints [67,97,137,136] // CHANGES BLUE 98 TO BLUE 97
    console.log(ctx.getImageData(0,0,1,1).data) // prints [67,98,137,136] // correct reading
}

/*
    it is the same for loaded images:
    the first getImageData on a pixel brings  [67,97,137,136] // CHANGES BLUE 98 TO BLUE 97
    the second brings [67,98,137,136] // correct reading
* /

*/

///////////////////////////////////////////////////////////////////////////////

// file: main/local-storage.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function setDataInLocalStorage() {
    localStorage["new-width"] =  "" + getNewWidth()
    localStorage["new-height"] =  "" + getNewHeight()
    //
    localStorage["interface-color"] = isDarkInterface ? "dark" : "light"
    //
    localStorage["palette-custom1"] = palettes["custom 1"].join(";")
    localStorage["palette-custom2"] = palettes["custom 2"].join(";")
    localStorage["palette-custom3"] = palettes["custom 3"].join(";")
    localStorage["palette-custom4"] = palettes["custom 4"].join(";")
    localStorage["palette-custom5"] = palettes["custom 5"].join(";")
    localStorage["palette-custom6"] = palettes["custom 6"].join(";")
}

///////////////////////////////////////////////////////////////////////////////

function recoverDataFromLocalStorage() {
    recoverInterfaceColor()
    recoverCustomPalettes()
}

///////////////////////////////////////////////////////////////////////////////

function recoverInterfaceColor() {
    const mem = localStorage["interface-color"]
    if (mem == undefined) { return }
    //
    if (mem == "dark")  { isDarkInterface = true }
    if (mem == "light") { isDarkInterface = false }
}

///////////////////////////////////////////////////////////////////////////////

function recoverNewWidthFromLocalStorage() { // on demand
    //
    const mem = localStorage["new-width"]
    if (mem == undefined) { return 120 }
    //
    let val = parseInt(mem)
    if (isNaN(val)) { return 120 }
    if (val < 1  ||  val > 2000) { return 120 }
    //
    return val
}

///////////////////////////////////////////////////////////////////////////////

function recoverNewHeightFromLocalStorage() { // on demand
    //
    const mem = localStorage["new-height"]
    if (mem == undefined) { return 80 }
    //
    let val = parseInt(mem)
    if (isNaN(val)) { return 80 }
    if (val < 1  ||  val > 2000) { return 80 }
    //
    return val
}

///////////////////////////////////////////////////////////////////////////////

function recoverCustomPalettes() {
    palettes["custom 1"] = recoverCustomPalette("palette-custom1")
    palettes["custom 2"] = recoverCustomPalette("palette-custom2")
    palettes["custom 3"] = recoverCustomPalette("palette-custom3")
    palettes["custom 4"] = recoverCustomPalette("palette-custom4")
    palettes["custom 5"] = recoverCustomPalette("palette-custom5")
    palettes["custom 6"] = recoverCustomPalette("palette-custom6")
}

function recoverCustomPalette(key) {
    const data = localStorage[key]
    if (data == undefined) { return defaultCustomPalette() }
    //
    const list = data.split(";")
    if (list.length != 30) { return defaultCustomPalette() }
    //
    const newlist = [ ]
    for (const s of list) {
        if (s == "blank") { newlist.push("blank"); continue }
        //
        const tokens = s.split(",")
        if (tokens.length != 3) { return defaultCustomPalette() }
        //
        const r = parseInt(tokens.shift())
        const g = parseInt(tokens.shift())
        const b = parseInt(tokens.shift())
        //
        if (isNaN(r)) { return defaultCustomPalette() }
        if (isNaN(g)) { return defaultCustomPalette() }
        if (isNaN(b)) { return defaultCustomPalette() }
        //
        if (r < 0) { return defaultCustomPalette() }
        if (g < 0) { return defaultCustomPalette() }
        if (b < 0) { return defaultCustomPalette() }
        //
        if (r > 255) { return defaultCustomPalette() }
        if (g > 255) { return defaultCustomPalette() }
        if (b > 255) { return defaultCustomPalette() }
        //
        newlist.push("" + r + "," + g + "," + b)
    }
    return newlist
}

///////////////////////////////////////////////////////////////////////////////

// file: main/main.js //
// "use strict"

//  800 x 600 is 0.3% of all screens
// 1024 x 768 is 4%   of all screens
// 1280 x something is next

var MODE = "standard" // help, favorites, animation, tile-set, alternative-save

var LOOP = 0

var previousTimeStamp = 0

const LOOP_DURATION_IN_MS = 1000 / 30

///////////////////////////////////////////////////////////////////////////////

function main() {
    //
    if (isFramed()) { return }
    //
    document.body.onblur = resetKeyboard // maybe redundant: other modules also call resetKeyboard
    //
    recoverDataFromLocalStorage() // it is also a kind of initialization
    //
    initLoadAndSave()
    //
    initIcons()
    initFonts()
    //
    main2()
}

function main2() {
    //
    if (iconSheet != null  &&  fontSheet != null) { afterIconsAndFonts(); return }
    //
    setTimeout(main2, 30)
}

function afterIconsAndFonts() {
    //
    initLayers()
    initAnimation()
    initInterface()
    //
    window.onresize = resetBigDivPosition // cannot come before initInterface!
    //
    window.onbeforeunload = function () { setDataInLocalStorage(); return "leaving?" }
    //
    initKeyboard()
    runMainLoop()
    showOrHideHelp()

}

///////////////////////////////////////////////////////////////////////////////

function runMainLoop(timeStamp) {
    //
    const elapsed = timeStamp - previousTimeStamp
    //
    if (elapsed < 30) { requestAnimationFrame(runMainLoop); return }
    //
    previousTimeStamp = timeStamp
    //
    runCoreLoop()
}

function runCoreLoop() {
    //
    LOOP += 1
    //
    manageMemorySpooling() // must be the first
    updateSchedule()
    runTask()
    //
    if (mouseBusy  ||  superHandOn) { } else { moveTopLayerByKeyboard() }
    //
    updateMouseColorByStage()
    //
    displayMouseColor()
    displayGeneralInfo()
    //
    manageNumboxesBlinking()
    //
    if (shallRepaint) {
        paintStage()
        paintPhoto()
        shallRepaint = false
    }
    //
    if (MODE == "animation") { drawAnimation() }
    //
    if (TASK == null  &&  memorySpool == null) { // also for MODE "animation"
        requestAnimationFrame(refresh)
    }
    else {
        requestAnimationFrame(runMainLoop)
    }
}

function refresh() {
    requestAnimationFrame(runMainLoop)
}

///////////////////////////////////////////////////////////////////////////////

function isFramed() {
    if (window.top == window.self) { return false }
    //
    window.top.location.replace(window.self.location.href)
    return true
}

// file: main/schedule.js //
// "use strict"

var schedule = [ ]

///////////////////////////////////////////////////////////////////////////////

function Schedule(func, timer) { // constructor
    this.func = func
    this.timer = timer
}

function __scheduleByTime(func, miliseconds) { // delay argument in milliseconds
    scheduleByLoop(func, Math.round(miliseconds / LOOP_DURATION_IN_MS))
}

function scheduleByLoop(func, loops) { // delay argument in loops
    const timer = LOOP + Math.max(1, loops)
    const obj = new Schedule(func, timer)
    schedule.push(obj)
}

function updateSchedule() {
    if (schedule.length == 0) { return }
    //
    const list = [ ]
    //
    for (const obj of schedule) {
        if (LOOP < obj.timer) {
            list.push(obj)
        }
        else {
            obj.func()
        }
    }
    schedule = list
}

// file: html/custom-alert.js //
// "use strict"

// var customAlertCount = 0

///////////////////////////////////////////////////////////////////////////////

function customError(message, callback) {
    customAlertCore("Error", message, callback)
}

function customAlert(message, callback) {
    customAlertCore("Alert", message, callback)
}

function customAlertCore(title, message, callback) {
    resetKeyboard() // or else, for example, ctrlPressed keeps true
    //
// customAlertCount += 1
    //
    const onkeyup    = document.onkeyup
    const onkeydown  = document.onkeydown
    const onkeypress = document.onkeypress
    //
    const overlay = document.createElement("div")
    overlay.style.backgroundColor = "black"
    overlay.style.opacity  = "0.8"
    overlay.style.position = "fixed"
    overlay.style.left = "0px"
    overlay.style.top  = "0px"
    overlay.style.width  = "100%"
    overlay.style.height = "100%"
    overlay.style.zIndex = "90"
    document.body.appendChild(overlay)
    //
    const box = document.createElement("div")
    box.style.padding = "8px"
    box.style.backgroundColor = "black"
    box.style.position = "fixed" // absolute
    box.style.width = "550px"
    box.style.borderRadius = "7px"
    box.style.outline = "none"
    //
    let left = Math.floor((window.innerWidth - 550) / 2)
    if (left < 100) { left = 100 }
    box.style.left = left + "px"
    //
    let top = Math.floor((window.innerHeight - 200) / 2)
    if (top < 100) { top = 100 }
    box.style.top  = top + "px"
    //
    box.style.zIndex = "91"
    document.body.appendChild(box)
    //
    const head = document.createElement("div")
    head.style.padding = "20px"
    head.style.backgroundColor = "#666666"
    head.style.color = "#CCCCCC"
    head.style.fontFamily = "Arial, Helvetica, Symbol"
    head.style.fontSize = "22px"
    head.innerHTML = title
    box.appendChild(head)
    //
    const body = document.createElement("div")
    body.style.padding = "20px"
    body.style.backgroundColor = "#333333"
    box.appendChild(body)
    //
    const foot = document.createElement("div")
    foot.style.padding = "10px"
    foot.style.backgroundColor = "#666666"
    foot.style.textAlign = "right"
    box.appendChild(foot)
    //
    const label = document.createElement("label")
    label.style.display = "block"
    label.style.overflow = "hidden"
    label.style.color = "silver"
    label.style.fontFamily = "Arial, Helvetica, Symbol"
    label.style.fontSize = "18px"
    label.innerHTML = htmlFromText(message)
    body.appendChild(label)
    //
    const buttonOk = document.createElement("button")
 // buttonOk.style.backgroundColor = "whitesmoke"
    buttonOk.style.margin = "10px 0px 10px 20px"
    buttonOk.style.width  = "80px"
    buttonOk.style.fontSize = "17px"
    buttonOk.innerHTML = "ok"
    buttonOk.onclick   = function () { close(true) }
    foot.appendChild(buttonOk)
    //
    document.onkeyup   = null
    document.onkeyress = null
    document.onkeydown = function (e) {
        e.preventDefault()  // necessary to avoid CTRL S saves the webpage
        e.stopPropagation() // necessary to avoid send keystrokes to keyboard module
        if (e.keyCode == 13) { close(true) }
        if (e.keyCode == 27) { close(false) }
    }
    //
    function htmlFromText(text) {
        let html = ""
        while (text != "") {
            const c = text[0]
            text = text.substr(1)
            if (c == "&")  { html += "&amp;";  continue }
            if (c == "<")  { html += "&lt;";   continue }
            if (c == ">")  { html += "&gt;";   continue }
            if (c == " ")  { html += "&nbsp;"; continue }
            if (c == "\n") { html += "<br>";   continue }
            html += c
        }
        return html
    }
    //
    function close(value) {
        document.onkeyup    = onkeyup
        document.onkeydown  = onkeydown
        document.onkeypress = onkeypress
        //
        document.body.removeChild(box)
        document.body.removeChild(overlay)
    // customAlertCount -= 1
        if (callback != undefined) { callback(value) }
    }
}

// file: html/custom-confirm.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function customConfirm(message, callback, callback2) {
    resetKeyboard() // or else, for example, ctrlPressed keeps true
    //
    const onkeyup    = document.onkeyup
    const onkeydown  = document.onkeydown
    const onkeypress = document.onkeypress
    //
    const overlay = document.createElement("div")
    overlay.style.backgroundColor = "black"
    overlay.style.opacity  = "0.8"
    overlay.style.position = "fixed"
    overlay.style.left = "0px"
    overlay.style.top  = "0px"
    overlay.style.width  = "100%"
    overlay.style.height = "100%"
    overlay.style.zIndex = "90"
    document.body.appendChild(overlay)
    //
    const box = document.createElement("div")
    box.style.padding = "8px"
    box.style.backgroundColor = "black"
    box.style.position = "fixed" // absolute
    box.style.width = "550px"
    box.style.borderRadius = "7px"
    box.style.outline = "none"
    //
    let left = Math.floor((window.innerWidth - 550) / 2)
    if (left < 100) { left = 100 }
    box.style.left = left + "px"
    //
    let top = Math.floor((window.innerHeight - 200) / 2)
    if (top < 100) { top = 100 }
    box.style.top  = top + "px"
    //
    box.style.zIndex = "91"
    document.body.appendChild(box)
    //
    const head = document.createElement("div")
    head.style.padding = "20px"
    head.style.backgroundColor = "#666666"
    head.style.color = "#CCCCCC"
    head.style.fontFamily = "Arial, Helvetica, Symbol"
    head.style.fontSize = "22px"
    head.innerHTML = "Confirm"
    box.appendChild(head)
    //
    const body = document.createElement("div")
    body.style.padding = "20px"
    body.style.backgroundColor = "#333333"
    box.appendChild(body)
    //
    const foot = document.createElement("div")
    foot.style.padding = "10px"
    foot.style.backgroundColor = "#666666"
    foot.style.textAlign = "right"
    box.appendChild(foot)
    //
    const label = document.createElement("label")
    label.style.display = "block"
    label.style.overflow = "hidden"
    label.style.color = "silver"
    label.style.fontFamily = "Arial, Helvetica, Symbol"
    label.style.fontSize = "18px"
    label.innerHTML = htmlFromText(message)
    body.appendChild(label)
    //
    const buttonCancel = document.createElement("button")
 // buttonCancel.style.backgroundColor = "whitesmoke"
    buttonCancel.style.margin = "10px 0px 10px 20px"
    buttonCancel.style.width  = "80px"
    buttonCancel.style.fontSize = "17px"
    buttonCancel.innerHTML = "no"
    buttonCancel.onclick   = function () { close(false) }
    foot.appendChild(buttonCancel)
    //
    const buttonOk = document.createElement("button")
 // buttonOk.style.backgroundColor = "whitesmoke"
    buttonOk.style.margin = "10px 0px 10px 20px"
    buttonOk.style.width  = "80px"
    buttonOk.style.fontSize = "17px"
    buttonOk.innerHTML = "yes"
    buttonOk.onclick   = function () { close(true) }
    foot.appendChild(buttonOk)
    //
    document.onkeyup   = null
    document.onkeyress = null
    document.onkeydown = function (e) {
        e.preventDefault()  // necessary to avoid CTRL S saves the webpage
        e.stopPropagation() // necessary to avoid send keystrokes to keyboard module
        if (e.keyCode == 13) { close(true) }
        if (e.keyCode == 27) { close(false) }
    }
    //
    function htmlFromText(text) {
        let html = ""
        while (text != "") {
            const c = text[0]
            text = text.substr(1)
            if (c == "&")  { html += "&amp;";  continue }
            if (c == "<")  { html += "&lt;";   continue }
            if (c == ">")  { html += "&gt;";   continue }
            if (c == " ")  { html += "&nbsp;"; continue }
            if (c == "\n") { html += "<br>";   continue }
            html += c

        }
        return html
    }
    //
    function close(value) {
        document.onkeyup    = onkeyup
        document.onkeydown  = onkeydown
        document.onkeypress = onkeypress
        //
        document.body.removeChild(box)
        document.body.removeChild(overlay)
        //
        if (value) {
            if (callback)  { callback() }
        }
        else {
            if (callback2) { callback2() }
        }
    }
}

// file: html/custom-prompt.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function customPrompt(message, callback, value) {
    resetKeyboard() // or else, for example, ctrlPressed keeps true
    //
    const onkeyup    = document.onkeyup
    const onkeydown  = document.onkeydown
    const onkeypress = document.onkeypress
    //
    document.onkeyup    = null
    document.onkeypress = null
    document.onkeydown  = function (e) { if (e.ctrlKey) { return false } } // necessary to abort CTRL S
    //
    if (value == null  ||  value == undefined) { value = "" }
    //
    const overlay = document.createElement("div")
    overlay.style.backgroundColor = "black"
    overlay.style.opacity  = "0.8"
    overlay.style.position = "fixed"
    overlay.style.left = "0px"
    overlay.style.top  = "0px"
    overlay.style.width  = "100%"
    overlay.style.height = "100%"
    overlay.style.zIndex = "90"
    document.body.appendChild(overlay)
    //
    const box = document.createElement("div")
    box.style.padding = "8px"
    box.style.backgroundColor = "black"
    box.style.position = "absolute"
    box.style.width = "550px"
    box.style.borderRadius = "7px"
    box.style.outline = "none"
    //
    let left = Math.floor((window.innerWidth - 550) / 2)
    if (left < 100) { left = 100 }
    box.style.left = left + "px"
    //
    let top = Math.floor((window.innerHeight - 200) / 2)
    if (top < 100) { top = 100 }
    box.style.top  = top + "px"
    //
    box.style.zIndex = "91"
    document.body.appendChild(box)
    //
    const head = document.createElement("div")
    head.style.padding = "20px"
    head.style.backgroundColor = "#666666"
    box.appendChild(head)
    //
    const body = document.createElement("div")
    body.style.padding = "20px"
    body.style.backgroundColor = "#333333"
    box.appendChild(body)
    //
    const foot = document.createElement("div")
    foot.style.padding = "10px"
    foot.style.backgroundColor = "#666666"
    foot.style.textAlign = "right"
    box.appendChild(foot)
    //
    const label = document.createElement("label")
    label.style.display = "block"
    label.style.overflow = "hidden"
    label.style.color = "#CCCCCC"
    label.style.fontFamily = "Arial, Helvetica, Symbol"
    label.style.fontSize = "22px"
    label.innerHTML = htmlFromText(message)
    head.appendChild(label)
    //
    const input = document.createElement("input")
    input.style.width = "465px"
    input.style.margin = "0px 0px 0px 20px"
    input.style.fontSize = "21px"
    input.value = value
    input.oninput = function () {
        // oninput only fires when text changes (does not receive ENTER nor ESCAPE)
        if (textIsBad(input.value)) { input.value = value } else { value = input.value }
    }
    input.onkeydown = function (e) {
        e.stopPropagation() // necessary to avoid send keystrokes to keyboard module
        if (e.ctrlKey) { return false } // necessary to abort CTRL S
        if (e.keyCode == 13) { close(value) }
        if (e.keyCode == 27) { close("") }
    }
    body.appendChild(input)
    input.focus()
    //
    const buttonCancel = document.createElement("button")
 // buttonCancel.style.backgroundColor = "whitesmoke"
    buttonCancel.style.margin = "10px 0px 10px 20px"
    buttonCancel.style.width  = "80px"
    buttonCancel.style.fontSize = "17px"
    buttonCancel.innerHTML = "cancel"
    buttonCancel.onclick   = function () { close("") }
    foot.appendChild(buttonCancel)
    //
    const buttonOk = document.createElement("button")
 // buttonOk.style.backgroundColor = "whitesmoke"
    buttonOk.style.margin = "10px 0px 10px 20px"
    buttonOk.style.width  = "80px"
    buttonOk.style.fontSize = "17px"
    buttonOk.innerHTML = "ok"
    buttonOk.onclick   = function () { close(value) }
    foot.appendChild(buttonOk)
    //
    function htmlFromText(text) {
        let html = ""
        while (text != "") {
            const c = text[0]
            text = text.substr(1)
            if (c == "&")  { html += "&amp;";  continue }
            if (c == "<")  { html += "&lt;";   continue }
            if (c == ">")  { html += "&gt;";   continue }
            if (c == " ")  { html += "&nbsp;"; continue }
            if (c == "\n") { html += "<br>";   continue }
            html += c

        }
        return html
    }
    //
    function textIsBad(text) {
        const reference = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$01234567890-_"
        for (let n = 0; n < text.length; n += 1) {
            const c = text[n]
            if (reference.indexOf(c) == -1) { return true }
        }
        return false
    }
    //
    function close(text) {
        document.onkeyup    = onkeyup
        document.onkeydown  = onkeydown
        document.onkeypress = onkeypress
        //
        document.body.removeChild(box)
        document.body.removeChild(overlay)
        if (callback != undefined) { callback(text) }
    }
}

// file: html/html.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function clickHtmlElement(element) {
    // Firefox (and Edge) does not click link that is not body's child
    const e = document.createEvent("MouseEvents")
    e.initEvent("click", true, true) // event type, can bubble?,  cancelable?
    element.dispatchEvent(e)
}

function createCanvas(width, height) {
    const cnv = document.createElement("canvas")
    cnv.width  = width
    cnv.height = height
    return cnv
}

// file: component/GADGETS.js //
// "use strict"

// a layout (container) is a gadget

var currentGadgets = [ ]

var focusedGadget = null // focused means mousedown or mousedrag!!!

var gadgetUnderMouse = null  // for panel-color-hsl and panel-color-rgba

var panelDragControl = null

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseLeave() { // does not reset focusedGadget
    //
    currentGadgets = [ ]
    gadgetUnderMouse = null
    panelDragControl = null
    //
    eraseMouseColor()
}

function resetFocusedGadget() { // for numbox
    focusedGadget = null
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseEnter(gadgets, dcCallback) {
    //
    currentGadgets = gadgets
    panelDragControl = dcCallback ? dcCallback : null
}

///////////////////////////////////////////////////////////////////////////////

function panelOnWheel(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    const sign = Math.sign(e.deltaY)
    //
    const gadget = getGadgetUnderMouse(x, y)
    //
    if (gadget == null) { return }
    //
    if (gadget.onWheel) { gadget.onWheel(x - gadget.left, y - gadget.top, sign) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseDown(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    //
    const gadget = getGadgetUnderMouse(x, y)
    //
    focusedGadget = gadget
    //
    if (panelDragControl) { panelDragControl("down", x, y, gadget, false) }
    //
    if (gadget == null) { return }
    //
    if (gadget.onMouseDown) { gadget.onMouseDown(x - gadget.left, y - gadget.top) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseUp(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    //
    const gadget = getGadgetUnderMouse(x, y)
    //
    if (panelDragControl) { panelDragControl("up", x, y, gadget, false) }
    //
    if (gadget == null) { return }
    //
    if (gadget != focusedGadget) { focusedGadget = null; return }
    //
    // classic click
    //
    if (gadget.onClick) { gadget.onClick(x - gadget.left, y - gadget.top) }
}

///////////////////////////////////////////////////////////////////////////////

function panelOnMouseMove(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    const dragging = (e.buttons == 1)
    //
    const gadget = getGadgetUnderMouse(x, y)
    //
    tryMouseLeftFocusedGadget(gadget, dragging)
    //
    if (gadget == null) { eraseMouseColor(); return }
    //
    if (gadget.onMouseMove) { gadget.onMouseMove(x - gadget.left, y - gadget.top, dragging) }
    //
    if (panelDragControl) { panelDragControl("move", x, y, gadget, dragging) }
}

function tryMouseLeftFocusedGadget(gadget, dragging) {
    //
    if (focusedGadget == null) { return }
    //
    if (focusedGadget == gadget) { return } // has not left
    //
    if (focusedGadget.onMouseLeave) { focusedGadget.onMouseLeave(dragging) }
    //
    if (dragging) { focusedGadget = null }
}

///////////////////////////////////////////////////////////////////////////////

function getGadgetUnderMouse(x, y)  {
    //
    gadgetUnderMouse = getGadgetUnderMouseCore(x, y)
    return gadgetUnderMouse
}

function getGadgetUnderMouseCore(x, y)  {
    //
    for (const gadget of currentGadgets) {
        //
        if (isGadgetUnderMouse(x, y, gadget)) { return gadget }
    }
    //
    return null
}

function isGadgetUnderMouse(x, y, gadget) {
    //
    if (x < gadget.left) { return false }
    if (y < gadget.top)  { return false }
    //
    const right = gadget.left + gadget.width - 1
    const bottom = gadget.top + gadget.height - 1
    //
    if (x > right)  { return false }
    if (y > bottom) { return false }
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function focusedNumbox() {
    //
    if (focusedGadget == null) { return null }
    //
    if (focusedGadget.kind == "numbox") { return focusedGadget }
    //
    return null
}

// file: component/button.js //
// "use strict"

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
    updateButtonImages(button)
    //
    Object.seal(button)
    return button
}

function updateButtonImages(button) { // also called by function 'exchangeLayers'
    //
    const width = button.width
    const height = button.height
    const txt = button.text
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

// file: component/checkbox.js //
// "use strict"

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

// file: component/chess-bg.js //
// "use strict"

const chessLightColorA = "rgb(180,180,180)"
const chessLightColorB = "rgb(172,172,172)"

const chessDarkColorA = "rgb(140,140,140)"
const chessDarkColorB = "rgb(130,130,130)"

const chessIconColorA = "rgb(220,220,220)"
const chessIconColorB = "rgb(200,200,200)"

///////////////////////////////////////////////////////////////////////////////

function createStageChessLight() {
    //
    return createChessBox(900, 600, 60, chessLightColorA, chessLightColorB)
}

function createStageChessDark() {
    //
    return createChessBox(900, 600, 60, chessDarkColorA, chessDarkColorB)
}

///////////////////////////////////////////////////////////////////////////////

function createChessBox(width, height, side, light, dark) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark
    ctx.fillRect(0, 0, width, height)
    //
    ctx.fillStyle = light
    //
    let top = 0
    let startJumping = false
    //
    while (true) {
        paintChessBoxRow(ctx, width, top, side, startJumping)
        startJumping = ! startJumping
        top += side
        if (top > height - 1) { break }
    }
    //
    return cnv
}

function paintChessBoxRow(ctx, width, top, side, startJumping) {
    let left = startJumping ? side : 0
    while (true) {
        ctx.fillRect(left, top, side, side)
        left += side * 2
        if (left > width - 1) { break }
    }
}

// file: component/components.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function greyTraceH(targetCtx, left, top, width) {
    greyArea(targetCtx, left, top, width, 1)
}

function greyTraceV(targetCtx, left, top, height) {
    greyArea(targetCtx, left, top, 1, height)
}

function greyArea(targetCtx, left, top, width, height) {
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = foldColor()
    ctx.fillRect(0, 0, width, height)
    //
    targetCtx.drawImage(cnv, left, top)
}

function greyOuterEdgeByGadget(gadget) {
    greyOuterEdge(gadget.parentCtx, gadget.left, gadget.top, gadget.width, gadget.height)
}

function greyOuterEdge(targetCtx, left, top, width, height) {
    greyEmptyRect(targetCtx, left-1, top-1, width+2, height+2)
}

function greyEmptyRect(targetCtx, left, top, width, height) {
    //
    greyTraceH(targetCtx, left, top, width) // top
    greyTraceH(targetCtx, left, top+height-1, width) // bottom
    //
    greyTraceV(targetCtx, left, top+1, height-2) // left
    greyTraceV(targetCtx, left+width-1, top+1, height-2) // right
}

///////////////////////////////////////////////////////////////////////////////

function paintBgOn25(ctx, left, top) {
    ctx.fillStyle = "white"
    ctx.fillRect(left, top, 25, 25)
}

function paintBgOn30(ctx, left, top) {
    ctx.fillStyle = "white"
    ctx.fillRect(left, top, 30, 30)
}

///////////////////////////////////////////////////////////////////////////////

function paintBgOff25(ctx, left, top) {
    ctx.fillStyle = wingColor()
    ctx.fillRect(left, top, 25, 25)
}

function paintBgOff30(ctx, left, top) {
    ctx.fillStyle = wingColor()
    ctx.fillRect(left, top, 30, 30)
}

///////////////////////////////////////////////////////////////////////////////

function makeFrameCanvasIcon() {
    //
    const cnv = createCanvas(80, 80)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 80, 80)
    //
    const label = createCanvasLabel("CANVAS", 16, "beige")
    const l = Math.floor((80 - label.width) / 2)
    const t = Math.floor((80 - label.height) / 2)
    //
    ctx.drawImage(label, l, t)
    //
    return cnv
}

function makeFrameOffIcon() {
    //
    const cnv = createCanvas(80, 80)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 80, 80)
    //
    const label = createCanvasLabel("off", 22, "beige")
    const l = Math.floor((80 - label.width) / 2)
    const t = Math.floor((80 - label.height) / 2)
    //
    ctx.drawImage(label, l, t)
    //
    return cnv
}

function createCanvasLabel(txt, fontSize, fgColor) {
    //
    const cnv = createCanvas(80, 80)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = fgColor
    ctx.font = "900 " + fontSize + "px Arial,Helvetica,MonoSpace,Sans-Serif"
    ctx.textBaseline = "top"
    ctx.fillText(txt, 0, 0)
    //
    return autocrop(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function makeFavoriteIcon(src) {
    //
    const cnv = createCanvas(100, 100)
    const ctx = cnv.getContext("2d")
    //
    let x = 0
    let y = 0
    let width = src.width
    let height = src.height
    //
    if (width > height) {
        y = - Math.floor((width - height) / 2)
        height = width
    }
    else if (height > width) {
        x = - Math.floor((height - width) / 2)
        width = height
    }
    //
    ctx.drawImage(src, x,y,width,height, 0,0,100,100)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function createMarker(side) {
    //
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, side, side)
    //
    ctx.fillStyle = "white"
    ctx.fillRect(1, 1, side-2, side-2)
    //
    ctx.clearRect(2, 2, side-4, side-4)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function createStandardHueCanvas(width, height) {
    const cnv = createCanvas(360, height)
    const ctx = cnv.getContext("2d")
    //
    for (let left = 0; left < 360; left++) {
        ctx.fillStyle = "hsl(" + left + ",100%,50%)"
        ctx.fillRect(left, 0, 1, height)
    }
    //
    const cnv2 = createCanvas(width, height)
    cnv2.getContext("2d").drawImage(cnv, 0,0,360,height,  0,0,width,height)
    return cnv2
}

/*
function createStandardHueCanvas(width, height) {
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const grd = ctx.createLinearGradient(0, 0, width-1, 0)
    grd.addColorStop(0,    "rgb(255,   0,   0)")
    grd.addColorStop(0.17, "rgb(255, 255,   0)")
    grd.addColorStop(0.34, "rgb(0,   255,   0)")
    grd.addColorStop(0.51, "rgb(0,   255, 255)")
    grd.addColorStop(0.68, "rgb(0,     0, 255)")
    grd.addColorStop(0.85, "rgb(255,   0, 255)")
    grd.addColorStop(1,    "rgb(255,   0,   0)")
    //
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)
    //
    return cnv
}
*/

///////////////////////////////////////////////////////////////////////////////

function paintThisPalette(ctx, width, list, side, rowStart, top, even) {
    //
    const bg1 = even ? "rgb(180,180,180)" : "rgb(235,235,235)"
    const bg2 = even ? "rgb(235,235,235)" : "rgb(180,180,180)"
    //
    let left = rowStart
    //
    for (const raw of list) {
        //
        paintColorOnThisPalette(ctx, raw, left, top, side, bg1, bg2)
        //
        left += side
        if (left >= width ) { left = rowStart; top += side }
    }
}

function paintColorOnThisPalette(ctx, raw, left, top, side, bg1, bg2) {
    //
    if (raw != "blank") {
        ctx.fillStyle = "rgb(" + raw + ")"
        ctx.fillRect(left, top, side, side)
        return
    }
    //
    ctx.fillStyle = bg1
    ctx.fillRect(left, top, side, side)
    //
    const half = Math.floor(side / 2)
    const exact = (side == 2 * half)
    const delta = exact ? 0 : 1
    //
    ctx.fillStyle = bg2
    ctx.fillRect(left, top, half, half+delta)
    ctx.fillRect(left+half, top+half+delta, half+delta, half)
}

// file: component/fonts.js //
// "use strict"

var standardFont = { }
var strongFont = { }
var fontForDark = { }

var fontSheet = null // also works as areFontsReady

const fontReferenceA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const fontReferenceB = "abcdefghijklmnopqrstuvwxyz"
const fontReferenceC = "0123456789.,:;(){}[]<>"
const fontReferenceD = "?/|\\~^'\"!@#$%&*_-+="


const fontGuideA = [0,9,16,7,30,7,44,8,59,7,74,6,87,8,102,7,116,7,131,6,145,8,160,7,174,7,188,7,202,8,217,7,231,8,246,7,260,8,274,8,289,7,303,8,317,9,332,8,346,8,361,7]

const fontGuideB = [1,7,16,7,30,7,44,7,58,8,73,8,87,8,102,7,116,6,130,6,145,8,159,8,173,8,188,7,202,8,217,7,231,8,246,7,260,7,274,8,289,7,303,8,317,9,332,8,346,8,361,7]

const fontGuideC = [1,7,16,7,30,7,44,7,58,8,73,7,87,8,102,7,116,7,130,8,147,4,161,4,175,4,190,4,204,5,218,5,232,6,246,6,262,5,275,5,290,6,304,6]

const fontGuideD = [2,6,16,6,32,3,45,6,59,7,73,7,89,4,102,6,118,4,130,8,145,7,160,7,173,8,188,8,203,7,217,7,232,7,246,7,260,7]

///////////////////////////////////////////////////////////////////////////////

function initFonts() {
    const img = new Image()
    img.onload = function () { fontSheetDownloaded(img) }
    img.src = "images/font-sheet.png"
}

function fontSheetDownloaded(img) {
    fontSheet = cloneImage(img)
    fillFont(strongFont, 0)
    fillFont(standardFont, 60)
    fillFont(fontForDark, 120)
}

///////////////////////////////////////////////////////////////////////////////

function fillFont(font, top) {
    fillFontOnce(font, top, fontReferenceA, fontGuideA)
    top += 15
    fillFontOnce(font, top, fontReferenceB, fontGuideB)
    top += 15
    fillFontOnce(font, top, fontReferenceC, fontGuideC)
    top += 15
    fillFontOnce(font, top, fontReferenceD, fontGuideD)
}

///////////////////////////////////////////////////////////////////////////////

function fillFontOnce(font, top, reference, guide) {
    //
    const bar = createCanvas(370, 15)
    const ctx = bar.getContext("2d")
    ctx.drawImage(fontSheet, 0, -top)
    //
    const symbols = reference.split("")
    let n = -1
    for (const symbol of symbols) {
        n += 1
        const begin = guide[n]
        n += 1
        const width = guide[n]
        //
        const cnv = createCanvas(width, 15)
        const ctx = cnv.getContext("2d")
        //
        const iDelta = (symbol == "i") ? -1 : 0 // ADULTERATING THE FONT 'i' !!!!!!!
        //
        ctx.drawImage(bar, -begin + iDelta, 0)
        //
        font[symbol] = cnv
    }
}

///////////////////////////////////////////////////////////////////////////////

function write(ctx, txt, left, top) {
    const font = isDarkInterface ? fontForDark : standardFont
    //
    writeCore(ctx, font, txt, left, top)
}

function standardWrite(ctx, txt, left, top) {
    writeCore(ctx, standardFont, txt, left, top)
}

function writeOnCanvasHelp(txt, left, top) {
    writeCore(canvasHelpCtx, strongFont, txt, left, top)
    return 15
}

function weakWriteOnCanvasHelp(txt, left, top) {
    writeCore(canvasHelpCtx, standardFont, txt, left, top)
    return 15
}

///////////////////////////////////////////////////////////////////////////////

function writeCore(ctx, font, txt, left, top) {
    //
    for (const c of txt) {
        if (c == " ") { left += 4; continue }
        //
        const spr = font[c]
        ctx.drawImage(spr, left, top)
        left += spr.width
    }
}

///////////////////////////////////////////////////////////////////////////////

function lengthOfText(txt) {
    let length = 0
    //
    for (const c of txt) {
        if (c == " ") { length += 4; continue }
        //
        length += (standardFont[c]).width
    }
    //
    return length
}

// file: component/hsl-gradient.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function createGreyTranslucentGradient() {
    const canvas = createGradient256()
    // vertical reduction
    const canvasV = createCanvas(256, 125)
    const contextV = canvasV.getContext("2d")
    contextV.drawImage(canvas, 0,  0,256,  3,   0,  0,256,  3) // rows   0 to   2 -> rows   0 to   2
    contextV.drawImage(canvas, 0,  3,256,200,   0,  3,256,100) // rows   3 to 202 -> rows   3 to 102
    contextV.drawImage(canvas, 0,203,256, 53,   0,103,256, 23) // rows 203 to 255 -> rows 103 to 125
    // horizontal reduction
    const canvasH = createCanvas(228, 125)  //  <-- final size!!!
    const contextH = canvasH.getContext("2d")
    contextH.drawImage(canvasV,   0,0,  1,125,    0,0,  1,125) // cols   0 to   0 -> cols  0 to   0
    contextH.drawImage(canvasV,   1,0,120,125,    1,0, 60,125) // cols   1 to 120 -> cols  1 to  60
    contextH.drawImage(canvasV, 121,0,135,125,   61,0,167,125) // cols 121 to 255 -> cols 61 to 227
    //
    contextH.fillStyle = "black"
    contextH.fillRect(227, 124, 1, 1)
    //
    return canvasH
}

//////////////////////////////////////////////////////////////////////////////

function createGradient256() {
    const cnv = createCanvas(256, 256)
    const ctx = cnv.getContext("2d")
    //
    ctx.drawImage(createWhiteGradient(), 0, 0)
    ctx.drawImage(createBlackGradient(), 0, 0)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function createWhiteGradient() {
    const cnv = createCanvas(256, 256)
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, 256, 256)
    const data = imgdata.data
    //
    for (let x = 0; x < 256; x++) { paintCol(x) }
    //
    ctx.putImageData(imgdata, 0, 0)
    return cnv
    //
    function paintCol(x) {
        const alpha = 255 - x
        for (let y = 0; y < 256; y++) {
            const index = 4 * (y * 256 + x)
            data[index] = 255
            data[index+1] = 255
            data[index+2] = 255
            data[index+3] = alpha
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

function createBlackGradient() {
    const cnv = createCanvas(256, 256)
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, 256, 256)
    const data = imgdata.data
    //
    for (let y = 0; y < 256; y++) { paintRow(y) }
    //
    ctx.putImageData(imgdata, 0, 0)
    return cnv
    //
    function paintRow(y) {
        const alpha = y
        for (let x = 0; x < 256; x++) {
            const index = 4 * (y * 256 + x)
            data[index] = 0
            data[index+1] = 0
            data[index+2] = 0
            data[index+3] = alpha
        }
    }
}

// file: component/icons.js //
// "use strict"

var icons50 = { }
var icons30 = { }
var icons25 = { }
var specialIcons = { }

var iconSheet = null // also works as areIconsReady

var iconGuide = {
    // row and col are base one //
    "every": [1, 1],
    "rotate-rev": [1,2],
    "animation": [1,4],
    "tile-set": [1, 5],
    "palette": [1, 6],
    "colorize": [2, 1],
    "line": [2, 3],
    "load": [2, 4],
    "rubber": [2, 5],
    "brush": [2, 6],
    "effect": [3, 1],
    "rectangle": [3, 2],
    "save2": [3, 3],
    "scale": [3, 4],
    "save": [4, 1],
    "ellipse": [4, 2],
    "capture": [4, 3],
    "select": [4, 4],
    "roll": [4, 6],
    "hand": [5, 1],
    "bucket": [5, 2],
    "trashcan": [5, 4],
    "paste": [5, 5],
    "border": [5, 6],
    "spray": [6, 1],
    "rotate": [6, 5],
    "black-dot": [8, 6],
    "blur-pixel": [9, 5],
    "clone": [10, 1],
    "mirror-left": [10, 2],
    "both": [10, 3],
    "scissor": [10, 4],
    "left": [10, 5],
    "right": [10, 6],
    "lasso": [11, 4],
    "previous": [11, 2],
    "next": [11, 3],
    "fast": [11, 6],
    "pen": [12, 1],
    "down": [12, 3],
    "up": [12, 4],
    "thin-pen": [12, 5],
    "register": [12, 6],
    "sprite": [13, 1],
    "mask": [13, 2],
    "blur-border": [13, 3],
    "undo": [13, 4],
    "redo": [13, 5],
    "help": [13, 6],
    "center": [14, 1],
    "feather": [14, 2],
    "protection": [14, 3],
    "lighten": [14, 4],
    "darken": [14, 5],
    "exchange": [15, 1],
    "halves-h": [15, 2],
    "halves-v": [15, 2],
    "shear": [15, 4],
    "plus": [16, 1],
    "minus": [16, 2],
    "zoom-in": [16, 3],
    "zoom-out": [16, 4],
    "select-area": [16, 5],
    "config": [16, 6],
    "favorites": [17, 1],
    "mirror-pen": [17, 2],
    "light": [17, 3],
    "color": [17,5],
    "size": [18, 6]
}

///////////////////////////////////////////////////////////////////////////////

function initIcons() {
    const img = new Image()
    img.onload = function () { iconSheetDownloaded(img) }
    img.src = "images/icon-sheet.png?version=20-jun-2021"
}

function iconSheetDownloaded(img) {
    //
    iconSheet = cloneImage(img)
    //
    for (const id of Object.keys(iconGuide)) { createIcon50(id) }
    //
    rotateIcon50("halves-v")
    //
    makeBigTrashcanIcon()
    //
    makeScaledIcon("up", 20, specialIcons)
    makeScaledIcon("down", 20, specialIcons)
    atenuateIcon(specialIcons["up"], 0.2)
    atenuateIcon(specialIcons["down"], 0.2)
    //
    makeBobSpriteIcon()
    makeBobSpriteIconDark()
    //
    makeTextIcons()
}

///////////////////////////////////////////////////////////////////////////////

function getIcon25(id) {
    //
    let icon = icons25[id]
    if (icon == undefined) { makeScaledIcon(id, 25, icons25); icon = icons25[id] }
    return icon
}

function getIcon30(id) {
    //
    let icon = icons30[id]
    if (icon == undefined) { makeScaledIcon(id, 30, icons30); icon = icons30[id] }
    return icon
}

///////////////////////////////////////////////////////////////////////////////

function createIcon50(id) {
    //
    const cnv = createCanvas(50, 50)
    const ctx = cnv.getContext("2d")
    //
    const row = iconGuide[id][0] // base one
    const col = iconGuide[id][1] // base one
    //
    const left = (col - 1) * 50
    const top  = (row - 1) * 50
    //
    ctx.drawImage(iconSheet, -left, -top)
    //
    icons50[id] = cnv
}

function rotateIcon50(id) {
    const src = icons50[id]
    const ctx = src.getContext("2d")
    const clone = cloneImage(src)
    //
    ctx.clearRect(0, 0, 50, 50)
    ctx.save()
    ctx.translate(25, 25)
    ctx.rotate(Math.PI/2)
    ctx.drawImage(clone, -25, -25)
    ctx.restore()
}

///////////////////////////////////////////////////////////////////////////////

function makeScaledIcon(id, side, dict) {
    //
    if (id == "") { return }
    //
    const src = icons50[id]
    //
    const cnv = createCanvas(side, side)
    cnv.getContext("2d").drawImage(src, 0,0,50,50, 0,0,side,side)
    //
    dict[id] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function atenuateIcon(cnv, ga) {
    const clone = cloneImage(cnv)
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    //
    ctx.globalAlpha = ga
    ctx.drawImage(clone, 0, 0)
    ctx.globalAlpha = 1
}

///////////////////////////////////////////////////////////////////////////////

function makeBigTrashcanIcon() {
    const src = icons50["trashcan"]
    const cnv = createCanvas(100, 100)
    cnv.getContext("2d").drawImage(src, 5,5,40,40, 0,0,100,100)
    //
    specialIcons["big-trashcan"] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeBobSpriteIcon() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -2, -850)
    specialIcons["bobsprite"] = cnv
}

function makeBobSpriteIconDark() {
    const cnv = createCanvas(105, 21)
    const ctx = cnv.getContext("2d")
    ctx.drawImage(iconSheet, -125, -850)
    specialIcons["bobsprite-dark"] = cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeTextIcons() {
    const list = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " " ]
    const guide = [ 0,8, 8,8, 16,8, 24,8, 32,8, 40,8, 48,8, 56,8, 64,8, 72,8, 80,8 ]
    //
    const top = 874
    for (const id of list) {
        const left = guide.shift()
        const width = guide.shift()
        //
        const cnv = createCanvas(width, 10)
        cnv.getContext("2d").drawImage(iconSheet, -left, -top)
        //
        specialIcons[id] = cnv
    }
}

// file: component/overlay.js //
// "use strict"

var overlay

///////////////////////////////////////////////////////////////////////////////

function initOverlay() {
    //
    overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.width  = "1300px"
    overlay.style.height = "660px"
    overlay.style.zIndex = "30"
    overlay.style.visibility = "hidden"
    //
    bigdiv.appendChild(overlay)
}

function showOverlay(white) {
    //
    overlay.style.backgroundColor = white ? "white" : "rgba(0,0,0,0.7)"
    //
    overlay.style.visibility = "visible"
}

function hideOverlay() {
    //
    overlay.style.visibility = "hidden"
}

// file: component/numbox.js //
// "use strict"

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

// file: component/slider.js //
// "use strict"

// height of slider is 20

const sliders = { } // just the images

///////////////////////////////////////////////////////////////////////////////

function Slider(id, ctx, left, top, width, value, action) {
    //
    this.kind = "slider"
    //
    this.id = id
    this.parentCtx = ctx
    //
    this.left = left
    this.top = top
    this.width = width
    this.height = 30 // constant; for mouse coordinates only
    //
    this.onClick = function (x) { inputOnSlider(this, x) }
    this.onMouseMove = function (x, __y, dragging) {
        if (dragging) { inputOnSlider(this, x) }
    }
    //
    this.value = value
    this.action = action
}

///////////////////////////////////////////////////////////////////////////////

function createSlider(id, ctx, left, top, width, value, action) {
    //
    const slider = new Slider(id, ctx, left, top, width, value, action)
    //
    Object.seal(slider)
    return slider
}

///////////////////////////////////////////////////////////////////////////////

function resetSlider(slider, value, forced) {
    //
    if (slider.value == value  &&  ! forced) { return }
    //
    slider.value = value
    //
    paintSlider(slider)
}

///////////////////////////////////////////////////////////////////////////////

function paintSlider(slider) {
    //
    const dark = isDarkInterface
    //
    slider.parentCtx.drawImage(sliderBar(slider.width, dark), slider.left, slider.top)
    //
    slider.parentCtx.drawImage(sliderCursor(dark), sliderCursorLeft(slider), slider.top)
}

///////////////////////////////////////////////////////////////////////////////

function sliderBar(width, dark) {
    //
    const id = width + "-" + (dark ? "dark" : "light")
    //
    let slider = sliders[id]
    //
    if (slider == undefined) { slider = createSliderBar(width, dark); sliders[id] = slider }
    //
    return slider
}

///////////////////////////////////////////////////////////////////////////////

function sliderCursor(dark) {
    //
    const id = "cursor-" + (dark ? "dark" : "light")
    //
    let cursor = sliders[id]
    //
    if (cursor == undefined) { cursor = createSliderCursor(dark); sliders[id] = cursor }
    //
    return cursor
}

///////////////////////////////////////////////////////////////////////////////

function sliderCursorLeft(slider) {
    //
    const logicalWidth = slider.width - 20
    //
    const logicalLeft = Math.round(slider.value * logicalWidth)
    //
    return slider.left + 10 + logicalLeft - 10 // +10: visible bar displacement; -10: half cursor width
}

///////////////////////////////////////////////////////////////////////////////

function inputOnSlider(slider, x) {
    //
    const adjustedX = x - 10 // -10: visible bar displacement
    //
    const logicalWidth = slider.width - 20
    //
    slider.value = adjustedX / logicalWidth
    //
    if (slider.value < 0) { slider.value = 0 }
    if (slider.value > 1) { slider.value = 1 }
    //
    paintSlider(slider)
    //
    slider.action(slider)
}

// file: component/slider-parts.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function createSliderCursor(dark) {
    const cnv = createCanvas(20, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : "rgb(90,90,90)"
    ctx.beginPath()
    ctx.arc(10, 10, 9, 0, 2 * Math.PI);
    ctx.fill()
    //
    ctx.fillStyle = dark ? "silver" : wingColorLight
    ctx.beginPath()
    ctx.arc(10, 10, 7, 0, 2 * Math.PI);
    ctx.fill()
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createSliderBar(width, dark) {
    //
    const cnv = createCanvas(width, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : wingColorLight
    ctx.fillRect(0, 0, width, 20)
    //
    const core = createSliderBarCore(width - 20, dark) // reserving space for cursor at ends
    ctx.drawImage(core, 10, 0)
    //
    return cnv
}

function createSliderBarCore(width, dark) {
    //
    const cnv = createCanvas(width, 20)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = dark ? wingColorDark : wingColorLight
    ctx.fillRect(0, 0, width, 20)
    //
    ctx.fillStyle = dark ? "rgb(170,170,180)" : "dimgrey"
    ctx.fillRect(0,  7, width, 2)
    ctx.fillRect(0, 11, width, 2)
    //
    ctx.drawImage(sliderLeftBeacon(dark), 0, 7)
    ctx.drawImage(sliderRightBeacon(dark), width-3, 7)
    //
    if (dark) { ctx.fillRect(2, 9, width-4, 2) }
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function sliderLeftBeacon(dark) {
    if (dark) {
        return sliderBeacon([0,135,138, 135,172,172, 168,172,172], dark)
    }
    return sliderBeacon([0,141,109, 141,105,105, 109,105,170], dark)
}

function sliderRightBeacon(dark) {
    const src = sliderLeftBeacon(dark)
    const clone = cloneImage(src)
    horizontalReverse(clone)
    return clone
}

///////////////////////////////////////////////////////////////////////////////

function sliderBeacon(hints, dark) {
    const cnv = createCanvas(3, 6)
    const ctx = cnv.getContext("2d")
    //
    const colors = [ ]
    for (const hint of hints) { colors.push(colorFromHint(hint, dark)) }
    // top part
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 3; x ++) {
            const index = (y * 3) + x
            const color = colors[index]
            ctx.fillStyle = color
            ctx.fillRect(x, y, 1, 1)
        }
    }
    // bottom part
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 3; x ++) {
            const index = (y * 3) + x
            const color = colors[index]
            ctx.fillStyle = color
            ctx.fillRect(x, (5-y), 1, 1)
        }
    }
    //
    return cnv
}

function colorFromHint(hint, dark) {
    if (hint == 0) { return dark ? wingColorDark : wingColorLight }
    //
    return "rgb(" + hint + "," + hint + "," + hint + ")"
}

// file: component/surface.js //
// "use strict"

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

// file: interface/alternative-save.js //
// "use strict"

var imageForAlternativeSave
var frameForAlternativeSave

///////////////////////////////////////////////////////////////////////////////

function showAlternativeSave() {
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("save2")
    //
    makeCheckedPicture(showAlternativeSave2)
}

function showAlternativeSave2(pic) {
    //
    imageForAlternativeSave = pic
    //
    MODE = "alternative-save"
    //
    showOverlay(true)
    //
    const width = 2 + imageForAlternativeSave.width
    const height = 2 + imageForAlternativeSave.height
    //
    const left = Math.floor((1300 - width) / 2)
    const top  = Math.floor((660 - height) / 2)
    //
    frameForAlternativeSave = createCanvas(width, height)
    const ctx = frameForAlternativeSave.getContext("2d")
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    ctx.clearRect(1, 1, width-2, height-2)
    //
    frameForAlternativeSave.style.position = "absolute"
    frameForAlternativeSave.style.zIndex = "32"
    frameForAlternativeSave.style.left = (left - 1) + "px"
    frameForAlternativeSave.style.top = (top - 1) + "px"
    bigdiv.appendChild(frameForAlternativeSave)
    //
    imageForAlternativeSave.style.position = "absolute"
    imageForAlternativeSave.style.zIndex = "33"
    imageForAlternativeSave.style.left = left + "px"
    imageForAlternativeSave.style.top = top + "px"
    bigdiv.appendChild(imageForAlternativeSave)
}

function hideAlternativeSave() {
    MODE = "standard"
    bigdiv.removeChild(frameForAlternativeSave)
    bigdiv.removeChild(imageForAlternativeSave)
    hideOverlay()
}

// file: interface/bottom-bar.js //
// "use strict"

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

// file: interface/canvas-animation.js //
// "use strict"

var animationCnv
var animationCtx

var frameOffIcon
var frameCanvasIcon
var frameIconChessBg

var frameIconAtMouseDown = -1 // the index

var animationChessBg

var animationFps = 5 // 3, 5, 10, 15, 30

var animationZoom = 1

var animationClock = 0
var indexOfLastAnimatedObj = -1

var pictureForAnimation

///////////////////////////////////////////////////////////////////////////////

function initCanvasAnimation() {
    //
    animationCnv = createCanvas(1300, 660)
    animationCtx = animationCnv.getContext("2d")
    //
    animationCtx["imageSmoothingEnabled"] = false
    //
    animationCnv.style.position = "absolute"
    animationCnv.style.zIndex = "11"
    animationCnv.style.visibility = "hidden"
    //
    bigdiv.appendChild(animationCnv)
    //
    initCanvasAnimation2()
}

function initCanvasAnimation2() {
    //
    frameOffIcon = makeFrameOffIcon()
    frameCanvasIcon = makeFrameCanvasIcon()
    frameIconChessBg = createChessBox(80, 80, 20, chessIconColorA, chessIconColorB)
    animationChessBg = createChessBox(400, 400, 25, chessIconColorA, chessIconColorB)
    //
    animationCnv.onwheel = animationOnWheel
    animationCnv.onmouseup = animationOnMouseUp
    animationCnv.onmousedown = animationOnMouseDown
    animationCnv.onmousemove = animationOnMouseMove
    animationCnv.onmouseleave = animationOnMouseLeave
}

///////////////////////////////////////////////////////////////////////////////

function showAnimation() {
    //
    if (toplayer == null) { customAlert("cannot show animation: no layer is on"); return }
    //
    if (favorites.length == 0) { customAlert("cannot show animation: no favorite (memorized image)"); return }
    //
    resetFocusedGadget()
    //
    startBlinkingIconOnTopBar("animation")
    //
    makeCheckedPicture(showAnimation2)
}

function showAnimation2(pic) {
    //
    MODE = "animation"
    //
    prepareAnimation(pic)
    paintPanelAnimation()
    //
    animationCnv.style.visibility = "visible"
}

function hideAnimation() {
    MODE = "standard"
    animationCnv.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelAnimation() {  // mainLoop will call drawAnimation
    // reseting animation stats
    animationClock = 0
    indexOfLastAnimatedObj = -1
    //
    animationCtx.fillStyle = "rgb(192,192,192)"
    animationCtx.fillRect(0, 0, 1300, 660)
    //
    animationCtx.lineWidth = 1
    animationCtx.strokeStyle = "rgb(48,48,48)"
    animationCtx.strokeRect(2, 2, 1296, 656)
    //
    paintAnimationFps()
    standardWrite(animationCtx, "zoom " + animationZoom + "x", 625, 485)
    //
    standardWrite(animationCtx, "animation", 610, 10)
    //
    const msg =  "   Uses the first 12 favorites and the current canvas      |" +
                 "     Clicking any frame toggles it on/off    |" +
                 "     Left and right arrows move the frame CANVAS    |" +
                 "     Any other key closes this panel"
    //
    standardWrite(animationCtx, msg, 20, 630)
    //
    paintAnimationIcons()
}

///////////////////////////////////////////////////////////////////////////////

function paintAnimationFps() {
    //
    animationCtx.strokeStyle = "grey"
    animationCtx.lineWidth = 2
    //
    for (let n = 0; n < 5; n++) {
        const x = 955 + n * 50
        animationCtx.strokeRect(x, 200, 40, 30)
    }
    //
    standardWrite(animationCtx, "frames per second", 1015, 180)
    const msg = "  3          5          10         15         30"
    standardWrite(animationCtx, msg, 965, 210)
    //
    const index = [3, 5, 10, 15, 30].indexOf(animationFps)
    const left = 955 + (index * 50)
    animationCtx.strokeStyle = "black"
    animationCtx.strokeRect(left, 200, 40, 30)
}

///////////////////////////////////////////////////////////////////////////////

function paintAnimationIcons() {
    //
    let x = 15 - 99
    const y = 530
    //
    for (const obj of animationObjs) {
        //
        x += 99
        //
        animationCtx.strokeStyle = "black"
        animationCtx.lineWidth = 1
        animationCtx.strokeRect(x-1, y-1, 82, 82)
        //
        if (! obj.isOn) { animationCtx.drawImage(frameOffIcon, x, y); continue }
        //
        if (obj.isCanvas) { animationCtx.drawImage(frameCanvasIcon, x, y); continue }
        //
        if (backgroundColor == "blank") {
            //
            animationCtx.drawImage(frameIconChessBg, x, y)
        }
        else {
            animationCtx.fillStyle = backgroundColor
            animationCtx.fillRect(x, y, 80, 80)
        }
        //
        const fav = favorites[obj.favIndex]
        //
        animationCtx.drawImage(fav.icon, 0,0,100,100, x,y,80,80)
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function animationOnWheel(e) {
    //
    const delta = (e.deltaY > 0) ? -1 : +1
    //
    const zoom = animationZoom + delta
    //
    if (zoom < 1) { return }
    if (zoom > 3) { return }
    //
    animationZoom = zoom
    paintPanelAnimation()
}

///////////////////////////////////////////////////////////////////////////////

function animationOnMouseDown(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    frameIconAtMouseDown = frameIndexByMouse(x, y)
    changeFpsByMouse(x, y)
}

function animationOnMouseUp(e) {
    //
    if (frameIconAtMouseDown == -1) { return }
    //
    const previous = frameIconAtMouseDown
    frameIconAtMouseDown = -1
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = frameIndexByMouse(x, y)
    //
    if (index == -1) { return }
    //
    if (index == previous) { toggleAnimationFrameOnOff(index) }
}

function animationOnMouseMove(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = frameIndexByMouse(x, y)
    //
    if (index == -1) { frameIconAtMouseDown = -1 }
}

function animationOnMouseLeave() {
    //
    frameIconAtMouseDown = -1
}

function frameIndexByMouse(x, y) {
    //
    if (y < 530) { return -1 }
    if (y > 610) { return -1 }
    //
    const adjustedX = x - 15
    //
    if (adjustedX < 0) { return -1 }
    //
    const col = Math.floor(adjustedX / 99)
    //
    if (adjustedX - (col * 99) > 79) { return -1 }
    //
    return col
}

///////////////////////////////////////////////////////////////////////////////

function changeFpsByMouse(x, y) {
    //
    if (y < 201) { return }
    if (y > 229) { return }
    //
    if (x < 957) { return }
    if (x < 995) { changeFps(3); return }
    //
    if (x < 957 + 50) { return }
    if (x < 995 + 50) { changeFps(5); return }
    //
    if (x < 957 + 100) { return }
    if (x < 995 + 100) { changeFps(10); return }
    //
    if (x < 957 + 150) { return }
    if (x < 995 + 150) { changeFps(15); return }
    //
    if (x < 957 + 200) { return }
    if (x < 995 + 200) { changeFps(30); return }
}

function changeFps(fps) {
    //
    if (fps != animationFps) { animationFps = fps; paintPanelAnimation() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function drawAnimation() { // called by mainLoop if MODE=="animation"
    //
    if (favorites.length == 0) { return }
    //
    const intervalInLoops = 30 / animationFps // mainLoop runs at 30 FPS
    //
    if (LOOP < animationClock + intervalInLoops) { return }
    //
    animationClock = LOOP
    //
    animationCtx.strokeStyle = "black"
    animationCtx.lineWidth = 1
    animationCtx.strokeRect(448, 68, 404, 404)
    //
    if (backgroundColor == "blank") {
        //
        animationCtx.drawImage(animationChessBg, 449, 69)
    }
    else {
        animationCtx.fillStyle = backgroundColor
        animationCtx.fillRect(449, 69, 402, 402)
    }
    //
    drawAnimationFrame()
}

function drawAnimationFrame() { // 402 x 402 px virtual canvas
    //
    indexOfLastAnimatedObj = indexOfNextAnimationObj()
    //
    if (indexOfLastAnimatedObj == -1) { return }
    //
    const obj = animationObjs[indexOfLastAnimatedObj]
    //
    const src = (obj.isCanvas) ? pictureForAnimation : favorites[obj.favIndex].canvas
    //
    const side = 402 / animationZoom
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    const left = Math.floor((side - src.width) / 2)
    const top  = Math.floor((side - src.height) / 2)
    //
    ctx.drawImage(src, left, top)
    //
    animationCtx.drawImage(cnv, 0,0,side,side, 449,69,402,402)
}

// file: interface/canvas-favorites.js //
// "use strict"

var favoritesCnv
var favoritesCtx

var favoritesChessBg

var favoritesCursor = ""

var mouseDownOnFavoritesWasOK = false

///////////////////////////////////////////////////////////////////////////////

function initCanvasFavorites() {
    //
    favoritesCnv = createCanvas(1300, 660)
    favoritesCtx = favoritesCnv.getContext("2d")
    //
    favoritesCnv.style.position = "absolute"
    favoritesCnv.style.zIndex = "11"
    favoritesCnv.style.visibility = "hidden"
    //
    bigdiv.appendChild(favoritesCnv)
    //
    initCanvasFavorites2()
}

function initCanvasFavorites2() {
    //
    favoritesChessBg = createChessBox(100, 100, 25, chessIconColorA, chessIconColorB)
    //
    favoritesCnv.onmouseup = favoritesOnMouseUp
    favoritesCnv.onmousedown = favoritesOnMouseDown
    favoritesCnv.onmousemove = favoritesOnMouseMove
    favoritesCnv.onmouseleave = favoritesOnMouseLeave
}

///////////////////////////////////////////////////////////////////////////////

function showFavorites() {
    //
    MODE = "favorites"
    resetFocusedGadget()
    //
    startBlinkingIconOnTopBar("favorites")
    //
    favoritesCursor = ""
    mouseDownOnFavoritesWasOK = false
    paintFavorites()
    //
    favoritesCnv.style.visibility = "visible"
}

function hideFavorites() {
    MODE = "standard"
    favoritesCnv.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function setFavoritesCursorDefault() {
    //
    if (favoritesCursor == "") { return }
    //
    favoritesCursor = ""
    favoritesCnv.style.cursor = ""
}

function setFavoritesCursorMove() {
    //
    if (favoritesCursor == "move") { return }
    //
    favoritesCursor = "move"
    favoritesCnv.style.cursor = "move"
}

///////////////////////////////////////////////////////////////////////////////

function paintFavorites() {
    //
    favoritesCtx.fillStyle = "rgb(192,192,192)"
    favoritesCtx.fillRect(0, 0, 1300, 660)
    //
    favoritesCtx.lineWidth = 1
    favoritesCtx.strokeStyle = "rgb(48,48,48)"
    favoritesCtx.strokeRect(2, 2, 1296, 656)
    //
    standardWrite(favoritesCtx, "favorites", 610, 10)
    //
    if (favorites.length == 0) {
        //
        standardWrite(favoritesCtx, "No favorite to show", 590, 330)
        standardWrite(favoritesCtx, "Type any key to close this panel", 545, 360)
        //
        return
    }
    //
    const msg =  "       Use mouse to drag any favorite       |" +
                 "       The first 12 favorites will be used in panel Animation        |" +
                 "       Type any key to close this panel"
    //
    standardWrite(favoritesCtx, msg, 20, 625)
    //
    let n = 0
    let x = 15
    let y = 35
    //
    while (n < favorites.length) {
        //
        paintFavorite(n, x, y)
        //
        x += 130
        if (x >= 1200) { x = 15; y += 120 }
        //
        n += 1
    }
    //
    favoritesCtx.drawImage(specialIcons["big-trashcan"], 1185, 515)
    //
    markFavorite(indexOfSelectedFavorite)
}

function paintFavorite(n, x, y) {
    //
    favoritesCtx.fillStyle = "black"
    favoritesCtx.fillRect(x-1, y-1, 102, 102)
    //
    if (backgroundColor == "blank") {
        //
        favoritesCtx.drawImage(favoritesChessBg, x, y)
    }
    else {
        favoritesCtx.fillStyle = backgroundColor
        favoritesCtx.fillRect(x, y, 100, 100)
    }
    //
    const f = favorites[n]
    favoritesCtx.drawImage(f.icon, x, y)
}

function markFavorite(n) {
    const row = Math.floor(n / 10)
    const col = n - (row * 10)
    //
    const x = 15 + (col * 130)
    const y = 35 + (row * 120)
    //
    favoritesCtx.lineWidth = 4
    favoritesCtx.strokeStyle = "rgb(48,48,48)"
    favoritesCtx.strokeRect(x-5, y-5, 110, 110)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function favoriteIndexByMouse(x, y) {
    const row = favoriteRow(y)
    const col = favoriteCol(x)
    //
    if (row == -1) { return -1 }
    if (col == -1) { return -1 }
    //
    let index = (row * 10) + col
    //
    if (index == 49) { return 49 } // trashcan
    //
    if (index > favorites.length - 1) { return -1 }
    //
    return index
}

function favoriteRow(y) {
    const adjustedY = y - 35
    if (adjustedY < 0) { return -1 }
    //
    const row = Math.floor(adjustedY / 120)
    if (row > 4) { return -1 }
    //
    const relativeY = adjustedY - (row * 120)
    if (relativeY > 99) { return -1 }
    //
    return row
}

function favoriteCol(x) {
    const adjustedX = x - 15
    if (adjustedX < 0) { return -1 }
    //
    const col = Math.floor(adjustedX / 130)
    if (col > 9) { return -1 }
    //
    const relativeX = adjustedX - (col * 130)
    if (relativeX > 99) { return -1 }
    //
    return col
}

///////////////////////////////////////////////////////////////////////////////

function favoritesOnMouseDown(e) {
    //
    const x = e.offsetX
    const y = e.offsetY
    let index = favoriteIndexByMouse(x, y)
    //
    mouseDownOnFavoritesWasOK = false
    //
    if (index == -1) { return } // nothing
    if (index == 49) { return } // trashcan
    //
    mouseDownOnFavoritesWasOK = true
    //
    indexOfSelectedFavorite = index
    //
    paintFavorites()
}

function favoritesOnMouseUp(e) {
    //
    setFavoritesCursorDefault()
    //
    if (! mouseDownOnFavoritesWasOK) { return }
    //
    mouseDownOnFavoritesWasOK = false
    //
    const x = e.offsetX
    const y = e.offsetY
    const index = favoriteIndexByMouse(x, y)
    //
    if (index == -1) { return } // nothing
    //
    if (index == 49) { deleteFavorite(); return } // trashcan
    //
    if (index == indexOfSelectedFavorite) { return } // self click
    //
    exchangeFavorites(indexOfSelectedFavorite, index) // exchange
}

function favoritesOnMouseMove(e) {
    //
    const y = e.offsetY
    const dragging = (e.buttons == 1)
    //
    if (dragging  &&  y < 620  &&  mouseDownOnFavoritesWasOK) {
        //
        setFavoritesCursorMove()
    }
    else {
        setFavoritesCursorDefault()
    }
}

function favoritesOnMouseLeave() {
    //
    setFavoritesCursorDefault()
    //
    mouseDownOnFavoritesWasOK = false
}

// file: interface/canvas-help.js //
// "use strict"

var canvasHelp
var canvasHelpCtx

///////////////////////////////////////////////////////////////////////////////

function initCanvasHelp() {
    canvasHelp = createCanvas(1300, 600)
    canvasHelpCtx = canvasHelp.getContext("2d")
    //
    canvasHelp.style.position = "absolute"
    canvasHelp.style.top = "30px"
    canvasHelp.style.zIndex = "31"
    canvasHelp.style.visibility = "hidden"
    //
    bigdiv.appendChild(canvasHelp)
    //
    initCanvasHelp2()
}

function initCanvasHelp2() {
    canvasHelp.onclick = showOrHideHelp
}

function resetCanvasHelp() {
    //
    canvasHelpCtx.fillStyle = "rgb(192,192,192)"
    canvasHelpCtx.fillRect(0, 0, 1300, 600)
    //
    canvasHelpCtx.lineWidth = 1
    canvasHelpCtx.strokeStyle = "rgb(48,48,48)"
    canvasHelpCtx.strokeRect(2, 2, 1296, 596)
    canvasHelpCtx.strokeStyle = "rgb(160,160,160)"
    canvasHelpCtx.strokeRect(432, 25, 1, 540)
    canvasHelpCtx.strokeRect(866, 25, 1, 540)
}

///////////////////////////////////////////////////////////////////////////////

function showCanvasHelp() {
    canvasHelp.style.visibility = "visible"
}

function hideCanvasHelp() {
    canvasHelp.style.visibility = "hidden"
}

// file: interface/interface.js //
// "use strict"

const wingColorDark = "rgb(102,104,108)"
const wingColorLight = "rgb(192,192,192)"

var bigdiv

///////////////////////////////////////////////////////////////////////////////

function initInterface() {
    //
    bigdiv = document.getElementById("bigdiv")
    resetBigDivPosition()
    //
    initOverlay()
    initCanvasFavorites()
    initCanvasAnimation()
    initCanvasHelp()
    //
    initTopBar()
    initStage()
    initBottomBar()
    //
    initToolbox()
    initPanelLayers()
    initPanelOpacity()
    //
    initPanelMonitor()
    initMiniBar()
    initPolyPanel()
    //
    initSuperHand()
    //
    paintInterface()
    startListening()
}

function resetBigDivPosition() {
    let excedent = window.innerWidth - 1300
    if (excedent <= 0) { excedent = 0 }
    //
    const left = Math.floor(excedent / 2)
    bigdiv.style.left = left + "px"
}

///////////////////////////////////////////////////////////////////////////////

function paintInterface() {
    //
    paintTopBar()
    shallRepaint = true // necessary
    paintStage()
    paintBottomBar()
    //
    paintToolbox()
    //
    paintPanelLayers()
    paintPanelOpacity()
    //
    paintPanelMonitor()
    paintMiniBar()
    //
    paintAndShowPolyPanel()
}

///////////////////////////////////////////////////////////////////////////////

function startListening() {
    //
    startListeningTopBar()
    startListeningStage()
    startListeningBottomBar()
    startListeningToolbox()
    startListeningPanelLayers()
    startListeningPanelOpacity()
    startListeningPanelMonitor()
    startListeningMiniBar()
    startListeningPolyPanel()
}

///////////////////////////////////////////////////////////////////////////////

function wingColor() {
    if (isDarkInterface) { return wingColorDark }
    return wingColorLight
}

function __stageColor() { // unused
 // if (isDarkInterface) { return "rgb(88,90,92)" }
 // return "rgb(110,112,114)"
    if (isDarkInterface) { return "rgb(46,48,52)" }
    return "rgb(130,132,134)"
}

function bottomBarColor() {
    if (isDarkInterface) { return "rgb(94,96,100)" }
    return "rgb(208,208,208)"
}

function foldColor() {
    if (isDarkInterface) { return "rgb(78,80,84)" }
    return "darkgrey"
}

function canvasFrameColor() {
    if (isDarkInterface) { return "rgb(48,48,48)" }
    return "rgb(128,128,128)"
}

// file: interface/mini-bar.js //
// "use strict"

var miniBar
var miniBarCtx

const miniBarScheme = [
    "palette",
    "color",
    "size",
    "effect",
    "colorize",
    "shear",
    "config"
]

const miniBarLefts = [ ]

var selectedOnMiniBar = "palette"

///////////////////////////////////////////////////////////////////////////////

function initMiniBar() {
    fillMiniBarLefts()
    //
    miniBar = createCanvas(240, 30)
    miniBarCtx = miniBar.getContext("2d")
    //
    miniBar.style.position = "absolute"
    miniBar.style.top = "295px"
    miniBar.style.left = "1060px"
    //
    bigdiv.appendChild(miniBar)
    //
    initMiniBar2()
}

function initMiniBar2() {
    fillMiniBarLefts()
}

function fillMiniBarLefts() {
    let left = 8
    //
    const off = miniBarScheme.length
    for (let n = 0; n < off; n++) {
        miniBarLefts.push(left)
        left += 33
    }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningMiniBar() {
    miniBar.onmousedown = resetFocusedGadget
    miniBar.onclick = miniBarClicked
}

///////////////////////////////////////////////////////////////////////////////

function paintMiniBar() {
    paintMiniBarBg()
    //
    miniBarCtx.fillStyle = wingColor()
    miniBarCtx.fillRect(0, 0, 240, 30)
    //
    greyTraceH(miniBarCtx, 5, 29, 230)
    //
    const off = miniBarScheme.length
    for (let n = 0; n < off; n++) {
        const id = miniBarScheme[n]
        const left = miniBarLefts[n]
        paintIconOnMiniBar(id, left)
    }
}

function paintMiniBarBg() {
    miniBarCtx.fillStyle = wingColor()
    miniBarCtx.fillRect(0, 0, 240, 45)
}

function paintIconOnMiniBar(id, left) {
    if (id == selectedOnMiniBar) { paintBgOn25(miniBarCtx, left, 2) }
    //
    const icon = getIcon25(id)
    miniBarCtx.drawImage(icon, left, 2)
}

///////////////////////////////////////////////////////////////////////////////

function miniBarClicked(e) {
    const wanted = clickedIconOnMiniBar(e.offsetX, e.offsetY)
    //
    if (wanted == "") { return }
    //
    hidePolyPanel()
    selectedOnMiniBar = wanted
    paintMiniBar()
    paintAndShowPolyPanel()
}

function clickedIconOnMiniBar(x, y) {
    if (y < 3)  { return "" }
    if (y > 28) { return "" }
    //
    const off = miniBarLefts.length
    for (let n = 0; n < off; n++) {
        const left = miniBarLefts[n]
        const a = left - 1 // start including 1 pixel
        const b = left + 25 + 1 // end inluding 1 pixel
        //
        if (x < a) { continue }
        if (x > b) { continue }
        return miniBarScheme[n]
    }
    return ""
}

// file: interface/panel-color.js //
// "use strict"

// NOT REALLY A PANEL!

var hslOrRgba = "hsl"

var referenceRed   = 255 // 90
var referenceGreen =  81 // 130
var referenceBlue  =  55 // 200
var referenceAlpha = 255

///////////////////////////////////////////////////////////////////////////////

function tradeColors() {
    //
    const color = [ referenceRed, referenceGreen, referenceBlue, referenceAlpha ]
    //
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA
    //
    updateCurrentColor(color)
}

///////////////////////////////////////////////////////////////////////////////

function paintAndShowPanelColor() {
    //
    if (hslOrRgba == "hsl") {
        //
        paintPanelHsl()
        panelHsl.style.visibility = "visible"
    }
    else {
        //
        paintPanelRgba()
        panelRgba.style.visibility = "visible"
    }
}

function hidePanelColor() {
    //
    if (hslOrRgba == "hsl") {
        panelHsl.style.visibility = "hidden"
    }
    else {
        panelRgba.style.visibility = "hidden"
    }
}

///////////////////////////////////////////////////////////////////////////////

function maybeRepaintColorPanel() {
    //
    if (selectedOnMiniBar != "color") { return }
    //
    if (hslOrRgba == "hsl") { paintPanelHsl() } else { paintPanelRgba() }
}

// file: interface/panel-color-hsl-1.js //
// "use strict"

var panelHsl
var panelHslCtx

var surfaceHslReference
var surfaceHslCurrent

var surfaceHsl
var surfaceHue
var surfaceDetail

var buttonHslCopy
var buttonToRgba

var panelHslGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelHsl() {
    panelHsl = createCanvas(240, 305)
    panelHslCtx = panelHsl.getContext("2d")
    //
    panelHsl.style.position = "absolute"
    panelHsl.style.top = "325px"
    panelHsl.style.left = "1060px"
    panelHsl.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelHsl)
    //
    initPanelHsl2()
}

function initPanelHsl2() {
    //
    initHslComplements()
    //
    surfaceHslReference = createSurface("hsl-reference", panelHslCtx, 40, 4, 80, 35)
    configSurfaceHslReference()
    //
    surfaceHslCurrent = createSurface("hsl-current", panelHslCtx, 120, 4, 80, 35)
    configSurfaceHslCurrent()
    //
    surfaceHsl = createSurface("box-hsl", panelHslCtx, 6-5, 48-5, 228+10, 125+10)
    configSurfaceHsl()
    //
    surfaceDetail = createSurface("box-detail", panelHslCtx, 3, 185, 234, 25)
    configSurfaceDetail()
    //
    surfaceHue = createSurface("box-hue", panelHslCtx, 3, 217, 234, 41)
    configSurfaceHue()
    //
    buttonToRgba = createButton("to-rgba", panelHslCtx,  13, 267, 97, 30, "to  R G B A", changeToRgba, false)
    buttonHslCopy = createButton("hsl-copy", panelHslCtx, 130, 267, 97, 30, "copy to ref", hslCopyToReference, false)
    //
    panelHslGadgets = [ surfaceHslReference, surfaceHslCurrent, surfaceHue, surfaceHsl, surfaceDetail,
                        buttonToRgba, buttonHslCopy ]
    //
    adjustHslGadgetsToCurrentColor()
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelHsl() {
    panelHsl.onmouseup = panelOnMouseUp
    panelHsl.onmousedown = panelOnMouseDown
    panelHsl.onmousemove = panelOnMouseMove
    panelHsl.onmouseleave = panelOnMouseLeave
    panelHsl.onmouseenter = function () { panelOnMouseEnter(panelHslGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelHsl() {
    // background
    panelHslCtx.fillStyle = wingColor()
    panelHslCtx.fillRect(0, 0, 240, 305)
    //
    greyEmptyRect(panelHslCtx, surfaceHslReference.left-1, surfaceHslReference.top-1,
                               surfaceHslReference.width*2+2, surfaceHslReference.height+2)
    //
    paintSurfaceHslReference()
    paintSurfaceHslCurrent()
    //
    write(panelHslCtx, "ref", 10, 17)
    write(panelHslCtx, "cur", 205, 17)
    //
    greyEmptyRect(panelHslCtx, surfaceHsl.left+5-1, surfaceHsl.top+5-1,
                               surfaceHsl.width-10+2, surfaceHsl.height-10+2)
    //
    greyOuterEdgeByGadget(surfaceDetail)
    //
    adjustHslGadgetsToCurrentColor()
    //
    greyOuterEdgeByGadget(surfaceHue)
    paintSurface(surfaceHue)
    //
    paintButton(buttonToRgba)
    paintButton(buttonHslCopy)
}

function paintSurfaceHslReference() {
    //
    panelHslCtx.fillStyle = "rgb(" + referenceRed + "," + referenceGreen + "," + referenceBlue + ")"
    //
    const gadget = surfaceHslReference
    panelHslCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceHslReference) { return }
    //
    changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha], true)
}

function paintSurfaceHslCurrent() {
    //
    panelHslCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    //
    const gadget = surfaceHslCurrent
    panelHslCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceHslCurrent) { return }
    //
    changeMouseColor([RED, GREEN, BLUE, ALPHA], true)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHslReference() {
    //
    surfaceHslReference.onMouseMove = function () { changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha]) }
    //
    surfaceHslReference.onMouseDown = function () { tradeColors(); paintPanelHsl() }
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHslCurrent() {
    //
    surfaceHslCurrent.onMouseMove = function () { changeMouseColor([RED, GREEN, BLUE, ALPHA]) }
    //
    surfaceHslCurrent.onMouseDown = function () { tradeColors(); paintPanelHsl() }
}

///////////////////////////////////////////////////////////////////////////////

function adjustHslGadgetsToCurrentColor() {
    //
    const color = [RED, GREEN, BLUE]
    //
    const hsl = rgbToHsl(color)
    const hue = hsl[0]
    //
    paintSurfaceDetail(hue)
    //
    drawHslGradient(hue)
    //
    const point = bestMatchingPixel(hslGradient, color) // must send canvas without marker!
    surfaceHslX = point.x
    surfaceHslY = point.y
    //
    repaintSurfaceHsl()
}

///////////////////////////////////////////////////////////////////////////////

function updateByHue() {
    const hsl = rgbToHsl([mouseRed, mouseGreen, mouseBlue])
    const hue = hsl[0]
    //
    paintSurfaceDetail(hue)
    paintSurfaceHsl(hue)
    updateCurrentColorByHsl()
}

function updateByDetail() {
    const hsl = rgbToHsl([mouseRed, mouseGreen, mouseBlue])
    const hue = hsl[0]
    //
    paintSurfaceHsl(hue)
    updateCurrentColorByHsl()
}

function updateCurrentColorByHsl() { // not by input on surfaceHsl
    const color = colorAtHslMark()
    //
    updateCurrentColor(color) // alpha is 255
    //
    paintSurfaceHslCurrent()
}

///////////////////////////////////////////////////////////////////////////////

function hslCopyToReference() {
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA
    //
    paintSurfaceHslReference()
}

///////////////////////////////////////////////////////////////////////////////

function changeToRgba() {
    hidePolyPanel()
    hslOrRgba = "rgba"
    startBlinkingButton(buttonToHsl) // other panel button
    paintAndShowPolyPanel()
}

// file: interface/panel-color-hsl-2.js //
// "use strict"

var surfaceHslCtx
var surfaceHueCtx
var surfaceDetailCtx

var surfaceHslX
var surfaceHslY

var hslGradient    // 228 x 125
var hslGradientCtx

var greyTranslucentGradient // 228 x 125

var hslMarker

///////////////////////////////////////////////////////////////////////////////

function initHslComplements() {
    //
    hslMarker = createMarker(11)
    //
    greyTranslucentGradient = createGreyTranslucentGradient()
    //
    hslGradient = createCanvas(228, 125)
    hslGradientCtx = hslGradient.getContext("2d")
}

function drawHslGradient(hue) {
    //
    hslGradientCtx.fillStyle = "hsl(" + hue + ",100%,50%)" // solid
    hslGradientCtx.fillRect(0, 0, 228, 125)
    //
    hslGradientCtx.drawImage(greyTranslucentGradient, 0, 0) // translucent
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceHue() {
    //
    const width = surfaceHue.width
    const height = surfaceHue.height
    //
    surfaceHue.canvas = createStandardHueCanvas(width, height)
    surfaceHueCtx = surfaceHue.canvas.getContext("2d")
    //
    surfaceHue.onMouseDown = updateByHue
    surfaceHue.onMouseMove = surfaceHueOnMouseMove
}

function surfaceHueOnMouseMove(x, y, dragging) {
    //
    changeMouseColor(colorAtHue(x, y))
    //
    if (dragging) { updateByHue() }
}

function colorAtHue(x, y) {
    //
    return surfaceHueCtx.getImageData(x, y, 1, 1).data
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceDetail() {
    //
    surfaceDetailCtx = surfaceDetail.canvas.getContext("2d")
    //
    surfaceDetail.onMouseDown = updateByDetail
    surfaceDetail.onMouseMove = surfaceDetailOnMouseMove
}

function surfaceDetailOnMouseMove(x, y, dragging) {
    //
    changeMouseColor(colorAtDetail(x, y))
    //
    if (dragging) { updateByDetail() }
}

function paintSurfaceDetail(hue) {
    //
    drawSurfaceDetail(hue)
    paintSurface(surfaceDetail)
}

function drawSurfaceDetail(hue) {
    //
    hue = Math.round(hue)
    if (hue >= 360) { hue -= 360 }
    //
    const width = surfaceDetail.canvas.width
    const height = surfaceDetail.canvas.height
    const thick = 8
    const amount = Math.ceil(width / thick)
    const half = Math.round(amount / 2)
    //
    let start = hue - half // hue is already rounded
    for (let n = 0; n < amount; n++) {
        let hue = start + n
        if (hue < 0)    { hue += 360 }
        if (hue >= 360) { hue -= 360 }
        //
        surfaceDetailCtx.fillStyle = "hsl(" + hue + ",100%,50%)"
        surfaceDetailCtx.fillRect(n*thick, 0, thick, height)
    }
}

function colorAtDetail(x, y) {
    //
    return surfaceDetailCtx.getImageData(x, y, 1, 1).data
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function configSurfaceHsl() {
    //
    surfaceHsl.canvas = createCanvas(228, 125) // reduced canvas helps set marker on edges!!!
    surfaceHslCtx = surfaceHsl.canvas.getContext("2d")
    //
    surfaceHslX = 227
    surfaceHslY = 0
    //
    surfaceHsl.onMouseDown = surfaceHslOnMouseDown
    surfaceHsl.onMouseMove = surfaceHslOnMouseMove
}

function surfaceHslOnMouseDown(x, y) {
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y)
    //
    const color = colorAtHsl(x, y)
    updateCurrentColor(color) // alpha is 255
    //
    inputOnSurfaceHsl(x, y)
    paintSurfaceHslCurrent()
}

function surfaceHslOnMouseMove(x, y, dragging) {
    //
    if (dragging) { draggingOnSurfaceHsl(x, y) } else { justMovingOnSurfaceHsl(x, y) }
}

///////////////////////////////////////////////////////////////////////////////

function justMovingOnSurfaceHsl(x, y) {
    //
    if (x < 5) { eraseMouseColor(); return }
    if (y < 5) { eraseMouseColor(); return }
    //
    if (x > 232) { eraseMouseColor(); return }
    if (y > 129) { eraseMouseColor(); return }
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y)
    //
    changeMouseColor(colorAtHsl(x, y))
}

function draggingOnSurfaceHsl(x, y) {
    //
    x = fixedXForSurfaceHsl(x)
    y = fixedYForSurfaceHsl(y)
    //
    const color = colorAtHsl(x, y)
    changeMouseColor(color)
    updateCurrentColor(color) // alpha is 255
    //
    inputOnSurfaceHsl(x, y)
    paintSurfaceHslCurrent()
}

function inputOnSurfaceHsl(x, y) {
    //
    surfaceHslX = x
    surfaceHslY = y
    repaintSurfaceHsl() // must repaint because marker has new position
}

///////////////////////////////////////////////////////////////////////////////

function paintSurfaceHsl(hue) {
    //
    drawHslGradient(hue)
    repaintSurfaceHsl()
}

function repaintSurfaceHsl() { // keeps the same hue
    //
    surfaceHslCtx.drawImage(hslGradient, 0, 0)
    surfaceHslCtx.drawImage(hslMarker, surfaceHslX - 5, surfaceHslY - 5)
    //
    panelHslCtx.drawImage(surfaceHsl.canvas, surfaceHsl.left + 5, surfaceHsl.top + 5)
}

///////////////////////////////////////////////////////////////////////////////

function fixedXForSurfaceHsl(x) {
    x -= 5
    if (x < 0) { return 0 }
    if (x > 227) { return 227 }
    return x
}

function fixedYForSurfaceHsl(y) {
    y -= 5
    if (y < 0) { return 0 }
    if (y > 124) { return 124 }
    return y
}

function colorAtHsl(x, y) {
    //
    return hslGradientCtx.getImageData(x, y, 1, 1).data // must be on hslGradientCtx because of the mark
}

function colorAtHslMark() { // for passive color update
    //
    return hslGradientCtx.getImageData(surfaceHslX, surfaceHslY, 1, 1).data
}

// file: interface/panel-color-rgba.js //
// "use strict"

var panelRgba
var panelRgbaCtx

var surfaceRgbaReference
var surfaceRgbaCurrent

var numboxRgbaRed
var numboxRgbaGreen
var numboxRgbaBlue
var numboxRgbaAlpha

var buttonToHsl
var buttonRgbaCopy

var panelRgbaGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelRgba() {
    panelRgba = createCanvas(240, 305)
    panelRgbaCtx = panelRgba.getContext("2d")
    //
    panelRgba.style.position = "absolute"
    panelRgba.style.top = "325px"
    panelRgba.style.left = "1060px"
    panelRgba.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelRgba)
    //
    initPanelRgba2()
}

function initPanelRgba2() {
    //
    surfaceRgbaReference = createSurface("rgba-reference", panelRgbaCtx, 40, 4, 80, 35)
    configSurfaceRgbaReference()
    //
    surfaceRgbaCurrent = createSurface("rgba-current", panelRgbaCtx, 120, 4, 80, 35)
    configSurfaceRgbaCurrent()
    //
    numboxRgbaRed   = createNumbox("rgba-red",   panelRgbaCtx, 135,  70, 60, 30, ""+RED,   255, updateCurrentColorByRgba)
    numboxRgbaGreen = createNumbox("rgba-green", panelRgbaCtx, 135, 115, 60, 30, ""+GREEN, 255, updateCurrentColorByRgba)
    numboxRgbaBlue  = createNumbox("rgba-blue",  panelRgbaCtx, 135, 160, 60, 30, ""+BLUE,  255, updateCurrentColorByRgba)
    numboxRgbaAlpha = createNumbox("rgba-alpha", panelRgbaCtx, 135, 205, 60, 30, ""+ALPHA, 255, updateCurrentColorByRgba)
    //
    buttonToHsl = createButton("to-hsl", panelRgbaCtx, 13, 267, 97, 30, "to  H S L", changeToHsl, false)
    buttonRgbaCopy = createButton("rgba-copy", panelRgbaCtx, 130, 267, 97, 30, "copy to ref", rgbaCopyToReference, false)
    //
    panelRgbaGadgets = [ surfaceRgbaReference, surfaceRgbaCurrent, buttonToHsl, buttonRgbaCopy,
                         numboxRgbaRed, numboxRgbaGreen, numboxRgbaBlue, numboxRgbaAlpha ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelRgba() {
    panelRgba.onmouseup = panelOnMouseUp
    panelRgba.onmousedown = panelOnMouseDown
    panelRgba.onmousemove = panelOnMouseMove
    panelRgba.onmouseleave = panelOnMouseLeave
    panelRgba.onmouseenter = function () { panelOnMouseEnter(panelRgbaGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelRgba() {
    // background
    panelRgbaCtx.fillStyle = wingColor()
    panelRgbaCtx.fillRect(0, 0, 240, 305)
    //
    greyEmptyRect(panelRgbaCtx, surfaceRgbaReference.left-1, surfaceRgbaReference.top-1,
                                surfaceRgbaReference.width*2+2, surfaceRgbaReference.height+2)
    //
    paintSurfaceRgbaReference()
    paintSurfaceRgbaCurrent()
    //
    write(panelRgbaCtx, "ref", 10, 17)
    write(panelRgbaCtx, "cur", 205, 17)
    //
    write(panelRgbaCtx, "RED",   60,  83)
    write(panelRgbaCtx, "GREEN", 60, 128)
    write(panelRgbaCtx, "BLUE",  60, 173)
    write(panelRgbaCtx, "ALPHA", 60, 218)
    //
    resetNumbox(numboxRgbaRed,   ""+RED)
    resetNumbox(numboxRgbaGreen, ""+GREEN)
    resetNumbox(numboxRgbaBlue,  ""+BLUE)
    resetNumbox(numboxRgbaAlpha, ""+ALPHA)
    //
    paintNumbox(numboxRgbaRed)
    paintNumbox(numboxRgbaGreen)
    paintNumbox(numboxRgbaBlue)
    paintNumbox(numboxRgbaAlpha)
    //
    paintButton(buttonToHsl)
    paintButton(buttonRgbaCopy)
}

function paintSurfaceRgbaReference() {
    //
    panelRgbaCtx.fillStyle = "rgb(" + referenceRed + "," + referenceGreen + "," + referenceBlue + ")"
    //
    const gadget = surfaceRgbaReference
    panelRgbaCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceRgbaReference) { return }
    //
    changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha], true)
}

function paintSurfaceRgbaCurrent() {
    //
    panelRgbaCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    //
    const gadget = surfaceRgbaCurrent
    panelRgbaCtx.fillRect(gadget.left, gadget.top, gadget.width, gadget.height)
    //
    if (gadgetUnderMouse != surfaceRgbaCurrent) { return }
    //
    changeMouseColor([RED, GREEN, BLUE, ALPHA], true)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceRgbaReference() {
    //
    surfaceRgbaReference.onMouseMove = function () { changeMouseColor([referenceRed, referenceGreen, referenceBlue, referenceAlpha]) }
    //
    surfaceRgbaReference.onMouseDown = function () { tradeColors(); paintPanelRgba() }
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceRgbaCurrent() {
    //
    surfaceRgbaCurrent.onMouseMove = function () { changeMouseColor([RED, GREEN, BLUE, ALPHA]) }
    //
    surfaceRgbaCurrent.onMouseDown = function () { tradeColors(); paintPanelRgba() }
}

///////////////////////////////////////////////////////////////////////////////

function updateCurrentColorByRgba() {
    const r = parseInt(numboxRgbaRed.text)
    const g = parseInt(numboxRgbaGreen.text)
    const b = parseInt(numboxRgbaBlue.text)
    const a = parseInt(numboxRgbaAlpha.text)
    //
    updateCurrentColor([r, g, b, a])
    paintSurfaceRgbaCurrent()
}

///////////////////////////////////////////////////////////////////////////////

function rgbaCopyToReference() {
    referenceRed   = RED
    referenceGreen = GREEN
    referenceBlue  = BLUE
    referenceAlpha = ALPHA
    //
    paintSurfaceRgbaReference()
}

///////////////////////////////////////////////////////////////////////////////

function changeToHsl() {
    hidePolyPanel()
    hslOrRgba = "hsl"
    startBlinkingButton(buttonToRgba) // other panel button
    paintAndShowPolyPanel()
}

// file: interface/panel-colorize.js //
// "use strict"

var panelColorize
var panelColorizeCtx

var sliderColorizeHue
var sliderColorizeSat
var sliderColorizeLum
var sliderColorizeOpa

var buttonColorizeReset
var buttonColorizeApply

var panelColorizeGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelColorize() {
    panelColorize = createCanvas(240, 305)
    panelColorizeCtx = panelColorize.getContext("2d")
    //
    panelColorize.style.position = "absolute"
    panelColorize.style.top = "325px"
    panelColorize.style.left = "1060px"
    panelColorize.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelColorize)
    //
    initPanelColorize2()
}

function initPanelColorize2() {
    const ctx = panelColorizeCtx
    //
    sliderColorizeHue = createSlider("colorize-hue", ctx, 10, 50, 220, 0, colorizeLayer)
    sliderColorizeSat = createSlider("colorize-sat", ctx, 10, 100, 220, 0.5, colorizeLayer)
    sliderColorizeLum = createSlider("colorize-lum", ctx, 10, 150, 220, 0.5, colorizeLayer)
    sliderColorizeOpa = createSlider("colorize-opa", ctx, 10, 200, 220, 1, colorizeLayer)
    //
    buttonColorizeReset = createButton("colorize-reset", ctx,  13, 255, 97, 30, "reset", panelColorizeReset, true)
    buttonColorizeApply = createButton("colorize-apply",  ctx, 130, 255, 97, 30, "apply", panelColorizeApply, true)
    //
    panelColorizeGadgets = [ sliderColorizeHue, sliderColorizeSat, sliderColorizeLum, sliderColorizeOpa,
                             buttonColorizeReset, buttonColorizeApply ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelColorize() {
    panelColorize.onmouseup = panelOnMouseUp
    panelColorize.onmousedown = panelOnMouseDown
    panelColorize.onmousemove = panelOnMouseMove
    panelColorize.onmouseleave = panelOnMouseLeave
    panelColorize.onmouseenter = function () { panelOnMouseEnter(panelColorizeGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelColorize() {
    // background
    panelColorizeCtx.fillStyle = wingColor()
    panelColorizeCtx.fillRect(0, 0, 240, 305)
    //
    const ctx = panelColorizeCtx
    //
    write(ctx, "intensity of new hue", 10, 35)
    paintSlider(sliderColorizeHue)
    //
    write(ctx, "saturation", 10, 85)
    paintSlider(sliderColorizeSat)
    //
    write(ctx, "luminosity", 10, 135)
    paintSlider(sliderColorizeLum)
    //
    write(ctx, "opacity", 10, 185)
    paintSlider(sliderColorizeOpa)
    //
    greyTraceH(ctx, 20, 235, 200)
    //
    paintButton(buttonColorizeReset)
    paintButton(buttonColorizeApply)
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeApply() {
    //
    panelColorizeResetGadgets()
    if (toplayer != null) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function panelColorizeReset() {
    //
    panelColorizeResetGadgets()
    resetTopLayerByMemory()
}

function panelColorizeResetGadgets() {
    //
    resetSlider(sliderColorizeHue, 0)
    resetSlider(sliderColorizeSat, 0.5)
    resetSlider(sliderColorizeLum, 0.5)
    resetSlider(sliderColorizeOpa, 1)
    //
    updateColorizeButtons()
}

///////////////////////////////////////////////////////////////////////////////

function updateColorizeButtons() {
    const changing = colorizePanelChanging()
    //
    for (const button of [ buttonColorizeReset, buttonColorizeApply ]) {
        if (button.disabled == ! changing) { continue }
        button.disabled = ! changing
        paintButton(button)
    }
}

function colorizePanelChanging() {
    //
    if (sliderColorizeHue.value != 0)   { return true }
    if (sliderColorizeSat.value != 0.5) { return true }
    if (sliderColorizeLum.value != 0.5) { return true }
    if (sliderColorizeOpa.value != 1)   { return true }
    //
    return false
}

// file: interface/panel-config.js //
// "use strict"

var panelConfig
var panelConfigCtx

var checkboxHint
var checkboxDark
var checkboxRedYellowCursor
var surfaceBgTable

var panelConfigGadgets

var isDarkInterface = true

var shallHintAlert = true // to be configured at initialization

var backgroundColor = "white"

const backgroundColors = [

    "255,255,255", "237,237,237", "190,190,190", "128,128,128", "54,54,56", "0,0,0",
    "240,240,160", "240,230,140", "189,183,127", "131,0,0", "15,25,75", "blank"
]

///////////////////////////////////////////////////////////////////////////////

function initPanelConfig() {
    //
    panelConfig = createCanvas(240, 305)
    panelConfigCtx = panelConfig.getContext("2d")
    //
    panelConfig.style.position = "absolute"
    panelConfig.style.top = "325px"
    panelConfig.style.left = "1060px"
    panelConfig.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelConfig)
    //
    initPanelConfig2()
}

function initPanelConfig2() {
    //
    checkboxHint = createCheckbox("hint", panelConfigCtx, 130, 35, 12, null, shallHintAlert)
    //
    checkboxDark = createCheckbox("dark", panelConfigCtx, 130, 75, 12, toggleDarkness, isDarkInterface)
    //
    checkboxRedYellowCursor = createCheckbox("dark", panelConfigCtx, 160, 115, 12, null, false)
    //
    surfaceBgTable = createSurface("bg-table", panelConfigCtx, 3, 160,  6*paletteSide, 2*paletteSide)
    configSurfaceBgTable()
    //
    panelConfigGadgets = [ checkboxHint, checkboxDark, checkboxRedYellowCursor, surfaceBgTable ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelConfig() {
    panelConfig.onmouseup = panelOnMouseUp
    panelConfig.onmousedown = panelOnMouseDown
    panelConfig.onmousemove = panelOnMouseMove
    panelConfig.onmouseleave = panelOnMouseLeave
    panelConfig.onmouseenter = function () { panelOnMouseEnter(panelConfigGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelConfig() {
    // background
    panelConfigCtx.fillStyle = wingColor()
    panelConfigCtx.fillRect(0, 0, 240, 305)
    //
    write(panelConfigCtx, "hint alert on", 20, 35)
    paintCheckbox(checkboxHint)
    //
    write(panelConfigCtx, "dark interface", 20, 75)
    paintCheckbox(checkboxDark)
    //
    write(panelConfigCtx, "red & yellow cursor", 20, 115)
    paintCheckbox(checkboxRedYellowCursor)
    //
    greyOuterEdgeByGadget(surfaceBgTable)
    paintSurface(surfaceBgTable)
    //
    write(panelConfigCtx, "layer background", 20, 255)
    write(panelConfigCtx, "(not part of  image)", 20, 275)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfaceBgTable() {
    //
    const ctx = surfaceBgTable.canvas.getContext("2d")
    const width = surfaceBgTable.canvas.width
    //
    paintThisPalette(ctx, width, backgroundColors, paletteSide, 0, 0, false)
    //
    surfaceBgTable.onClick = toggleBackground
    surfaceBgTable.onMouseMove = surfaceBgTableOnMouseMove
}

function surfaceBgTableOnMouseMove(x, y) {
    //
    const color = bgTableColorAt(x, y)
    //
    if (color == "blank") { eraseMouseColor(); return }
    //
    const parts = color.split(",")
    const res = [ 0, 0, 0, 255 ]
    res[0] = parseInt(parts[0])
    res[1] = parseInt(parts[1])
    res[2] = parseInt(parts[2])
    //
    changeMouseColor(res)
}

function bgTableColorAt(x, y) {
    //
    const col = Math.floor(x / paletteSide)
    const row = Math.floor(y / paletteSide)
    const numberOfCols = Math.floor(surfaceBgTable.width / paletteSide)
    const index = col + (row * numberOfCols)
    return backgroundColors[index]
}

function toggleBackground() {
    shallRepaint = true
    //
    if (mouseAlpha == -1) {
        backgroundColor = "blank"
    }
    else {
        backgroundColor = "rgb(" + mouseRed + "," + mouseGreen + "," + mouseBlue + ")"
    }
}

///////////////////////////////////////////////////////////////////////////////

function toggleDarkness() {
    isDarkInterface = ! isDarkInterface // also called by keyboard!
    checkboxDark.checked = isDarkInterface
    //
    paintInterface()
}

// file: interface/panel-effect.js //
// "use strict"

var panelEffect
var panelEffectCtx

var selectedSubpanelEffect

var checkboxEffectA
var checkboxEffectB
var checkboxEffectC
var checkboxEffectD
var checkboxEffectE

var panelEffectGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffect() {
    panelEffect = createCanvas(240, 305)
    panelEffectCtx = panelEffect.getContext("2d")
    //
    panelEffect.style.position = "absolute"
    panelEffect.style.top = "325px"
    panelEffect.style.left = "1060px"
    panelEffect.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffect)
    //
    initPanelEffect2()
}

function initPanelEffect2() {
    //
    checkboxEffectA = createCheckbox("effect-a", panelEffectCtx,  20, 14, 16, changeSubpanelEffect, true)
    checkboxEffectB = createCheckbox("effect-b", panelEffectCtx,  66, 14, 16, changeSubpanelEffect, false)
    checkboxEffectC = createCheckbox("effect-c", panelEffectCtx, 112, 14, 16, changeSubpanelEffect, false)
    checkboxEffectD = createCheckbox("effect-d", panelEffectCtx, 158, 14, 16, changeSubpanelEffect, false)
    checkboxEffectE = createCheckbox("effect-e", panelEffectCtx, 204, 14, 16, changeSubpanelEffect, false)
    //
    panelEffectGadgets = [ checkboxEffectA, checkboxEffectB, checkboxEffectC, checkboxEffectD, checkboxEffectE ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffect() {
    panelEffect.style.visibility = "hidden"
    hideSelectedSubpanelEffect()
}

function paintAndShowPanelEffect() {
    paintPanelEffect()
    panelEffect.style.visibility = "visible"
    //
    paintAndShowSelectedSubpanelEffect()
}

///////////////////////////////////////////////////////////////////////////////

function hideSelectedSubpanelEffect() {
    if (selectedSubpanelEffect == panelEffectA) { hidePanelEffectA(); return }
    if (selectedSubpanelEffect == panelEffectB) { hidePanelEffectB(); return }
    if (selectedSubpanelEffect == panelEffectC) { hidePanelEffectC(); return }
    if (selectedSubpanelEffect == panelEffectD) { hidePanelEffectD(); return }
    if (selectedSubpanelEffect == panelEffectE) { hidePanelEffectE(); return }
}

function paintAndShowSelectedSubpanelEffect() {
    if (selectedSubpanelEffect == undefined) { selectedSubpanelEffect = panelEffectA }
    //
    if (selectedSubpanelEffect == panelEffectA) { paintAndShowPanelEffectA(); return }
    if (selectedSubpanelEffect == panelEffectB) { paintAndShowPanelEffectB(); return }
    if (selectedSubpanelEffect == panelEffectC) { paintAndShowPanelEffectC(); return }
    if (selectedSubpanelEffect == panelEffectD) { paintAndShowPanelEffectD(); return }
    if (selectedSubpanelEffect == panelEffectE) { paintAndShowPanelEffectE(); return }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffect() {
    panelEffect.onmouseup = panelOnMouseUp
    panelEffect.onmousedown = panelOnMouseDown
    panelEffect.onmousemove = panelOnMouseMove
    panelEffect.onmouseleave = panelOnMouseLeave
    panelEffect.onmouseenter = function () { panelOnMouseEnter(panelEffectGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffect() {
    // background
    panelEffectCtx.fillStyle = wingColor()
    panelEffectCtx.fillRect(0, 0, 240, 305)
    //
    paintCheckbox(checkboxEffectA)
    paintCheckbox(checkboxEffectB)
    paintCheckbox(checkboxEffectC)
    paintCheckbox(checkboxEffectD)
    paintCheckbox(checkboxEffectE)
    //
    greyTraceH(panelEffectCtx, 5, 277, 230)
}

///////////////////////////////////////////////////////////////////////////////

function changeSubpanelEffect(cb) {
    //
    const newSubPanel = referencedSubPanelEffect(cb)
    if (newSubPanel == selectedSubpanelEffect) { resetCheckbox(cb, true); return }
    //
    const old = referencedCheckbox(selectedSubpanelEffect)
    resetCheckbox(old, false)
    hideSelectedSubpanelEffect()
    //
    selectedSubpanelEffect = referencedSubPanelEffect(cb)
    paintAndShowSelectedSubpanelEffect()
}

function referencedSubPanelEffect(cb) {
    if (cb == checkboxEffectA) { return panelEffectA }
    if (cb == checkboxEffectB) { return panelEffectB }
    if (cb == checkboxEffectC) { return panelEffectC }
    if (cb == checkboxEffectD) { return panelEffectD }
    if (cb == checkboxEffectE) { return panelEffectE }
}

function referencedCheckbox(subpanel) {
    if (subpanel == panelEffectA) { return checkboxEffectA }
    if (subpanel == panelEffectB) { return checkboxEffectB }
    if (subpanel == panelEffectC) { return checkboxEffectC }
    if (subpanel == panelEffectD) { return checkboxEffectD }
    if (subpanel == panelEffectE) { return checkboxEffectE }
}

// file: interface/panel-layers.js //
// "use strict"

var panelLayers
var panelLayersCtx

var iconLayerUp
var iconLayerDown

var panelLayersCursor = ""

var buttonLayer0
var buttonLayer1
var buttonLayer2
var buttonLayer3
var buttonLayer4
var buttonLayer5

var buttonMergeUp
var buttonMergeDown
var buttonReverseOrder
var buttonDisplayOpacity

var panelLayersGadgets

var panelLayersDragCandidate = null

const layerDragMessage = 'dragging a layer button changes its order\n(the layer button "selection" is static)'

///////////////////////////////////////////////////////////////////////////////

function initPanelLayers() {
    panelLayers = createCanvas(160, 415)
    panelLayersCtx = panelLayers.getContext("2d")
    //
    panelLayers.style.position = "absolute"
    panelLayers.style.top = "215px"
    //
    bigdiv.appendChild(panelLayers)
    //
    initPanelLayers2()
}

function initPanelLayers2() {
    const ctx = panelLayersCtx
    //
    iconLayerDown = createSurface("layer-down", panelLayersCtx, 10, 28, 20, 20)
    configIconLayerDown()
    iconLayerUp = createSurface("layer-up", panelLayersCtx, 130, 229, 20, 20)
    configIconLayerUp()
    //
    buttonLayer0 = createButton("layer-0", ctx, 40,  25, 80, 27, "selection", null, true)
    buttonLayer1 = createButton("layer-1", ctx, 40,  65, 80, 27, "layer A",   null, false)
    buttonLayer2 = createButton("layer-2", ctx, 40, 105, 80, 27, "layer B",   null, true)
    buttonLayer3 = createButton("layer-3", ctx, 40, 145, 80, 27, "layer C",   null, true)
    buttonLayer4 = createButton("layer-4", ctx, 40, 185, 80, 27, "layer D",   null, true)
    buttonLayer5 = createButton("layer-5", ctx, 40, 225, 80, 27, "layer E",   null, true)
    //
    buttonMergeUp = createButton("merge-down", ctx, 13, 270, 134, 30, "merge up", mergeUp, true)
    buttonMergeDown = createButton("merge-down", ctx, 13, 306, 134, 30, "merge down", mergeDown, true)
    buttonReverseOrder = createButton("rev-order", ctx, 13, 342, 134, 30, "reverse order", reverseOrder, true)
    buttonDisplayOpacity = createButton("opacity", ctx, 13, 378, 134, 30, "display opacity", showPanelOpacity, false)
    //
    panelLayersGadgets = [ buttonLayer0, buttonLayer1, buttonLayer2, buttonLayer3, buttonLayer4, buttonLayer5,
                           buttonMergeUp, buttonMergeDown, buttonReverseOrder, buttonDisplayOpacity,
                           iconLayerUp, iconLayerDown // first 6 positions are reserved for the layer buttons!!!
                         ]
}

function configIconLayerDown() {
    //
    const ctx = iconLayerDown.canvas.getContext("2d")
    ctx.drawImage(specialIcons["down"], 0, 0)
    //
    iconLayerDown.onMouseDown = function () { customAlert(layerDragMessage) }
}

function configIconLayerUp() {
    //
    const ctx = iconLayerUp.canvas.getContext("2d")
    ctx.drawImage(specialIcons["up"], 0, 0)
    //
    iconLayerUp.onMouseDown = function () { customAlert(layerDragMessage) }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelLayers() {
    panelLayers.onmouseup = panelOnMouseUp
    panelLayers.onmousedown = panelOnMouseDown
    panelLayers.onmousemove = panelOnMouseMove
    panelLayers.onmouseleave = panelOnMouseLeave
    panelLayers.onmouseenter = function () { panelOnMouseEnter(panelLayersGadgets, panelLayersDragControl) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelLayers() {
    // background
    panelLayersCtx.fillStyle = wingColor()
    panelLayersCtx.fillRect(0, 0, 160, 415)
    //
    greyTraceH(panelLayersCtx, 5, 0, 150)
    //
    panelLayersCtx.drawImage(iconLayerDown.canvas, 10, 28)
    panelLayersCtx.drawImage(iconLayerUp.canvas, 130, 229)
    //
    paintButton(buttonLayer0)
    paintButton(buttonLayer1)
    paintButton(buttonLayer2)
    paintButton(buttonLayer3)
    paintButton(buttonLayer4)
    paintButton(buttonLayer5)
    //
    paintButton(buttonMergeUp)
    paintButton(buttonMergeDown)
    paintButton(buttonReverseOrder)
    paintButton(buttonDisplayOpacity)
}

///////////////////////////////////////////////////////////////////////////////

function setPanelLayersCursorDefault() {
    if (panelLayersCursor == "") { return }
    //
    panelLayersCursor = ""
    panelLayers.style.cursor = ""
}

function setPanelLayersCursorMove() {
    if (panelLayersCursor == "move") { return }
    //
    panelLayersCursor = "move"
    panelLayers.style.cursor = "move"
}

///////////////////////////////////////////////////////////////////////////////

function panelLayersDragControl(kind, x, y, gadget, dragging) {
    //
    if (x < 40  ||  x > 120) { cancelPanelLayersDrag(); return }
    if (y < 25  ||  y > 255) { cancelPanelLayersDrag(); return }
    //
    if (kind == "down") {
        //
        if (gadget == null) { cancelPanelLayersDrag() }
        //
        if (gadget.id == "layer-0") { cancelPanelLayersDrag(); return }
        //
        panelLayersDragCandidate = gadget
        //
        return
    }
    //
    if (kind == "move") {
        //
        if (! dragging  ||  panelLayersDragCandidate == null) { cancelPanelLayersDrag(); return }
        //
        setPanelLayersCursorMove()
        //
        return
    }
    // kind == "up"
    //
    if (gadget == null) { cancelPanelLayersDrag(); return }
    //
    if (gadget.id == "layer-0") { cancelPanelLayersDrag(); return }
    //
    if (panelLayersDragCandidate == null) { cancelPanelLayersDrag(); return }
    //
    if (gadget == panelLayersDragCandidate) { cancelPanelLayersDrag(); return } // standard click
    //
    finishPanelLayersDrag(panelLayersDragCandidate, gadget)
}

///////////////////////////////////////////////////////////////////////////////

function cancelPanelLayersDrag() {
    //
    panelLayersDragCandidate = null
    setPanelLayersCursorDefault()
}

function finishPanelLayersDrag(buttonA, buttonB) {
    //
    setPanelLayersCursorDefault()
    //
    const indexA = parseInt(buttonA.id.replace("layer-", ""))
    const indexB = parseInt(buttonB.id.replace("layer-", ""))
    //
    exchangeLayers(indexA, indexB)
}

///////////////////////////////////////////////////////////////////////////////

function layerButtonClicked(button) {
    //
    const n = parseInt(button.id.replace("layer-", ""))
    setPanelLayersCursorDefault()
    changeLayerVisibility(n)
}

///////////////////////////////////////////////////////////////////////////////

function showPanelOpacity() {
    //
    hintAlert("the displaying opacity doesn't affect the image opacity")
    //
    panelOpacityOn = true
    paintPanelOpacity()
    panelOpacity.style.visibility = "visible"
    //
    panelLayers.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function updateLayerButtons() {  // helper
    //
    let count = 0
    //
    for (let n = 0; n < 6; n++) {
        const button = panelLayersGadgets[n]
        button.disabled = ! layers[n].enabled
        paintButton(button)
        if (! button.disabled) { count += 1 }
    }
    //
    buttonMergeUp.disabled = count < 2
    paintButton(buttonMergeUp)
    //
    //
    buttonMergeDown.disabled = count < 2
    paintButton(buttonMergeDown)
    //
    buttonReverseOrder.disabled = count < 2
    paintButton(buttonReverseOrder)
    //
    buttonDisplayOpacity.disabled = count == 0
    paintButton(buttonDisplayOpacity)
    //
    updateOtherButtons(count == 0)
}

///////////////////////////////////////////////////////////////////////////////

function updateOtherButtons(disabled) {
    //
    if (buttonResizeLayer.disabled == disabled) { return } // one represents all
    //
    const buttons = [
        buttonResizeLayer, buttonScaleLayer, buttonAutocropLayer,
        effectA1, effectA2, effectA3, effectA4, effectA5, effectA6, effectA7,
        effectB1, effectB2, effectB3, effectB4, effectB5, effectB6, effectB7,
        effectC1, effectC2, effectC3, effectC5,
        effectD1, effectD2, effectD3, effectD4, effectD5, effectD6, effectD7,
        effectE1, effectE2, effectE3, effectE4, effectE5, effectE6, effectE7
    ]
    //
    for (const button of buttons) {
        button.disabled = disabled
        paintButton(button)
    }
}

// file: interface/panel-monitor.js //
// "use strict"

/* NEVER FORGET:
    context["imageSmoothingQuality"] = "high" // medium, low
*/

var panelMonitor
var panelMonitorCtx

var monitorBox
var monitorBoxCtx

var checkboxFrozen
var checkboxMonitorPixelated

var panelMonitorGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelMonitor() {
    //
    panelMonitor = createCanvas(240, 265)
    panelMonitorCtx = panelMonitor.getContext("2d")
    //
    panelMonitor.style.position = "absolute"
    panelMonitor.style.top = "30px"
    panelMonitor.style.left = "1060px"
    //
    bigdiv.appendChild(panelMonitor)
    //
    initPanelMonitor2()
}

function initPanelMonitor2() {
    //
    initFrozenPhoto()
    //
    makeMonitorBox()
    //
    checkboxFrozen = createCheckbox("frozen", panelMonitorCtx,  55, 5, 12, toggleFrozen, false)
    checkboxMonitorPixelated = createCheckbox("monitor-pixel", panelMonitorCtx, 170, 5, 12, togglePixelated, true)
    //
    panelMonitorGadgets = [ checkboxFrozen, checkboxMonitorPixelated ]
}

function makeMonitorBox() {
    //
    monitorBox = createCanvas(236, 240)
    monitorBoxCtx = monitorBox.getContext("2d")
    //
    monitorBox.style.position = "absolute"
    monitorBox.style.top = "52px"
    monitorBox.style.left = "1062px"
    monitorBox.style.zIndex = "2"
    //
    bigdiv.appendChild(monitorBox)
    //
    monitorBoxCtx["imageSmoothingQuality"] = "high"
    //
    monitorBox.onwheel = changePhotoZoom
    monitorBox.onmousedown = resetFocusedGadget
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelMonitor() {
    panelMonitor.onmouseup = panelOnMouseUp
    panelMonitor.onmousedown = panelOnMouseDown
    panelMonitor.onmousemove = panelOnMouseMove
    panelMonitor.onmouseleave = panelOnMouseLeave
    panelMonitor.onmouseenter = function () { panelOnMouseEnter(panelMonitorGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelMonitor() {
    // background
    panelMonitorCtx.fillStyle = wingColor()
    panelMonitorCtx.fillRect(0, 0, 240, 265)
    //
    greyTraceH(panelMonitorCtx, 5, 0, 230)
    //
    write(panelMonitorCtx, "frozen", 5, 5)
    paintCheckbox(checkboxFrozen)
    //
    write(panelMonitorCtx, "pixelated", 98, 5)
    paintCheckbox(checkboxMonitorPixelated)
    //
    paintMonitorBoxZoom()
    //
    greyTraceH(panelMonitorCtx, 5, 263, 230)
}

function paintMonitorBoxZoom() {
    panelMonitorCtx.fillRect(210,3,30,15)
    write(panelMonitorCtx, photoZoom + "x", 215, 5)
}

///////////////////////////////////////////////////////////////////////////////

function togglePixelated() {
    //
    shallRepaint = true
}

function toggleFrozen() {
    //
    shallRepaint = true
    //
    if (checkboxFrozen.checked) { updateFrozenPhoto() }
}

// file: interface/panel-opacity.js //
// "use strict"

var panelOpacity
var panelOpacityCtx

var panelOpacityOn = false

var sliderOpacity0
var sliderOpacity1
var sliderOpacity2
var sliderOpacity3
var sliderOpacity4
var sliderOpacity5

var buttonOpacityReturn

var panelOpacityGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelOpacity() {
    panelOpacity = createCanvas(160, 415)
    panelOpacityCtx = panelOpacity.getContext("2d")
    //
    panelOpacity.style.position = "absolute"
    panelOpacity.style.top = "215px"
    panelOpacity.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelOpacity)
    //
    initPanelOpacity2()
}

function initPanelOpacity2() {
    const ctx = panelOpacityCtx
    //
    sliderOpacity0 = createSlider("opacity-0", ctx, 10,  50, 120, 1, changeOpacity)
    sliderOpacity1 = createSlider("opacity-1", ctx, 10, 100, 120, 1, changeOpacity)
    sliderOpacity2 = createSlider("opacity-2", ctx, 10, 150, 120, 1, changeOpacity)
    sliderOpacity3 = createSlider("opacity-3", ctx, 10, 200, 120, 1, changeOpacity)
    sliderOpacity4 = createSlider("opacity-4", ctx, 10, 250, 120, 1, changeOpacity)
    sliderOpacity5 = createSlider("opacity-5", ctx, 10, 300, 120, 1, changeOpacity)
    //
    buttonOpacityReturn = createButton("opacity-ret", ctx, 20, 350, 120, 35, "return", hidePanelOpacity, false)
    //
    panelOpacityGadgets = [ sliderOpacity0, sliderOpacity1, sliderOpacity2, sliderOpacity3,
                            sliderOpacity4, sliderOpacity5, buttonOpacityReturn ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelOpacity() {
    panelOpacity.onmouseup = panelOnMouseUp
    panelOpacity.onmousedown = panelOnMouseDown
    panelOpacity.onmousemove = panelOnMouseMove
    panelOpacity.onmouseleave = panelOnMouseLeave
    panelOpacity.onmouseenter = function () { panelOnMouseEnter(panelOpacityGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelOpacity() {
    // background
    panelOpacityCtx.fillStyle = wingColor()
    panelOpacityCtx.fillRect(0, 0, 160, 415)
    //
    greyTraceH(panelOpacityCtx, 5, 0, 150)
    //
    if (layers[0].enabled) {
        write(panelOpacityCtx, "opacity selec", 25, 35)
        resetSlider(sliderOpacity0, layers[0].opacity, true)
    }
    if (layers[1].enabled) {
        write(panelOpacityCtx, "opacity A", 25, 85)
        resetSlider(sliderOpacity1, layers[1].opacity, true)
    }
    if (layers[2].enabled) {
        write(panelOpacityCtx, "opacity B", 25, 135)
        resetSlider(sliderOpacity2, layers[2].opacity, true)
    }
    if (layers[3].enabled) {
        write(panelOpacityCtx, "opacity C", 25, 185)
        resetSlider(sliderOpacity3, layers[3].opacity, true)
    }
    if (layers[4].enabled) {
        write(panelOpacityCtx, "opacity D", 25, 235)
        resetSlider(sliderOpacity4, layers[4].opacity, true)
    }
    if (layers[5].enabled) {
        write(panelOpacityCtx, "opacity E", 25, 285)
        resetSlider(sliderOpacity5, layers[5].opacity, true)
    }
    //
    paintButton(buttonOpacityReturn)
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelOpacity() {
    panelOpacityOn = false
    panelLayers.style.visibility = "visible"
    //
    panelOpacity.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function changeOpacity(slider) {
    shallRepaint = true
    //
    const n = parseInt(slider.id.replace("opacity-", ""))
    const layer = layers[n]
    if (! layer.enabled) {
        slider.value = layer.opacity
        paintPanelOpacity() // erases disabled sliders that were automaticcaly painted
        return
    }
    //
    layer.opacity = slider.value
}

// file: interface/panel-palette.js //
// "use strict"

var panelPalette
var panelPaletteCtx

const paletteSide = 39

var surfacePalette

var buttonPreviousPalette
var buttonNextPalette
var buttonLoadPalette
var buttonSavePalette

var panelPaletteCursor = ""

var paletteIndexAtMouseDown = -1

var panelPaletteGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelPalette() {
    //
    panelPalette = createCanvas(240, 305)
    panelPaletteCtx = panelPalette.getContext("2d")
    //
    panelPalette.style.position = "absolute"
    panelPalette.style.top = "325px"
    panelPalette.style.left = "1060px"
    panelPalette.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelPalette)
    //
    initPanelPalette2()
}

function initPanelPalette2() {
    //
    const ctx = panelPaletteCtx
    //
    surfacePalette = createSurface("image-palette", ctx, 3, 3, 6*paletteSide, 5*paletteSide)
    configSurfacePalette()
    updateSurfacePalette()
    //
    buttonPreviousPalette = createButton("previous-palette", ctx, 13, 225, 97, 27, "previous plt", previousPalette, true)
    //
    buttonNextPalette = createButton("next-palette", ctx, 127, 225, 97, 27, "next palette", nextPalette, false)
    //
    buttonLoadPalette = createButton("load-palette", ctx, 13, 265, 97, 27, "load palette", loadPalette, true)
    //
    buttonSavePalette = createButton("save-palette", ctx, 127, 265, 97, 27, "save palette", savePalette, false)
    //
    panelPaletteGadgets = [ surfacePalette, buttonPreviousPalette, buttonNextPalette, buttonLoadPalette,
                            buttonSavePalette ]
}

///////////////////////////////////////////////////////////////////////////////

function setPaletteCursorDefault() {
    //
    if (panelPaletteCursor == "") { return }
    //
    panelPaletteCursor = ""
    panelPalette.style.cursor = ""
}

function setPaletteCursorMove() {
    //
    if (panelPaletteCursor == "move") { return }
    //
    panelPaletteCursor = "move"
    panelPalette.style.cursor = "move"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelPalette() {
    //
    panelPalette.onwheel = panelOnWheel
    panelPalette.onmouseup = panelOnMouseUp
    panelPalette.onmousedown = panelOnMouseDown
    panelPalette.onmousemove = panelOnMouseMove
    panelPalette.onmouseleave = panelOnMouseLeave
    panelPalette.onmouseenter = function () { panelOnMouseEnter(panelPaletteGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelPalette() {
    // background
    panelPaletteCtx.fillStyle = wingColor()
    panelPaletteCtx.fillRect(0, 0, 240, 305)
    //
    paintSurface(surfacePalette)
    greyOuterEdgeByGadget(surfacePalette)
    write(panelPaletteCtx, paletteName, 110, 205)
    //
    paintButton(buttonPreviousPalette)
    paintButton(buttonNextPalette)
    paintButton(buttonLoadPalette)
    paintButton(buttonSavePalette)
}

///////////////////////////////////////////////////////////////////////////////

function configSurfacePalette() {
    //
    surfacePalette.onWheel = surfacePaletteOnWheel
    surfacePalette.onClick = surfacePaletteOnClick
    surfacePalette.onMouseDown = surfacePaletteOnMouseDown
    surfacePalette.onMouseMove = surfacePaletteOnMouseMove
    surfacePalette.onMouseLeave = surfacePaletteOnMouseLeave
}

function surfacePaletteOnWheel(x, y, sign) {
    //
    changePalette(sign) // changePalette does not call changeMouseColor
    //
    updateMouseColorByPalette(x, y)
}

function surfacePaletteOnMouseDown(x, y) {
    //
    paletteIndexAtMouseDown = paletteIndexByMouse(x, y)
}

function surfacePaletteOnMouseMove(x, y, dragging) {
    //
    if (dragging  &&  paletteIndexAtMouseDown != -1) {
        setPaletteCursorMove()
    }
    else {
        setPaletteCursorDefault()
    }
    //
    updateMouseColorByPalette(x, y)
}

function surfacePaletteOnClick(x, y) {
    //
    setPaletteCursorDefault()
    //
    const index = paletteIndexByMouse(x, y)
    //
    if (index != paletteIndexAtMouseDown) { moveColorInPalette(paletteIndexAtMouseDown, index); return }
    //
    if (shiftPressed) { addColorToPalette(index); return }
    //
    if (ctrlPressed) { deleteColorInPalette(index); return }
    //
    captureColorFromPalette()
}

function surfacePaletteOnMouseLeave() {
    //
    paletteIndexAtMouseDown = -1
    eraseMouseColor()
    setPaletteCursorDefault()
}

///////////////////////////////////////////////////////////////////////////////

function updateMouseColorByPalette(x, y) {
    //
    const index = paletteIndexByMouse(x, y)
    const color = paletteColorArrayByIndex(index)
    changeMouseColor(color)
}

function captureColorFromPalette() {
    //
    const color = [ mouseRed, mouseGreen, mouseBlue, mouseAlpha ]
    updateCurrentColor(color)
}

function addColorToPalette(index) {
    //
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    palettes[paletteName][index] = RED + "," + GREEN + "," + BLUE
    updateSurfacePalette()
    paintSurface(surfacePalette)
    changeMouseColor([RED, GREEN, BLUE, 255])
}

function deleteColorInPalette(index) {
    //
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    palettes[paletteName][index] = "blank"
    updateSurfacePalette()
    paintSurface(surfacePalette)
    eraseMouseColor()
}

function moveColorInPalette(indexA, indexB) {
    //
    if (paletteName == "bob") { customAlert("palette 'bob' is not editable"); return }
    //
    const palette = palettes[paletteName]
    //
    const a = palette[indexA]
    const b = palette[indexB]
    palette[indexA] = b
    palette[indexB] = a
    //
    updateSurfacePalette()
    paintSurface(surfacePalette)
    //
    const color = paletteColorArrayByIndex(indexB)
    changeMouseColor(color)
}

///////////////////////////////////////////////////////////////////////////////

function previousPalette() {
    //
    changePalette(-1)
}

function nextPalette() {
    //
    changePalette(+1)
}

function changePalette(delta) {
    //
    const max = paletteNames.length - 1
    //
    let index = paletteNames.indexOf(paletteName) + delta
    if (index < 0)   { return }
    if (index > max) { return }
    //
    paletteName = paletteNames[index]
    buttonPreviousPalette.disabled = (index == 0)
    buttonNextPalette.disabled = (index == max)
    buttonLoadPalette.disabled = (paletteName == "bob")
    //
    updateSurfacePalette()
    paintPanelPalette()
}

///////////////////////////////////////////////////////////////////////////////

function paletteIndexByMouse(x, y) {
    //
    const row = Math.floor(y / paletteSide)
    const col = Math.floor(x / paletteSide)
    return (row * 6) + col
}

function paletteColorArrayByIndex(index) {
    //
    const raw = palettes[paletteName][index]
    //
    if (raw == "blank") { return null }
    //
    const strarr = raw.split(",")
    const r = parseInt(strarr[0])
    const g = parseInt(strarr[1])
    const b = parseInt(strarr[2])
    return [ r, g, b, 255 ]
}

///////////////////////////////////////////////////////////////////////////////

function updateSurfacePalette() {
    //
    const ctx = surfacePalette.canvas.getContext("2d")
    const width = surfacePalette.canvas.width
    const list = palettes[paletteName]
    const even = (paletteNames.indexOf(paletteName) % 2) == 0
    //
    paintThisPalette(ctx, width, list, paletteSide, 0, 0, even) // 0, 0 for left and top
}

// file: interface/panel-shear.js //
// "use strict"

var panelShear
var panelShearCtx

var sliderRotate
var sliderShearV
var sliderShearH

var buttonShearReset
var buttonShearApply

var panelShearGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelShear() {
    panelShear = createCanvas(240, 305)
    panelShearCtx = panelShear.getContext("2d")
    //
    panelShear.style.position = "absolute"
    panelShear.style.top = "325px"
    panelShear.style.left = "1060px"
    panelShear.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelShear)
    //
    initPanelShear2()
}

function initPanelShear2() {
    const ctx = panelShearCtx
    //
    sliderRotate = createSlider(sliderRotate, ctx, 10, 40, 220, 0.5, rotateLayer)
    //
    sliderShearV = createSlider(sliderShearV, ctx, 10, 122, 220, 0.5, shearLayer)
    //
    sliderShearH = createSlider(sliderShearH, ctx, 10, 182, 220, 0.5, shearLayer)
    //
    buttonShearReset = createButton("shear-reset", ctx,  13, 250, 97, 30, "reset", panelShearReset, true)
    //
    buttonShearApply = createButton("shear-apply",  ctx, 130, 250, 97, 30, "apply", panelShearApply, true)
    //
    panelShearGadgets = [ sliderRotate, sliderShearV, sliderShearH, buttonShearReset, buttonShearApply ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelShear() {
    panelShear.onmouseup = panelOnMouseUp
    panelShear.onmousedown = panelOnMouseDown
    panelShear.onmousemove = panelOnMouseMove
    panelShear.onmouseleave = panelOnMouseLeave
    panelShear.onmouseenter = function () { panelOnMouseEnter(panelShearGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelShear() {
    // background
    panelShearCtx.fillStyle = wingColor()
    panelShearCtx.fillRect(0, 0, 240, 305)
    //
    const ctx = panelShearCtx
    //
    write(ctx, "rotation", 10, 28)
    paintSlider(sliderRotate)
    //
    greyTraceH(ctx, 20, 85, 200)
    //
    write(ctx, "vertical shear", 10, 110)
    paintSlider(sliderShearV)
    //
    write(ctx, "horizontal shear", 10, 170)
    paintSlider(sliderShearH)
    //
    greyTraceH(ctx, 20, 230, 200)
    //
    paintButton(buttonShearReset)
    paintButton(buttonShearApply)
}


///////////////////////////////////////////////////////////////////////////////

function panelShearApply() {
    //
    panelShearResetGadgets()
    if (toplayer != null) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////

function panelShearReset() {
    //
    panelShearResetGadgets()
    resetTopLayerByMemory()
}

function panelShearResetGadgets() {
    //
    resetSliderShearH()
    resetSliderShearV()
    resetSliderRotate()
    //
    updateShearButtons()
}

///////////////////////////////////////////////////////////////////////////////

function resetSliderShearV() {
    resetSlider(sliderShearV, 0.5)
}

function resetSliderShearH() {
    resetSlider(sliderShearH, 0.5)
}

function resetSliderRotate() {
    resetSlider(sliderRotate, 0.5)
}

///////////////////////////////////////////////////////////////////////////////

function updateShearButtons() {
    const changing = shearPanelChanging()
    //
    for (const button of [ buttonShearReset, buttonShearApply ]) {
        if (button.disabled == ! changing) { continue }
        button.disabled = ! changing
        paintButton(button)
    }
}

function shearPanelChanging() {
    if (sliderShearV.value != 0.5) { return true }
    if (sliderShearH.value != 0.5) { return true }
    if (sliderRotate.value != 0.5) { return true }
    return false
}

// file: interface/panel-size.js //
// "use strict"

var panelSize
var panelSizeCtx

var boxNewWidth
var boxNewHeight

var buttonResizeLayer
var buttonScaleLayer
var buttonAutocropLayer

var checkboxSizePixelated

var panelSizeGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelSize() {
    panelSize = createCanvas(240, 305)
    panelSizeCtx = panelSize.getContext("2d")
    //
    panelSize.style.position = "absolute"
    panelSize.style.top = "325px"
    panelSize.style.left = "1060px"
    panelSize.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelSize)
    //
    initPanelSize2()
}

function initPanelSize2() {
    //
    const ctx = panelSizeCtx
    const w = "" + recoverNewWidthFromLocalStorage()
    const h = "" + recoverNewHeightFromLocalStorage()
    //
    boxNewWidth = createNumbox("new-width",  ctx,  40, 20, 60, 30, w,  2000, null)
    boxNewHeight = createNumbox("new-height", ctx, 140, 20, 60, 30, h, 2000, null)
    //
    //
    buttonResizeLayer = createButton("resize-layer", ctx, 40, 90, 160, 40, "resize layer", resizeLayer, false)
    //
    buttonScaleLayer = createButton("scale-layer", ctx, 40, 150, 160, 40, "scale layer", scaleLayer, false)
    //
    buttonAutocropLayer = createButton("autocrop-layer", ctx, 40, 210, 160, 40, "autocrop layer", autocropLayer, false)
    //
    checkboxSizePixelated = createCheckbox("pixelated-scale", ctx, 190, 275, 12, null, true)
    //
    panelSizeGadgets = [ boxNewWidth, boxNewHeight, buttonResizeLayer, buttonScaleLayer, buttonAutocropLayer, checkboxSizePixelated ]
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelSize() {
    panelSize.onclick = panelOnMouseUp
    panelSize.onmousedown = panelOnMouseDown
    panelSize.onmousemove = panelOnMouseMove
    panelSize.onmouseleave = panelOnMouseLeave
    panelSize.onmouseenter = function () { panelOnMouseEnter(panelSizeGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelSize() {
    // background
    panelSizeCtx.fillStyle = wingColor()
    panelSizeCtx.fillRect(0, 0, 240, 305)
    //
    write(panelSizeCtx, "new width", 37, 55)
    write(panelSizeCtx, "new height", 133, 55)
    //
    paintNumbox(boxNewWidth)
    paintNumbox(boxNewHeight)
    //
    paintButton(buttonResizeLayer)
    paintButton(buttonScaleLayer)
    paintButton(buttonAutocropLayer)
    //
    write(panelSizeCtx, "pixelated scaling", 55, 275)
    paintCheckbox(checkboxSizePixelated)
}

///////////////////////////////////////////////////////////////////////////////

function getNewWidth() {
    fixNewWidth()
    return parseInt(boxNewWidth.text)
}

function getNewHeight() {
    fixNewHeight()
    return parseInt(boxNewHeight.text)
}

///////////////////////////////////////////////////////////////////////////////

function fixNewWidth() {
    fixNewDimension(boxNewWidth, 120)
}

function fixNewHeight() {
    fixNewDimension(boxNewHeight, 80)
}

function fixNewDimension(numbox, defaul) {
    //
    let val = parseInt(numbox.text)
    //
    if (isNaN(val)) { val = defaul }
    if (val == 0)   { val = defaul }
    if (val > 2000) { val = 2000 }
    resetNumbox(numbox, "" + val) // also cleans "003" for example
    //
    return val
}

// file: interface/photo.js //
// "use strict"

var photoZoom = 1
var frozenPhoto = null

///////////////////////////////////////////////////////////////////////////////

function initFrozenPhoto() {
    //
    frozenPhoto = createCanvas(236, 240)
}

///////////////////////////////////////////////////////////////////////////////

function changePhotoZoom(e) {
    //
    shallRepaint = true
    //
    if (e.deltaY > 0) { decreasePhotoZoom(); return false }
    if (e.deltaY < 0) { increasePhotoZoom(); return false }
    //
    return false
}

function decreasePhotoZoom() {
    //
    if (photoZoom == 5) {
        photoZoom = 4
    }
    else if (photoZoom == 4) {
        photoZoom = 3
    }
    else if (photoZoom == 3) {
        photoZoom = 2
    }
    else {
        photoZoom = 1
    }
    //
    paintMonitorBoxZoom()
}

function increasePhotoZoom() {
    //
    if (photoZoom == 1) {
        photoZoom = 2
    }
    else if (photoZoom == 2) {
        photoZoom = 3
    }
    else if (photoZoom == 3) {
        photoZoom = 4
    }
    else {
        photoZoom = 5
    }
    //
    paintMonitorBoxZoom()
}

///////////////////////////////////////////////////////////////////////////////

function paintPhoto() {
    //
    paintPhotoBackground()
    //
    monitorBoxCtx["imageSmoothingEnabled"] = ! checkboxMonitorPixelated.checked
    //
    if (checkboxFrozen.checked) {
        paintFrozenPhoto()
    }
    else {
        paintLayersOnPhoto()
    }
}

function paintPhotoBackground() {
    //
    monitorBoxCtx.fillStyle = backgroundColor
    monitorBoxCtx.fillRect(0, 0, 236, 240)
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////  painting layers  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintLayersOnPhoto() {
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerOnPhoto(layers[n]) }
}

function paintLayerOnPhoto(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = photoZoomedLeft(layer)
    const top  = photoZoomedTop(layer)
    //
    const src = layer.canvas
    //
    const width  = photoZoom * src.width
    const height = photoZoom * src.height
    //
    monitorBoxCtx.drawImage(src, 0,0,src.width,src.height,  left,top,width,height)
}

function photoZoomedLeft(layer) {
    //
    // on stage:
    //
    const layerCenterX = layer.left + (layer.canvas.width / 2)
    //
    const layerDisplacementX = stageCenterX - layerCenterX
    //
    // on photo:
    //
    const layerZoomedCenterX = 118 - (layerDisplacementX * photoZoom) // 118 is horizontal center of monitor box
    //
    const halfZoomedWidth = layer.canvas.width * photoZoom / 2
    //
    return Math.floor(layerZoomedCenterX - halfZoomedWidth)
}

function photoZoomedTop(layer) {
    //
    // on stage:
    //
    const layerCenterY = layer.top + (layer.canvas.height / 2)
    //
    const layerDisplacementY = stageCenterY - layerCenterY
    //
    // on photo:
    //
    const layerZoomedCenterY = 120 - (layerDisplacementY * photoZoom) // 120 is vertical center of monitor box
    //
    const halfZoomedHeight = layer.canvas.height * photoZoom / 2
    //
    return Math.floor(layerZoomedCenterY - halfZoomedHeight)
}

///////////////////////////////////////////////////////////////////////////////
////////////////////////  painting frozenPhoto  ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintFrozenPhoto() {
    //
    const zoomedWidthHalf = 236 * photoZoom / 2
    const left = 118 - zoomedWidthHalf
    //
    const zoomedHeightHalf = 240 * photoZoom / 2
    const top = 120 - zoomedHeightHalf
    //
    monitorBoxCtx.drawImage(frozenPhoto, 0,0,236,240, left,top,236*photoZoom,240*photoZoom)
}

///////////////////////////////////////////////////////////////////////////////

function updateFrozenPhoto() {
    //
    const ctx = frozenPhoto.getContext("2d")
    //
    ctx.clearRect(0, 0, 236, 240)
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerOnFrozenPhoto(ctx, layers[n]) }
}

function paintLayerOnFrozenPhoto(ctx, layer) {
    //
    if (! layer.enabled) { return }
    //
    const halfWidth = Math.floor(layer.canvas.width / 2)
    const layerCenterX = layer.left + halfWidth
    const layerDisplacementX = stageCenterX - layerCenterX
    const left = 118 - layerDisplacementX - halfWidth // 118 is horizontal center of monitor box
    //
    const halfHeight = Math.floor(layer.canvas.height / 2)
    const layerCenterY = layer.top + halfHeight
    const layerDisplacementY = stageCenterY - layerCenterY
    const top = 120 - layerDisplacementY - halfHeight // 120 is vertical center of monitor box
    //
    ctx.drawImage(layer.canvas, left, top)
}

// file: interface/poly-panel.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function initPolyPanel() {
    //
    initPanelPalette()
    //
    initPanelHsl()
    initPanelRgba()
    //
    initPanelSize()
    //
    initPanelEffect()
    initPanelEffectA()
    initPanelEffectB()
    initPanelEffectC()
    initPanelEffectD()
    initPanelEffectE()
    //
    initPanelColorize()
    initPanelShear()
    initPanelConfig()
}

function startListeningPolyPanel() {
    //
    startListeningPanelPalette()
    //
    startListeningPanelHsl()
    startListeningPanelRgba()
    //
    startListeningPanelSize()
    //
    startListeningPanelEffect()
    startListeningPanelEffectA()
    startListeningPanelEffectB()
    startListeningPanelEffectC()
    startListeningPanelEffectD()
    startListeningPanelEffectE()
    //
    startListeningPanelColorize()
    startListeningPanelShear()
    startListeningPanelConfig()
}

///////////////////////////////////////////////////////////////////////////////

function hidePolyPanel() {
    //
    if (selectedOnMiniBar == "palette") {
        panelPalette.style.visibility = "hidden"
    }
    else if (selectedOnMiniBar == "color") {
        hidePanelColor()
    }
    else if (selectedOnMiniBar == "size") {
        panelSize.style.visibility = "hidden"
    }
    else if (selectedOnMiniBar == "effect") {
        hidePanelEffect()
    }
    else if (selectedOnMiniBar == "colorize") {
        panelColorize.style.visibility = "hidden"
    }
    else if (selectedOnMiniBar == "shear") {
        panelShear.style.visibility = "hidden"
    }
    else if (selectedOnMiniBar == "config") {
        panelConfig.style.visibility = "hidden"
    }
}

///////////////////////////////////////////////////////////////////////////////

function paintAndShowPolyPanel() {
    //
    if (selectedOnMiniBar == "palette") {
        paintPanelPalette()
        panelPalette.style.visibility = "visible"
    }
    else if (selectedOnMiniBar == "color") {
        paintAndShowPanelColor()
    }
    else if (selectedOnMiniBar == "size") {
        paintPanelSize()
        panelSize.style.visibility = "visible"
    }
    else if (selectedOnMiniBar == "effect") {
        paintAndShowPanelEffect()
    }
    else if (selectedOnMiniBar == "colorize") {
        paintPanelColorize()
        panelColorize.style.visibility = "visible"
    }
    else if (selectedOnMiniBar == "shear") {
        paintPanelShear()
        panelShear.style.visibility = "visible"
    }
    else if (selectedOnMiniBar == "config") {
        paintPanelConfig()
        panelConfig.style.visibility = "visible"
    }
}

// file: interface/stage.js //
// "use strict"

const stageWidth = 900
const stageHeight = 600

const stageCenterX = 450
const stageCenterY = 300

var stage
var stageCtx

var stageChessLight
var stageChessDark

var shallRepaint = true

///////////////////////////////////////////////////////////////////////////////

function initStage() {
    stage = createCanvas(stageWidth, stageHeight)
    stageCtx = stage.getContext("2d")
    //
    stage.style.position = "absolute"
    stage.style.top = "30px"
    stage.style.left = "160px"
    //
    bigdiv.appendChild(stage)
    //
    stageChessLight = createStageChessLight()
    stageChessDark = createStageChessDark()
}

///////////////////////////////////////////////////////////////////////////////

function startListeningStage() {
    stage.onwheel = mouseWheelHandler
    stage.onmouseup = mouseUpHandler
    stage.onmousedown = mouseDownHandler
    stage.onmousemove = mouseMoveHandler
    stage.onmouseleave = mouseLeaveHandler
}

///////////////////////////////////////////////////////////////////////////////

function paintStage() {
    //
    paintStageBg()
    //
    paintLayersBackgrounds()
    //
    stageCtx["imageSmoothingEnabled"] = false
    paintLayersForegrounds()
    stageCtx["imageSmoothingEnabled"] = true // because of draw picture bug on chrome
    //
    paintTopLayerFrame()
    //
    drawPictureCursor()
}

///////////////////////////////////////////////////////////////////////////////

function paintStageBg() {
    //
    const img = isDarkInterface ? stageChessDark : stageChessLight
    //
    stageCtx.drawImage(img, 0, 0)
}

///////////////////////////////////////////////////////////////////////////////

function paintLayersBackgrounds() {
    //
    if (backgroundColor == "blank") { return }
    //
    stageCtx.fillStyle = backgroundColor
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerBackground(layers[n]) }
}

function paintLayerBackground(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = zoomedLeft(layer)
    const top = zoomedTop(layer)
    //
    const width = layer.canvas.width * ZOOM
    const height = layer.canvas.height * ZOOM
    //
    stageCtx.fillRect(left, top, width, height)
}

///////////////////////////////////////////////////////////////////////////////

function paintLayersForegrounds() {
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) { paintLayerForeground(layers[n]) }
    //
    paintMaskOnStage()
}

function paintLayerForeground(layer) {
    //
    if (! layer.enabled) { return }
    //
    const left = zoomedLeft(layer)
    const top = zoomedTop(layer)
    //
    const width = layer.canvas.width
    const height = layer.canvas.height
    //
    stageCtx.globalAlpha = layer.opacity
    stageCtx.drawImage(layer.canvas, 0,0,width,height, left,top,width*ZOOM,height*ZOOM)
    stageCtx.globalAlpha = 1
}

function paintMaskOnStage() {
    //
    if (! maskOn) { return }
    //
    const left = zoomedLeft(toplayer)
    const top  = zoomedTop(toplayer)
    //
    const width = mask.width
    const height = mask.height
    //
    stageCtx.drawImage(mask, 0,0,width,height, left,top,width*ZOOM,height*ZOOM)
}

///////////////////////////////////////////////////////////////////////////////

function paintTopLayerFrame() {
    //
    if (toplayer == null) { return }
    //
    stageCtx.fillStyle = canvasFrameColor()
    //
    const left = zoomedLeft(toplayer) - 1
    const top = zoomedTop(toplayer) - 1
    //
    const width = toplayer.canvas.width * ZOOM + 2
    const height = toplayer.canvas.height * ZOOM + 2
    //
    stageCtx.fillRect(left, top, width, 1) // top
    stageCtx.fillRect(left, top+height-1, width, 1) // bottom
    stageCtx.fillRect(left, top, 1, height) // left
    stageCtx.fillRect(left+width-1, top, 1, height) // right
}

// file: interface/stage-cursor.js //
// "use strict"

const cursors = { } // "side:color" : cnv

///////////////////////////////////////////////////////////////////////////////

function drawPictureCursor() {
    //
    if (! okToDrawCursor()) { stage.style.cursor = "default"; return }
    //
    stage.style.cursor = "none"
    //
    // ignoring zoom level
    //
    const deltaTool = (toolSizeFor[tool] - 1) / 2 // assuming tool size is odd and greater than 1
    //
    const cornerX = stageX - deltaTool
    const cornerY = stageY - deltaTool
    //
    // applying zoom level
    //
    const cornerDeltaX = cornerX - stageCenterX
    const cornerDeltaY = cornerY - stageCenterY
    //
    const rawCornerX = stageCenterX + (cornerDeltaX * ZOOM)
    const rawCornerY = stageCenterY + (cornerDeltaY * ZOOM)
    //
    // painting cursor
    //
    const side = toolSizeFor[tool] * ZOOM
    //
    const isRedYellow = checkboxRedYellowCursor.checked
    //
    const cursor = getCursor(side, isRedYellow)
    //
    const thick = side > 9 ? 3 : 2
    //
    const left = rawCornerX - thick
    const top  = rawCornerY - thick
    //
    stageCtx.drawImage(cursor, left, top)
}

function getCursor(side, isRedYellow) {
    //
    const id = side + ":" + (isRedYellow ? "red-yellow" : "black-white")
    //
    let cursor = cursors[id]
    //
    if (cursor == undefined) {
        cursor = makeCursor(side, isRedYellow)
        cursors[id] = cursor
    }
    //
    return cursor
}

function makeCursor(innerSide, isRedYellow) {
    if (innerSide > 9) {
        return makeFatCursor(innerSide, isRedYellow)
    }
    return makeThinCursor(innerSide, isRedYellow)
}

///////////////////////////////////////////////////////////////////////////////

function makeFatCursor(innerSide, isRedYellow) {
    //
    const side = innerSide + 6
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = (isRedYellow ? "red" : "white")
    //
    ctx.fillRect(0, 0, side, side)
    ctx.clearRect(3, 3, side - 6, side - 6)
    //
    ctx.fillStyle = (isRedYellow ? "yellow" : "black")
    //
    let len = Math.floor(side / 2) // middle part
    let rest = side - len // sum of two beacons
    //
    if (rest % 2 != 0) {
        len -= 1
        rest += 1
    }
    //
    const start = (rest / 2)
    //
    ctx.fillRect(start, 0, len, 3) // top
    ctx.fillRect(start, side-3, len, 3) // bottom
    ctx.fillRect(0, start, 3, len) // left
    ctx.fillRect(side-3, start, 3, len) // right
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function makeThinCursor(innerSide, isRedYellow) {
    //
    const side = innerSide + 4
    const cnv = createCanvas(side, side)
    const ctx = cnv.getContext("2d")
    //
    ctx.fillStyle = (isRedYellow ? "red" : "white")
    //
    ctx.fillRect(0, 0, side, side)
    ctx.clearRect(2, 2, side - 4, side - 4)
    //
    ctx.fillStyle = (isRedYellow ? "yellow" : "black")
    //
    let len = Math.floor(side / 2) // middle part
    let rest = side - len // sum of two beacons
    //
    if (rest % 2 != 0) {
        len -= 1
        rest += 1
    }
    //
    const start = (rest / 2)
    //
    ctx.fillRect(start, 0, len, 2) // top
    ctx.fillRect(start, side-2, len, 2) // bottom
    ctx.fillRect(0, start, 2, len) // left
    ctx.fillRect(side-2, start, 2, len) // right
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////

function okToDrawCursor() {
    //
    if (stageRawX == null) { return false }
    //
    if (ZOOM == 0.5) { return toolSizeFor[tool] > 14 }
    //
    return toolSizeFor[tool] > 1
}

// file: interface/subpanel-effect-a.js //
// "use strict"

var panelEffectA
var panelEffectACtx

var effectA1
var effectA2
var effectA3
var effectA4
var effectA5
var effectA6
var effectA7

var panelEffectAGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectA() {
    panelEffectA = createCanvas(240, 277)
    panelEffectACtx = panelEffectA.getContext("2d")
    //
    panelEffectA.style.position = "absolute"
    panelEffectA.style.top = "355px"
    panelEffectA.style.left = "1060px"
    panelEffectA.style.zIndex = "2"
    panelEffectA.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectA)
    //
    initPanelEffectA2()
}

function initPanelEffectA2() {
    const ctx = panelEffectACtx
    //
    effectA1 = createButton("effect-a1", ctx, 40,  20, 160, 25, "swap rgb", swapRgb, false)
    //
    effectA2 = createButton("effect-a2", ctx, 40,  55, 160, 25, "negative", negative, false)
    //
    effectA3 = createButton("effect-a3", ctx, 40,  90, 160, 25, "grey scale", greyScale, false)
    //
    effectA4 = createButton("effect-a4", ctx, 40, 125, 160, 25, "rotate 90 (R)", rotate90, false)
    //
    effectA5 = createButton("effect-a5", ctx, 40, 160, 160, 25, "mixed reverse (X)", mixedReverse, false)
    //
    effectA6 = createButton("effect-a6", ctx, 40, 195, 160, 25, "vertical reverse (V)", verticalReverse, false)
    //
    effectA7 = createButton("effect-a7", ctx, 40, 230, 160, 25, "horizontal reverse (H)", horizontalReverse, false)
    //
    panelEffectAGadgets = [ effectA1, effectA2, effectA3, effectA4, effectA5, effectA6, effectA7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectA() {
    panelEffectA.style.visibility = "hidden"
}

function paintAndShowPanelEffectA() {
    paintPanelEffectA()
    panelEffectA.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectA() {
    panelEffectA.onmouseup = panelOnMouseUp
    panelEffectA.onmousedown = panelOnMouseDown
    panelEffectA.onmouseleave = panelOnMouseLeave
    panelEffectA.onmouseenter = function () { panelOnMouseEnter(panelEffectAGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectA() {
    // background
    panelEffectACtx.fillStyle = wingColor()
    panelEffectACtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectA1)
    paintButton(effectA2)
    paintButton(effectA3)
    paintButton(effectA4)
    paintButton(effectA5)
    paintButton(effectA6)
    paintButton(effectA7)
}

// file: interface/subpanel-effect-b.js //
// "use strict"

var panelEffectB
var panelEffectBCtx

var effectB1
var effectB2
var effectB3
var effectB4
var effectB5
var effectB6
var effectB7

var panelEffectBGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectB() {
    panelEffectB = createCanvas(240, 277)
    panelEffectBCtx = panelEffectB.getContext("2d")
    //
    panelEffectB.style.position = "absolute"
    panelEffectB.style.top = "355px"
    panelEffectB.style.left = "1060px"
    panelEffectB.style.zIndex = "2"
    panelEffectB.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectB)
    //
    initPanelEffectB2()
}

function initPanelEffectB2() {
    const ctx = panelEffectBCtx
    //
    effectB1 = createButton("effect-b1", ctx, 40,  20, 160, 25, "erase black", eraseBlack, false)
    //
    effectB2 = createButton("effect-b2", ctx, 40,  55, 160, 25, "erase colored", eraseColored, false)
    //
    effectB3 = createButton("effect-b3", ctx, 40,  90, 160, 25, "erase translucent", eraseTranslucent, false)
    //
    effectB4 = createButton("effect-b4", ctx, 40, 125, 160, 25, "erase all but black", eraseAllButBlack, false)
    //
    effectB5 = createButton("effect-b5", ctx, 40, 160, 160, 25, "erase all but colored", eraseAllButColored, false)
    //
    effectB6 = createButton("effect-b6", ctx, 40, 195, 160, 25, "erase all but transluc", eraseAllButTranslucent, false)
    //
    effectB7 = createButton("effect-b7", ctx, 40, 230, 160, 25, "erase palette match", erasePalettePixelsInLayer, false)
    //
    panelEffectBGadgets = [ effectB1, effectB2, effectB3, effectB4, effectB5, effectB6, effectB7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectB() {
    panelEffectB.style.visibility = "hidden"
}

function paintAndShowPanelEffectB() {
    paintPanelEffectB()
    panelEffectB.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectB() {
    panelEffectB.onmouseup = panelOnMouseUp
    panelEffectB.onmousedown = panelOnMouseDown
    panelEffectB.onmouseleave = panelOnMouseLeave
    panelEffectB.onmouseenter = function () { panelOnMouseEnter(panelEffectBGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectB() {
    // background
    panelEffectBCtx.fillStyle = wingColor()
    panelEffectBCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectB1)
    paintButton(effectB2)
    paintButton(effectB3)
    paintButton(effectB4)
    paintButton(effectB5)
    paintButton(effectB6)
    paintButton(effectB7)
}

// file: interface/subpanel-effect-c.js //
// "use strict"

var panelEffectC
var panelEffectCCtx

var effectC1
var effectC2
var effectC3
var effectC4
var effectC5

var panelEffectCGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectC() {
    panelEffectC = createCanvas(240, 277)
    panelEffectCCtx = panelEffectC.getContext("2d")
    //
    panelEffectC.style.position = "absolute"
    panelEffectC.style.top = "355px"
    panelEffectC.style.left = "1060px"
    panelEffectC.style.zIndex = "2"
    panelEffectC.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectC)
    //
    initPanelEffectC2()
}

function initPanelEffectC2() {
    const ctx = panelEffectCCtx
    //
    effectC1 = createButton("effect-c1", ctx, 40,  20, 160, 25, "eat edge", eatBorder, false)
    //
    effectC2 = createButton("effect-c2", ctx, 40,  55, 160, 25, "paint edge inside", inliner, false)
    //
    effectC3 = createButton("effect-c3", ctx, 40,  90, 160, 25, "paint edge outside", outliner, false)
    //
    effectC4 = createButton("effect-c4", ctx, 40, 125, 160, 25, "antialiasing outside 1", antialiasingStandard, false)
    //
    effectC5 = createButton("effect-c5", ctx, 40, 160, 160, 25, "antialiasing outside 2", antialiasingStrong, false)
    //
    panelEffectCGadgets = [ effectC1, effectC2, effectC3, effectC4, effectC5 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectC() {
    panelEffectC.style.visibility = "hidden"
}

function paintAndShowPanelEffectC() {
    paintPanelEffectC()
    panelEffectC.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectC() {
    panelEffectC.onmouseup = panelOnMouseUp
    panelEffectC.onmousedown = panelOnMouseDown
    panelEffectC.onmouseleave = panelOnMouseLeave
    panelEffectC.onmouseenter = function () { panelOnMouseEnter(panelEffectCGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectC() {
    // background
    panelEffectCCtx.fillStyle = wingColor()
    panelEffectCCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectC1)
    paintButton(effectC2)
    paintButton(effectC3)
    paintButton(effectC4)
    paintButton(effectC5)
}

// file: interface/subpanel-effect-d.js //
// "use strict"

var panelEffectD
var panelEffectDCtx

var effectD1
var effectD2
var effectD3
var effectD4
var effectD5
var effectD6
var effectD7

var panelEffectDGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectD() {
    panelEffectD = createCanvas(240, 277)
    panelEffectDCtx = panelEffectD.getContext("2d")
    //
    panelEffectD.style.position = "absolute"
    panelEffectD.style.top = "355px"
    panelEffectD.style.left = "1060px"
    panelEffectD.style.zIndex = "2"
    panelEffectD.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectD)
    //
    initPanelEffectD2()
}

function initPanelEffectD2() {
    const ctx = panelEffectDCtx
    //
    effectD1 = createButton("effect-d1", ctx, 40,  20, 160, 25, "pixelate 2x2", pixelate2, false)
    //
    effectD2 = createButton("effect-d2", ctx, 40,  55, 160, 25, "pixelate 3x3", pixelate3, false)
    //
    effectD3 = createButton("effect-d3", ctx, 40,  90, 160, 25, "pixelate 4x4", pixelate4, false)
    //
    effectD4 = createButton("effect-d4", ctx, 40, 125, 160, 25, "pixelate 5x5", pixelate5, false)
    //
    effectD5 = createButton("effect-d5", ctx, 40, 160, 160, 25, "reduce color A", reduceA, false)
    //
    effectD6 = createButton("effect-d6", ctx, 40, 195, 160, 25, "reduce color B", reduceB, false)
    //
    effectD7 = createButton("effect-d7", ctx, 40, 230, 160, 25, "reduce color C", reduceC, false)
    //
    panelEffectDGadgets = [ effectD1, effectD2, effectD3, effectD4, effectD5, effectD6, effectD7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectD() {
    panelEffectD.style.visibility = "hidden"
}

function paintAndShowPanelEffectD() {
    paintPanelEffectD()
    panelEffectD.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectD() {
    panelEffectD.onmouseup = panelOnMouseUp
    panelEffectD.onmousedown = panelOnMouseDown
    panelEffectD.onmouseleave = panelOnMouseLeave
    panelEffectD.onmouseenter = function () { panelOnMouseEnter(panelEffectDGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectD() {
    // background
    panelEffectDCtx.fillStyle = wingColor()
    panelEffectDCtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectD1)
    paintButton(effectD2)
    paintButton(effectD3)
    paintButton(effectD4)
    paintButton(effectD5)
    paintButton(effectD6)
    paintButton(effectD7)
}

// file: interface/subpanel-effect-e.js //
// "use strict"

var panelEffectE
var panelEffectECtx

var effectE1
var effectE2
var effectE3
var effectE4
var effectE5
var effectE6
var effectE7

var panelEffectEGadgets

///////////////////////////////////////////////////////////////////////////////

function initPanelEffectE() {
    panelEffectE = createCanvas(240, 277)
    panelEffectECtx = panelEffectE.getContext("2d")
    //
    panelEffectE.style.position = "absolute"
    panelEffectE.style.top = "355px"
    panelEffectE.style.left = "1060px"
    panelEffectE.style.zIndex = "2"
    panelEffectE.style.visibility = "hidden"
    //
    bigdiv.appendChild(panelEffectE)
    //
    initPanelEffectE2()
}

function initPanelEffectE2() {
    const ctx = panelEffectECtx
    //
    effectE1 = createButton("effect-e1", ctx, 40,  20, 160, 25, "emboss", emboss, false)
    //
    effectE2 = createButton("effect-e2", ctx, 40,  55, 160, 25, "smooth", smooth, false)
    //
    effectE3 = createButton("effect-e3", ctx, 40,  90, 160, 25, "blur", blur, false)
    //
    effectE4 = createButton("effect-e4", ctx, 40, 125, 160, 25, "noise", addNoise, false)
    //
    effectE5 = createButton("effect-e5", ctx, 40, 160, 160, 25, "round alpha", roundAlpha, false)
    //
    effectE6 = createButton("effect-e6", ctx, 40, 195, 160, 25, "sepia tone", sepiaTone, false)
    //
    effectE7 = createButton("effect-e7", ctx, 40, 230, 160, 25, "weaken black pixels", weakenBlack, false)
    //
    panelEffectEGadgets = [ effectE1, effectE2, effectE3, effectE4, effectE5, effectE6, effectE7 ]
}

///////////////////////////////////////////////////////////////////////////////

function hidePanelEffectE() {
    panelEffectE.style.visibility = "hidden"
}

function paintAndShowPanelEffectE() {
    paintPanelEffectE()
    panelEffectE.style.visibility = "visible"
}

///////////////////////////////////////////////////////////////////////////////

function startListeningPanelEffectE() {
    panelEffectE.onmouseup = panelOnMouseUp
    panelEffectE.onmousedown = panelOnMouseDown
    panelEffectE.onmouseleave = panelOnMouseLeave
    panelEffectE.onmouseenter = function () { panelOnMouseEnter(panelEffectEGadgets) }
}

///////////////////////////////////////////////////////////////////////////////

function paintPanelEffectE() {
    // background
    panelEffectECtx.fillStyle = wingColor()
    panelEffectECtx.fillRect(0, 0, 240, 277)
    //
    paintButton(effectE1)
    paintButton(effectE2)
    paintButton(effectE3)
    paintButton(effectE4)
    paintButton(effectE5)
    paintButton(effectE6)
    paintButton(effectE7)
}

// file: interface/superhand.js //
// "use strict"

var superHand
var superHandCtx

var superHandOn = false

///////////////////////////////////////////////////////////////////////////////

function initSuperHand() {
    superHand = createCanvas(160, 185)
    superHandCtx = superHand.getContext("2d")
    //
    superHand.style.position = "absolute"
    superHand.style.top = "30px"
    superHand.style.zIndex = "2"
    superHand.style.visibility = "hidden"
    //
    paintSuperHand()
    //
    bigdiv.appendChild(superHand)
}

///////////////////////////////////////////////////////////////////////////////

function paintSuperHand() {
    //
    superHandCtx.fillStyle = "rgb(144,146,148)"
    superHandCtx.fillRect(0, 0, 160, 185)
    //
    const src = icons50["hand"]
    //
    superHandCtx.drawImage(src, 0,0,50,50, 30,45,100,100)
}

///////////////////////////////////////////////////////////////////////////////

function showSuperHand() {
    //
    superHandOn = true
    superHand.style.visibility = "visible"
}

function hideSuperHand() {
    superHandOn = false
    resetMove()
    superHand.style.visibility = "hidden"
}

// file: interface/tile-set.js //
// "use strict"

var tileset = null
var tilesetCtx = null

///////////////////////////////////////////////////////////////////////////////

function showTileSet() {
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("tile-set")
    //
    makeCheckedPicture(showTileSet2)
}

function showTileSet2(pic) {
    //
    MODE = "tile-set"
    //
    if (tileset == null) { initTileSet() }
    tileset.style.visibility = "visible"
    //
    updateTileSet(pic)
}

function hideTileSet() {
    MODE = "standard"
    tileset.style.visibility = "hidden"
}

///////////////////////////////////////////////////////////////////////////////

function initTileSet() {
    tileset = createCanvas(1300, 660)
    tilesetCtx = tileset.getContext("2d")
    //
    tileset.style.position = "absolute"
    tileset.style.zIndex = "31"
    tileset.style.visibility = "hidden"
    //
    bigdiv.appendChild(tileset)
    //
    tileset.onclick = hideTileSet
}

function updateTileSet(src) {
    //
    tilesetCtx.fillStyle = "rgb(192,192,192)"
    tilesetCtx.fillRect(0, 0, 1300, 660)
    //
    let left = 0
    let top  = 0
    while (true) {
        tilesetCtx.drawImage(src, left, top)
        left += src.width
        if (left > 1300) { left = 0; top += src.height }
        if (top  >  660) { break }
    }
}

// file: interface/toolbox.js //
// "use strict"

var tool = "thin-pen"
var toolBeforeCapture = "thin-pen"

var toolbox
var toolboxCtx

var toolboxScheme = [
    //
    "mirror-pen",
    "spray",
    "every",
    "bucket",
    "thin-pen",
    //
    "rectangle",
    "ellipse",
    "border",
    "line",
    "pen",
    //
    "darken",
    "lighten",
    "rubber",
    "capture",
    "feather",
    //
    "blur-pixel",
    "blur-border",
    "scale",
    "hand",
    "", // for finding clicked icon
    //
    "select",
    "lasso",
    "", // for finding clicked icon
    "", // for finding clicked icon
    ""  // for finding clicked icon
]

///////////////////////////////////////////////////////////////////////////////

function initToolbox() {
    toolbox = createCanvas(160, 185)
    toolboxCtx = toolbox.getContext("2d")
    //
    toolbox.style.position = "absolute"
    toolbox.style.top = "30px"
    //
    bigdiv.appendChild(toolbox)
}

///////////////////////////////////////////////////////////////////////////////

function startListeningToolbox() {
    toolbox.onmousedown = resetFocusedGadget
    toolbox.onclick = toolboxClicked
}

///////////////////////////////////////////////////////////////////////////////

function paintToolbox() {
    paintToolboxBg()
    //
    greyTraceH(toolboxCtx, 5, 0, 150)
    paintIconsOnToolbox()
    paintToolSizeOnToolbox()
    paintToolIntensityOnToolbox()
}

function paintToolboxBg() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(0, 0, 160, 185)
}

function paintIconsOnToolbox() {
    let left = 1
    let top  = 6
    //
    for (const id of toolboxScheme) {
        paintIconOnToolbox(id, left, top)
        left += 32
        if (left > 130) { left = 1; top += 32 }
    }
}

function paintIconOnToolbox(id, left, top) {
    if (id == "") { return }
    //
    if (id == tool) {
        paintBgOn30(toolboxCtx, left, top)
    }
    else {
        paintBgOff30(toolboxCtx, left, top)
    }
    //
    const icon = getIcon30(id)
    toolboxCtx.drawImage(icon, left, top)
}

///////////////////////////////////////////////////////////////////////////////

function paintToolSizeOnToolbox() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(0, 165, 90, 20)
    //
    const side = toolSizeFor[tool]
    if (side == undefined) { return }
    //
    const txt = "size  " + side + " x " + side
    write(toolboxCtx, txt, 5, 170)
}

function paintToolIntensityOnToolbox() {
    toolboxCtx.fillStyle = wingColor()
    toolboxCtx.fillRect(90, 165, 70, 20)
    //
    let intensity = intensityFor[tool]
    if (intensity == undefined) { return }
    if (tool == "lighten"  ||  tool == "darken") { intensity *= 10 }
    //
    const txt = "int  " + Math.floor(intensity * 100) + "%"
    write(toolboxCtx, txt, 95, 170)
}

///////////////////////////////////////////////////////////////////////////////

function toolboxClicked(e) {
    const wanted = clickedIconOnToolbox(e.offsetX, e.offsetY)
    //
    if (wanted == "") { return }
    //
    if (wanted == "capture") { toolBeforeCapture = tool }
    //
    tool = wanted
    paintIconsOnToolbox()
}

function recoverToolBeforeCapture() {
    tool = toolBeforeCapture
    paintIconsOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function clickedIconOnToolbox(x, y) {
    const tops = [ 6, 38, 70, 106, 138 ]
    //
    const off = tops.length
    for (let n = 0; n < off; n++) {
        const top = tops[n]
        if (y < top) { return "" }
        if (y < top + 30) { return clickedRowOnToolbox(x, n) }
    }
    //
    return ""
}

function clickedRowOnToolbox(x, row) {
    const lefts = [ 1, 33, 65, 97, 129 ] // excludes 2 pixels from left
    //
    const off = lefts.length
    for (let n = 0; n < off; n++) {
        const left = lefts[n]
        if (x < left) { return "" }
        if (x < left + 30) { return clickedRowColOnToolbox(row, n) }
    }
    return ""
}

function clickedRowColOnToolbox(row, col) {
    return toolboxScheme[row * 5 + col]
}

// file: interface/top-bar.js //
// "use strict"

var topBar
var topBarCtx

var topBarScheme = [
    //
    "roll",
    "",
    "protection",
    "",
    "center",
    "",
    "minus",
    "plus",
    "",
    "halves-h",
    "halves-v",
    "tile-set",
    "",
    "",
    "undo",
    "redo",
    "",
    "",
    "register",
    "previous",
    "next",
    "favorites",
    "",
    "animation",
    "",
    "load",
    "save",
    "save2",
    "",
    "help"
]

const topBarLefts = [ ]

const topBarBlinkings = { } // { id: timer }

///////////////////////////////////////////////////////////////////////////////

function initTopBar() {
    topBar = createCanvas(1300, 30)
    topBarCtx = topBar.getContext("2d")
    //
    topBar.style.position = "absolute"
    //
    bigdiv.appendChild(topBar)
    //
    initTopBar2()
}

function initTopBar2() {
    fillTopBarLefts()
}

function fillTopBarLefts() {
    let left = 164
    //
    for (const id of topBarScheme) {
        topBarLefts.push(left)
        left += (id == "" ? 19 : 37)
    }
}

///////////////////////////////////////////////////////////////////////////////

function startListeningTopBar() {
    topBar.onclick = topBarClicked
    topBar.onmousedown = resetFocusedGadget
}

///////////////////////////////////////////////////////////////////////////////

function paintTopBar() {
    paintTopBarBg()
    //
    paintBobSpriteLogo()
    paintIconsOnTopBar()
    paintCurrentColorOnTopBar()
}

function paintTopBarBg() {
    topBarCtx.fillStyle = wingColor()
    topBarCtx.fillRect(0, 0, 1300, 30)
}

function paintBobSpriteLogo() {
    let bobsprite = specialIcons["bobsprite"]
    if (isDarkInterface)  { bobsprite = specialIcons["bobsprite-dark"] }
    topBarCtx.drawImage(bobsprite, 26, 7)
}

///////////////////////////////////////////////////////////////////////////////

function paintIconsOnTopBar() {
    //
    const off = topBarScheme.length
    for (let n = 0; n < off; n++) {
        const id = topBarScheme[n]
        const left = topBarLefts[n]
        if (id != "") { paintIconOnTopBar(id, left) }
    }
}

function paintIconOnTopBar(id, left) {
    //
    if (topBarIconIsOn(id)) {
        paintBgOn25(topBarCtx, left, 3)
    }
    else {
        paintBgOff25(topBarCtx, left, 3)
    }
    //
    const icon = getIcon25(id)
    topBarCtx.drawImage(icon, left, 3)
}

function topBarIconIsOn(id) {
    //
    if (id == "protection") { return shallProtectBlank }
    //
    const timer = topBarBlinkings[id]
    if (timer == undefined) { return false }
    return timer > LOOP
}

///////////////////////////////////////////////////////////////////////////////

function paintCurrentColorOnTopBar() {
    const x = 1030
    //
    topBarCtx.fillStyle = "black"
    topBarCtx.fillRect(x + 64, 1, 40, 28)
    topBarCtx.fillStyle = "rgb(" + RED + "," + GREEN + "," + BLUE + ")"
    topBarCtx.fillRect(x + 65, 2, 38, 26)
    //
    topBarCtx.fillStyle = wingColor()
    topBarCtx.fillRect(x + 108, 7, 130, 20)
    //
    const alpha = (ALPHA == 255 ? "opaque" : ALPHA)
    const txt = RED + " " + GREEN + " " + BLUE + " " + alpha
    //
    write(topBarCtx, txt, x + 112, 12)
}

///////////////////////////////////////////////////////////////////////////////

function topBarClicked(e) {
    const id = clickedIconOnTopBar(e.offsetX, e.offsetY)
    //
    if (id == "") { return }
    //
    if (id == "help") { setTask(showOrHideHelp); return }
    if (id == "load") { loadImage(); return }
    if (id == "undo") { setTask(undo); return }
    if (id == "redo") { setTask(redo); return }
    if (id == "save") { saveImage("png"); return }
    if (id == "roll") { setTask(useRoll); return }
    if (id == "plus") { setTask(increaseZoom); return }
    if (id == "next") { setTask(showNextFavorite); return }
    if (id == "minus") { setTask(decreaseZoom); return }
    if (id == "save2") { setTask(showAlternativeSave); return }
    if (id == "center") { setTask(centerLayers); return }
    if (id == "tile-set") { setTask(showTileSet); return }
    if (id == "halves-h") { setTask(leftRightToCenter); return }
    if (id == "halves-v") { setTask(topBottomToCenter); return }
    if (id == "register") { setTask(pictureToFavorites); return }
    if (id == "previous") { setTask(showPreviousFavorite); return }
    if (id == "favorites") { setTask(showFavorites); return }
    if (id == "animation") { setTask(showAnimation); return }
    if (id == "protection") { toggleProtection(); return }
}

///////////////////////////////////////////////////////////////////////////////

function clickedIconOnTopBar(x, y) {
    if (y < 2)  { return "" }
    if (y > 28) { return "" }
    //
    const off = topBarLefts.length
    for (let n = 0; n < off; n++) {
        const left = topBarLefts[n]
        const a = left - 3
        const b = left + 25 + 3
        if (x < a) { continue }
        if (x > b) { continue }
        const id = topBarScheme[n]
        if (id != "") { return id }
    }
    return ""
}

///////////////////////////////////////////////////////////////////////////////

function startBlinkingIconOnTopBar(id) {
    topBarBlinkings[id] = LOOP + 5
    paintIconsOnTopBar()
    scheduleByLoop(paintIconsOnTopBar, 5)
}

// file: library/antialiasing-extern.js //
// "use strict"

// standard: 100, 50, 25
// strong:   140, 70, 35
// erases/overwrites translucid pixels;
// antialiases any solid neighbour;

///////////////////////////////////////////////////////////////////////////////

function antialiasingStandard(cnv) {
    antialiasingCore(cnv, 100, 50, 25)
}

function antialiasingStrong(cnv) {
    antialiasingCore(cnv, 140, 70, 35)
}

function antialiasingCore(cnv, A, B, C) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    // current system of marking points for review is a canvas;
    // the old system (growing list of points) used to break the program with big images!
    const reviewTable = createCanvas(width, height)
    const reviewData = reviewTable.getContext("2d").getImageData(0, 0, width, height).data
    process()
    ctx.putImageData(imgdata, 0, 0)
    return
    //
    function process() {
        //
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { eraseTranslucent(x, y) }
        }
        //
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { firstProcessAt(x, y) }
        }
        //
        for (let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { secondProcessAt(x, y) }
        }
    }
    function eraseTranslucent(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        if (a == 255) { return } // opaque
        //
        data[index    ] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
    }
    function firstProcessAt(x, y) {
        const index = 4 * (width * y + x)
        let alpha = data[index + 3]
        if (alpha != 0) { return } // not blank
        //
        const north = isSolid(x, y - 1)
        const south = isSolid(x, y + 1)
        const west  = isSolid(x - 1, y)
        const east  = isSolid(x + 1, y)
        //
        if (north && west) {  // corner
            alpha = A
        }
        else if (north && east) {  // corner
            alpha = A
        }
        else if (south && west) {  // corner
            alpha = A
        }
        else if (south && east) {  // corner
            alpha = A
        }
        else if (north || south || east  || west) {  // side
            alpha = C
            reviewData[index + 3] = 255
        }
        //
        data[index + 3] = alpha
    }
    function secondProcessAt(x, y) {
        const index = 4 * (width * y + x)
        const a = reviewData[index + 3]
        if (a != 255) { return } // not marked to be reviewed
        //
        const north = isAntialiasingA(x, y - 1)
        const south = isAntialiasingA(x, y + 1)
        const west  = isAntialiasingA(x - 1, y)
        const east  = isAntialiasingA(x + 1, y)
        //
        if (north  ||  south  ||  east  ||  west) {
            data[index + 3] = B
        }
    }
    function isSolid(x, y) {
        if (y < 0  ||  x < 0) { return false }
        if (y > height - 1  ||  x > width - 1) { return false }
        //
        const index = 4 * (width * y + x)
        return data[index + 3] == 255
    }
    function isAntialiasingA(x, y) {
        if (y < 0  ||  x < 0) { return false }
        if (y > height - 1  ||  x > width - 1) { return false }
        //
        const index = 4 * (width * y + x)
        return data[index + 3] == A
    }
}

// file: library/autocrop.js //
// "use strict"

function autocrop(src) {
    //
    return autocropWidth(autocropHeight(src))
}

function autocropHeight(src) {
    const width  = src.width
    const height = src.height
    const data   = src.getContext("2d").getImageData(0, 0, width, height).data
    //
    const first  = firstNonBlankRow()
    const last   = lastNonBlankRow()
    const newHeight = last - first + 1
    //
    const cnv = createCanvas(width, newHeight)
    cnv.getContext("2d").drawImage(src, 0, -first)
    return cnv
    //
    function firstNonBlankRow() {
        for (let y = 0; y < height; y += 1) { if (! rowIsBlank(y)) { return y } }
        return 0 // blank image
    }
    function lastNonBlankRow() {
        for (let y = height - 1; y > -1; y -= 1) { if (! rowIsBlank(y)) { return y } }
        return height - 1 // blank image
    }
    function rowIsBlank(y) {
        for (let x = 0; x < width; x += 1) {
            let index = 4 * (width * y + x)
            if (data[index + 3] != 0) { return false }  // alpha
        }
        return true
    }
}

function autocropWidth(src) {
    const width  = src.width
    const height = src.height
    const data   = src.getContext("2d").getImageData(0, 0, width, height).data
    //
    const first  = firstNonBlankCol()
    const last   = lastNonBlankCol()
    const newWidth =  last - first + 1
    //
    const cnv = createCanvas(newWidth, height)
    cnv.getContext("2d").drawImage(src, -first, 0)
    return cnv
    //
    function firstNonBlankCol() {
        for (let x = 0; x < width; x += 1) { if (! colIsBlank(x)) { return x } }
        return 0 // blank image
    }
    function lastNonBlankCol() {
        for (let x = width - 1; x > -1; x -= 1) { if (! colIsBlank(x)) { return x } }
        return width - 1 // blank image
    }
    function colIsBlank(x) {
        for (let y = 0; y < height; y += 1) {
            let index = 4 * (width * y + x)
            if (data[index + 3] != 0) { return false }  // alpha
        }
        return true
    }
}

// file: library/blur-border.js //
// "use strict"

// does not work on blank areas //

///////////////////////////////////////////////////////////////////////////////

function blurBorder(cnv, x, y) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const index = 4 * (width * y + x)
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false }
    //
    const refdata = getAreaData(data, width, height, x, y)
    //
    const changed = blurBorderCore(data, width, height, refdata, r, g, b)
    if (! changed) { return false }
    //
    ctx.putImageData(imgdata, 0, 0)
    return true
}

function blurBorderCore(data, width, height, refdata, r, g, b) {
    let rsum
    let gsum
    let bsum
    let counter
    let changed = false
    //
    process()
    return changed
    //
    function process() {
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        if (refdata[index + 3] == 0) { return } // blank
        //
        rsum = 0
        gsum = 0
        bsum = 0
        counter = 0
        //
        grabPixel(x, y - 1, false) // north
        grabPixel(x, y + 1, false) // south
        grabPixel(x - 1, y, false) // west
        grabPixel(x + 1, y, false) // east
        grabPixel(x - 1, y - 1, true) // northwest
        grabPixel(x + 1, y - 1, true) // northeast
        grabPixel(x - 1, y + 1, true) // southwest
        grabPixel(x + 1, y + 1, true) // southeast
        //
        if (counter == 0)  { return } // not border or neutral border (surrounded by blank or outline)
        //
        const R = rsum / counter
        const G = gsum / counter
        const B = bsum / counter
        //
        /*
            cant use: const rate = intensity * (counter / 8)
            because counter often is 12 (straight counts double than diagonal);
            anyway, at least with rectangles, it is more beautiful without this consideration
        */
        const rate  = intensityFor[tool]  // global variable
        const rate2 = 1 - rate
        //
        let r2 = Math.round(R * rate  +  r * rate2)
        let g2 = Math.round(G * rate  +  g * rate2)
        let b2 = Math.round(B * rate  +  b * rate2)
        //
        if (r2 > 255) { r2 = 255 }
        if (g2 > 255) { g2 = 255 }
        if (b2 > 255) { b2 = 255 }
        //
        if (r2 + g2 + b2 == 0) { r2 = 1; g2 = 1; b2 = 1 } // avoids make false outline
        //
        if (r2 == r  &&  g2 == g  &&  b2 == b)  { return }
        //
        data[index    ] = r2
        data[index + 1] = g2
        data[index + 2] = b2
        changed = true
    }
    //
    function grabPixel(x, y, diagonal) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        if (refdata[index + 3] != 0) { return } // neighbour inside target area
        //
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (a == 0) { return } // not counting blank
        if (r + g + b == 0  &&  a == 255) { return } // not counting black (outline)
        //
        rsum += r
        gsum += g
        bsum += b
        counter += 1
        //
        if (diagonal) { return }
        // straight neighbours have double influence:
        rsum += r
        gsum += g
        bsum += b
        counter += 1
    }
}

// file: library/bresenham.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function makeBresenham(x0, y0, x1, y1) {
    if (x0 == null) { return [createPoint(x1, y1)] } // just starting
    //
    return makeBresenhamCore(x0, y0, x1, y1)
}

function makeBresenhamCore(x0, y0, x1, y1) {
    //
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    if (dx < 2  &&  dy < 2) { return [createPoint(x1, y1)] } // no jump
    //
    let sx = (x0 < x1) ? 1 : -1
    let sy = (y0 < y1) ? 1 : -1
    //
    let err = dx - dy
    const arr = [ ]
    // adapted bresenham !
    while (true) {
        if ((x0 == x1) && (y0 == y1)) { break }
        //
        const e2 = 2 * err
        if (e2 > -dy) { err -= dy; x0 += sx }
        if (e2 <  dx) { err += dx; y0 += sy }
        //
        arr.push(createPoint(x0, y0)) // this line is at end to not include x0y0
    }
    return arr
}

// file: library/colorize.js //
// "use strict"

// not checking if image changed!

///////////////////////////////////////////////////////////////////////////////

function colorize(cnv, intensityOfNewHue, SAT, LUM) {
    //
    const HSL = rgbToHsl([RED, GREEN, BLUE])
    const HUE = HSL[0]
    const RGB = hslToRgb([HUE, 1, 0.5 ]) // max saturation & balanced luminosity = pure color
    //
    const factor1 = 1 - intensityOfNewHue
    const factor2 = intensityOfNewHue
    //
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    return
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        let r = data[index]
        let g = data[index + 1]
        let b = data[index + 2]
        let a = data[index + 3]
        //
        if (a == 0) { return } // blank
        if (r + g + b == 0  &&  a == 255) { return } // solid black
        //
        let hsl = rgbToHsl([ r, g, b ])
        let hue = hsl[0]
        const sat = Math.min(1, hsl[1] * (SAT / 0.5))
        const lum = Math.min(1, hsl[2] * (LUM / 0.5))
        //
        let rgb = hslToRgb([hue, 1, 0.5])
        //
        r = (factor1 * rgb[0]) + (factor2 * RGB[0])
        g = (factor1 * rgb[1]) + (factor2 * RGB[1])
        b = (factor1 * rgb[2]) + (factor2 * RGB[2])
        //
        r = Math.min(255, Math.round(r))
        g = Math.min(255, Math.round(g))
        b = Math.min(255, Math.round(b))
        //
        hue = rgbToHsl([r, g, b])[0]
        //
        rgb = hslToRgb([ hue, sat, lum ])
        //
        r = rgb[0]
        g = rgb[1]
        b = rgb[2]
        //
        if (a == 255  &&  r == 0  &&  g == 0  &&  b == 0) { r = 1; g = 1; b = 1 } // avoid false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
    }
}

// file: library/eat-border.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function eatBorder(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const ref = data.slice(0)
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        if (ref[index + 3] == 0) { return } // blank
        if (! isBorder(x, y)) { return }
        //
        data[index]     = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true
    }
    function isBorder(x, y) {
        if (isBlankOrOff(x    , y - 1)) { return true }
        if (isBlankOrOff(x    , y + 1)) { return true }
        if (isBlankOrOff(x - 1, y    )) { return true }
        if (isBlankOrOff(x + 1, y    )) { return true }
        return false
    }
    function isBlankOrOff(x, y) {
        if (x < 0) { return true }
        if (y < 0) { return true }
        if (x > width - 1) { return true }
        if (y > height- 1) { return true }
        //
        const index = 4 * (width * y + x)
        return (ref[index + 3] == 0) // alpha
    }
}

// file: library/erase.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function eraseBlack(cnv) {
    return selectiveErase(cnv, true, false, false)
}

function eraseColored(cnv) {
    return selectiveErase(cnv, false, true, false)
}

function eraseTranslucent(cnv) {
    return selectiveErase(cnv, false, false, true)
}

function eraseAllButBlack(cnv) {
    return selectiveErase(cnv, false, true, true)
}

function eraseAllButColored(cnv) {
    return selectiveErase(cnv, true, false, true)
}

function eraseAllButTranslucent(cnv) {
    return selectiveErase(cnv, true, true, false)
}

///////////////////////////////////////////////////////////////////////////////

function selectiveErase(cnv, black, colored, transluc) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (! shallErase(r, g, b, a)) { return }
        data[index]     = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true
    }
    function shallErase(r, g, b, a) {
        if (a == 0)  { return false }
        if (a < 255) { return transluc }
        if (r + g + b == 0) { return black }
        return colored
    }
}

// file: library/erase-matches.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function eraseMatchingPixels(cnv, rgbColors) {
    //
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        //
        if (a != 255) { return } // translucent
        //
        if (! isInColors(r, g, b)) { return }
        //
        data[index] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
        //
        changed = true
    }
    function isInColors(r, g, b) {
        //
        for (const color of rgbColors) {
            if (r != color[0]) { continue }
            if (g != color[1]) { continue }
            if (b != color[2]) { continue }
            return true
        }
        return false
    }
}

// file: library/filters.js //
// "use strict"

// avoids make false outline
// own pixel replaces value of some invalid neighbour
// completely ignores blank and black pixels

/*
function edgeDetection(cnv) {
    return applyFilter(cnv, [ 0,  1,  0,    1,  -4,  1,    0,  1, 0 ])
}

function edgeDetection2(cnv) {
   return applyFilter(cnv, [ -1,  -1,  -1,    -1,  8,  -1,    -1,  -1, -1 ])
}

function raise(cnv) {
    return applyFilter(cnv, [ 0,  0,  -2,    0,  2,  0,     1,  0,  0 ])
}

function sharpen(cnv) {
 // return applyFilter(cnv, [ -1,  -1,  -1,    -1,  9,  -1,   -1,  -1,  -1 ]) // old
    return applyFilter(cnv, [ 0,   -1,   0,    -1,  5,  -1,    0,  -1,   0 ])
}
*/

///////////////////////////////////////////////////////////////////////////////

function emboss(cnv) {
    return applyFilter(cnv, [ -1,  0,  0,    0,  1,  0,    0,  0,  1 ])
}

function blur(cnv) {
    return applyFilter(cnv, [ 1/9,  1/9,  1/9,    1/9,  1/9,  1/9,     1/9,  1/9,  1/9 ])
}

function smooth(cnv) {
    return applyFilter(cnv, [ 1/20,  1/20,  1/20,    1/20,  12/20,  1/20,    1/20,  1/20,  1/20 ])
}

///////////////////////////////////////////////////////////////////////////////

function applyFilter(cnv, filter) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const srcdata = data.slice(0)
    let channels, R, G, B, A
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        R = srcdata[index]
        G = srcdata[index + 1]
        B = srcdata[index + 2]
        A = srcdata[index + 3]
        //
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        channels = [0, 0, 0]
        fillChannelsWith(x - 1, y - 1, filter[0]) // northwest
        fillChannelsWith(x    , y - 1, filter[1]) // north
        fillChannelsWith(x + 1, y - 1, filter[2]) // northeast
        fillChannelsWith(x - 1, y    , filter[3]) // west
        fillChannelsWith(x    , y    , filter[4]) // center
        fillChannelsWith(x + 1, y    , filter[5]) // east
        fillChannelsWith(x - 1, y + 1, filter[6]) // southwest
        fillChannelsWith(x    , y + 1, filter[7]) // south
        fillChannelsWith(x + 1, y + 1, filter[8]) // southeast
        //
        let r = Math.floor(channels[0])
        let g = Math.floor(channels[1])
        let b = Math.floor(channels[2])
        //
        if (r > 255) { r = 255 }
        if (g > 255) { g = 255 }
        if (b > 255) { b = 255 }
        //
        if (r < 0) { r = 0 } // necessary when some factor is negative
        if (g < 0) { g = 0 } // or else may fool 'avoid false outline' control
        if (b < 0) { b = 0 } //
        //
        if (r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        //
        if (R != r  ||  G != g  ||  B != b) { changed = true }
    }
    function fillChannelsWith(x, y, factor) {
        const px = getPixel(x, y)
        channels[0] += px[0] * factor
        channels[1] += px[1] * factor
        channels[2] += px[2] * factor
    }
    function getPixel(x, y) {
        if (x < 0) { return [R, G, B] }
        if (y < 0) { return [R, G, B] }
        if (x > width - 1) { return [R, G, B] }
        if (y > height- 1) { return [R, G, B] }
        //
        const index = 4 * (width * y + x)
        const r = srcdata[index]
        const g = srcdata[index + 1]
        const b = srcdata[index + 2]
        const a = srcdata[index + 3]
        //
        if (a == 0) { return [R, G, B] } // blank
        //
        if (r + g + b == 0  &&  a == 255) { return [R, G, B] } // solid black
        //
        return [r, g, b]
    }
}

// file: library/get-area.js //
// "use strict"

// area is copy of part of source //
// area become fuchsia when it is blank //

///////////////////////////////////////////////////////////////////////////////

function __getArea(cnv, x, y) {
    //
    const width  = cnv.width
    const height = cnv.height
    //
    const ctx = cnv.getContext("2d")
    const srcdata = ctx.getImageData(0, 0, width, height).data
    //
    let px = ctx.getImageData(x, y, 1, 1).data
    let R = px[0]
    let G = px[1]
    let B = px[2]
    let A = px[3]
    const isBlankArea = (R + G + B + A) == 0
    //
    const area = createCanvas(width, height)
    const areaCtx = area.getContext("2d")
    const imgdata = areaCtx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    let current = []
    let future  = [] // each point is already painted; serves as center to search neighbours
    process()
    areaCtx.putImageData(imgdata, 0, 0)
    return area
    //
    function process() {
        processAt(x, y) // must paint starting pixel
        while (future.length > 0) { walk() }
    }
    function walk() {
        current = future
        future  = []
        while (current.length > 0) {
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        //
        if (data[index + 3] != 0) { return } // already processed
        //
        if (R != srcdata[index    ]) { return }
        if (G != srcdata[index + 1]) { return }
        if (B != srcdata[index + 2]) { return }
        if (A != srcdata[index + 3]) { return }
        //
        if (isBlankArea) {
            // must mark desired area with some color;
            // no mess with fuchsia pixels from source because,
            // in this case, we are picking only blank pixels from source
            data[index    ] = 255
            data[index + 1] =   0
            data[index + 2] = 255
            data[index + 3] = 255
        }
        else {
            data[index    ] = R
            data[index + 1] = G
            data[index + 2] = B
            data[index + 3] = A
        }
        //
        future.push(createPoint(x, y))
    }
}

// file: library/get-area-data.js //
// "use strict"

// area is copy of part of source //
// area become fuchsia when it is blank //

///////////////////////////////////////////////////////////////////////////////

function getAreaData(srcdata, width, height, x, y) {
    //
    const px = startingPixel()
    const R = px[0]
    const G = px[1]
    const B = px[2]
    const A = px[3]
    const isBlankArea = (R + G + B + A) == 0
    //
    const data = srcdata.slice(0) // clones data
    const off = data.length
    for (let n = 0; n < off; n++) { data[n] = 0 }
    //
    let current = []
    let future  = [] // each point is already painted; serves as center to search neighbours
    process()
    return data
    //
    function process() {
        processAt(x, y) // must paint starting pixel
        while (future.length > 0) { walk() }
    }
    function walk() {
        current = future
        future  = []
        while (current.length > 0) {
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        //
        if (data[index + 3] != 0) { return } // already processed
        //
        if (R != srcdata[index    ]) { return }
        if (G != srcdata[index + 1]) { return }
        if (B != srcdata[index + 2]) { return }
        if (A != srcdata[index + 3]) { return }
        //
        if (isBlankArea) {
            // must mark desired area with some color;
            // no mess with fuchsia pixels from source because,
            // in this case, we are picking only blank pixels from source
            data[index    ] = 255
            data[index + 1] =   0
            data[index + 2] = 255
            data[index + 3] = 255
        }
        else {
            data[index    ] = R
            data[index + 1] = G
            data[index + 2] = B
            data[index + 3] = A
        }
        //
        future.push(createPoint(x, y))
    }
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            srcdata[index],
            srcdata[index + 1],
            srcdata[index + 2],
            srcdata[index + 3]
        ]
    }
}

// file: library/grey-scale.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function greyScale(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
// old: const grey = Math.floor((r + g + b) / 3)
//old2: const rgb  = rgbToGrey([r,g,b])
//old2: const grey = rgb[0]
        let grey = getGrey(R, G, B)
        //
        if (grey == 0  &&  A == 255) { grey = 1 } // avoid false outline
        //
        data[index    ] = grey
        data[index + 1] = grey
        data[index + 2] = grey
        //
        if (R != grey  ||  G != grey  ||  B != grey) { changed = true }
    }
}

function getGrey(r, g, b) {
    let grey = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
    if (grey > 255) { grey = 255 }
    //
    return grey
}

function __getGrey2(r, g, b) {
    const sum = r + g + b
    if (sum == 0) { return 0 }
    //
    const standard = r * 0.299 + g * 0.587 + b * 0.114
    const forred   = r * 0.4   + g * 0.4   + b * 0.2
    const forblue  = r * 0.3   + g * 0.4   + b * 0.3
    //
    const factorForRed  = r / sum
    const factorForBlue = b / sum
    const factorForStandard = 1 - factorForRed - factorForBlue
    //
    let grey = Math.round(standard * factorForStandard + forred * factorForRed + forblue * factorForBlue)
    if (grey > 255) { grey = 255 }
    //
    return grey
}

// file: library/hsl.js //
// "use strict"

// Hue is a degree on the color wheel (from 0 to 359) - 0 (or 360) is red, 120 is green, 240 is blue.
// Saturation is a percentage value; 0% means a shade of gray and 100% is the full color.
// Lightness is also a percentage; 0% is black, 100% is white.

///////////////////////////////////////////////////////////////////////////////

function lightenDarkenColor(rgb, delta) { // bad for orion's face; best for everything else
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    const sat = hsl[1]
    let   lum = hsl[2]
    lum += delta
    if (lum < 0) { lum = 0 }
    if (lum > 1) { lum = 1 }
    //
    return hslToRgb([hue, sat, lum])
}

function __changeColorContrast(rgb, delta) {
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    let   sat = hsl[1]
    const lum = hsl[2]
    sat += delta
    if (sat < 0) { sat = 0 }
    if (sat > 1) { sat = 1 }
    //
    return hslToRgb([hue, sat, lum])
}

///////////////////////////////////////////////////////////////////////////////

function __hslToString(hsl) {
    const h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
    return "hsl(" + parseInt(h*100)/100 + "," + parseInt(s*10000)/100 + "%," + parseInt(l*10000)/100 + "%)"
}

///////////////////////////////////////////////////////////////////////////////

function rgbToHsl(rgb) {
    const r = rgb[0] / 255.0
    const g = rgb[1] / 255.0
    const b = rgb[2] / 255.0
    //
    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    let hue
    let sat
    // luminosity is the average of the largest and smallest color components
    const lum = (max + min) / 2.0
    const chroma = max - min
    //
    if (chroma == 0) { // no saturation
        hue = 0
        sat = 0
    }
    else {
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        if (lum < 0.5) {
            sat = chroma / (2 * lum)
        }
        else {
            sat = chroma / (2 - 2 * lum)
        }
        //
        if (max == r  &&  g >= b) {
            hue = 1.0472 * (g - b) / chroma
        }
        else if (max == r  &&  g < b) {
            hue = 1.0472 * (g - b) / chroma + 6.2832
        }
        else if (max == g) {
            hue = 1.0472 * (b - r) / chroma + 2.0944
        }
        else if (max == b) {
            hue = 1.0472 * (r - g) / chroma + 4.1888
        }
    }
    //
    const H = Math.round(1000 * hue / 6.2832 * 360) / 1000
    const S = Math.round(1000 * sat) / 1000
    const L = Math.round(1000 * lum) / 1000
    return [ H, S, L ]
}

///////////////////////////////////////////////////////////////////////////////

function hslToRgb(hsl) {
    /*
        const cnv = createCanvas(1, 1)
        const ctx = cnv.getContext("2d")
        ctx.fillStyle = hslToString(hsl)
        ctx.fillRect(0,0,1,1)
        const data = ctx.getImageData(0, 0, 1, 1).data
        return [data[0], data[1], data[2]]
    */

    let   h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
    if (h < 0  ||  h > 360) { return [ 0, 0, 0 ] }
    if (s < 0  ||  s >   1) { return [ 0, 0, 0 ] }
    if (l < 0  ||  l >   1) { return [ 0, 0, 0 ] }
    //
    const chroma = (1 - Math.abs(2 * l - 1)) * s
    h = h / 60
    const x = (1 - Math.abs(h % 2 - 1)) * chroma
    let r, g, b = 0
    //
    if (h < 1) {
        r = chroma
        g = x
        b = 0
    }
    else if (h < 2) {
        r = x
        g = chroma
        b = 0
    }
    else if (h < 3) {
        r = 0
        g = chroma
        b = x
    }
    else if (h < 4) {
        r = 0
        g = x
        b = chroma
    }
    else if (h < 5) {
        r = x
        g = 0
        b = chroma
    }
    else {
        r = chroma
        g = 0
        b = x
    }
    //
    const m = l - chroma/2
    const R = Math.round(255 * (r + m))
    const G = Math.round(255 * (g + m))
    const B = Math.round(255 * (b + m))
    return [ R, G, B ]
}

///////////////////////////////////////////////////////////////////////////////

/* test (works fine)

function testHsl() {
    testHslCore([97, 193, 54])
    testHslCore([169, 104, 54])
    testHslCore([1, 2, 3])
    testHslCore([0, 0, 0])
    testHslCore([255, 255, 255])
    testHslCore([0, 255, 100])
}

function testHslCore(rgb) {
    const hsl = rgbToHsl(rgb)
    //
    const rgb2 = hslToRgb(hsl)
    console.log(rgb, rgb2, hslToString(hsl))
    //
    const ok = true
    if (rgb[0] != rgb2[0]) { ok = false }
    if (rgb[1] != rgb2[1]) { ok = false }
    if (rgb[2] != rgb2[2]) { ok = false }
    if (ok) { return }
    //
    console.log("problem:", rgb, "!=", rgb2)
}
*/

///////////////////////////////////////////////////////////////////////////////

/* retired

function rgbToGrey(rgb) {
    const hsl = rgbToHsl(rgb)
//  const hue = hsl[0]
//  const sat = hsl[1]
    const lum = hsl[2]
    return hslToRgb([0,0,lum])
}

function luminosityFromRgb(rgb) {
    const hsl = rgbToHsl(rgb)
//  const hue = hsl[0]
//  const sat = hsl[1]
    const lum = hsl[2]
    return lum
}

function luminosityToRgb(rgb, luminosity) {
    const hsl = rgbToHsl(rgb)
    const hue = hsl[0]
    const sat = hsl[1]
//  const lum = hsl[2]
    return hslToRgb([hue,sat,luminosity])
}
*/

// file: library/inliner.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function inliner(cnv) {
    return inlinerCore(cnv, RED, GREEN, BLUE, ALPHA)
}

function inlinerCore(cnv, R, G, B, A) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        //
        if (! hasBlankNeighbour(x, y)) { return }
        //
        if (data[index    ] != R) { changed = true }
        if (data[index + 1] != G) { changed = true }
        if (data[index + 2] != B) { changed = true }
        if (data[index + 3] != A) { changed = true }
        //
        data[index    ] = R
        data[index + 1] = G
        data[index + 2] = B
        data[index + 3] = A
    }
    function hasBlankNeighbour(x, y) {
        if (isBlank(x    , y - 1)) { return true }
        if (isBlank(x    , y + 1)) { return true }
        if (isBlank(x - 1, y    )) { return true }
        if (isBlank(x + 1, y    )) { return true }
        return false
    }
    function isBlank(x, y) {
        if (x < 0) { return true }
        if (y < 0) { return true }
        if (x > width - 1) { return true }
        if (y > height- 1) { return true }
        //
        const index = 4 * (width * y + x)
        return (data[index + 3] == 0) // alpha
    }
}

// file: library/negative.js //
// "use strict"

// may affect translucent pixels //

///////////////////////////////////////////////////////////////////////////////

function negative(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //
        if (A == 0) { return } // blank
    //  if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        let r = 255 - R
        let g = 255 - G
        let b = 255 - B
        if (A == 255  &&  r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
    }
}

// file: library/noise.js //
// "use strict"

// avoids solid black always //

///////////////////////////////////////////////////////////////////////////////

function addNoise(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        if (Math.random() < 0.33) { return }
        //
        const signal = (Math.random() < 0.5) ? -1 : +1
        //
        const rgb = lightenDarkenColor([R,G,B], signal * 0.01)
        let r = rgb[0]
        let g = rgb[1]
        let b = rgb[2]
        //
        if (r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
    }
}

// file: library/outliner.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function outliner(cnv) {
    return outlinerCore(cnv, RED, GREEN, BLUE, ALPHA)
}

function outlinerCore(cnv, red, green, blue, alpha) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const ref = data.slice(0)
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        //
        if (ref[index + 3] != 0) { return } // not blank
        if (! hasContentNeighbour(x, y)) { return }
        //
        data[index]     = red
        data[index + 1] = green
        data[index + 2] = blue
        data[index + 3] = alpha
        changed = true
    }
    function hasContentNeighbour(x, y) {
        if (hasContent(x    , y - 1)) { return true }
        if (hasContent(x    , y + 1)) { return true }
        if (hasContent(x - 1, y    )) { return true }
        if (hasContent(x + 1, y    )) { return true }
        return false
    }
    function hasContent(x, y) {
        if (x < 0) { return false }
        if (y < 0) { return false }
        if (x > width - 1) { return false }
        if (y > height- 1) { return false }
        //
        const index = 4 * (width * y + x)
        return (ref[index + 3] != 0) // alpha
    }
}

// file: library/paint-area.js //
// "use strict"

// does not paint area when mouseColor == color,
// because it is already painted... and worse:
// algorithm will run infinitely not because of first step
// but because of redundancy on future list

// *erases* area when argument [r,g,b,a] == [0,0,0,0]

///////////////////////////////////////////////////////////////////////////////

function paintArea(cnv, x, y, r, g, b, a) {
    const ctx = cnv.getContext("2d")
    const width   = cnv.width
    const height  = cnv.height
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    let current = [] // already painted, useful for find neighbours
    let future  = [] // already painted, useful for find neighbours
    process()
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        processAt(x, y)
        while (future.length > 0) { walk() }
    }
    function walk() {
        current = future
        future  = []
        while (current.length > 0) {
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        if (data[index]     != px[0]) { return }
        if (data[index + 1] != px[1]) { return }
        if (data[index + 2] != px[2]) { return }
        if (data[index + 3] != px[3]) { return }
        //
        data[index]     = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
        //
        future.push(createPoint(x, y))
    }
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        ]
    }
}

// file: library/paint-border.js //
// "use strict"

// does not paint area when mouseColor == color,
// because it is already painted... and worse:
// algorithm will run infinitely not because of first step
// but because of redundancy on future list

// *erases* area when argument [r,g,b,a] == [0,0,0,0]

///////////////////////////////////////////////////////////////////////////////

function paintBorder(cnv, x, y, r, g, b, a) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    const refdata = getAreaData(data, width, height, x, y)
    //
    process()
    ctx.putImageData(imgdata, 0, 0, 0, 0, width, height)
    return true
    //
    function process() {
        for(let y = 0; y < height; y += 1) {
            for(let x = 0; x < width; x += 1) { processAt(x, y) }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        if (refdata[index + 3] == 0) { return } // blank
        //
        const north = isBlank(x, y - 1)
        const south = isBlank(x, y + 1)
        const west  = isBlank(x - 1, y)
        const east  = isBlank(x + 1, y)
        //
        let good = false
        if (north && ! south) {  good = true }
        if (south && ! north) {  good = true }
        if (east  && ! west)  {  good = true }
        if (west  && ! east)  {  good = true }
        if (! good) { return }
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
    }
    function isBlank(x, y) {
        if (y < 0  ||  x < 0) { return true }
        if (y > height - 1  ||  x > width - 1) { return true }
        const index = 4 * (width * y + x)
        return refdata[index + 3] == 0
    }
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        ]
    }
}

// file: library/paint-every.js //
// "use strict"

// *erases* area when argument [r,g,b,a] == [0,0,0,0]

///////////////////////////////////////////////////////////////////////////////

function paintEvery(cnv, x, y, r, g, b, a) {
    const width   = cnv.width
    const height  = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const px = startingPixel()
    if (pixelsMatch(px, [r, g, b, a])) { return false }
    //
    process()
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        if (data[index]     != px[0]) { return }
        if (data[index + 1] != px[1]) { return }
        if (data[index + 2] != px[2]) { return }
        if (data[index + 3] != px[3]) { return }
        //
        data[index]     = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
    }
    function startingPixel() {
        const index = 4 * (width * y + x)
        //
        return [
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        ]
    }
}

// file: library/pixelate.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function pixelate2(cnv)  {
    pixelate(cnv,  2)
}

function pixelate3(cnv)  {
    pixelate(cnv,  3)
}

function pixelate4(cnv)  {
    pixelate(cnv,  4)
}

function pixelate5(cnv)  {
    pixelate(cnv,  5)
}

///////////////////////////////////////////////////////////////////////////////

// (no real need to create canvas source when dimensions come rounded) //

function pixelate(cnv, factor) {
    const width  = calcDimension(cnv.width)
    const height = calcDimension(cnv.height)
    //
    function calcDimension(dim) {
        const rest = dim % factor
        if (rest == 0) { return dim }
        return dim + factor - rest // ok (tested)
    }
    //
    const source = createCanvas(width, height)
    const sourceCtx = source.getContext("2d")
    sourceCtx.drawImage(cnv, 0, 0)
    //
    const reduced = createCanvas(width / factor, height / factor)
    const reducedCtx = reduced.getContext("2d")
    reducedCtx["imageSmoothingEnabled"] = false
    reducedCtx.drawImage(source, 0,0,width,height, 0,0,reduced.width,reduced.height)
    //
    sourceCtx.clearRect(0, 0, width, height)
    sourceCtx["imageSmoothingEnabled"] = false
    sourceCtx.drawImage(reduced, 0,0,reduced.width,reduced.height, 0,0,width,height)
    //
    const ctx = cnv.getContext("2d")
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(source, 0, 0)
}

// file: library/reduce.js //
// "use strict"

// calling the same function again produces different result

const reduxAZeroToOne = [ 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55, 0.50,
                          0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05 ]

const reduxBZeroToOne = [ 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1 ]

const reduxCZeroToOne = [ 0.9, 0.7, 0.5, 0.3, 0.1 ]


const reduxAZeroTo360  = [ 360, 350, 340, 330, 320, 310, 300, 290, 280, 270,
                           260, 250, 240, 230, 220, 210, 200, 190, 180, 170,
                           160, 150, 140, 130, 120, 110, 100,  90,  80,  70,
                            60,  50,  40,  30,  20,  10 ]


const reduxBZeroTo360  = [ 350, 330, 310, 290, 270, 250, 230, 210, 190, 170,
                           150, 130, 110,  90,  70,  50,  30,  10 ]

const reduxCZeroTo360  = [ 340, 300, 260, 220, 180, 140, 100, 60, 20 ]


///////////////////////////////////////////////////////////////////////////////

function reduceA(cnv) {
    return reduce(cnv, reduxAZeroTo360, reduxAZeroToOne, reduxAZeroToOne)
}

function reduceB(cnv) {
    return reduce(cnv, reduxBZeroTo360, reduxBZeroToOne, reduxBZeroToOne)
}

function reduceC(cnv) {
    return reduce(cnv, reduxCZeroTo360, reduxCZeroToOne, reduxCZeroToOne)
}

///////////////////////////////////////////////////////////////////////////////

function reduce(cnv, hArr, sArr, lArr) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        const hsl = rgbToHsl([R, G, B])
        const h = hsl[0]
        const s = hsl[1]
        const l = hsl[2]
        //
        const hue = adjustToArray(h, hArr)
        const sat = adjustToArray(s, sArr)
        const lum = adjustToArray(l, lArr)
        //
        const rgb = hslToRgb([hue, sat, lum])
        //
        let r = rgb[0]
        let g = rgb[1]
        let b = rgb[2]
        let a = reduceChannel(A)
        if (r + g + b == 0  &&  a == 255) { r = 1; g = 1; b = 1 } // avoids make false outline
        //
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        data[index + 3] = a
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
        if (A != a) { changed = true; return }
    }
    function adjustToArray(val, arr) {
        //
        for (const ref of arr) {
            if (val >= ref) { return ref }
        }
        return 0
    }
    function reduceChannel(m) {
        const factor = 25
        //
        const n = Math.round(m / factor) * factor
        if (n > 249) { return 255 }
        return n
    }
}

// file: library/rotate90.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function horizontalReverse(src) {
    const ctx = src.getContext("2d")
    const clone = cloneImage(src)
    //
    ctx.clearRect(0, 0, src.width, src.height)
    ctx.save()
    ctx.translate(src.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(clone, 0, 0)
    ctx.restore()
}

///////////////////////////////////////////////////////////////////////////////

function verticalReverse(src) {
    const ctx = src.getContext("2d")
    const clone = cloneImage(src)
    //
    ctx.clearRect(0, 0, src.width, src.height)
    ctx.save()
    ctx.translate(0, src.height)
    ctx.scale(1, -1)
    ctx.drawImage(clone, 0, 0)
    ctx.restore()
}

///////////////////////////////////////////////////////////////////////////////

function rotate90(dst) { // works in place
    const src = cloneImage(dst)
    const srcwidth  = src.width
    const srcheight = src.height
    const srcdata = src.getContext("2d").getImageData(0, 0, srcwidth, srcheight).data
    //
    const width  = srcheight
    const height = srcwidth
    //
    dst.width = width
    dst.height = height
    const ctx = dst.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const dstdata = imgdata.data
    //
    let changed = false
    //
    for(let srcX = 0; srcX < srcwidth; srcX += 1) {
        for(let srcY = 0; srcY < srcheight; srcY += 1) {
            //
            const srcindex = 4 * (srcwidth * srcY + srcX)
            //
            const srcR = srcdata[srcindex]
            const srcG = srcdata[srcindex + 1]
            const srcB = srcdata[srcindex + 2]
            const srcA = srcdata[srcindex + 3]
            //
            const x = srcheight - 1 - srcY
            const y = srcX
            const index = 4 * (width * y + x)
            //
            const dstR = dstdata[index]
            const dstG = dstdata[index + 1]
            const dstB = dstdata[index + 2]
            const dstA = dstdata[index + 3]
            //
            if (srcR == dstR  &&  srcG == dstG  &&  srcB == dstB  &&  srcA == dstA) { continue }
            //
            dstdata[index + 0] = srcR
            dstdata[index + 1] = srcG
            dstdata[index + 2] = srcB
            dstdata[index + 3] = srcA
            changed = true
        }
    }
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0, 0, 0, width, height)
    return true
}

///////////////////////////////////////////////////////////////////////////////

function __reverseRotate90(dst) { // works in place
    const src = cloneImage(dst)
    const srcwidth  = src.width
    const srcheight = src.height
    const srcdata = src.getContext("2d").getImageData(0, 0, srcwidth, srcheight).data
    //
    const width  = srcheight
    const height = srcwidth
    //
    dst.width = width
    dst.height = height
    const ctx = dst.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const dstdata = imgdata.data
    //
    let changed = false
    //
    for(let srcX = 0; srcX < srcwidth; srcX += 1) {
        for(let srcY = 0; srcY < srcheight; srcY += 1) {
            //
            const srcindex = 4 * (srcwidth * srcY + srcX)
            //
            const srcR = srcdata[srcindex]
            const srcG = srcdata[srcindex + 1]
            const srcB = srcdata[srcindex + 2]
            const srcA = srcdata[srcindex + 3]
            //
            const x = srcY
            const y = srcwidth - 1 - srcX
            const index = 4 * (width * y + x)
            //
            const dstR = dstdata[index]
            const dstG = dstdata[index + 1]
            const dstB = dstdata[index + 2]
            const dstA = dstdata[index + 3]
            //
            if (srcR == dstR  &&  srcG == dstG  &&  srcB == dstB  &&  srcA == dstA) { continue }
            //
            dstdata[index + 0] = srcR
            dstdata[index + 1] = srcG
            dstdata[index + 2] = srcB
            dstdata[index + 3] = srcA
            changed = true
        }
    }
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0, 0, 0, width, height)
    return true
}

///////////////////////////////////////////////////////////////////////////////

function mixedReverse(dst) { // works in place
    const src = cloneImage(dst)
    const srcwidth  = src.width
    const srcheight = src.height
    const srcdata = src.getContext("2d").getImageData(0, 0, srcwidth, srcheight).data
    //
    const width  = srcheight
    const height = srcwidth
    //
    dst.width = width
    dst.height = height
    const ctx = dst.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const dstdata = imgdata.data
    //
    let changed = false
    //
    for(let srcX = 0; srcX < srcwidth; srcX += 1) {
        for(let srcY = 0; srcY < srcheight; srcY += 1) {
            //
            const srcindex = 4 * (srcwidth * srcY + srcX)
            //
            const srcR = srcdata[srcindex]
            const srcG = srcdata[srcindex + 1]
            const srcB = srcdata[srcindex + 2]
            const srcA = srcdata[srcindex + 3]
            //
            const x = srcY
            const y = srcX
            const index = 4 * (width * y + x)
            //
            const dstR = dstdata[index]
            const dstG = dstdata[index + 1]
            const dstB = dstdata[index + 2]
            const dstA = dstdata[index + 3]
            //
            if (srcR == dstR  &&  srcG == dstG  &&  srcB == dstB  &&  srcA == dstA) { continue }
            //
            dstdata[index + 0] = srcR
            dstdata[index + 1] = srcG
            dstdata[index + 2] = srcB
            dstdata[index + 3] = srcA
            changed = true
        }
    }
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0, 0, 0, width, height)
    return true
}

// file: library/round-alpha.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function roundAlpha(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    //
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const a = data[index + 3]
        //
        if (a ==   0) { return }
        if (a ==  25) { return }
        if (a ==  75) { return }
        if (a == 125) { return }
        if (a == 175) { return }
        if (a == 255) { return }
        //
        changed = true
        if (a <  10) { data[index + 3] =   0; return }
        if (a <  50) { data[index + 3] =  25; return }
        if (a < 100) { data[index + 3] =  75; return }
        if (a < 150) { data[index + 3] = 125; return }
        if (a < 200) { data[index + 3] = 175; return }
        data[index + 3] = 255
    }
}

// file: library/sepia-tone.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function sepiaTone(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const R = data[index]
        const G = data[index + 1]
        const B = data[index + 2]
        const A = data[index + 3]
        //
        if (A == 0) { return } // blank
        if (R + G + B == 0  &&  A == 255) { return } // solid black
        //
        const channel = (R * 0.393) + (G * 0.769) + (B * 0.189)
        let r = Math.floor(channel)
        let g = Math.floor(channel * 0.89)
        let b = Math.floor(channel * 0.7)
        if (A == 255  &&  r + g + b == 0) { r = 1; g = 1; b = 1 } // avoids make false outline
        data[index    ] = r
        data[index + 1] = g
        data[index + 2] = b
        //
        if (R != r) { changed = true; return }
        if (G != g) { changed = true; return }
        if (B != b) { changed = true; return }
    }
}

// file: library/swap-rgb.js //
// "use strict"

const swaps = [ "rgbToGbr", "rgbToGbr", "rgbToRbg", "rgbToGbr", "rgbToGbr", "rgbToRbg" ]

///////////////////////////////////////////////////////////////////////////////

function swapRgb(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    const swap = swaps[0]
    swaps.push(swaps.shift())
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (a == 0) { return } // blank
        if (swap == "rgbToGbr") {
            data[index    ] = g
            data[index + 1] = b
            data[index + 2] = r
            //
            if (r != g  ||  g != b  ||  b != r) { changed = true }
        }
        else {
            data[index    ] = r
            data[index + 1] = b
            data[index + 2] = g
            //
            if (g != b) { changed = true }
        }
    }
}

// file: library/weaken-black.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function weakenBlack(cnv) {
    const width  = cnv.width
    const height = cnv.height
    const ctx = cnv.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    let changed = false
    //
    process()
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
    //
    function process() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                processAt(x, y)
            }
        }
    }
    function processAt(x, y) {
        const index = 4 * (width * y + x)
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        //
        if (a != 255) { return }  // not solid
        if (r + g + b != 0) { return } // not black
        //
        data[index    ] = 1
        data[index + 1] = 1
        data[index + 2] = 1
        changed = true
    }
}

// file: tools/blur-pixel.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startBlur() {
    //
    continueBlur()
}

function continueBlur() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(true) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintBlur(ctx, p.x, p.y)
    }
}

function finishBlur() {
    //
    paintLastX = null
    paintLastY = null
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintBlur(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    // paint rectangle is expanded to include outside neighbors!!!
    // any pixel outside layer comes as [0,0,0,0]
    //
    paintBlur2(ctx, rect.left-1, rect.top-1, rect.width+2, rect.height+2)
}

function paintBlur2(ctx, left, top, width, height) {
    //
    const imgdata = ctx.getImageData(left, top, width, height)
    const data = imgdata.data
    //
    const refdata = paintControlCtx.getImageData(left, top, width, height).data
    //
    let anyChange = false
    //
    // paint rectangle was expanded to include outside neighbors!!!
    // any pixel outside layer comes as [0,0,0,0]
    // iterating on INNER rectangle now!!!
    //
    for (let x = 1; x < width-1; x++) {
        for (let y = 1; y < height-1; y++) {
            const changed = paintBlurAt(data, refdata, width, x, y)
            if (changed) { anyChange = true }
        }
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, left, top)
    shallMemorizePaint = true
}

function paintBlurAt(data, refdata, width, x, y) {
    //
    // bounds are ok because rectangle was previously expanded
    // any pixel outside layer comes as [0,0,0,0]
    //
    const index = 4 * (y * width + x)
    // original values
    const R = refdata[index]
    const G = refdata[index + 1]
    const B = refdata[index + 2]
    const A = refdata[index + 3]
    //
    if (A == 0) { return false } // blank
    if (shallProtectBlack  &&  A == 255  &&  R + G + B == 0) { return false }
    //
    // current values
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    //
    if (r != R  ||  g != G  ||   b != B) { return false } // already done
    //
    return paintBlurAt2(data, refdata, width, x, y, R, G, B, A)
}

function paintBlurAt2(data, refdata, width, x, y, R, G, B, A) {
    //
    const RGB = getBlurInfo(refdata, width, x, y) // fractionary values
    if (RGB == null) { return false }
    //
    let rate = intensityFor[tool]
    const rate2 = 1 - rate
    //
    let r, g, b
    //
    if (shiftPressed) {
        // antiblur
        rate *= 1.25
        //
        r = R + Math.round(rate * (R - RGB[0]))
        g = G + Math.round(rate * (G - RGB[1]))
        b = B + Math.round(rate * (B - RGB[2]))
    }
    else {
        // blur
        r = Math.round(RGB[0] * rate  +  R * rate2)
        g = Math.round(RGB[1] * rate  +  G * rate2)
        b = Math.round(RGB[2] * rate  +  B * rate2)
    }
    // fix bounds
    if (r < 0) { r = 0 }
    if (g < 0) { g = 0 }
    if (b < 0) { b = 0 }
    // fix bounds
    if (r > 255) { r = 255 }
    if (g > 255) { g = 255 }
    if (b > 255) { b = 255 }
    // checking
    if (A == 255 &&  r + g + b == 0) { r = 1; g = 1; b = 1 } // avoiding false outline
    if (r == R  &&  g == G  &&  b == B) { return false } // no change
    // applying
    const index = 4 * (y * width + x)
    //
    data[index]     = r
    data[index + 1] = g
    data[index + 2] = b
    //
    return true
}

function getBlurInfo(refdata, width, x, y) { // fractionary values
    //
    // bounds are ok because rectangle was previously expanded
    // any pixel outside layer comes as [0,0,0,0]
    //
    let count = 0
    const arr = [0, 0, 0] // [R, G, B]
    //
    addNeighbor(x,   y-1, false) // north
    addNeighbor(x,   y+1, false) // south
    addNeighbor(x-1, y,   false) // west
    addNeighbor(x+1, y,   false) // east
    addNeighbor(x-1, y-1, true) // northwest
    addNeighbor(x+1, y-1, true) // northeast
    addNeighbor(x-1, y+1, true) // southwest
    addNeighbor(x+1, y+1, true) // southeast
    //
    if (count == 0) { return null } // no blur
    //
    arr[0] /= count
    arr[1] /= count
    arr[2] /= count
    //
    return arr
    //
    function addNeighbor(x, y, diagonal) {
        // bounds are ok because rectangle was expanded
        // bounds need not to be checked
        //
        const index = 4 * (width * y + x)
        const r = refdata[index]
        const g = refdata[index + 1]
        const b = refdata[index + 2]
        const a = refdata[index + 3]
        //
        if (a == 0) { return } // blank
        if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return }
        //
        const factor = diagonal ? 1 : 2 // straight weighs double than diagonal
        arr[0] += r * factor
        arr[1] += g * factor
        arr[2] += b * factor
        //
        count += factor
    }
}

// file: tools/brush.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startBrush() {
    //
    continueBrush()
}

function continueBrush() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintBrush(ctx, p.x, p.y)
    }
}

function finishBrush() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintBrush(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = paintHardPixel(data, index, shiftPressed)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

// file: tools/darken-tool.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startDarken() {
    //
    continueDarken()
}

function continueDarken() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(false) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintDarken(ctx, p.x, p.y)
    }
}

function finishDarken() {
    //
    paintLastX = null
    paintLastY = null
    //
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintDarken(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    const refimgdata = paintControlCtx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const refdata = refimgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = darkenPixel(data, refdata, index)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    paintControlCtx.putImageData(refimgdata, rect.left, rect.top)
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

function darkenPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false } // blank
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    const color = lightenDarkenColor([r, g, b], -intensityFor[tool])
    let r2 = color[0]
    let g2 = color[1]
    let b2 = color[2]
    //
    if (a == 255  &&  r2 + g2 + b2 == 0) { r2 = 1; g2 = 1; b2 = 1 } // avoid false outline
    //
    if (r2 == r  &&  g2 == g  &&  b2 == b) { return false } // no change
    //
    data[index]     = r2
    data[index + 1] = g2
    data[index + 2] = b2
    //
    return true
}

// file: tools/ellipse.js //
// "use strict"

// validation by (mask != null)

///////////////////////////////////////////////////////////////////////////////

function startEllipse() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueEllipse()
}

function continueEllipse() {
    //
    if (mask == null) { return }
    //
    clearMask()
    //
    const currentX = stageX - toplayer.left
    const currentY = stageY - toplayer.top
    //
    let startX = paintStartX
    let startY = paintStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = paintStartX }
    if (endY < startY) { startY = currentY; endY = paintStartY }
    //
    const maskdata = maskImgData.data
    const width = mask.width
    const height = mask.height
    //
    strokeEllipse(maskdata, startX, startY, endX, endY, width, height) // must come before fillEllipse
    if (shiftPressed) { fillEllipse(maskdata, startX, startY, endX, endY, width, height) }
    //
    maskCtx.putImageData(maskImgData, 0, 0)
}

function finishEllipse() {
    //
    paintStartX = null
    paintStartY = null
    //
    if (mask == null) { return }
    //
    mask = null
    maskOn = false
    //
    const changed = applyMask()
    //
    if (changed) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// stroke /////////////////////////////////////////////////////////////////////

function strokeEllipse(data, startX, startY, endX, endY, width, height) {
    //
    const centerX = Math.round((startX + endX) / 2)
    const centerY = Math.round((startY + endY) / 2)
    const radiusX = endX - centerX
    const radiusY = endY - centerY
    const evenX = (startX + endX) % 2
    const evenY = (startY + endY) % 2
    //
    for (let x = startX; x <= centerX; x++) {
        const angle = Math.acos((x - centerX) / radiusX)
        const y = Math.round(radiusY * Math.sin(angle) + centerY)
        //
        strokeEllipsePixel(data, x - evenX, y, width, height) // southwest
        strokeEllipsePixel(data, x - evenX, 2 * centerY - y - evenY, width, height) // northwest
        strokeEllipsePixel(data, 2 * centerX - x, y, width, height) // southeast
        strokeEllipsePixel(data, 2 * centerX - x, 2 * centerY - y - evenY, width, height) // northeast
    }
    //
    for (let y = startY; y <= centerY; y++) {
        const angle = Math.asin((y - centerY) / radiusY)
        const x = Math.round(radiusX * Math.cos(angle) + centerX)
        //
        strokeEllipsePixel(data, x, y - evenY, width, height) // northeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, y - evenY, width, height) // northwest
        strokeEllipsePixel(data, x, 2 * centerY - y, width, height) // southeast
        strokeEllipsePixel(data, 2 * centerX - x - evenX, 2 * centerY - y, width, height) // southwest
    }
}

function strokeEllipsePixel(data, x, y, width, height) {
    //
    if (isNaN(x)) { return }
    if (isNaN(y)) { return } // often happens on firefox
    //
    if (x < 0) { return }
    if (y < 0) { return }
    //
    if (x >= width)  { return }
    if (y >= height) { return }
    //
    const index = 4 * (mask.width * y + x)
    //
    data[index    ] = RED
    data[index + 1] = GREEN
    data[index + 2] = BLUE
    data[index + 3] = ALPHA
}

// fill ///////////////////////////////////////////////////////////////////////

function fillEllipse(data, startX, startY, endX, endY, width, height) {
    //
    const centerY = Math.round((startY + endY) / 2)
    //
    for (let x = startX + 1; x < endX; x++) {
        fillEllipseHalfColumn(data, x, centerY, +1, startY, endY, width, height)     // center and inferior half
        fillEllipseHalfColumn(data, x, centerY - 1, -1, startY, endY, width, height) // superior half
    }
}

function fillEllipseHalfColumn(data, x, y, delta, startY, endY, width, height) {
    //
    if (x < 0) { return }
    if (y < 0) { return }
    //
    if (x >= width)  { return }
    if (y >= height) { return }
    //
    while (true) {
        const index = 4 * (mask.width * y + x)
        if (data[index + 3] != 0) { return } // already painted (when stroked!)
        //
        data[index    ] = RED
        data[index + 1] = GREEN
        data[index + 2] = BLUE
        data[index + 3] = ALPHA
        //
        y += delta
        // necessary to avoid infinite loop sometimes
        if (y <= startY) { return }
        if (y >= endY)   { return }
    }
}

// file: tools/feather.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startFeather() {
    continueFeather()
}

function continueFeather() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(false) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintFeather(ctx, p.x, p.y)
    }
}

function finishFeather() {
    //
    paintLastX = null
    paintLastY = null
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintFeather(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    const refimgdata = paintControlCtx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const refdata = refimgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = featherPixel(data, refdata, index)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    paintControlCtx.putImageData(refimgdata, rect.left, rect.top)
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

function featherPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    return paintSoftPixel(data, index, intensityFor[tool])
}

// file: tools/lasso.js //
// "use strict"

// coordinates for the lasso inner rectangle
var lassoNorth
var lassoSouth
var lassoEast
var lassoWest

///////////////////////////////////////////////////////////////////////////////

function startLasso() {
    //
    continueLasso()
}

function continueLasso() {
    //
    if (toplayer == null) { return }
    //
    if (selectionIsOn()) { alertSuperLayer(); return }
    //
    if (mask == null) {
        //
        resetMask()
        //
        const color = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")"
        maskCtx.fillStyle = color
    }
    //
    let x = Math.max(0, stageX - toplayer.left)
    let y = Math.max(0, stageY - toplayer.top)
    //
    x = Math.min(x, mask.width - 1)
    y = Math.min(y, mask.height - 1)
    //
    if (paintStartX == null) {
        //
        paintStartX = x
        paintStartY = y
        //
        paintLastX = x
        paintLastY = y
        //
        lassoNorth = y
        lassoSouth = y
        lassoEast = x
        lassoWest = x
    }
    //
    continueLasso2(x, y)
}

function continueLasso2(x, y) {
    //
    const arr = makeBresenham(paintLastX, paintLastY, x, y)
    //
    while (arr.length > 0) {
        const p = arr.shift()
        continueLassoCore(p.x, p.y)
    }
}

function continueLassoCore(x, y) {
    //
    paintLastX = x
    paintLastY = y
    //
    if (y < lassoNorth) { lassoNorth = y }
    if (y > lassoSouth) { lassoSouth = y }
    if (x < lassoWest)  { lassoWest  = x }
    if (x > lassoEast)  { lassoEast  = x }
    //
    maskCtx.clearRect(x, y, 1, 1) // clearing: not necessary when using opaque colors
    maskCtx.fillRect(x,  y, 1, 1) // filling
}

function finishLasso() {
    //
    if (mask == null) { return }
    //
    // jointing beacons
    if (paintStartX != paintLastX  ||  paintStartY != paintLastY) {
        continueLasso2(paintStartX, paintStartY)
    }
    //
    // setting the inner rectangle coordinates
    const left = lassoWest
    const top = lassoNorth
    const width = lassoEast - lassoWest + 1
    const height = lassoSouth - lassoNorth + 1
    //
    if (width  > 0  &&  height > 0  &&  width+height > 2) { finishLasso2(left, top, width, height) }
    //
    mask = null
    maskOn = false
    //
    paintStartX = null
    paintStartY = null
}

function finishLasso2(left, top, width, height) {
    //
    const lassoCnv = createCanvas(width, height)
    const lassoCtx = lassoCnv.getContext("2d")
    //
    lassoCtx.drawImage(mask, -left, -top)
    //
    const lassoImgData = lassoCtx.getImageData(0, 0, width, height)
    const lassodata = lassoImgData.data
    //
    fillLassoCanvas(lassodata, width, height)
    //
    const toplayerCtx = toplayer.canvas.getContext("2d")
    const toplayerImgData = toplayerCtx.getImageData(left, top, width, height)
    const toplayerdata = toplayerImgData.data
    //
    let shallMemorize = passLassoData(toplayerdata, lassodata, width, height)
    //
    if (shallMemorize) {
        toplayerCtx.putImageData(toplayerImgData, left, top)
        memorizeTopLayer()
    }
    //
    lassoCtx.putImageData(lassoImgData, 0, 0)
    //
    //
    const superlayer = layers[0]
    //
    shallMemorize = ! canvasesAreEqual(lassoCnv, superlayer.canvas)
    //
    superlayer.canvas = lassoCnv
    superlayer.left = toplayer.left + left
    superlayer.top  = toplayer.top + top
    //
    if (shallMemorize) { memorizeLayer(superlayer) }
    changeLayerVisibility(0)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function fillLassoCanvas(data, width, height) { // works on the edge
    //
    // start at first row
    for (let x = 0; x < width; x++) { fillLassoCanvasAt(data, x, 0, width, height) }
    //
    // start at last row
    for (let x = 0; x < width; x++) { fillLassoCanvasAt(data, x, height-1, width, height) }
    //
    // start at first col
    for (let y = 0; y < height; y++) { fillLassoCanvasAt(data, 0, y, width, height) }
    //
    // start at last col
    for (let y = 0; y < height; y++) { fillLassoCanvasAt(data, width-1, y, width, height) }
}

function fillLassoCanvasAt(data, x, y, width, height) { // fills outside blanks
    //
    const start = 4 * (y * width + x)
    if (data[start + 3] != 0) { return }
    //
    let current = []
    let future  = []
    process()
    return
    //
    function process() {
        processAt(x, y) // must paint starting pixel
        while (future.length > 0) { walk() }
    }
    //
    function walk() {
        current = future
        future  = []
        while (current.length > 0) {
            const point = current.shift()
            processAround(point.x, point.y)
        }
    }
    //
    function processAround(x, y) {
        processAt(x + 1, y)
        processAt(x - 1, y)
        processAt(x, y + 1)
        processAt(x, y - 1)
    }
    //
    function processAt(x, y) {
        if (x < 0) { return }
        if (y < 0) { return }
        if (x > width  - 1) { return }
        if (y > height - 1) { return }
        //
        const index = 4 * (width * y + x)
        //
        if (data[index + 3] != 0) { return } // original lasso or already processed
        //
        data[index] = 255 - RED // making it different of the trace by the user
        data[index + 3] = 255
        future.push(createPoint(x, y))
    }
}

///////////////////////////////////////////////////////////////////////////////

function passLassoData(layerdata, lassodata, width, height) {
    //
    let shallMemorize = false
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index =  4 * (width * y + x)
            //
            const layerR = layerdata[index]
            const layerG = layerdata[index + 1]
            const layerB = layerdata[index + 2]
            const layerA = layerdata[index + 3]
            //
            const lassoR = lassodata[index]
            const lassoA = lassodata[index + 3]
            //
            if (lassoA == 255  &&  lassoR == 255 - RED) { // different color of the trace by the user
                //
                lassodata[index] = 0
                lassodata[index + 1] = 0
                lassodata[index + 2] = 0
                lassodata[index + 3] = 0
                continue
            }
            //
            lassodata[index] = layerR
            lassodata[index + 1] = layerG
            lassodata[index + 2] = layerB
            lassodata[index + 3] = layerA
            //
            if (! shiftPressed) { continue } // not erasing the layer area
            //
            if (layerA == 0) { continue } // already blank
            //
            shallMemorize = true
            //
            layerdata[index] = 0
            layerdata[index + 1] = 0
            layerdata[index + 2] = 0
            layerdata[index + 3] = 0
        }
    }
    return shallMemorize
}

// file: tools/lighten-tool.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startLighten() {
    //
    continueLighten()
}

function continueLighten() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    if (paintControlCtx == null) { resetPaintControlCtx(false) }
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintLighten(ctx, p.x, p.y)
    }
}

function finishLighten() {
    //
    paintLastX = null
    paintLastY = null
    //
    paintControlCtx = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintLighten(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    const refimgdata = paintControlCtx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const refdata = refimgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = lightenPixel(data, refdata, index)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    paintControlCtx.putImageData(refimgdata, rect.left, rect.top)
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

function lightenPixel(data, refdata, index) {
    // checking
    if (refdata[index + 3] != 0) { return false } // already done
    refdata[index + 3] = 255 // marking as done
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false } // blank
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    const color = lightenDarkenColor([r, g, b], intensityFor[tool])
    let r2 = color[0]
    let g2 = color[1]
    let b2 = color[2]
    //
    if (a == 255  &&  r2 + g2 + b2 == 0) { r2 = 1; g2 = 1; b2 = 1 } // avoid false outline
    //
    if (r2 == r  &&  g2 == g  &&  b2 == b) { return false } // no change
    //
    data[index]     = r2
    data[index + 1] = g2
    data[index + 2] = b2
    //
    return true
}

// file: tools/line.js //
// "use strict"

// validation by (mask != null)

///////////////////////////////////////////////////////////////////////////////

function startLine() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueLine()
}

function continueLine() {
    setTask(function () { continueLineCore() })
}

function continueLineCore() {
    //
    if (mask == null) { return }
    //
    clearMask()
    //
    const currentX = stageX - toplayer.left
    const currentY = stageY - toplayer.top
    //
    const arr = makeBresenham(paintStartX, paintStartY, currentX, currentY)  // accepts paintStartXY == null; but this never happens here
    //
    if (arr.length != 1) { arr.unshift(createPoint(paintStartX, paintStartY)) } // necessary!
    //
    const maskdata = maskImgData.data
    const width = mask.width
    const height = mask.height
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        const x = p.x
        const y = p.y
        paintLineSegment(x, y, maskdata, width, height)
    }
    //
    maskCtx.putImageData(maskImgData, 0, 0)
}

function finishLine() {
    //
    paintStartX = null
    paintStartY = null
    //
    if (mask == null) { return }
    //
    mask = null
    maskOn = false
    //
    const changed = applyMask()
    //
    if (changed) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintLineSegment(centerX, centerY, maskdata, width, height) {
    //
    const delta = Math.floor(toolSizeFor[tool] / 2)
    const xa = centerX - delta
    const xb = centerX + delta + 1
    const ya = centerY - delta
    const yb = centerY + delta + 1
    //
    for (let x = xa; x < xb; x++) {
        for (let y = ya; y < yb; y++) {
            //
            if (x < 0) { return }
            if (y < 0) { return }
            if (x >= width)  { return }
            if (y >= height) { return }
            //
            const index = 4 * (width * y + x)
            //
            maskdata[index    ] = RED
            maskdata[index + 1] = GREEN
            maskdata[index + 2] = BLUE
            maskdata[index + 3] = ALPHA
        }
    }
}

// file: tools/mask.js //
// "use strict"

// used to draw line, ellipse, rectangle, lasso and select

var mask = null // also used for validation

var maskCtx = null // may keep obsolet value

var maskImgData = null // may keep obsolet value

var maskOn = false

///////////////////////////////////////////////////////////////////////////////

function resetMask() {
    //
    mask = createCanvas(toplayer.canvas.width, toplayer.canvas.height)
    //
    maskCtx = mask.getContext("2d")
    //
    maskImgData = getFullImageData(mask)
    //
    maskOn = true
}

///////////////////////////////////////////////////////////////////////////////

function clearMask() {
    //
    const maskdata = maskImgData.data
    const off = maskdata.length
    //
    for(let n = 0; n < off; n++) { maskdata[n] = 0 }
}

///////////////////////////////////////////////////////////////////////////////

function applyMask() { // for line, rectangle and ellipse
    //
    const width  = toplayer.canvas.width
    const height = toplayer.canvas.height
    //
    const ctx = toplayer.canvas.getContext("2d")
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const maskdata = maskImgData.data
    //
    let changed = false
    //
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            //
            const index = 4 * (width * y + x)
            const gotChange = applyMaskPixel(data, maskdata, index)
            if (gotChange) { changed = true }
        }
    }
    //
    if (! changed) { return false }
    ctx.putImageData(imgdata, 0, 0)
    return true
}

function applyMaskPixel(data, maskdata, index) {
    //
    const maskR = maskdata[index]
    const maskG = maskdata[index + 1]
    const maskB = maskdata[index + 2]
    const maskA = maskdata[index + 3]
    //
    if (maskA == 0) { return } // blank mask pixel
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (shallProtectBlank  &&  a == 0) { return }
    if (shallProtectBlack  &&  a == 255  &&  r+g+b == 0) { return }
    //
    data[index    ] = maskR
    data[index + 1] = maskG
    data[index + 2] = maskB
    data[index + 3] = maskA
    //
    if (maskR != r  ||  maskG != g  ||  maskB != b  || maskA != a) { return true }
    //
    return false
}

// file: tools/mirror-pen.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function mirrorPen() {
    //
    if (toplayer == null) { resetPerfectAny(); return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const width = toplayer.canvas.width
    const height = toplayer.canvas.width
    //
    const x1 = stageX - toplayer.left
    if (x1 < 0  ||  x1 >= width) { resetPerfectAny(); return }
    //
    const y1 = stageY - toplayer.top
    if (y1 < 0  ||  y1 >= height) { resetPerfectAny(); return }
    //
    let x0 = null
    let y0 = null
    //
    const n = executedsA.length
    if (n != 0) {
        const last = executedsA[n - 1]
        x0 = last.x
        y0 = last.y
    }
    //
    const arr = makeBresenham(x0, y0, x1, y1)  // accepts xy0 == null
    //
    while (arr.length > 0) {
        const p = arr.shift()
        paintMirrorPen(ctx, p.x, p.y, width)
    }
}

function paintMirrorPen(ctx, x, y, width) {
    //
    const x2 = width - x - 1
    //
    const changedA = paintPerfectPixel(ctx, x, y, executedsA)
    const changedB = paintPerfectPixel(ctx, x2, y, executedsB)
    //
    if (changedA  ||  changedB) { memorizeTopLayer() }
}

// file: tools/paint.js //
// "use strict"

// helper module for spray, hard brush and soft brush //

// setting data is *much* faster than use fillRect or drawImage //
// getImageData used to be 12x more expensive than putImageData //


var toolSizeFor = {
    "blur-pixel" : 3,
    "darken"     : 3,
    "feather"    : 3,
    "lighten"    : 3,
    "line"       : 3,
    "pen"        : 3,
    "rubber"     : 3,
    "brush"      : 3,
    "spray"      : 7,
    "thin-pen"   : 1,
    "mirror-pen" : 1
}

var toolSizesFor = {
    "blur-pixel" : [ 1, 3, 5, 7, 15, 21 ],
    "darken"     : [ 1, 3, 5, 7, 15, 21 ],
    "feather"    : [ 1, 3, 5, 7, 15, 21 ],
    "lighten"    : [ 1, 3, 5, 7, 15, 21 ],
    "line"       : [ 1, 3, 5, 7, 15, 21 ],
    "pen"        : [ 1, 3, 5, 7, 15, 21 ],
    "rubber"     : [ 1, 3, 5, 7, 15, 21 ],
    "brush"      : [ 1, 3, 5, 7, 15, 21 ],
    "spray"      : [ 3, 5, 7, 15, 21 ],
    "thin-pen"   : [ 1, 1 ],
    "mirror-pen" : [ 1, 1 ]
}

var intensityFor = {
    "blur-border" : 0.500,
    "blur-pixel"  : 0.500,
    "darken"      : 0.030,
    "feather"     : 0.200,
    "lighten"     : 0.030
}

var intensitiesFor = {
    "blur-border" : [ 0.200, 0.300, 0.400, 0.500, 0.600, 0.700, 0.750, 0.800, 0.850, 0.900 ],
    "blur-pixel"  : [ 0.200, 0.300, 0.400, 0.500, 0.600, 0.700, 0.750, 0.800, 0.850, 0.900 ],
    "darken"      : [ 0.015, 0.030, 0.045, 0.060 ],
    "feather"     : [ 0.015, 0.025, 0.050, 0.075, 0.100, 0.150, 0.200, 0.300, 0.400, 0.500 ],
    "lighten"     : [ 0.015, 0.030, 0.045, 0.060 ]
}

///////////////////////////////////////////////////////////////////////////////

function changeToolSize(delta) {
    //
    const size = toolSizeFor[tool]
    if (size == undefined) { return }
    //
    const sizes = toolSizesFor[tool]
    const index = sizes.indexOf(size) + delta
    //
    if (index < 0) { return }
    if (index > sizes.length - 1) { return }
    //
    toolSizeFor[tool] = sizes[index]
}

///////////////////////////////////////////////////////////////////////////////

function changeIntensity(delta) {
    //
    const int = intensityFor[tool]
    if (int == undefined) { return }
    //
    const values = intensitiesFor[tool]
    const index = values.indexOf(int) + delta
    //
    if (index < 0) { return }
    if (index > values.length - 1) { return }
    //
    intensityFor[tool] = values[index]
}

///////////////////////////////////////////////////////////////////////////////

function paintHardPixel(data, index, erasing) {
    //
    let R = RED
    let G = GREEN
    let B = BLUE
    let A = ALPHA
    //
    if (erasing) {
        R = 0
        G = 0
        B = 0
        A = 0
    }
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (r == R  &&  g == G  &&  b == B  &&  a == A) { return false }
    //
    if (shallProtectBlank  &&  a == 0) { return false }
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    data[index]     = R
    data[index + 1] = G
    data[index + 2] = B
    data[index + 3] = A
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function paintAnyHardPixel(data, erasing) { // for spray not fail by chance
    //
    const indexes = [ ]
    let index = 0 // index of first channel of rgba color
    //
    while (index < data.length) {
        indexes.push(index)
        index += 4
    }
    //
    while (indexes.length > 0) {
        //
        const position = Math.floor(Math.random() * indexes.length) // position inside list indexes
        //
        index = indexes[position]
        indexes.splice(position, 1) // removing used index
        //
        const changed = paintHardPixel(data, index, erasing)
        if (changed) { return true }
    }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function paintSoftPixel(data, index, rate) {
    //
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]
    //
    if (a == 0) { return false } // blank
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    let R, G, B
    //
    const rate2 = 1 - rate
    R = Math.floor(RED   * rate  +  r * rate2)
    G = Math.floor(GREEN * rate  +  g * rate2)
    B = Math.floor(BLUE  * rate  +  b * rate2)
    //
    if (a == 0  &&  R + G + B == 0) { R = 1; G = 1; B = 1 } // avoids false outline
    //
    if (r == R  &&  g == G  &&  b == B) { return false }
    //
    data[index]     = R
    data[index + 1] = G
    data[index + 2] = B
    //
    return true
}

// file: tools/paint-control.js //
// "use strict"

var shallProtectBlank = false
var shallProtectBlack = false

var paintStartX = null
var paintStartY = null

var paintLastX = null
var paintLastY = null

var originalPaint = null // canvas

var paintControlCtx = null

var shallMemorizePaint = false

///////////////////////////////////////////////////////////////////////////////

function resetPaintControlCtx(shallFill) {
    //
    const width = toplayer.canvas.width
    const height = toplayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    paintControlCtx = cnv.getContext("2d")
    //
    if (shallFill) { paintControlCtx.drawImage(toplayer.canvas, 0, 0) }
}

function toggleProtection() {
    //
    shallProtectBlank = ! shallProtectBlank
    shallProtectBlack = ! shallProtectBlack
    //
    paintTopBar()
    //
    if (shallProtectBlank) { hintAlert("now some tools will not affect blank or black pixels") }
}

// file: tools/pen.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startPen() {
    //
    continuePen()
}

function continuePen() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintPen(ctx, p.x, p.y)
    }
}

function finishPen() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintPen(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = paintHardPixel(data, index, shiftPressed)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

// file: tools/perfect-any.js //
// "use strict"

// helps thin-pen and mirror-pen //

var executeds  = []
var executedsA = [] // for mirror pen
var executedsB = [] // for mirror pen

///////////////////////////////////////////////////////////////////////////////

function PerfectPixel(x, y, r, g, b, a) {
    this.x = x
    this.y = y
    // old color:
    this.r = r
    this.g = g
    this.b = b
    this.a = a
}

///////////////////////////////////////////////////////////////////////////////

function resetPerfectAny() {
    executeds  = []
    executedsA = [] // for mirror pen
    executedsB = [] // for mirror pen
}

///////////////////////////////////////////////////////////////////////////////

function paintPerfectPixel(ctx, x, y, controlList) {
    //
    const R = shiftPressed ? 0 : RED
    const G = shiftPressed ? 0 : GREEN
    const B = shiftPressed ? 0 : BLUE
    const A = shiftPressed ? 0 : ALPHA
    //
    const imgdata = ctx.getImageData(x, y, 1, 1)
    const data = imgdata.data
    const r = data[0]
    const g = data[1]
    const b = data[2]
    const a = data[3]
    //
    const pp = new PerfectPixel(x, y, r, g, b, a)
    //
    controlList.push(pp)
    if (controlList.length > 3) { controlList.shift() }
    //
    if (r==R && g==G && b==B && a==A) { return false }
    //
    if (shallProtectBlank  &&  a == 0) { return false }
    if (shallProtectBlack  &&  a == 255  &&  r + g + b == 0) { return false }
    //
    data[0] = R
    data[1] = G
    data[2] = B
    data[3] = A
    //
    ctx.putImageData(imgdata, x, y)
    resetPerfectCorner(ctx, controlList)
    //
    return true
}

///////////////////////////////////////////////////////////////////////////////

function resetPerfectCorner(ctx, controlList) {
    //
    if (controlList.length < 3) { return }
    //
    const last = controlList[2]
    const corner = controlList[1]
    const first  = controlList[0]
    //
    if (! isDiagonal(last, first)) { return }
    if (isDiagonal(last, corner))  { return }
    //
    resetCornerPixel(ctx, corner)
    //
    // ERROR: CREATES ANOTHER LIST INSTEAD OF EDITING THE ORIGINAL!!!
    // controlList = [ last ] //
    //
    controlList.shift() // extracts the first
    controlList.shift() // extracts the corner
}

///////////////////////////////////////////////////////////////////////////////

function resetCornerPixel(ctx, corner) {
    const imgdata = ctx.getImageData(corner.x, corner.y, 1, 1)
    const data = imgdata.data
    data[0] = corner.r
    data[1] = corner.g
    data[2] = corner.b
    data[3] = corner.a
    ctx.putImageData(imgdata, corner.x, corner.y)
}

function isDiagonal(a, b) {
    if (Math.abs(a.x - b.x) != 1) { return false }
    if (Math.abs(a.y - b.y) != 1) { return false }
    return true
}

// file: tools/rubber.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startRubber() {
    //
    continueRubber()
}

function continueRubber() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintRubber(ctx, p.x, p.y)
    }
}

function finishRubber() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintRubber(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        const changed = paintHardPixel(data, index, true)
        if (changed) { anyChange = true }
        index += 4
    }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

// file: tools/rectangle.js //
// "use strict"

// validation by (mask != null)

var rectangleIsDot = true // 1 x 1 px

///////////////////////////////////////////////////////////////////////////////

function startRectangle() {
    //
    if (toplayer == null) { return }
    //
    resetMask()
    //
    maskCtx.fillStyle = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")" // traditional painting on mask
    //
    paintStartX = stageX - toplayer.left
    paintStartY = stageY - toplayer.top
    //
    continueRectangle()
}

function continueRectangle() {
    //
    if (mask == null) { return }
    //
    maskCtx.clearRect(0, 0, mask.width, mask.height)
    //
    const currentX = stageX - toplayer.left
    const currentY = stageY - toplayer.top
    //
    let startX = paintStartX
    let startY = paintStartY
    let endX = currentX
    let endY = currentY
    //
    if (endX < startX) { startX = currentX; endX = paintStartX }
    if (endY < startY) { startY = currentY; endY = paintStartY }
    //
    const width  = endX - startX + 1
    const height = endY - startY + 1
    rectangleIsDot = (width < 2  &&  height < 2)
    //
    maskCtx.fillRect(startX, startY, width, height) // filling
    //
    if (shiftPressed) { return } // done!
    if (width  < 3)   { return }
    if (height < 3)   { return }
    // erasing inside:
    maskCtx.clearRect(startX + 1, startY + 1, width -2, height -2)
}

function finishRectangle() {
    //
    paintStartX = null
    paintStartY = null
    //
    if (mask == null) { return }
    //
    if (rectangleIsDot) { mask = null; maskOn = false; return }
    //
    maskImgData = getFullImageData(mask)
    //
    mask = null
    maskOn = false
    //
    const changed = applyMask()
    if (changed) { memorizeTopLayer() }
}

// file: tools/scale.js //
// "use strict"

// validation by (originalPaint != null)

///////////////////////////////////////////////////////////////////////////////

function startScale() {
    //
    if (toplayer == null) { return }
    //
    originalPaint = cloneImage(toplayer.canvas)
    //
    paintLastX = stageX
    paintLastY = stageY
}

function continueScale() {
    setTask(function () { continueScaleCore() }) // useful!
}

function continueScaleCore() {
    //
    if (originalPaint == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const deltaWidth  = stageX - paintLastX
    const deltaHeight = stageY - paintLastY
    //
    paintLastX = stageX
    paintLastY = stageY
    //
    const newWidth = Math.max(1, toplayer.canvas.width  + deltaWidth)
    const newHeight = Math.max(1, toplayer.canvas.height + deltaHeight)
    //
    toplayer.canvas.width = newWidth
    toplayer.canvas.height = newHeight
    //
    ctx["imageSmoothingEnabled"] = false
    ctx.drawImage(originalPaint, 0,0,originalPaint.width,originalPaint.height,  0,0,newWidth,newHeight)
    ctx["imageSmoothingEnabled"] = true
}

function finishScale() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (originalPaint == null) { return }
    //
    let different = false
    if (toplayer.width  != originalPaint.width)  { different = true }
    if (toplayer.height != originalPaint.height) { different = true }
    //
    if (different) { memorizeTopLayer() }
    originalPaint = null
}

// file: tools/select.js //
// "use strict"

// validation by (mask != null)

// may not select the selection layer

///////////////////////////////////////////////////////////////////////////////

function startSelect() {
    //
    continueSelect()
}

function continueSelect() {
    //
    if (toplayer == null) { return }
    //
    if (selectionIsOn()) { alertSuperLayer(); return }
    //
    if (mask == null) {
        //
        resetMask()
        //
        const color = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + (ALPHA / 255) + ")"
        maskCtx.fillStyle = color
    }
    //
    let x = Math.max(0, stageX - toplayer.left)
    let y = Math.max(0, stageY - toplayer.top)
    //
    x = Math.min(x, mask.width - 1)
    y = Math.min(y, mask.height - 1)
    //
    if (paintStartX == null) { paintStartX = x; paintStartY = y }
    //
    paintLastX = x
    paintLastY = y
    //
    continueSelect2()
}

function continueSelect2() {
    //
    let startX = paintStartX
    let endX = paintLastX
    if (endX < startX) { startX = paintLastX; endX = paintStartX }
    //
    let startY = paintStartY
    let endY = paintLastY
    if (endY < startY) { startY = paintLastY; endY = paintStartY }
    //
    const width  = endX - startX + 1
    const height = endY - startY + 1
    //
    maskCtx.clearRect(0, 0, mask.width, mask.height)
    //
    maskCtx.fillRect(startX, startY, width, height) // filling
    //
    if (width  < 3) { return }
    if (height < 3) { return }
    // erasing inside:
    maskCtx.clearRect(startX + 1, startY + 1, width - 2, height - 2) // clearing inside
}

function finishSelect() {
    //
    if (mask == null) { return }
    //
    const left = Math.min(paintStartX, paintLastX)
    const top  = Math.min(paintStartY, paintLastY)
    //
    const right  = Math.max(paintStartX, paintLastX)
    const bottom = Math.max(paintStartY, paintLastY)
    //
    const width  = right - left + 1
    const height = bottom - top + 1
    //
    maskOn = false
    mask = null
    //
    paintStartX = null
    paintStartY = null
    //
    paintLastX = null
    paintLastY = null
    //
    if (width  < 1) { return }
    if (height < 1) { return }
    if (width + height == 2) { return }
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    ctx.drawImage(toplayer.canvas, -left, -top)
    //
    tryEraseRectangleInTopLayer(ctx, left, top, width, height)
    //
    finishSelect2(cnv, left, top)
}

function finishSelect2(cnv, deltaLeft, deltaTop) {
    //
    const superlayer = layers[0]
    //
    const shallMemorize = ! canvasesAreEqual(cnv, superlayer.canvas)
    //
    superlayer.canvas = cnv
    superlayer.left = toplayer.left + deltaLeft
    superlayer.top  = toplayer.top + deltaTop
    //
    if (shallMemorize) { memorizeLayer(superlayer) }
    //
    changeLayerVisibility(0)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function tryEraseRectangleInTopLayer(ctx, left, top, width, height) {
    //
    if (! shiftPressed) { return }
    //
    // does nothing if selected area is blank
    //
    const data = ctx.getImageData(0, 0, width, height).data
    //
    for (const value of data) {
        if (value != 0) {
            toplayer.canvas.getContext("2d").clearRect(left, top, width, height)
            memorizeTopLayer()
            return
        }
    }
}

// file: tools/spray.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function startSpray() {
    //
    continueSpray()
}

function continueSpray() {
    //
    if (toplayer == null) { return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const arr = makeBresenham(paintLastX, paintLastY, stageX, stageY) // accepts lastXY == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        paintLastX = p.x
        paintLastY = p.y
        paintSpray(ctx, p.x, p.y)
    }
}

function finishSpray() {
    //
    paintLastX = null
    paintLastY = null
    //
    if (shallMemorizePaint) { memorizeTopLayer() }
    shallMemorizePaint = false
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintSpray(ctx, x, y) {
    //
    const rect = getMouseRectangle(toplayer, x, y, toolSizeFor[tool])
    if (rect == null) { return }
    //
    const imgdata = ctx.getImageData(rect.left, rect.top, rect.width, rect.height)
    const data = imgdata.data
    //
    let anyChange = false
    //
    let index = 0
    while (index < data.length) {
        if (Math.random() < 0.02) {
            const changed = paintHardPixel(data, index, shiftPressed)
            if (changed) { anyChange = true }
        }
        index += 4
    }
    //
    if (! anyChange) { anyChange = paintAnyHardPixel(data, shiftPressed) }
    //
    if (! anyChange) { return }
    //
    ctx.putImageData(imgdata, rect.left, rect.top)
    shallMemorizePaint = true
}

// file: tools/thin-pen.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function thinPen() {
    //
    if (toplayer == null) { resetPerfectAny(); return }
    //
    const ctx = toplayer.canvas.getContext("2d")
    //
    const x1 = stageX - toplayer.left
    if (x1 < 0  ||  x1 >= toplayer.canvas.width) { resetPerfectAny(); return }
    //
    const y1 = stageY - toplayer.top
    if (y1 < 0  ||  y1 >= toplayer.canvas.height) { resetPerfectAny(); return }
    //
    let x0 = null
    let y0 = null
    //
    const n = executeds.length
    if (n != 0) {
        const last = executeds[n - 1]
        x0 = last.x
        y0 = last.y
    }
    //
    const arr = makeBresenham(x0, y0, x1, y1)  // accepts xy0 == null
    //
    while (arr.length > 0) {
        //
        const p = arr.shift()
        //
        const changed = paintPerfectPixel(ctx, p.x, p.y, executeds)
        //
        if (changed) { memorizeTopLayer() }
    }
}

// file: engine/animation.js //
// "use strict"

var animationObjs = [ ]

///////////////////////////////////////////////////////////////////////////////

function AnimationObject() {
    //
    this.isOn = true
    this.isCanvas = false
    this.favIndex = -1 // index in favorites
}

function createAnimationObject(favIndex) {
    //
    if (favIndex == undefined) { favIndex = -1 }
    //
    const obj = new AnimationObject()
    Object.seal(obj)
    //
    obj.favIndex = favIndex
    obj.isCanvas = favIndex == -1
    //
    return obj
}

///////////////////////////////////////////////////////////////////////////////

function initAnimation() {
    //
    animationObjs = [ createAnimationObject(-1) ]
}

///////////////////////////////////////////////////////////////////////////////

function prepareAnimation(pic) {
    //
    pictureForAnimation = pic
    //
    let temp = [ ]
    //
    for (const obj of animationObjs) {
        //
        if (obj.isCanvas) { temp.push(obj); continue }
        //
        if (obj.favIndex < favorites.length) { temp.push(obj); continue }
    }
    //
    animationObjs = temp
    //
    const count = Math.min(13, favorites.length + 1) // the frame canvas + up to 12 favorites
    //
    while (animationObjs.length < count) {
        //
        const index = animationObjs.length - 1 // less one because canvas is already there
        //
        const obj = createAnimationObject(index)
        animationObjs.push(obj)
    }
}

///////////////////////////////////////////////////////////////////////////////

function toggleAnimationFrameOnOff(n) {
    //
    animationObjs[n].isOn = ! animationObjs[n].isOn
    //
    paintPanelAnimation()
}

///////////////////////////////////////////////////////////////////////////////

function changeFrameCanvasPosition(delta) {
    //
    const a = indexOfFrameCanvas()
    const b = a + delta
    //
    if (b < 0) { return }
    if (b > animationObjs.length - 1) { return }
    //
    const objA = animationObjs[a]
    const objB = animationObjs[b]
    //
    animationObjs[a] = objB
    animationObjs[b] = objA
    //
    paintPanelAnimation()
}

function indexOfFrameCanvas() {
    //
    let n = -1
    //
    for (const obj of animationObjs) {
        //
        n += 1
        if (obj.isCanvas) { return n }
    }
}

///////////////////////////////////////////////////////////////////////////////

function indexOfNextAnimationObj() {
    //
    const off = animationObjs.length
    //
    for (let n = 0; n < off; n++) {
        //
        if (n <= indexOfLastAnimatedObj) { continue }
        //
        const obj = animationObjs[n]
        //
        if (obj.isOn) { return n }
    }
    //
    for (let m = 0; m < off; m++) {
        //
        const obj = animationObjs[m]
        //
        if (obj.isOn) { return m }
    }
    //
    return -1
}

// file: engine/color.js //
// "use strict"

var RED   = 230
var GREEN =  30
var BLUE  =   0
var ALPHA = 255

///////////////////////////////////////////////////////////////////////////////

function updateCurrentColor(color) {
    if (color == null) { return }
    if (color[3] < 0)  { return } // expecting to be -1 for blank slot in palette
    //
    RED    = color[0]
    GREEN  = color[1]
    BLUE   = color[2]
    ALPHA  = color[3]
    //
    paintCurrentColorOnTopBar()
    //
    mustDisplayMouseColor = true // or else "(match)" does not appear
}

// file: engine/display-info.js //
// "use strict"

// not all info goes here


var infoToolSize = null
var infoToolIntensity = null

var infoLayerX = null
var infoLayerY = null

var infoLayerWidth = null
var infoLayerHeight = null

var infoLayerLeft = null
var infoLayerTop = null

var infoLayerOpacity = null

///////////////////////////////////////////////////////////////////////////////

function displayGeneralInfo() {
    //
    displayToolSize()
    displayToolIntensity()
    //
    displayMousePosition()
    displayLayerSize()
    displayLayerPosition()
    displayLayerOpacity()
}

///////////////////////////////////////////////////////////////////////////////

function displayToolSize() {
    //
    let data = null
    const side = toolSizeFor[tool]
    if (side != undefined) { data = side }
    //
    if (infoToolSize == data) { return }
    //
    infoToolSize = data
    paintToolSizeOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function displayToolIntensity() {
    //
    let data = null
    const intensity = intensityFor[tool]
    if (intensity != undefined) { data = intensity }
    //
    if (infoToolIntensity == data) { return }
    //
    infoToolIntensity = data
    paintToolIntensityOnToolbox()
}

///////////////////////////////////////////////////////////////////////////////

function displayMousePosition() {
    //
    const layerX = getTopLayerX()
    const layerY = getTopLayerY()
    //
    if (infoLayerX == layerX  &&  infoLayerY == layerY) { return }
    //
    infoLayerX = layerX
    infoLayerY = layerY
    //
    paintMousePositionOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerSize() {
    //
    const width  = (toplayer == null) ? null : toplayer.canvas.width
    const height = (toplayer == null) ? null : toplayer.canvas.height
    //
    if (infoLayerWidth == width  &&  infoLayerHeight == height) { return }
    //
    infoLayerWidth = width
    infoLayerHeight = height
    //
    paintLayerSizeOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerPosition() {
    //
    const left = (toplayer == null) ? null : toplayer.left
    const top  = (toplayer == null) ? null : toplayer.top
    //
    if (infoLayerLeft == left  &&  infoLayerTop == top) { return }
    //
    infoLayerLeft = left
    infoLayerTop = top
    //
    paintLayerPositionOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function displayLayerOpacity() {
    //
    const opacity = getTopLayerOpacity()
    //
    if (infoLayerOpacity == opacity) { return }
    //
    infoLayerOpacity = opacity
    //
    paintLayerOpacityOnBottomBar()
}

// file: engine/favorites.js //
// "use strict"

const favorites = [ ]

var indexOfSelectedFavorite = -1

///////////////////////////////////////////////////////////////////////////////

function Favorite() {
    this.canvas = null
    this.icon = null
}

function createFavorite(cnv) {
    //
    const f = new Favorite()
    Object.seal(f)
    //
    f.canvas = cloneImage(cnv)
    f.icon = makeFavoriteIcon(cnv)
    //
    return f
}

///////////////////////////////////////////////////////////////////////////////

function showPreviousFavorite() {
    //
    showFavorite("previous", -1)
}

function showNextFavorite() {
    showFavorite("next", +1)
}

function showFavorite(kind, delta) {
    //
    shallRepaint = true
    //
    if (favorites.length == 0) { customAlert("no favorite to show"); return }
    //
    if (toplayer == null) { return }
    //
    const max = favorites.length - 1
    //
    let index = indexOfSelectedFavorite + delta
    //
    if (index < 0) { index = 0 }
    if (index > max) { index = max }
    //
    indexOfSelectedFavorite = index
    //
    const f = favorites[indexOfSelectedFavorite]
    //
    const isEdge = (index == 0  ||  index == max)
    if (isEdge  &&  canvasesAreEqual(f.canvas, toplayer.canvas)) { return }
    //
    startBlinkingIconOnTopBar(kind)
    toplayer.canvas = cloneImage(f.canvas)
    memorizeLayerFromFavorites(toplayer)
}

///////////////////////////////////////////////////////////////////////////////

function deleteFavorite() {
    //
    favorites.splice(indexOfSelectedFavorite, 1)
    //
    indexOfSelectedFavorite = favorites.length - 1
    //
    paintFavorites()
}

function exchangeFavorites(a, b) {
    //
    const favoriteA = favorites[a]
    const favoriteB = favorites[b]
    //
    favorites[a] = favoriteB
    favorites[b] = favoriteA
    //
    indexOfSelectedFavorite = b
    //
    paintFavorites()
}

///////////////////////////////////////////////////////////////////////////////

function fileToFavorites(cnv) {
    //
    toFavoritesCore(cnv)
}

function pictureToFavorites() {
    //
    if (toplayer == null) { return }
    //
    makeCheckedPicture(toFavoritesCore)
}

function toFavoritesCore(cnv, callback) {
    //
    if (favorites.length == 49) { customAlert("no room for another favorite", callback); return }
    //
    startBlinkingIconOnTopBar("register")
    //
    const f = createFavorite(cnv)
    //
    favorites.push(f)
    //
    indexOfSelectedFavorite = favorites.length - 1
    //
    if (callback) { callback() }
}

// file: engine/help.js //
// "use strict"

var currentHelp = 0

///////////////////////////////////////////////////////////////////////////////

function showOrHideHelp() {
    currentHelp += 1
    //
    if (currentHelp == 1) { showHelp1(); return }
    if (currentHelp == 2) { showHelp2(); return }
    if (currentHelp == 3) { showHelp3(); return }
    if (currentHelp == 4) { showHelp4(); return }
    //
    currentHelp = 0
    hideHelp()
}

function showHelp1() {
    MODE = "help"
    startBlinkingIconOnTopBar("help")
    showOverlay()
    paintCanvasHelp1()
    showCanvasHelp()
}

function showHelp2() {
    paintCanvasHelp2()
}

function showHelp3() {
    paintCanvasHelp3()
}

function showHelp4() {
    paintCanvasHelp4()
}

function hideHelp() {
    MODE = "standard"
    //
    hideOverlay()
    hideCanvasHelp()
}

///////////////////////////////////////////////////////////////////////////////

function drawIconOnCanvasHelp(id, x, y) {
    //
    canvasHelpCtx.drawImage(getIcon30(id), x, y)
    //
    return 35
}

// file: engine/help-1.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp1Left()
    paintCanvasHelp1Center()
    paintCanvasHelp1Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1Left() {
    let y = 30
    let x = 20
    y = 20 + helpBobSprite(x, y)
    y = 20 + helpHelp(x, y)
    y = 20 + helpMoveLayer(x, y)
    y = 20 + helpMoveLayers(x, y)
    y = 20 + helpCenterLayer(x, y)
}

function helpBobSprite(x, y) {
    y += 30
    y += writeOnCanvasHelp("BOBSPRITE", x, y)
    y += writeOnCanvasHelp("  > BobSprite is a free online drawing tool especially", x, y)
    y += writeOnCanvasHelp("     designed for *Pixel Art*", x, y)
    y += writeOnCanvasHelp("  > you can learn more at the home page:", x, y)
    y += writeOnCanvasHelp("     www.bobsprite.com", x, y)
    return y
}

function helpHelp(x, y) {
    y += drawIconOnCanvasHelp("help", x + 170, y+20)
    y += writeOnCanvasHelp("Help", x, y)
    y += writeOnCanvasHelp("  > shows this help", x, y)
    return y
}

function helpMoveLayer(x, y) {
    y += drawIconOnCanvasHelp("hand", x + 170, y)
    y += writeOnCanvasHelp("Hand Tool", x, y)
    y += writeOnCanvasHelp("  > moves the top layer", x, y)
    y += writeOnCanvasHelp("  > if CTRL pressed, moves the *content* of the top layer", x, y)
    y += writeOnCanvasHelp("  > hotkeys: ArrowUp, ArrowDown, ArrowLeft, ArrowRight", x, y)
    return y
}

function helpMoveLayers(x, y) {
    y += drawIconOnCanvasHelp("hand", x + 170, y)
    y += writeOnCanvasHelp("Move all active layers", x, y)
    y += writeOnCanvasHelp("  > drag the mouse while Spacebar is pressed", x, y)
    return y
}

function helpCenterLayer(x, y) {
    y += drawIconOnCanvasHelp("center", x + 170, y)
    y += writeOnCanvasHelp("Center the active layers", x, y)
    y += writeOnCanvasHelp("  > hotkey: C", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1Center() {
    let y = 30
    let x = 455
    y = 20 + helpRoll(x, y)
    y = 20 + helpPen(x, y)
    y = 20 + helpFeather(x, y)
    y = 20 + helpSpray(x, y)
    y = 20 + helpRubber(x, y)
}

function helpRoll(x, y) {
    y += drawIconOnCanvasHelp("roll", x + 170, y)
    y += writeOnCanvasHelp("Roll", x, y)
    y += writeOnCanvasHelp("  > paints the whole top layer", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpPen(x, y) {
    y += drawIconOnCanvasHelp("pen", x + 170, y)
    y += writeOnCanvasHelp("Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

/*
function helpBrush(x, y) {
    y += drawIconOnCanvasHelp("brush", x + 170, y)
    y += writeOnCanvasHelp("Brush Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}
*/

function helpFeather(x, y) {
    y += drawIconOnCanvasHelp("feather", x + 170, y)
    y += writeOnCanvasHelp("Feather Tool", x, y)
    y += writeOnCanvasHelp("  > NO EFFECT on blank pixels", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpSpray(x, y) {
    y += drawIconOnCanvasHelp("spray", x + 170, y)
    y += writeOnCanvasHelp("Spray Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

function helpRubber(x, y) {
    y += drawIconOnCanvasHelp("rubber", x + 170, y)
    y += writeOnCanvasHelp("Rubber Tool", x, y)
    y += writeOnCanvasHelp("  > just erases", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp1Right() {
    let y = 30
    let x = 895
    y = 20 + helpThinPen(x, y)
    y = 20 + helpMirrorPen(x, y)
    y = 20 + helpLineTool(x, y)
    y = 20 + helpProtection(x, y)
}

function helpThinPen(x, y) {
    y += drawIconOnCanvasHelp("thin-pen", x + 170, y)
    y += writeOnCanvasHelp("Thin Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > makes clean traces", x, y)
    y += writeOnCanvasHelp("  > undo/redo memory works pixel by pixel", x, y)
    return y
}

function helpMirrorPen(x, y) {
    y += drawIconOnCanvasHelp("mirror-pen", x + 170, y)
    y += writeOnCanvasHelp("Mirror Pen Tool", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    y += writeOnCanvasHelp("  > makes clean traces", x, y)
    y += writeOnCanvasHelp("  > undo/redo memory works pixel by pixel", x, y)
    return y
}

function helpLineTool(x, y) {
    y += drawIconOnCanvasHelp("line", x + 170, y)
    y += writeOnCanvasHelp("Line Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    return y
}

function helpProtection(x, y) {
    y += drawIconOnCanvasHelp("protection", x + 170, y)
    y += writeOnCanvasHelp("Protection  (blank and black)", x, y)
    y += writeOnCanvasHelp("  > there are two kind of protected pixels:", x, y)
    y += writeOnCanvasHelp("      blank (rgba 0 0 0 0)", x, y)
    y += writeOnCanvasHelp("      black (rgba 0 0 0 255)", x, y)
    y += writeOnCanvasHelp("  > some tools and effects cannot change them if", x, y)
    y += writeOnCanvasHelp("     Protection is on", x, y)
    y += writeOnCanvasHelp("  > effect Weaken Black Pixels turns (rgba 0 0 0 255)", x, y)
    y += writeOnCanvasHelp("     pixels into (rgba 1 1 1 255) pixels", x, y)
    return y
}

// file: engine/help-2.js //
// "use strict"

function paintCanvasHelp2() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp2Left()
    paintCanvasHelp2Center()
    paintCanvasHelp2Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Left() {
    let y = 30
    let x = 20
    y = 20 + helpBucket(x, y)
    y = 20 + helpColorReplacer(x, y)
    y = 20 + helpPaintBorder(x, y)
    y = 20 + helpBlurPixel(x, y)
    y = 20 + helpBlurBorder(x, y)
}

function helpBucket(x, y) {
    y += drawIconOnCanvasHelp("bucket", x + 170, y)
    y += writeOnCanvasHelp("Bucket Tool", x, y)
    y += writeOnCanvasHelp("  > paints the clicked area", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpColorReplacer(x, y) {
    y += drawIconOnCanvasHelp("every", x + 170, y)
    y += writeOnCanvasHelp("Color Replacer Tool", x, y)
    y += writeOnCanvasHelp("  > paints all pixels that match the clicked pixel", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpPaintBorder(x, y) {
    y += drawIconOnCanvasHelp("border", x + 170, y)
    y += writeOnCanvasHelp("Paint Border Tool", x, y)
    y += writeOnCanvasHelp("  > paints the inner border of the clicked area", x, y)
    y += writeOnCanvasHelp("  > erases if Shift is pressed", x, y)
    return y
}

function helpBlurPixel(x, y) {
    y += drawIconOnCanvasHelp("blur-pixel", x + 170, y)
    y += writeOnCanvasHelp("Blur Pixel Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpBlurBorder(x, y) {
    y += drawIconOnCanvasHelp("blur-border", x + 170, y)
    y += writeOnCanvasHelp("Blur Border Tool", x, y)
    y += writeOnCanvasHelp("  > blurs the inner border of the clicked area", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Center() {
    let y = 30
    let x = 455
    y = 20 + helpUndo(x, y)
    y = 20 + helpRedo(x, y)
    y = 20 + helpColorCapture(x, y)
    y = 20 + helpDarkenTool(x, y)
    y = 20 + helpLightenTool(x, y)
}

function helpColorCapture(x, y) {
    y += drawIconOnCanvasHelp("capture", x + 170, y)
    y += writeOnCanvasHelp("Color Capture Tool", x, y)
    y += writeOnCanvasHelp("  > only for use on the layer", x, y)
    y += writeOnCanvasHelp("  > hotkey: Tab", x, y)
    return y
}

function helpUndo(x, y) {
    y += drawIconOnCanvasHelp("undo", x + 170, y)
    y += writeOnCanvasHelp("Undo layer edition", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Z, Backspace", x, y)
    return y
}

function helpRedo(x, y) {
    y += drawIconOnCanvasHelp("redo", x + 170, y)
    y += writeOnCanvasHelp("Redo layer edition", x, y)
    y += writeOnCanvasHelp("  > hotkeys: Ctrl Y, Shift Backspace", x, y)
    return y
}

function helpDarkenTool(x, y) {
    y += drawIconOnCanvasHelp("darken", x + 170, y)
    y += writeOnCanvasHelp("Darken Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

function helpLightenTool(x, y) {
    y += drawIconOnCanvasHelp("lighten", x + 170, y)
    y += writeOnCanvasHelp("Lighten Tool", x, y)
    y += writeOnCanvasHelp("  > Shift spin the mouse wheel to change its size", x, y)
    y += writeOnCanvasHelp("  > Ctrl spin the mouse wheel to change its intensity", x, y)
    y += writeOnCanvasHelp("  > must release mouse button to affect same pixels again", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp2Right() {
    let y = 30
    let x = 895
    y = 20 + helpRectangle(x, y)
    y = 20 + helpEllipse(x, y)
    y = 20 + helpRectangleSelect(x, y)
    y = 20 + helpLasso(x, y)
    y = 20 + helpScaleTool(x, y)
}

function helpRectangleSelect(x, y) {
    y += drawIconOnCanvasHelp("select", x + 170, y)
    y += writeOnCanvasHelp("Rectangle Select Tool", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, erases part of the top layer", x, y)
    y += writeOnCanvasHelp("  > selected part appears in the layer Selection", x, y)
    return y
}

function helpLasso(x, y) {
    y += drawIconOnCanvasHelp("lasso", x + 170, y)
    y += writeOnCanvasHelp("Lasso Tool", x, y)
    y += writeOnCanvasHelp("  > if Shift pressed, erases part of the top layer", x, y)
    y += writeOnCanvasHelp("  > selected part appears in the layer Selection", x, y)
    return y
}

function helpRectangle(x, y) {
    y += drawIconOnCanvasHelp("rectangle", x + 170, y)
    y += writeOnCanvasHelp("Rectangle Tool", x, y)
    y += writeOnCanvasHelp("  > strokes a rectangle", x, y)
    y += writeOnCanvasHelp("  > fills the rectangle if Shift is pressed", x, y)
    return y
}

function helpEllipse(x, y) {
    y += drawIconOnCanvasHelp("ellipse", x + 170, y)
    y += writeOnCanvasHelp("Ellipse Tool", x, y)
    y += writeOnCanvasHelp("  > strokes a ellipse", x, y)
    y += writeOnCanvasHelp("  > fills the ellipse if Shift is pressed", x, y)
    return y
}

function helpScaleTool(x, y) {
    y += drawIconOnCanvasHelp("scale", x + 170, y)
    y += writeOnCanvasHelp("Scale Tool", x, y)
    y += writeOnCanvasHelp("  > avoid releasing the mouse button more than once", x, y)
    return y
}

// file: engine/help-3.js //
// "use strict"

function paintCanvasHelp3() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp3Left()
    paintCanvasHelp3Center()
    paintCanvasHelp3Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Left() {
    let y = 30
    let x = 20
    y = 20 + helpAnimation(x, y)
    y = 20 + helpFavorites(x, y)
    y = 20 + helpMemorizeFavorite(x, y)
    y = 20 + helpPrevious(x, y)
    y = 20 + helpNext(x, y)
}

function helpAnimation(x, y) {
    y += drawIconOnCanvasHelp("animation", x + 170, y)
    y += writeOnCanvasHelp("Show panel Animation", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over it to change the zoom level", x, y)
    y += writeOnCanvasHelp("  > hotkey: A", x, y)
    return y
}

function helpFavorites(x, y) {
    y += drawIconOnCanvasHelp("favorites", x + 170, y)
    y += writeOnCanvasHelp("Show panel Favorites", x, y)
    y += writeOnCanvasHelp("  > hotkey: F", x, y)
    return y
}

function helpMemorizeFavorite(x, y) {
    y += drawIconOnCanvasHelp("register", x + 170, y)
    y += writeOnCanvasHelp("Memorize the current image as favorite", x, y)
    y += writeOnCanvasHelp("  > any loaded or saved image is automatically memorized", x, y)
    y += writeOnCanvasHelp("  > hotkey: Enter", x, y)
    return y
}

function helpPrevious(x, y) {
    y += drawIconOnCanvasHelp("previous", x + 170, y)
    y += writeOnCanvasHelp("Show previous favorite", x, y)
    y += writeOnCanvasHelp("  > hotkey: PageUp", x, y)
    return y
}

function helpNext(x, y) {
    y += drawIconOnCanvasHelp("next", x + 170, y)
    y += writeOnCanvasHelp("Show next favorite", x, y)
    y += writeOnCanvasHelp("  > hotkey: PageDown", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Center() {
    let y = 30
    let x = 455
    y = 20 + helpDecreaseZoom(x, y)
    y = 20 + helpIncreaseZoom(x, y)
    y = 20 + helpTileSet(x, y)
    y = 20 + helpSwapHalves(x, y)
}

function helpDecreaseZoom(x, y) {
    y += drawIconOnCanvasHelp("minus", x + 170, y)
    y += writeOnCanvasHelp("Zoom out", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over the canvas", x, y)
    y += writeOnCanvasHelp("  > avoid painting with zoom 0.5x", x, y)
    y += writeOnCanvasHelp("  > hotkey: Minus (-)", x, y)
    return y
}

function helpIncreaseZoom(x, y) {
    y += drawIconOnCanvasHelp("plus", x + 170, y)
    y += writeOnCanvasHelp("Zoom in", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over the canvas", x, y)
    y += writeOnCanvasHelp("  > hotkey: Plus (+)", x, y)
    return y
}

function helpTileSet(x, y) {
    y += drawIconOnCanvasHelp("tile-set", x + 170, y)
    y += writeOnCanvasHelp("Create tile set", x, y)
    y += writeOnCanvasHelp("  > shows a big tile set of the current image", x, y)
    y += writeOnCanvasHelp("  > you can save it by Right Clicking it", x, y)
    y += writeOnCanvasHelp("  > pressing any key closes it", x, y)
    return y
}

function helpSwapHalves(x, y) {
    drawIconOnCanvasHelp("halves-h", x + 140, y)
    y += drawIconOnCanvasHelp("halves-v", x + 200, y)
    y += writeOnCanvasHelp("Swap halves", x, y)
    y += writeOnCanvasHelp("  > swaps halves of the top layer (adjusted)", x, y)
    y += writeOnCanvasHelp("  > an odd dimension will be rounded up before swapping,", x, y)
    y += writeOnCanvasHelp("     by inserting one thin blank row or col", x, y)
    y += writeOnCanvasHelp("  > useful for creating a tile set of one sprite only", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp3Right() {
    let y = 30
    let x = 895
    y = 20 + helpLoadImage(x, y)
    y = 20 + helpSaveImage(x, y)
    y = 20 + helpAlternativeSave(x, y)
}

function helpLoadImage(x, y) {
    y += drawIconOnCanvasHelp("load", x + 170, y)
    y += writeOnCanvasHelp("Load image", x, y)
    y += writeOnCanvasHelp("  > hotkey: Ctrl L", x, y)
    return y
}

function helpSaveImage(x, y) {
    y += drawIconOnCanvasHelp("save", x + 170, y)
    y += writeOnCanvasHelp("Save image", x, y)
    y += writeOnCanvasHelp("  > the saved image ignores the *displaying* opacities", x, y)
    y += writeOnCanvasHelp("  > hotkey: Ctrl S", x, y)
    return y
}

function helpAlternativeSave(x, y) {
    y += drawIconOnCanvasHelp("save2", x + 170, y)
    y += writeOnCanvasHelp("Save image (alternative method)", x, y)
    y += writeOnCanvasHelp("  > the saved image ignores the *displaying* opacities", x, y)
    y += writeOnCanvasHelp("  > you can save it by Right Clicking it", x, y)
    y += writeOnCanvasHelp("  > pressing any key closes it", x, y)
    return y
}

// file: engine/help-4.js //
// "use strict"

function paintCanvasHelp4() {
    resetCanvasHelp()
    weakWriteOnCanvasHelp("(click or type any key)", 567, 580)
    paintCanvasHelp4Left()
    paintCanvasHelp4Center()
    paintCanvasHelp4Right()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp4Left() {
    let y = 30
    let x = 20
    y = 20 + helpPalette(x, y)
    y = 20 + helpPanelColor(x, y)
    y = 20 + helpPanelSize(x, y)
    y = 20 + helpPanelEffect(x, y)
}

function helpPalette(x, y) {
    y += drawIconOnCanvasHelp("palette", x + 170, y)
    y += writeOnCanvasHelp("Panel Palette", x, y)
    y += writeOnCanvasHelp("  > palette 'bob' is not editable", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel to change the selected palette", x, y)
    y += writeOnCanvasHelp("  > Left Click selects a color", x, y)
    y += writeOnCanvasHelp("  > Shift Left Click replaces a color with the current color", x, y)
    y += writeOnCanvasHelp("  > Ctrl Left Click erases a color", x, y)
    y += writeOnCanvasHelp("  > Mouse Drag changes position of a color", x, y)
    y += writeOnCanvasHelp("  > when loading a palette, translucent colors are ignored", x, y)
    y += writeOnCanvasHelp("     or, if almost opaque, converted to opaque", x, y)
    return y
}

function helpPanelColor(x, y) {
    y += drawIconOnCanvasHelp("color", x + 170, y)
    y += writeOnCanvasHelp("Color: Panel HSL and Panel RGBA", x, y)
    y += writeOnCanvasHelp("  > 2 color samples: reference (left) and current (right)", x, y)
    y += writeOnCanvasHelp("  > current color is the color under edition", x, y)
    y += writeOnCanvasHelp("  > click on any color sample to swap both", x, y)
    y += writeOnCanvasHelp("  > only in Panel RGBA you can edit the opacity", x, y)
    return y
}

function helpPanelSize(x, y) {
    y += drawIconOnCanvasHelp("size", x + 170, y)
    y += writeOnCanvasHelp("Panel Size", x, y)
    y += writeOnCanvasHelp("  > notice the checkbox for pixelated scaling", x, y)
    return y
}

function helpPanelEffect(x, y) {
    y += drawIconOnCanvasHelp("effect", x + 170, y)
    y += writeOnCanvasHelp("Panel Effect", x, y)
    y += writeOnCanvasHelp("  > notice the 5 checkboxes for selecting subpanels", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp4Center() {
    let y = 30
    let x = 455
    y = 20 + helpPanelColorize(x, y)
    y = 20 + helpPanelShear(x, y)
    y = 20 + helpPanelConfig(x, y)
    y = 20 + helpMonitorBox(x, y)
}

function helpPanelColorize(x, y) {
    y += drawIconOnCanvasHelp("colorize", x + 170, y)
    y += writeOnCanvasHelp("Panel Colorize", x, y)
    y += writeOnCanvasHelp("  > the layer opacity is edited (not only its displaying)", x, y)
    return y
}

function helpPanelShear(x, y) {
    y += drawIconOnCanvasHelp("shear", x + 170, y)
    y += writeOnCanvasHelp("Panel Shear", x, y)
    y += writeOnCanvasHelp("  > works in pixelated mode", x, y)
    return y
}

function helpPanelConfig(x, y) {
    y += drawIconOnCanvasHelp("config", x + 170, y)
    y += writeOnCanvasHelp("Panel Config", x, y)
    y += writeOnCanvasHelp("  > hotkey: D (toggles dark/light interface)", x, y)
    return y
}

function helpMonitorBox(x, y) {
    y += drawIconOnCanvasHelp("zoom-in", x + 170, y)
    y += writeOnCanvasHelp("Panel Monitor  (no icon)", x, y)
    y += writeOnCanvasHelp("  > a frozen image works as a reference for drawing", x, y)
    y += writeOnCanvasHelp("  > spin the mouse wheel over it to change the zoom level", x, y)
    return y
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function paintCanvasHelp4Right() {
    let y = 30
    let x = 895
    y = 20 + helpPanelLayers(x, y)
    y = 20 + helpPanelOpacity(x, y)
    y = 20 + helpVersion(x, y)
}

function helpPanelLayers(x, y) {
    y += 30
    y += writeOnCanvasHelp("Panel Layers", x, y)
    y += writeOnCanvasHelp("  > there are 5 standard layers: A, B, C, D and E", x, y)
    y += writeOnCanvasHelp("  > the special layer Selection shows the result of", x, y)
    y += writeOnCanvasHelp("     using selection tools", x, y)
    y += writeOnCanvasHelp("  > drag a layer button to change its order", x, y)
    y += writeOnCanvasHelp("     the button of the layer \"selection\" is static:", x, y)
    y += writeOnCanvasHelp("      merge the selection with another layer or", x, y)
    y += writeOnCanvasHelp("      memorize the selection and recover on another layer", x, y)
    y += writeOnCanvasHelp("  > hotkeys:", x, y)
    y += writeOnCanvasHelp("      0, 1, 2, 3, 4, 5", x, y)
    y += writeOnCanvasHelp("      CTRL V: merge down unprotected", x, y)
    y += writeOnCanvasHelp("      CTRL SHIFT V: merge down protected", x, y)
    return y
}

function helpPanelOpacity(x, y) {
    y += 25
    y += writeOnCanvasHelp("Panel Opacity", x, y)
    y += writeOnCanvasHelp("  > only shows sliders for the active layers", x, y)
    y += writeOnCanvasHelp("  > sets the displaying (on the screen) opacity only", x, y)
    y += writeOnCanvasHelp("  > does not affect the true opacity of the layer", x, y)
    y += writeOnCanvasHelp("     (try Panel Colorize for the true opacity)", x, y)
    return y
}

function helpVersion(x, y) {
    y += 30
    y += writeOnCanvasHelp("Version", x, y)
    y += writeOnCanvasHelp("  > May 2024", x, y)
    return y
}

// file: engine/keyboard.js //
// "use strict"

var ctrlPressed  = false
var shiftPressed = false
var upPressed    = false
var downPressed  = false
var leftPressed  = false
var rightPressed = false

///////////////////////////////////////////////////////////////////////////////

function initKeyboard() {
    document.onkeyup = keyUpHandler
    document.onkeydown = keyDownHandler
}

///////////////////////////////////////////////////////////////////////////////

function resetKeyboard() {
    //
    // there was a horrible bug: (on old version yes; on new version, maybe not)
    // trying to move mask/sprite without it on,
    // raises alert
    // but key keeps 'pressed' under alert window,
    // so each main loop asks again checkMove wich
    // generates new alert window (thousands).
    // the solution is reset keyboard before alert
    //
    ctrlPressed  = false
    shiftPressed = false
    upPressed    = false
    downPressed  = false
    leftPressed  = false
    rightPressed = false
}

///////////////////////////////////////////////////////////////////////////////

function keyUpHandler(e) {
    //
    resetMoveByKeyboard()
    //
    shallRepaint = true
    //
    ctrlPressed  = e.ctrlKey
    shiftPressed = e.shiftKey
    //
    const low = e.key.toLowerCase()
    // console.log(low)
    if (low == "arrowup")    { upPressed    = false; return false }
    if (low == "arrowdown")  { downPressed  = false; return false }
    if (low == "arrowleft")  { leftPressed  = false; return false }
    if (low == "arrowright") { rightPressed = false; return false }
    //
    if (low == " ") { hideSuperHand(); return false }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function keyDownHandler(e) {
    //
    shallRepaint = true
    //
    const low = e.key.toLowerCase()
 // console.log(low)
    //
    ctrlPressed = e.ctrlKey
    shiftPressed = e.shiftKey
    //
    if (low == "f5")  { return true }
    if (low == "f11") { return true }
    if (low == "f12") { return true }
    //
    if (low == "-"  &&  e.ctrlKey) { return true }
    if (low == "+"  &&  e.ctrlKey) { return true }
    if (low == "="  &&  e.ctrlKey) { return true }
    if (low == "j"  &&  e.ctrlKey  &&  e.shiftKey) { return true }
    if (low == "u"  &&  e.ctrlKey) { return true }
    //
    if (MODE == "help") { setTask(showOrHideHelp); return true }
    if (MODE == "tile-set") { setTask(hideTileSet); return true }
    if (MODE == "favorites") { setTask(hideFavorites); return true }
    if (MODE == "alternative-save") { setTask(hideAlternativeSave); return true }
    //
    if (MODE == "animation") { keyDownHandlerAnimationMode(low); return true }
    //
    if (MODE == "standard") { keyDownHandlerStandardMode(low); return false }
    //
    return false // should not happen
}

function keyDownHandlerAnimationMode(low) {
    //
    if (low == "arrowleft")  { changeFrameCanvasPosition(-1); return }
    if (low == "arrowright") { changeFrameCanvasPosition(+1); return }
    setTask(hideAnimation)
}

function keyDownHandlerStandardMode(low) {
    //
    // ########################################### //
    // ABORTING COMMAND TO NOT MESS WITH MOUSE JOB //
    // ########################################### //
    //
    if (mouseBusy  ||  superHandOn) { return false }
    //
    //
    const numbox = focusedNumbox()
    if (numbox != null) { numboxOnKeyDown(numbox, low); return }
    //
    if (low == "arrowup")    { upPressed    = true; return }
    if (low == "arrowdown")  { downPressed  = true; return }
    if (low == "arrowleft")  { leftPressed  = true; return }
    if (low == "arrowright") { rightPressed = true; return }
    //
    if (low == "pageup") { setTask(showPreviousFavorite); return }
    if (low == "pagedown") { setTask(showNextFavorite); return }
    //
    if (low == "enter") { setTask(pictureToFavorites); return }
    //
    if (low == "tab") { managerCapture(); return }
    if (low == "capslock") { managerCapture(); return }
    //
    if (low == "backspace") {
        if (shiftPressed) { setTask(redo) } else { setTask(undo) }; return
    }
    //
    if (low == "0") { changeLayerVisibility(0); return }
    if (low == "1") { changeLayerVisibility(1); return }
    if (low == "2") { changeLayerVisibility(2); return }
    if (low == "3") { changeLayerVisibility(3); return }
    if (low == "4") { changeLayerVisibility(4); return }
    if (low == "5") { changeLayerVisibility(5); return }
    //
    if (low == "l"  &&  ctrlPressed)  { loadImage(); return }
    if (low == "s"  &&  ctrlPressed)  { saveImage("png"); return }
    if (low == "v"  &&  ctrlPressed)  {
        if (shiftPressed) { mergeDownProtected() } else { mergeDownUnprotected() }
        return
    }
    if (low == "y"  &&  ctrlPressed)  { setTask(redo); return }
    if (low == "z"  &&  ctrlPressed)  { setTask(undo); return }
    //
    if (low == " ") { showSuperHand(); return }
    if (low == "a") { setTask(showAnimation); return }
    if (low == "c") { setTask(centerLayers); return }
    if (low == "d") { setTask(toggleDarkness); return }
    if (low == "f") { setTask(showFavorites); return }
    if (low == "h") { applyEffect(horizontalReverse); return }
    if (low == "r") { applyEffect(rotate90); return }
    if (low == "v") { applyEffect(verticalReverse); return }
    if (low == "x") { applyEffect(mixedReverse); return }
    if (low == "-") { setTask(decreaseZoom); return }
    if (low == "+") { setTask(increaseZoom); return }
}

// file: engine/layers.js //
// "use strict"

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
    const buttonA = panelLayersGadgets[a]
    const buttonB = panelLayersGadgets[b]
    //
    const labelA = buttonA.text
    const labelB = buttonB.text
    //
    buttonA.text = labelB
    buttonB.text = labelA
    //
    updateButtonImages(buttonA)
    updateButtonImages(buttonB)
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
    startBlinkingButton(buttonA)
    startBlinkingButton(buttonB)
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

// file: engine/manager.js //
// "use strict"

// when painting with mouse, global mouseBusy blocks input by keyboard!
// also, when mouse is painting it is not pressing icons or panel buttons
// so task management may safely ignore painting by mouse

// the standard handling of an action is call setTask;
// some fast actions skip this step


// task management ////////////////////////////////////////////////////////////

var TASK = null

function setTask(callback) {
    if (TASK != null) { return }
    TASK = callback
}

function runTask() {
    if (TASK == null) { return }
    TASK()
    TASK = null
}

///////////////////////////////////////////////////////////////////////////////

function loadImage() {
    //
    if (toplayer == null) { customAlert("no layer on for image loading"); return }
    //
    startBlinkingIconOnTopBar("load")
    //
    isPaletteFile = false
    loadImageFile()
}

function imageLoaded(cnv) {
    //
    sendImageToTopLayer(cloneImage(cnv))
    //
    fileToFavorites(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function saveImage(style) {
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("save")
    //
    isPaletteFile = false
    saveStyle = style
    //
    makeCheckedPicture(saveImage2)
}

function saveImage2(pic) {
    //
    toFavoritesCore(pic, callback)
    //
    function callback() { saveImageFile(pic) }
}

///////////////////////////////////////////////////////////////////////////////

function applyEffect(func) {
    shallRepaint = true
    //
    function callback () { applyEffect1(func) }
    setTask(callback)
}

///////////////////////////////////////////////////////////////////////////////

function applyEffect1(func) {
    //
    if (func == pixelate2) { applyEffect2(func); return }
    if (func == pixelate3) { applyEffect2(func); return }
    if (func == pixelate4) { applyEffect2(func); return }
    if (func == pixelate5) { applyEffect2(func); return }
    if (func == verticalReverse) { applyEffect2(func); return }
    if (func == horizontalReverse) { applyEffect2(func); return }
    if (func == antialiasingStrong) { applyEffect2(func); return }
    if (func == antialiasingStandard) { applyEffect2(func); return }
    //
    if (toplayer == null) { return }
    //
    const changed = func(toplayer.canvas)
    if (changed) { memorizeTopLayer() }
}

function applyEffect2(func) {
    if (toplayer == null) { return }
    //
    const cnv = cloneImage(toplayer.canvas)
    func(toplayer.canvas)
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function managerCapture() { // very fast, need not to be set as task
    //
    if (mouseAlpha <= 0) { return } // mouseAlpha is -1 when mouse is off layer
    //
    if (tool == "capture") { recoverToolBeforeCapture() }
    //
    const color = [ mouseRed, mouseGreen, mouseBlue, mouseAlpha ]
    updateCurrentColor(color)
    //
    maybeRepaintColorPanel()
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintArea() {
    setTask(managerPaintAreaCore)
}

function managerPaintAreaCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed
    if (shiftPressed) {
        changed = paintArea(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintArea(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintEvery() {
    setTask(managerPaintEveryCore)
}

function managerPaintEveryCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed
    if (shiftPressed) {
        changed = paintEvery(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintEvery(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerPaintBorder() {
    setTask(managerPaintBorderCore)
}

function managerPaintBorderCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed
    if (shiftPressed) {
        changed = paintBorder(toplayer.canvas, x, y, 0, 0, 0, 0)
    }
    else {
        changed = paintBorder(toplayer.canvas, x, y, RED, GREEN, BLUE, ALPHA)
    }
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function managerBlurBorder() {
    setTask(managerBlurBorderCore)
}

function managerBlurBorderCore() {
    //
    const x = getTopLayerX()
    const y = getTopLayerY()
    //
    if (x == null  ||  y == null) { return }
    //
    let changed = blurBorder(toplayer.canvas, x, y)
    if (changed) { memorizeLayer(toplayer) }
}

///////////////////////////////////////////////////////////////////////////////

function leftRightToCenter() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("halves")
    //
    let width = toplayer.canvas.width
    if (width % 2 != 0) { width += 1 }
    //
    const height = toplayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(width / 2)
    //
    ctx.drawImage(toplayer.canvas, -half, 0)
    ctx.drawImage(toplayer.canvas, +half, 0)
    //
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    toplayer.canvas = cnv
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function topBottomToCenter() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    startBlinkingIconOnTopBar("halves")
    //
    let height = toplayer.canvas.height
    if (height % 2 != 0) { height += 1 }
    //
    const width = toplayer.canvas.width
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const half = Math.floor(height / 2)
    //
    ctx.drawImage(toplayer.canvas, 0, -half)
    ctx.drawImage(toplayer.canvas, 0, +half)
    //
    if (canvasesAreEqual(toplayer.canvas, cnv)) { return }
    //
    toplayer.canvas = cnv
    memorizeTopLayer()
}

// file: engine/memory.js //
// "use strict"

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

// file: engine/mouse.js //
// "use strict"

var mouseBusy = false // flag to abort concurrent keyboard command

var stageRawX = null // stage raw coordinate (ignores ZOOM)
var stageRawY = null // stage raw coordinate (ignores ZOOM)

var stageX = null // stage natural coordinate (after unzooming)
var stageY = null // stage natural coordinate (after unzooming)

///////////////////////////////////////////////////////////////////////////////

function updateStageXY() { // also called by module "zoom"
    //
    stageX = null
    stageY = null
    //
    if (stageRawX == null) { return }
    //
    const deltaXZoomed = stageRawX - stageCenterX
    const deltaYZoomed = stageRawY - stageCenterY
    //
    const deltaX = Math.floor(deltaXZoomed / ZOOM)
    const deltaY = Math.floor(deltaYZoomed / ZOOM)
    //
    stageX = stageCenterX + deltaX
    stageY = stageCenterY + deltaY
}

///////////////////////////////////////////////////////////////////////////////

// palette has own handler for wheel

function mouseWheelHandler(e) {
    shallRepaint = true
    //
    if (e.shiftKey) {
        if (e.deltaY > 0) { changeToolSize(-1); return false }
        if (e.deltaY < 0) { changeToolSize(+1); return false }
    }
    else if (e.ctrlKey) {
        if (e.deltaY > 0) { changeIntensity(-1); return false }
        if (e.deltaY < 0) { changeIntensity(+1); return false }
    }
    else {
        if (e.deltaY > 0) { decreaseZoom(); return false }
        if (e.deltaY < 0) { increaseZoom(); return false }
    }
}

///////////////////////////////////////////////////////////////////////////////

function mouseUpHandler() {
    //
    shallRepaint = true
    mouseBusy = false
    //
    finishMouseAction()
    return false
}

///////////////////////////////////////////////////////////////////////////////

function mouseLeaveHandler() {
    //
    shallRepaint = true
    mouseBusy = false
    //
    stageRawX = null
    stageRawY = null
    updateStageXY()
    //
    finishMouseAction()
    eraseMouseColor()
    return false
}

///////////////////////////////////////////////////////////////////////////////

function finishMouseAction() {
    //
    if (superHandOn)          { resetMove(); return }
    //
    if (tool == "pen")        { finishPen(); return }
    if (tool == "hand")       { resetMove(); return }
    if (tool == "line")       { finishLine(); return }
    if (tool == "blur-pixel") { finishBlur(); return }
    if (tool == "brush")      { finishBrush(); return }
    if (tool == "spray")      { finishSpray(); return }
    if (tool == "scale")      { finishScale(); return }
    if (tool == "lasso")      { finishLasso(); return }
    if (tool == "rubber")     { finishRubber(); return }
    if (tool == "select")     { finishSelect(); return }
    if (tool == "darken")     { finishDarken(); return }
    if (tool == "ellipse")    { finishEllipse(); return }
    if (tool == "feather")    { finishFeather(); return }
    if (tool == "lighten")    { finishLighten(); return }
    if (tool == "thin-pen")   { resetPerfectAny(); return }
    if (tool == "rectangle")  { finishRectangle(); return }
    if (tool == "mirror-pen") { resetPerfectAny(); return }
}

///////////////////////////////////////////////////////////////////////////////

function mouseDownHandler(e) {
    shallRepaint = true
    resetFocusedGadget()
    //
    mouseBusy = true
    //
    if (superHandOn) { return false }
    //
    if (e.buttons != 1)  { return false } // avoid mess with right button click
    //
    if (tool == "hand")        { return false }
    if (tool == "thin-pen")    { thinPen(); return false }
    if (tool == "pen")         { startPen(); return false }
    if (tool == "line")        { startLine(); return false }
    if (tool == "mirror-pen")  { mirrorPen(); return false }
    if (tool == "blur-pixel")  { startBlur(); return false }
    if (tool == "lasso")       { startLasso(); return false }
    if (tool == "scale")       { startScale(); return false }
    if (tool == "spray")       { startSpray(); return false }
    if (tool == "brush")       { startBrush(); return false }
    if (tool == "select")      { startSelect(); return false }
    if (tool == "darken")      { startDarken(); return false }
    if (tool == "rubber")      { startRubber(); return false }
    if (tool == "ellipse")     { startEllipse(); return false }
    if (tool == "feather")     { startFeather(); return false }
    if (tool == "lighten")     { startLighten(); return false }
    if (tool == "capture")     { managerCapture(); return false }
    if (tool == "rectangle")   { startRectangle(); return false }
    if (tool == "bucket")      { managerPaintArea(); return false }
    if (tool == "blur-border") { managerBlurBorder(); return false }
    if (tool == "every")       { managerPaintEvery(); return false }
    if (tool == "border")      { managerPaintBorder(); return false }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function mouseMoveHandler(e) {
   shallRepaint = true
    //
 // mouseBusy = (e.which == 1)  // good for chrome, bad for firefox (always 1)
 // mouseBusy = (e.button == 1) // only for pressing and releasing
    mouseBusy = (e.buttons == 1)
    //
    stageRawX = e.offsetX
    stageRawY = e.offsetY
    const oldStageX = stageX
    const oldStageY = stageY
    updateStageXY()
    //
    if (! mouseBusy) { return false }
    //
    resetFocusedGadget()
    //
    if (superHandOn) { moveLayers(e["movementX"], e["movementY"]); return false }
    //
    if (tool == "hand") { moveTopLayer(e["movementX"], e["movementY"]); return false }
    //
    if (stageX == oldStageX  &&  stageY == oldStageY) { return false }
    //
    if (tool == "thin-pen")   { thinPen(); return false }
    if (tool == "mirror-pen") { mirrorPen(); return false }
    if (tool == "pen")        { continuePen(); return false }
    if (tool == "line")       { continueLine(); return false }
    if (tool == "blur-pixel") { continueBlur(); return false }
    if (tool == "brush")      { continueBrush(); return false }
    if (tool == "lasso")      { continueLasso(); return false }
    if (tool == "scale")      { continueScale(); return false }
    if (tool == "spray")      { continueSpray(); return false }
    if (tool == "darken")     { continueDarken(); return false }
    if (tool == "rubber")     { continueRubber(); return false }
    if (tool == "select")     { continueSelect(); return false }
    if (tool == "ellipse")    { continueEllipse(); return false }
    if (tool == "feather")    { continueFeather(); return false }
    if (tool == "lighten")    { continueLighten(); return false }
    if (tool == "rectangle")  { continueRectangle(); return false }
    //
    return false
}

// file: engine/mouse-color.js //
// "use strict"

var mouseRed   =  -1 // -1 means mouse not on any color pixel
var mouseGreen =  -1
var mouseBlue  =  -1
var mouseAlpha =  -1

var oldMouseRed   = 0
var oldMouseGreen = 0
var oldMouseBlue  = 0
var oldMouseAlpha = 0

var mustDisplayMouseColor = false

///////////////////////////////////////////////////////////////////////////////

function changeMouseColor(color, forced) {
    if (color == null) { eraseMouseColor(); return }
    //
    mouseRed   = color[0]
    mouseGreen = color[1]
    mouseBlue  = color[2]
    mouseAlpha = color[3]
    //
    if (forced) { mustDisplayMouseColor = true } // or else "(match)" does not appear
}

function eraseMouseColor() {
    mouseRed   = -1
    mouseGreen = -1
    mouseBlue  = -1
    mouseAlpha = -1
}

///////////////////////////////////////////////////////////////////////////////

function displayMouseColor() { // called by main loop
    //
    if (mustDisplayMouseColor) {
        mustDisplayMouseColor = false
        displayMouseColorCore()
        return
    }
    //
    if (mouseColorChanged()) { displayMouseColorCore() }
}

function displayMouseColorCore() {
    //
    oldMouseRed   = mouseRed
    oldMouseGreen = mouseGreen
    oldMouseBlue  = mouseBlue
    oldMouseAlpha = mouseAlpha
    //
    paintMouseColorOnBottomBar()
}

function mouseColorChanged() {
    //
    if (mouseRed   != oldMouseRed)   { return true }
    if (mouseGreen != oldMouseGreen) { return true }
    if (mouseBlue  != oldMouseBlue)  { return true }
    if (mouseAlpha != oldMouseAlpha) { return true }
    //
    return false
}

///////////////////////////////////////////////////////////////////////////////

function updateMouseColorByStage() {
    //
    if (stageX == null) { return }
    //
    let color = null
    //
    for (const layer of layers) {
        //
        color = mouseColorOnVisibleLayer(layer)
        if (color != null) { break }
    }
    //
    changeMouseColor(color)
}

// file: engine/mouse-rectangle.js //
// "use strict"

function getMouseRectangle(layer, x, y, toolSize) { // stage coordinates
    //
    if (ZOOM < 1) { return getMouseRectangleZoomedIn(layer, x, y, toolSize) }
    //
    return getMouseRectangleStandard(layer, x, y, toolSize)
}

function getMouseRectangleStandard(layer, x, y, toolSize) { // stage coordinates
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
    return getMouseRectangleCore(layer, stageLeft, stageTop, stageRight, stageBottom)
}

function getMouseRectangleZoomedIn(layer, x, y, toolSize) { // stage coordinates
    //
    const delta = Math.floor(toolSize / 2)
    //
    // must accept negative value for x and y,
    // this happens when ZOOM is 0.5
    //
    const stageLeft = x - delta
    const stageTop  = y - delta
    //
    // not checking if right and bottom goes
    // beyond the stage (not WYSIWIG)
    //
    const stageRight  = x + delta
    const stageBottom = y + delta
    //
    return getMouseRectangleCore(layer, stageLeft, stageTop, stageRight, stageBottom)
}

function getMouseRectangleCore(layer, stageLeft, stageTop, stageRight, stageBottom) {
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

// file: engine/move-layer.js //
// "use strict"

var remainingMoveX = 0 // necessary when zoom is greater than one
var remainingMoveY = 0 // and mouse moves slowly

var consecutiveMovesByKeyboard = 0
var realTimeOfLastMoveByKeyboard = 0

///////////////////////////////////////////////////////////////////////////////

function resetMove() {
    remainingMoveX = 0
    remainingMoveY = 0
}

///////////////////////////////////////////////////////////////////////////////

function moveLayers(rawDeltaX, rawDeltaY) {
    //
    if (toplayer == null) { return }
    //
    const deltas = calcMoveValues(rawDeltaX, rawDeltaY)
    //
    for (const layer of layers) {
        if (! layer.enabled) { continue }
        //
        layer.left += deltas["deltaX"]
        layer.top  += deltas["deltaY"]
    }
}

///////////////////////////////////////////////////////////////////////////////

function moveTopLayer(rawDeltaX, rawDeltaY) {
    //
    if (toplayer == null) { return }
    //
    const deltas = calcMoveValues(rawDeltaX, rawDeltaY)
    //
    if (! ctrlPressed) {
        //
        toplayer.left += deltas["deltaX"]
        toplayer.top  += deltas["deltaY"]
        return
    }
    //
    // displacing content
    //
    const src = cloneImage(toplayer.canvas)
    //
    const ctx = toplayer.canvas.getContext("2d")
    ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
    ctx.drawImage(src, deltas["deltaX"], deltas["deltaY"])
    //
    if (! canvasesAreEqual(src, toplayer.canvas)) { memorizeTopLayer() }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function calcMoveValues(rawDeltaX, rawDeltaY) {
    //
    remainingMoveX += rawDeltaX
    remainingMoveY += rawDeltaY
    //
    // Math.floor is bad for negative values!!!!
    //
    const signX = Math.sign(remainingMoveX)
    const signY = Math.sign(remainingMoveY)
    //
    remainingMoveX = Math.abs(remainingMoveX)
    remainingMoveY = Math.abs(remainingMoveY)
    //
    let deltaX = Math.floor(remainingMoveX / ZOOM)
    let deltaY = Math.floor(remainingMoveY / ZOOM)
    //
    remainingMoveX -= (deltaX * ZOOM)
    remainingMoveY -= (deltaY * ZOOM)
    //
    remainingMoveX *= signX
    remainingMoveY *= signY
    //
    deltaX *= signX
    deltaY *= signY
    //
    return { "deltaX": deltaX, "deltaY": deltaY }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function resetMoveByKeyboard() {
    //
    consecutiveMovesByKeyboard = 0
}

function moveTopLayerByKeyboard() { // no more than once per loop!
    //
    if (toplayer == null) { return }
    //
    const elapsedTime = Date.now() - realTimeOfLastMoveByKeyboard
    //
    if (elapsedTime < 200) { return }
    //
    let deltaLeft = 0
    let deltaTop = 0
    //
    if (upPressed)    { deltaTop  = -1 }
    if (downPressed)  { deltaTop  = +1 }
    if (leftPressed)  { deltaLeft = -1 }
    if (rightPressed) { deltaLeft = +1 }
    //
    if (deltaLeft == 0  &&  deltaTop == 0) { return }
    //
    let factor = 1
    //
    if (consecutiveMovesByKeyboard > 0) { factor =  5 }
    if (consecutiveMovesByKeyboard > 5) { factor = 30 }
    //
    deltaLeft *= factor
    deltaTop  *= factor
    //
    // these flags must be updated here, after the abort checks
    // because mainLoop ALWAYS calls this function
    //
    consecutiveMovesByKeyboard += 1
    //
    realTimeOfLastMoveByKeyboard = Date.now()
    //
    shallRepaint = true // << it is here!
    //
    if (! ctrlPressed) {
        toplayer.left += deltaLeft
        toplayer.top  += deltaTop
        return
    }
    //
    // displacing content
    //
    const src = cloneImage(toplayer.canvas)
    //
    const ctx = toplayer.canvas.getContext("2d")
    ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
    ctx.drawImage(src, deltaLeft, deltaTop)
    //
    if (! canvasesAreEqual(src, toplayer.canvas)) { memorizeTopLayer() }
}

// file: engine/palette.js //
// "use strict"

var paletteName = "bob"

var loadingPaletteName = ""

var paletteNames = ["bob", "custom 1", "custom 2", "custom 3", "custom 4", "custom 5", "custom 6"]

const palettes = {

    "bob": [

        "255,50,43", "255,0,0", "232,2,0", "192,0,0", "160,0,0", "131,0,0",
        "247,170,48", "255,144,0", "255,128,0", "224,96,16", "255,79,0", "208,48,0",
        "5,17,85", "75,75,150", "60,150,170", "0,128,128", "136,146,111", "160,144,112",
        "250,47,122", "230,28,247", "153,47,124", "224,192,80", "212,168,60", "112,108,96",
        "35,93,19", "15,141,0", "81,225,19", "255,255,255", "128,128,128", "0,0,0"
    ]
}

///////////////////////////////////////////////////////////////////////////////

function defaultCustomPalette() {
    return [
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank",
        "blank", "blank", "blank", "blank", "blank", "blank"
    ]
}

///////////////////////////////////////////////////////////////////////////////

function erasePalettePixelsInLayer(cnv) {
    const list = rgbColorsFromPalette()
    return eraseMatchingPixels(cnv, list) // so layer can be memorized or not
}

///////////////////////////////////////////////////////////////////////////////

function savePalette() {
    isPaletteFile = true
    saveStyle = "png"
    //
    const cnv = createCanvas(240, 200)
    const ctx = cnv.getContext("2d")
    //
    let left = 0
    let top  = 0
    //
    for (const raw of palettes[paletteName]) {
        if (raw != "blank") {
            ctx.fillStyle = "rgb(" + raw + ")"
            ctx.fillRect(left, top, 40, 40)
        }
        left += 40
        if (left == 240) { left = 0; top += 40 }
    }
    //
    saveImageFile(cnv)
}

///////////////////////////////////////////////////////////////////////////////

function loadPalette() {
    const msg = "replace colors of palette '" + paletteName + "'?" +
                "\n(translucent colors will be ignored or converted)"
     //
    customConfirm(msg, loadPalette2)
}

function loadPalette2() {
    //
    isPaletteFile = true
    loadingPaletteName = paletteName
    loadImageFile()
}

function paletteLoaded(cnv) {
    const raws = [ ]
    const off = 4 * (cnv.width * cnv.height)
    const data = cnv.getContext("2d").getImageData(0, 0, cnv.width, cnv.height).data
    //
    for (let n = 0; n < off; n += 4) {
        const r = data[n]
        const g = data[n + 1]
        const b = data[n + 2]
        const a = data[n + 3]
        //
        if (a < 200) { continue }
        //
        const raw = r + "," + g + "," + b
        if (raws.includes(raw)) { continue }
        //
        raws.push(raw)
        if (raws.length == 30) { break }
    }
    //
    while(raws.length < 30) { raws.push("blank") }
    //
    palettes[loadingPaletteName] = raws
    //
    updateSurfacePalette()
    paintPanelPalette()
}

///////////////////////////////////////////////////////////////////////////////

function rgbColorsFromPalette() {
    //
    const colors = [ ]
    const raws = palettes[paletteName]
    //
    for (const raw of raws) {
        const color = rgbFromRaw(raw)
        if (! colorInColors(color)) { colors.push(color) }
    }
    return colors
    //
    function rgbFromRaw(raw) {
        const color = [0, 0, 0]
        //
        if (raw == "blank") { return color }
        //
        const tokens = raw.split(",")
        color[0] = parseInt(tokens[0])
        color[1] = parseInt(tokens[1])
        color[2] = parseInt(tokens[2])
        //
        return color
    }
    //
    function colorInColors(newcolor) {
        //
        for (const color of colors) {
            if (color[0] != newcolor[0]) { continue }
            if (color[1] != newcolor[1]) { continue }
            if (color[2] != newcolor[2]) { continue }
            //
            return true
        }
        return false
    }
}

// file: engine/picture.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function makeCheckedPicture(callback) {
    //
    let count = 0
    let top = null
    //
    const off = layers.length
    //
    for (let n = 0; n < off; n++) {
        //
        if (! layers[n].enabled) { continue }
        //
        count += 1
        //
        if (top == null) { top = n }
    }
    //
    if (count == 0) { callback(null); return }
    //
    if (count == 1) { callback(cloneImage(toplayer.canvas)); return }
    //
    let index = indexOfBaseLayer()
    //
    if (index != null) { callback(makePictureCore(index)); return }
    //
    customAlert("layers do not match:\nthe resulting picture may not be what you expect",

        function () { callback(makeBottomPicture(false)) }
    )
}

function makeTopPicture() {
    //
    const index = getNumberOfTopLayer()
    if (index == null) { return null }
    //
    const cnv = makePictureCore(index)
    //
    return cnv
}

function makeBottomPicture(protect) {
    //
    let count = 0
    let bottom = null
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) {
        //
        if (! layers[n].enabled) { continue }
        //
        count += 1
        //
        if (bottom == null) { bottom = n }
    }
    //
    if (count == 0) { return null }
    //
    if (count == 1) { return cloneImage(toplayer.canvas) }
    //
    if (protect) {
        return makeBottomPictureCoreProtected(bottom)
    }
    else {
        return makePictureCore(bottom)
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makePictureCore(n) { // expecting 'n' to be a valid index
    //
    const reflayer = layers[n]
    //
    const width = reflayer.canvas.width
    const height = reflayer.canvas.height
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) {
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        const left = layer.left - reflayer.left
        const top  = layer.top  - reflayer.top
        //
        ctx.drawImage(layer.canvas, left, top)
    }
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeBottomPictureCoreProtected(bottom) { // expects at least 1 layer over the bottom layer
    //
    const reflayer = layers[bottom]
    //
    const width = reflayer.canvas.width
    const height = reflayer.canvas.height
    //
    const cnv = cloneImage(reflayer.canvas)
    const ctx = cnv.getContext("2d")
    //
    const refdata = ctx.getImageData(0, 0, width, height).data
    //
    const start = bottom - 1
    //
    for (let n = start; n > -1; n--) {
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        const overcanvas = makeOverCanvasForMergeDown(layer, reflayer.left, reflayer.top, width, height, refdata)
        //
        ctx.drawImage(overcanvas, 0, 0)
    }
    //
    return cnv
}

function makeOverCanvasForMergeDown(layer, refleft, reftop, width, height, refdata) {
    //
    const cnv = createCanvas(width, height)
    const ctx = cnv.getContext("2d")
    //
    const left = layer.left - refleft
    const top  = layer.top  - reftop
    //
    ctx.drawImage(layer.canvas, left, top) // projected (by position)
    //
    // clearing where reference pixel is blank
    //
    const imgdata = ctx.getImageData(0, 0, width, height)
    const data = imgdata.data
    //
    const off = width * height * 4
    //
    let index = 0
    //
    while (index < off) {
        //
        if (refdata[index+3] == 0) { //  blank
            //
            data[index]   = 0
            data[index+1] = 0
            data[index+2] = 0
            data[index+3] = 0
        }
        //
        index += 4
    }
    //
    ctx.putImageData(imgdata, 0, 0)
    //
    return cnv
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function indexOfBaseLayer() { // most relevant layer
    //
    const last = layers.length - 1
    //
    for (let n = last; n > -1; n--) {
    //
        if (layerContainsAllOthers(n)) { return n }
    }
    //
    return null
}

function layerContainsAllOthers(index) {
    //
    const candidate = layers[index]
    //
    if (! candidate.enabled) { return false }
    //
    const off = layers.length
    //
    for (let n = 0; n < off; n++) {
        //
        if (n == index) { continue }
        //
        const layer = layers[n]
        //
        if (! layer.enabled) { continue }
        //
        if (candidate.left > layer.left) { return false }
        //
        if (candidate.top > layer.top) { return false }
        //
        const layerRight = layer.left + layer.canvas.width
        const candidateRight = candidate.left + candidate.canvas.width
        if (candidateRight < layerRight) { return false }
        //
        const layerBottom = layer.top + layer.canvas.height
        const candidateBottom = candidate.top + candidate.canvas.height
        if (candidateBottom < layerBottom) { return false }
    }
    //
    return true
}

// file: engine/rotate-shear-colorize.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function resetTopLayerByMemory() {
    //
    if (toplayer == null) { return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(model, 0, 0)
    //
    shallRepaint = true
}

///////////////////////////////////////////////////////////////////////////////

function rotateLayer(slider) {
    setTask(callback)
    //
    function callback() { polyModelRotateLayer(slider.value) }
}

function polyModelRotateLayer(value) {
    //
    if (toplayer == null) { panelShearResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    //
    value -= 0.5
    const rad = 2 * Math.PI * value
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    const halfWidth  = Math.floor(cnv.width / 2)
    const halfHeight = Math.floor(cnv.height / 2)
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.save()
    ctx["imageSmoothingEnabled"] = false
    ctx.translate(halfWidth, halfHeight)
    ctx.rotate(rad)
    ctx.drawImage(model, -halfWidth, -halfHeight)
    ctx.restore()
    //
    resetSliderShearV()
    resetSliderShearH()
    updateShearButtons()
}

///////////////////////////////////////////////////////////////////////////////

function shearLayer() {
    setTask(polyModelShearLayer)
}

function polyModelShearLayer() {
    //
    if (toplayer == null) { panelShearResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    const rawV = sliderShearV.value
    const rawH = sliderShearH.value
    //
    const v =  3 * (0.5 - rawV)
    const h =  3 * (0.5 - rawH)
    //
    const halfWidth  = Math.floor(cnv.width / 2)
    const halfHeight = Math.floor(cnv.height / 2)
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.save()
    ctx["imageSmoothingEnabled"] = false
    ctx.translate(halfWidth, halfHeight)
    ctx.transform(1, v, h, 1, 0, 0)
    ctx.drawImage(model, -halfWidth, -halfHeight)
    ctx.restore()
    //
    resetSliderRotate()
    updateShearButtons()
}


///////////////////////////////////////////////////////////////////////////////

function colorizeLayer() {
    setTask(polyModelColorizeLayer)
}

function polyModelColorizeLayer() {
    //
    if (toplayer == null) { panelColorizeResetGadgets(); return }
    //
    const mem = toplayer.memory
    const model = (mem[mem.length - 1]).canvas
    //
    shallRepaint = true
    //
    const intensityOfNewHue = sliderColorizeHue.value
    const sat = sliderColorizeSat.value
    const lum = softLumValue(sliderColorizeLum.value)
    const opacity = sliderColorizeOpa.value
    //
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    //
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    ctx.drawImage(model, 0, 0)
    //
    colorize(cnv, intensityOfNewHue, sat, lum)
    //
    if (opacity != 1) {
        const colorized = cloneImage(toplayer.canvas)
        ctx.clearRect(0, 0, toplayer.canvas.width, toplayer.canvas.height)
        ctx.globalAlpha = opacity
        ctx.drawImage(colorized, 0, 0)
        ctx.globalAlpha = 1.0
    }
    //
    updateColorizeButtons()
}

function softLumValue(value) { // returns from 0.2 to 0.8
    //
    if (value == 0.5) { return 0.5 }
    //
    return (value < 0.5) ? softLumValueLow(value) : softLumValueHigh(value)
}

function softLumValueLow(value) {
    //
    const factor = value / 0.5
    return 0.2 + (0.3 * factor)
}

function softLumValueHigh(value) {
    //
    const factor = (value - 0.5) / 0.5
    return 0.5 + (0.3 * factor)
}

// file: engine/roll.js //
// "use strict"

///////////////////////////////////////////////////////////////////////////////

function useRoll() {
    //
    if (toplayer == null) { return }
    //
    shallRepaint = true
    startBlinkingIconOnTopBar("roll")
    //
    const original = cloneImage(toplayer.canvas)
    const cnv = toplayer.canvas
    const ctx = cnv.getContext("2d")
    const width  = cnv.width
    const height = cnv.height
    //
    ctx.clearRect(0, 0, width, height)
    //
    if (! shiftPressed) {
        ctx.fillStyle = "rgba(" + RED + "," + GREEN + "," + BLUE + "," + ALPHA / 255 + ")"
        ctx.fillRect(0, 0, width, height)
    }
    //
    if (! canvasesAreEqual(original, cnv)) { memorizeTopLayer() }
}

// file: engine/size.js //
// "use strict"

/* NEVER FORGET:

    (experimental technology)
    context["imageSmoothingQuality"] = "high" // medium, low // default is "low"

*/

var desiredWidth = 120
var desiredHeight = 80

///////////////////////////////////////////////////////////////////////////////

function resizeLayer() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    const src = toplayer.canvas
    //
    const newWidth = getNewWidth()
    const newHeight = getNewHeight()
    //
    if (newWidth == src.width  &&  newHeight == src.height) { return }
    //
    const cnv = createCanvas(newWidth, newHeight)
    cnv.getContext("2d").drawImage(src, 0, 0)
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function scaleLayer() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    const src = toplayer.canvas
    //
    const newWidth = getNewWidth()
    const newHeight = getNewHeight()
    //
    if (newWidth == src.width  &&  newHeight == src.height) { return }
    //
    const cnv = createCanvas(newWidth, newHeight)
    const ctx = cnv.getContext("2d")
    //
    ctx["imageSmoothingEnabled"] = ! checkboxSizePixelated.checked
    ctx["imageSmoothingQuality"] = "high" // VERY IMORTANT!!! (or else lines of some grid disappear)
    ctx.drawImage(src, 0,0,src.width,src.height, 0,0,newWidth,newHeight)
    ctx["imageSmoothingEnabled"] = true
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

///////////////////////////////////////////////////////////////////////////////

function autocropLayer() {
    //
    shallRepaint = true
    //
    if (toplayer == null) { return }
    //
    const cnv = autocrop(toplayer.canvas)
    //
    const deltaWidth = cnv.width - toplayer.canvas.width
    const deltaHeight = cnv.height - toplayer.canvas.height
    //
    if (deltaWidth == 0  &&  deltaHeight == 0) { return }
    //
    toplayer.canvas = cnv
    centerLayerCore(toplayer)
    memorizeTopLayer()
}

// file: engine/zoom.js //
// "use strict"

var ZOOM = 5
var zooms = [ 0.5, 1, 2, 3, 4, 5, 6, 10, 15, 20 ]

///////////////////////////////////////////////////////////////////////////////

function decreaseZoom() {
    if (mouseBusy) { return }
    if (ZOOM == 0.5) { return }
    //
    startBlinkingIconOnTopBar("minus")
    setZoom(-1)
}

function increaseZoom() {
    if (mouseBusy)  { return }
    if (ZOOM == 20) { return }
    //
    startBlinkingIconOnTopBar("plus")
    setZoom(+1)
}

function setZoom(delta) {
    shallRepaint = true
    //
    const n = zooms.indexOf(ZOOM) + delta
    ZOOM = zooms[n]
    //
    updateStageXY()
    //
    paintZoomOnBottomBar()
}

///////////////////////////////////////////////////////////////////////////////

function zoomedLeft(layer) {
    //
    const layerCenterX = layer.left + (layer.canvas.width / 2)
    //
    const layerDisplacementX = stageCenterX - layerCenterX
    //
    const layerZoomedCenterX = stageCenterX - (layerDisplacementX * ZOOM)
    //
    const halfZoomedWidth = layer.canvas.width * ZOOM / 2
    //
    return Math.floor(layerZoomedCenterX - halfZoomedWidth)
}

function zoomedTop(layer) {
    //
    const layerCenterY = layer.top + (layer.canvas.height / 2)
    //
    const layerDisplacementY = stageCenterY - layerCenterY
    //
    const layerZoomedCenterY = stageCenterY - (layerDisplacementY * ZOOM)
    //
    const halfZoomedHeight = layer.canvas.height * ZOOM / 2
    //
    return Math.floor(layerZoomedCenterY - halfZoomedHeight)
}

// file: boot/boot.js //
// "use strict"

main()

