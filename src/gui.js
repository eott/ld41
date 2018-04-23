var GUI = function() {
    this.splash = new Image()
    this.splash.width = 1000
    this.splash.height = 600
    this.splash.src = "assets/images/splash.jpg"
    this.introDrawn = false
    this.firstFade = false
    this.isDoingScreenShake = false
    this.screenShakeCounter = 0
}

GUI.prototype.update = function() {
    if (this.screenShakeCounter == 4) {
        this.isDoingScreenShake = false
        game.ctx.restore()
    }

    if (this.isDoingScreenShake) {
        this.screenShakeCounter += 1
        game.ctx.translate(5 * Math.sin(-Math.PI + 2 * Math.PI * this.screenShakeCounter / 4), 0)
    }
}

GUI.prototype.draw = function(ctx) {
    var fac = 1.0 - game.beatProximity * 2 / game.beatMillis

    // make background in canvas flash (but not too strongly, epilepsy and such)
    var greyVal = fac * 25
    game.can.style["background-color"] = "rgba(" + greyVal + ", " + greyVal + ", " + greyVal + ", 1.0)"

    // eighth power gives us a nice pulse
    fac = fac * fac
    fac = fac * fac
    fac = fac * fac

    // draw pulsating circle in center
    ctx.fillStyle = "rgba(255, 255, 255, " + fac + ")"
    ctx.strokeStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(500, 500, 20, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke()

    // draw timeline
    ctx.beginPath()
    ctx.moveTo(50, 500)
    ctx.lineTo(950, 500)
    ctx.stroke()
    for (var i = 0; i < 4; i++) {
        var x = (900 / 4) * (i - game.beatOverdue / game.beatMillis)
        x = x < 0 ? 900 + x : x
        ctx.beginPath()
        ctx.moveTo(50 + x, 480)
        ctx.lineTo(50 + x, 520)
        ctx.stroke()
    }

    // draw sync meter
    ctx.fillStyle = "#222222"
    ctx.fillRect(50, 535, 600, 50)
    ctx.fillStyle = "#dd00dd"
    ctx.fillRect(52, 537, 596 * game.human.sync, 46)
    ctx.strokeStyle = "#ffffff"
    ctx.beginPath()
    ctx.moveTo(50 + 600 * game.scene.buildingCost, 537)
    ctx.lineTo(50 + 600 * game.scene.buildingCost, 583)
    ctx.stroke()

    // draw balance meter
    ctx.fillStyle = "#222222"
    ctx.fillRect(665, 535, 285, 50)
    var grad = ctx.createLinearGradient(667, 537, 948, 537)
    grad.addColorStop(0, "#00ff00")
    grad.addColorStop(1, "#ff0000")
    ctx.fillStyle = grad
    ctx.fillRect(667, 537, 281, 46)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(667 + 281 * game.balance, 537)
    ctx.lineTo(667 + 281 * game.balance, 587)
    ctx.stroke()
}

GUI.prototype.doScreenShake = function() {
    if (!this.isDoingScreenShake) {
        this.isDoingScreenShake = true
        this.screenShakeCounter = 0
        game.ctx.save()
    }
}

GUI.prototype.drawIntro = function(ctx) {
    if (!this.introDrawn) {
        ctx.drawImage(
            this.splash,
            0, 0,
            this.splash.width,
            this.splash.height
        )
        this.introDrawn = true
    }
}

GUI.prototype.drawFade = function(ctx) {
    if (!this.firstFade) {
        this.firstFade = new Date().getTime()
    }
    var percent = (new Date().getTime() - this.firstFade) / 2000.0

    if (percent >= 1.0) {
        return true
    }

    ctx.fillStyle = "rgba(0,0,0," + percent + ")"
    ctx.fillRect(0, 0, 1000, 600)

    return false
}

GUI.prototype.drawEndScreen = function(ctx, humanWon) {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, 1000, 600)

    ctx.font = "70px Arial"
    ctx.fillStyle = "#ffffff"
    if (humanWon) {
        ctx.fillText("You won!", 350, 300)
    } else {
        ctx.fillText("You lost!", 350, 300)
    }
}