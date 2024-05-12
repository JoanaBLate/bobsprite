"use strict"

// packages linked js files of html page //
// ignores embedded js code //
// link script tags must have open and close in the same exclusive line //

var consolidation = ""
var shallEncapsulate = false

var title = "BobSprite packager"
var pathForHtmlFile = "source.html"
var pathForPackaged = "bobsprite.js"

// main ///////////////////////////////////////////////////////////////////////

function main() { 
    console.log("\u001Bc") // *clears console perfectly* //
    console.log("running " + title)
    console.log("   -- available option: 'encapsulate'\n")
    processOptions()
    const s = (shallEncapsulate) ? "encapsulated" : "open code"
    console.log("using mode: " + s)
    processHtml()
}

// options ////////////////////////////////////////////////////////////////////

function processOptions() {
    //
    const options = Deno.args.slice(0, Deno.args.length)
    //
    if (options.length == 0) { return }
    //
    let option = options.shift()
    //
    if (option == "compile") {
        console.log("ERROR: option 'compile': not compiling anymore, cannot rely on Google-Closure compiler")
        Deno.exit(1)
    }
    if (option == "encapsulate") {
        shallEncapsulate = true
    }
    else {
        console.log("ERROR: unknown option:", option)
        Deno.exit(1)    
    }
    //
    if (options.length != 0) {
        console.log("ERROR: unknown or duplicated option:", options[0])
        Deno.exit(1)    
    }
}

// html process ///////////////////////////////////////////////////////////////

function processHtml() {
    applyHead()
    applyBody()
    applyFoot()
    // saving 
    Deno.writeTextFileSync(pathForPackaged, consolidation)
}

function applyHead() {
    consolidation  = "// # Copyright (c) 2014-2024 Feudal Code Limitada #\n\n\"use strict\""
    if (shallEncapsulate) { consolidation += "\n(function () {" }
}

function applyBody() {
    const htmlLines = loadLines(pathForHtmlFile)
    for (const line of htmlLines) { 
        const trim = line.trim()
        if (trim.startsWith("<script src=")) { consolidateLinkedFile(trim) }
    }
} 

function applyFoot() {
    if (shallEncapsulate) { consolidation += "\n})()" }
    consolidation += "\n\n"
}

///////////////////////////////////////////////////////////////////////////////

function loadLines(path) {
    const text = loadFile(path).trimRight()
    const lines = text.split("\n")    
    for (let n = 0; n < lines.length; n++) {
        lines[n] = lines[n].trimRight()
    }
    return lines
}

function loadFile(path) {
    try {
        return Deno.readTextFileSync(path)
    }
    catch (e) {
        console.log("ERROR: could not read: " + path) 
        Deno.exit(1)       
    }
}

///////////////////////////////////////////////////////////////////////////////

function consolidateLinkedFile(trim) {
    // if there is content after "</script>", path will raise error
    let path = trim.replace('<script src="', "").replace('"></script>', "")
    if (path[0] == "/") { path = path.substr(1) }
    //
    let txt = "\n\n// file: " + path + " //"
    const js = loadLines(path)
    while (js.length > 0) {
        let line = js.shift()
        if (line.trim() == '"use strict"') { line = "// " + line }
        txt += "\n" + line 
    }
    consolidation += txt
}

// boot ///////////////////////////////////////////////////////////////////////

main()

