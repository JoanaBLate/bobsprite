// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


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

