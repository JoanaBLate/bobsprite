// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

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

