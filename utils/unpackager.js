"use strict"

const msg = `
Simple tool for unpackaging bobsprite.js
May *create* directories!
May *OVERWRITE* files!!!
Shall continue? (y/N)`
 
if (prompt(msg) != "y") { console.log("aborted"); Deno.exit() }


const sourceText = Deno.readTextFileSync("bobsprite.js")

const segments = sourceText.split("// file: ")

segments.shift() // header

for (const segment of segments) {

    const lines = segment.split("\n")

    const path = lines.shift().replace(" //", "")

    lines[0] = '"use strict"'
    
    const text = lines.join("\n")
    
    const parts = path.split("/")
        
    const dirname = parts.shift()
    const filename = parts.shift()
    
    try { Deno.mkdirSync(dirname) } catch (e) { }
    
    Deno.writeTextFileSync(path, text)
}

console.log("done"); 
