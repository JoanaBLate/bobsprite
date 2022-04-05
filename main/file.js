// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

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

