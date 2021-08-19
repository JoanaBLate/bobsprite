// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


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

