// # Copyright (c) 2014-2022 Feudal Code Limitada #
"use strict"

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
    checkboxEffectA = createCheckbox("effect-a", panelEffectCtx,  20, 283, 16, changeSubpanelEffect, true)
    checkboxEffectB = createCheckbox("effect-b", panelEffectCtx,  66, 283, 16, changeSubpanelEffect, false)
    checkboxEffectC = createCheckbox("effect-c", panelEffectCtx, 112, 283, 16, changeSubpanelEffect, false)
    checkboxEffectD = createCheckbox("effect-d", panelEffectCtx, 158, 283, 16, changeSubpanelEffect, false)
    checkboxEffectE = createCheckbox("effect-e", panelEffectCtx, 204, 283, 16, changeSubpanelEffect, false)
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

