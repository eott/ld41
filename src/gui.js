var GUI = function() {

}

GUI.prototype.draw = function(ctx) {
    var fac = 1.0 - game.beatProximity * 2 / game.beatMillis
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