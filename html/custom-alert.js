// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"

// var customAlertCount = 0


///////////////////////////////////////////////////////////////////////////////

function error(message, callback) {
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

