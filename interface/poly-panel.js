// # Copyright (c) 2014-2021 Feudal Code Limitada # 

"use strict"


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

