// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


///////////////////////////////////////////////////////////////////////////////

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

