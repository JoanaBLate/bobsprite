// # Copyright (c) 2014-2021 Feudal Code Limitada #

"use strict"


var schedule = [ ]

///////////////////////////////////////////////////////////////////////////////

function Schedule(func, timer) { // constructor
    this.func = func
    this.timer = timer
}

function __scheduleByTime(func, miliseconds) { // delay argument in milliseconds
    scheduleByLoop(func, Math.round(miliseconds / LOOP_DURATION_IN_MS))
}

function scheduleByLoop(func, loops) { // delay argument in loops
    const timer = LOOP + Math.max(1, loops)
    const obj = new Schedule(func, timer)
    schedule.push(obj)
}

function updateSchedule() {
    if (schedule.length == 0) { return }
    //
    const list = [ ]
    //
    for (const obj of schedule) {
        if (LOOP < obj.timer) {
            list.push(obj)
        }
        else {
            obj.func()
        }
    }
    schedule = list
}

