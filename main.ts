function randomMove () {
    if (randomMoveId == 0) {
        wuKong.mecanumRun(wuKong.RunList.Front, 100)
    } else if (randomMoveId == 1) {
        wuKong.mecanumRun(wuKong.RunList.rear, 100)
    } else if (randomMoveId == 2) {
        wuKong.mecanumRun(wuKong.RunList.right, 100)
    } else if (randomMoveId == 3) {
        wuKong.mecanumRun(wuKong.RunList.left, 100)
    } else if (randomMoveId == 4) {
        wuKong.mecanumRun(wuKong.RunList.RightFront, 100)
    } else if (randomMoveId == 5) {
        wuKong.mecanumRun(wuKong.RunList.LeftFront, 100)
    } else if (randomMoveId == 6) {
        wuKong.mecanumRun(wuKong.RunList.LeftRear, 100)
    } else if (randomMoveId == 7) {
        wuKong.mecanumRun(wuKong.RunList.RightRear, 100)
    } else if (randomMoveId == 8) {
        wuKong.mecanumDrift(wuKong.TurnList.Left)
    } else if (randomMoveId == 9) {
        wuKong.mecanumDrift(wuKong.TurnList.Right)
    } else if (randomMoveId == 10) {
        wuKong.mecanumSpin(wuKong.TurnList.Left, 100)
    } else {
        wuKong.mecanumSpin(wuKong.TurnList.Right, 100)
    }
}
function initStripColors (mode: number) {
    stripChangeDelay = 100
    if (mode == 1) {
        stripColors = [[255, 0, 0], [0, 0, 0], [0, 0, 255], [0, 0, 0]]
    } else if (mode == 2) {
        stripColors = []
        for (let indexR = 0; indexR <= 255; indexR++) {
            stripColors.push([indexR, 255 - indexR, 0])
        }
        for (let indexG = 0; indexG <= 255; indexG++) {
            stripColors.push([255 - indexG, 0, indexG])
        }
        for (let indexB = 0; indexB <= 255; indexB++) {
            stripColors.push([0, indexB, 255 - indexB])
        }
        stripChangeDelay = 5
    } else {
        // should not be shown
        stripColors = [[50, 0, 0]]
    }
}
function ledsColor (r: number, g: number, b: number) {
    strip.setPixelColor(0, neopixel.rgb(r, g, b))
    strip.setPixelColor(1, neopixel.rgb(r, g, b))
    strip.setPixelColor(2, neopixel.rgb(r, g, b))
    strip.setPixelColor(3, neopixel.rgb(r, g, b))
    strip.show()
}
function updateCarSpeed () {
    let tmp = Math.round(pins.analogReadPin(AnalogPin.P1) / 10.22)
    if (tmp != carSpeed) {
        carSpeed = tmp
        wuKong.mecanumRun(wuKong.RunList.Front, carSpeed)
    }
}

input.onButtonPressed(Button.A, function () {
    stripMode += 1
    if (stripMode > 2) {
        stripMode = 0
    }
    initStripColors(stripMode)
    stripColorsIndex = 0
    strip.clear()
    strip.show()
})
input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Ghost)
    for (let index = 0; index < 40; index++) {
        randomMoveId = randint(0, 11)
        randomMove()
        basic.pause(500)
    }
    wuKong.mecanumStop()
})
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.LeftTriangle)
    if (carAutonomnous <= 0) {
        carAutonomnous += 1
        wuKong.mecanumRun(wuKong.RunList.Front, carSpeed)
    } else {
        carAutonomnous = 0
        wuKong.mecanumStop()
    }
})

let randomMoveId = 0
let carSpeed = 50
let carAutonomnous = 0
let distance = 300
let strip: neopixel.Strip = null
let stripMode = 0
let stripColorsIndex = 0
let stripChangeDelay = 100
let stripColors = [[50, 0, 0]]
strip = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)
strip.clear()
basic.showIcon(IconNames.Happy)
music.playMelody("C D E F - - - - ", 283)
wuKong.mecanumWheel(wuKong.ServoList.S2, wuKong.ServoList.S3, wuKong.ServoList.S1, wuKong.ServoList.S0)
wuKong.setLightMode(wuKong.LightMode.BREATH)

basic.forever(function () {
    if (stripMode) {
        ledsColor(stripColors[stripColorsIndex][0], stripColors[stripColorsIndex][1], stripColors[stripColorsIndex][2])
        stripColorsIndex += 1
        if (stripColorsIndex > stripColors.length - 1) {
            stripColorsIndex = 0
        }
    }
    basic.pause(stripChangeDelay)
})
basic.forever(function () {
    if (carAutonomnous > 0 && distance < 25) {
        wuKong.mecanumRun(wuKong.RunList.rear, carSpeed)
        basic.pause(500)
        if (Math.randomBoolean()) {
            wuKong.mecanumRun(wuKong.RunList.right, 100)
        } else {
            wuKong.mecanumRun(wuKong.RunList.left, 100)
        }
        basic.pause(300)
        wuKong.mecanumRun(wuKong.RunList.Front, carSpeed)
    }
})
loops.everyInterval(100, function () {
    if (input.soundLevel() >= 150) {
        carAutonomnous = 0
        basic.showIcon(IconNames.Rollerskate)
        wuKong.mecanumStop()
    } else if (carAutonomnous > 0) {
        updateCarSpeed()
        distance = sonar.ping(DigitalPin.P0, DigitalPin.P0, PingUnit.Centimeters)
    }
})
