var GUI = function() {

}

GUI.prototype.draw = function(ctx) {
    var fac = 1.0 - game.beatProximity * 0.002
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
        var x = (900 / 4) * (i - game.beatOverdue * 0.001)
        x = x < 0 ? 900 + x : x
        ctx.beginPath()
        ctx.moveTo(50 + x, 480)
        ctx.lineTo(50 + x, 520)
        ctx.stroke()
    }
}