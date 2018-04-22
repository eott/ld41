var GameApp = function(can, ctx) {
    this.can = can
    this.ctx = ctx
    this.isInitialized = false
}

GameApp.prototype.centerOfHex = function(i, k) {
    if (i % 2 == 0) {
        var x_offset = a + c
        var y_offset = b + c
    } else {
        var x_offset = a + c
        var y_offset = 2 * b + c
    }
    // @TODO figure out why 1.3 is necessary and what's the precise number
    return [x_offset + i * (a + 1.3 * c), y_offset + k * 2 * b]
}

GameApp.prototype.init = function() {
    this.beatTimerStart = (new Date()).getTime()
    this.beatOverdue = 1000
    this.beatCounter = 0
    this.beatProximity = 0
    this.beatsPerMinute = 80
    this.beatMillis = 60000 / this.beatsPerMinute
    this.beatSlack = 100

    this.balance = 0

    this.hexes = []
    for (var k = 0; k < 16; k++) {
        for (var i = 0; i < 24; i++) {
            var coords = this.centerOfHex(i, k)
            this.hexes.push(new Hex(i, k, coords[0], coords[1]))
        }
    }

    this.human = new Player(true, 0, 1)
    this.ai = new Player(false, 23, 14)
    this.input = new Input()
    this.gui = new GUI()
    this.sfx = new SFX()
    this.scene = new Scene()

    this.isInitialized = true
}

GameApp.prototype.onBeat = function() {
    this.beatCounter += 1

    if (this.beatCounter == 1) {
        this.sfx.playSound("baseLine")
    }
    // @TODO make dependednt on length of baseline sound file instead of harcoding
    // @TODO figure out way to avoid the sudden cutoff during reset for smoother loop
    if (this.beatCounter % 16 == 0) {
        this.sfx.resetSound("baseLine")
    }
}

GameApp.prototype.gameLoop = function() {
    if (!this.isInitialized) {
        this.init()
    }

    this.ctx.clearRect(0, 0, can.width, can.height)

    var oldOverdue = this.beatOverdue
    this.beatOverdue = (new Date().getTime() - this.beatTimerStart) % this.beatMillis
    this.beatProximity = this.beatOverdue < this.beatMillis * 0.5
        ? this.beatOverdue
        : this.beatMillis - this.beatOverdue

    if (oldOverdue > this.beatOverdue) {
        this.onBeat()
    }

    for (idx in this.hexes) {
        this.hexes[idx].preUpdate()
    }

    this.balance = 0
    for (idx in this.hexes) {
        this.balance += this.hexes[idx].corruption
    }
    this.balance = this.balance / 384 / 255 // 384 = nr of hexes

    this.human.update()
    this.ai.update()

    for (idx in this.hexes) {
        this.hexes[idx].postUpdate()
        this.hexes[idx].draw(this.ctx)
    }

    this.gui.draw(ctx)

    this.human.draw(this.ctx)
    this.ai.draw(this.ctx)
}

var can = document.getElementById("screen"); // The canvas element
var ctx = can.getContext("2d"); // The 2D draw context

var sp3 = 0.86602540378 // Number is sin(PI/3)
var a = 20
var b = 0.8 * a * Math.sin(2 * 3.1415926 / 3)
var c = Math.sqrt(a * a - b * b)

var game = new GameApp(can, ctx)
window.setInterval('game.gameLoop()', 40);